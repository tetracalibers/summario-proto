-- 1) 一時 jsonb カラムを追加（安全なデフォルトを入れる）
ALTER TABLE "terms"
  ADD COLUMN "content_jsonb" jsonb NOT NULL
  DEFAULT '{"type":"doc","content":[{"type":"title_block","content":[]}]}';

--> statement-breakpoint

-- 2) 既存の JSON っぽい行だけキャストしてコピー（PostgreSQL 14+ は IS JSON が使える）
UPDATE "terms"
SET "content_jsonb" = "content"::jsonb
WHERE "content" IS NOT NULL
  AND "content" IS JSON;

--> statement-breakpoint

-- 3) 旧カラムを差し替え（content -> DROP、content_jsonb -> RENAME）
ALTER TABLE "terms" DROP COLUMN "content";

--> statement-breakpoint

ALTER TABLE "terms" RENAME COLUMN "content_jsonb" TO "content";

--> statement-breakpoint

-- 4) デフォルトを設定（お好みの初期値に）
ALTER TABLE "terms"
  ALTER COLUMN "content"
  SET DEFAULT '{"type":"doc","content":[{"type":"title_block","content":[]}]}';

--> statement-breakpoint

-- 5) タイトル同期用関数（title_block.text を抽出）
CREATE OR REPLACE FUNCTION terms_sync_title()
RETURNS TRIGGER AS $$
DECLARE
  j jsonb;
  extracted text;
BEGIN
  j := jsonb_path_query_first(
         NEW.content,
         '$.content[*] ? (@.type == "title_block").content[*] ? (@.type == "text").text'
       );
  IF j IS NOT NULL THEN
    extracted := j #>> '{}';
    NEW.title := LEFT(extracted, 255);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint

-- 6) トリガを作成（INSERT/UPDATE で同期）
DROP TRIGGER IF EXISTS trg_terms_sync_title ON "terms";

CREATE TRIGGER trg_terms_sync_title
BEFORE INSERT OR UPDATE OF "content" ON "terms"
FOR EACH ROW
EXECUTE FUNCTION terms_sync_title();

--> statement-breakpoint

-- 7) 既存行を再同期（トリガを発火させる）
UPDATE "terms" SET "content" = "content";

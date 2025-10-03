-- supabase/seed.sql

-- 既存のデータを全削除
-- TRUNCATEはテーブルデータを高速に削除するコマンド。
-- CASCADEをつけることで、外部キーで参照しているテーブルもまとめて削除してくれる。
-- RESTART IDENTITYをつけることで、連番(id)もリセットされる。
-- TRUNCATE TABLE folders, terms, term_aliases, term_edges RESTART IDENTITY CASCADE;

-- フォルダのサンプルデータ
INSERT INTO folders (id, name, parent_id) VALUES
(1, 'プログラミング', NULL),
(2, 'Webフロントエンド', 1),
(3, 'バックエンド', 1),
(4, 'データベース', NULL);

-- 用語ノートのサンプルデータ
INSERT INTO terms (id, title, content, folder_id) VALUES
-- 'Webフロントエンド'配下
(1, 'React', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"React"}]},{"type":"paragraph","content":[{"type":"text","text":"Facebookが開発したUIライブラリです。"}]}]}', 2),
(2, 'Vue.js', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"Vue.js"}]},{"type":"paragraph","content":[{"type":"text","text":"Evan Youが開発したプログレッシブフレームワークです。"}]}]}', 2),
-- 'バックエンド'配下
(3, 'Node.js', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"Node.js"}]},{"type":"paragraph","content":[{"type":"text","text":"サーバーサイドでJavaScriptを実行するための環境です。"}]}]}', 3),
-- 'データベース'配下
(4, 'MySQL', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"MySQL"}]},{"type":"paragraph","content":[{"type":"text","text":"オープンソースのリレーショナルデータベースマネジメントシステムです。"}]}]}', 4),
(5, 'PostgreSQL', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"PostgreSQL"}]},{"type":"paragraph","content":[{"type":"text","text":"オープンソースのリレーショナルデータベースマネジメントシステムです。"}]}]}', 4),
(6, 'Drizzle ORM', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"Drizzle ORM"}]},{"type":"paragraph","content":[{"type":"text","text":"TypeScript向けのORMです。"}]}]}', 4),
-- 'プログラミング'配下
(7, 'JavaScript', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"JavaScript"}]},{"type":"paragraph","content":[{"type":"text","text":"Webブラウザ上で動作するプログラミング言語です。"}]}]}', 1),
(8, 'Python', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"Python"}]},{"type":"paragraph","content":[{"type":"text","text":"シンプルで読みやすいコードが特徴のプログラミング言語です。"}]}]}', 1),
-- 親フォルダなし
(9, '関数', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"関数"}]},{"type":"paragraph","content":[{"type":"text","text":"特定の処理をまとめたコードの塊です。"}]}]}', NULL),
(10, 'アルゴリズム', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"アルゴリズム"}]},{"type":"paragraph","content":[{"type":"text","text":"問題を解決するための手順や方法です。"}]}]}', NULL);

-- エイリアスのサンプルデータ
INSERT INTO term_aliases (term_id, title) VALUES
(1, 'React.js'),
(3, 'Node'),
(5, 'Postgres');

-- 関連用語のサンプルデータ
-- (1, 3) -> React, Node.js
-- (5, 6) -> PostgreSQL, Drizzle ORM
INSERT INTO term_edges (source_term_id, target_term_id) VALUES
(1, 3),
(5, 6);

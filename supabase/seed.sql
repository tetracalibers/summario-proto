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
(1, 'React', '<p>Facebookが開発したUIライブラリです。</p>', 2),
(2, 'Vue.js', '<p>Evan Youが開発したプログレッシブフレームワークです。</p>', 2),
(3, 'Node.js', '<p>サーバーサイドでJavaScriptを実行するための環境です。</p>', 3),
(4, 'PostgreSQL', '<p>オープンソースのリレーショナルデータベースマネジメントシステムです。</p>', 4),
(5, 'Drizzle ORM', '<p>TypeScript向けのORMです。</p>', 4);

-- エイリアスのサンプルデータ
INSERT INTO term_aliases (term_id, title) VALUES
(1, 'React.js'),
(3, 'Node'),
(4, 'Postgres');

-- 関連用語のサンプルデータ
-- (1, 3) -> React, Node.js
-- (4, 5) -> PostgreSQL, Drizzle ORM
INSERT INTO term_edges (source_term_id, target_term_id) VALUES
(1, 3),
(4, 5);

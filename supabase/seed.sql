SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict FcsKs7VAOrwzt1N34B1ojahA1Bdes8R2fp5mceeABqOPeO6slaysrGhETOpvCUh

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: folders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."folders" ("id", "name", "parent_id", "created_at", "updated_at") VALUES
	(1, 'プログラミング', NULL, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00'),
	(2, 'Webフロントエンド', 1, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00'),
	(3, 'バックエンド', 1, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00'),
	(4, 'データベース', NULL, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00');


--
-- Data for Name: terms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."terms" ("id", "title", "content", "folder_id", "created_at", "updated_at") VALUES
	(3, 'Node.js', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"Node.js"}]},{"type":"paragraph","content":[{"type":"text","text":"サーバーサイドでJavaScriptを実行するための環境です。"}]}]}', 3, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00'),
	(4, 'MySQL', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"MySQL"}]},{"type":"paragraph","content":[{"type":"text","text":"オープンソースのリレーショナルデータベースマネジメントシステムです。"}]}]}', 4, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00'),
	(5, 'PostgreSQL', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"PostgreSQL"}]},{"type":"paragraph","content":[{"type":"text","text":"オープンソースのリレーショナルデータベースマネジメントシステムです。"}]}]}', 4, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00'),
	(6, 'Drizzle ORM', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"Drizzle ORM"}]},{"type":"paragraph","content":[{"type":"text","text":"TypeScript向けのORMです。"}]}]}', 4, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00'),
	(7, 'JavaScript', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"JavaScript"}]},{"type":"paragraph","content":[{"type":"text","text":"Webブラウザ上で動作するプログラミング言語です。"}]}]}', 1, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00'),
	(8, 'Python', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"Python"}]},{"type":"paragraph","content":[{"type":"text","text":"シンプルで読みやすいコードが特徴のプログラミング言語です。"}]}]}', 1, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00'),
	(9, '関数', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"関数"}]},{"type":"paragraph","content":[{"type":"text","text":"特定の処理をまとめたコードの塊です。"}]}]}', NULL, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00'),
	(10, 'アルゴリズム', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"アルゴリズム"}]},{"type":"paragraph","content":[{"type":"text","text":"問題を解決するための手順や方法です。"}]}]}', NULL, '2025-10-21 22:42:07.906649+00', '2025-10-21 22:42:07.906649+00'),
	(1, 'React', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","text":"React"}]},{"type":"paragraph","content":[{"type":"text","text":"Facebookが開発したUIライブラリです。"}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Summary"}]},{"type":"paragraph","content":[{"type":"text","text":"abcs"}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"csioa"}]},{"type":"orderedList","attrs":{"start":1,"type":null},"content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"scna"}]}]},{"type":"listItem","content":[{"type":"paragraph"}]}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Background"}]}]}]}', 2, '2025-10-21 22:42:07.906649+00', '2025-10-25 02:29:39.112+00'),
	(2, 'Promise', '{"type":"doc","content":[{"type":"title_block","content":[{"type":"text","marks":[{"type":"code"}],"text":"Promise"}]},{"type":"paragraph","content":[{"type":"text","text":"非同期処理を“約束”するオブジェクト"}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"概要"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"Promise"},{"type":"text","text":"は、"},{"type":"text","marks":[{"type":"bold"}],"text":"非同期処理の結果を表すオブジェクト"},{"type":"text","text":"です。  "}]},{"type":"paragraph","content":[{"type":"text","text":"成功・失敗どちらの結果も一つの値として扱うことで、コールバック地獄を避け、可読性の高い非同期コードを実現します。"}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"詳細"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"Promise"},{"type":"text","text":"の状態は以下の3つのいずれかにあります："}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"pending"},{"type":"text","text":"（保留中）: 結果がまだ決まっていない状態  "}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"fulfilled"},{"type":"text","text":"（成功）: 処理が完了し、値が返された状態  "}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"rejected"},{"type":"text","text":"（失敗）: 処理が失敗し、理由（エラー）が返された状態"}]}]}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"背景"}]},{"type":"paragraph","content":[{"type":"text","text":"JavaScriptはシングルスレッドで動作し、I/O処理などの待機時間をブロックしないために"},{"type":"text","marks":[{"type":"bold"}],"text":"非同期処理"},{"type":"text","text":"が必要です。  "}]},{"type":"paragraph","content":[{"type":"text","text":"しかし、従来のコールバック方式ではネストが深くなり、エラー処理も煩雑でした。  "}]},{"type":"paragraph","content":[{"type":"text","text":"この問題を解決するために、ES2015で"},{"type":"text","marks":[{"type":"code"}],"text":"Promise"},{"type":"text","text":"が導入されました。"}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"仕組み"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"Promise"},{"type":"text","text":"は、コンストラクタで非同期処理を受け取り、その結果"},{"type":"text","marks":[{"type":"code"}],"text":"resolve"},{"type":"text","text":"また"},{"type":"text","marks":[{"type":"code"}],"text":"reject"},{"type":"text","text":"関数で通知します。  "}]},{"type":"paragraph","content":[{"type":"text","text":"呼び出し側は"},{"type":"text","marks":[{"type":"code"}],"text":".then().catch()"},{"type":"text","text":"を使って結果を受け取り"},{"type":"text","marks":[{"type":"code"}],"text":".finally()"},{"type":"text","text":"で終了処理を記述できます。  "}]},{"type":"paragraph","content":[{"type":"text","text":"非同期処理の連鎖（チェーン）が可能で、例外は自動的"},{"type":"text","marks":[{"type":"code"}],"text":"reject"},{"type":"text","text":"に伝播します。"}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"目的"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"非同期処理を値のように扱う"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"複数の非同期処理を組み合わせる"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"可読性と保守性を高める"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"エラー処理を一元化する"}]}]}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"使い方"}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","marks":[{"type":"code"}],"text":"Promise"},{"type":"text","text":"を作る"}]},{"type":"codeBlock","attrs":{"language":"js"},"content":[{"type":"text","text":"const promise = new Promise((resolve, reject) => {\n  const success = true;\n  if (success) resolve(\"成功\");\n  else reject(\"失敗\");\n});"}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"結果を受け取る"}]},{"type":"codeBlock","attrs":{"language":"js"},"content":[{"type":"text","text":"promise\n  .then(value => console.log(value))\n  .catch(err => console.error(err));"}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"複数をまとめる"}]},{"type":"codeBlock","attrs":{"language":"js"},"content":[{"type":"text","text":"Promise.all([fetchData(), loadImage(), getUser()])\n  .then(results => console.log(\"全部完了\", results))\n  .catch(error => console.error(\"どれか失敗\", error));"}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"使用例"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"APIリクエストの結果を待つ"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"ファイルの読み込みや画像のロード完了を検知する"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"タイマーやアニメーションの完了を扱う"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"複数の非同期処理を直列・並列に制御する"}]}]}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"利点"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"コードのネストが浅くなる"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"直感的なエラー処理（"},{"type":"text","marks":[{"type":"code"}],"text":".catch()"},{"type":"text","text":"）"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"非同期処理の連鎖が可能"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"Promise.all"},{"type":"text","text":"や"},{"type":"text","marks":[{"type":"code"}],"text":"Promise.race"},{"type":"text","text":"による並列実行の簡素化"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"async/await"},{"type":"text","text":"構文との自然な統合"}]}]}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"注意点"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"Promise"},{"type":"text","text":"自体は"},{"type":"text","marks":[{"type":"bold"}],"text":"即時実行される"},{"type":"text","text":"（コンストラクタ内は遅延しない）"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":".then()"},{"type":"text","text":"の中で"},{"type":"text","marks":[{"type":"code"}],"text":"return"},{"type":"text","text":"を忘れるとチェーンが崩れる"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"Promise.all"},{"type":"text","text":"は"},{"type":"text","marks":[{"type":"bold"}],"text":"1つでも失敗すると全体がrejectされる"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"非同期関数の例外は"},{"type":"text","marks":[{"type":"code"}],"text":"try/catch"},{"type":"text","text":"だけでは拾えない場合がある"}]}]}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"使う上での制約"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"1度"},{"type":"text","marks":[{"type":"code"}],"text":"resolve"},{"type":"text","text":"または"},{"type":"text","marks":[{"type":"code"}],"text":"reject"},{"type":"text","text":"されると"},{"type":"text","marks":[{"type":"bold"}],"text":"状態は固定"},{"type":"text","text":"される"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"結果は"},{"type":"text","marks":[{"type":"bold"}],"text":"一度しか得られない"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Promiseは"},{"type":"text","marks":[{"type":"bold"}],"text":"非同期処理の完了結果を表す"},{"type":"text","text":"ものであり、途中経過にはアクセスできない"}]}]}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"不向きな場合"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"長時間かかるタスクやストリームの逐次処理には不向き"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"キャンセル機能を持たない（"},{"type":"text","marks":[{"type":"code"}],"text":"AbortController"},{"type":"text","text":"など別の仕組みが必要）"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"非同期処理の制御構造としては"},{"type":"text","marks":[{"type":"bold"}],"text":"低レベル"},{"type":"text","text":"（より抽象的な制御は"},{"type":"text","marks":[{"type":"code"}],"text":"async/await"},{"type":"text","text":"で行う）"}]}]}]}]},{"type":"section_block","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"まとめ"}]},{"type":"paragraph","content":[{"type":"text","text":"Promiseは「未来の値」を扱うという概念をプログラムに持ち込んだものと捉えられます。"},{"type":"hardBreak"},{"type":"text","text":"“時間のずれ”を値の形で安全に扱えるようにした点が最大の革新です。"},{"type":"hardBreak"},{"type":"text","text":"非同期処理を「手続き」から「データ構造」として捉えることで、JavaScriptの表現力が大きく広がりました。"}]}]}]}', 2, '2025-10-21 22:42:07.906649+00', '2025-10-29 21:21:06.677+00');


--
-- Data for Name: term_aliases; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."term_aliases" ("id", "term_id", "title", "created_at") VALUES
	(1, 1, 'React.js', '2025-10-21 22:42:07.906649+00'),
	(2, 3, 'Node', '2025-10-21 22:42:07.906649+00'),
	(3, 5, 'Postgres', '2025-10-21 22:42:07.906649+00');


--
-- Data for Name: term_edges; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."term_edges" ("source_term_id", "target_term_id", "created_at") VALUES
	(5, 6, '2025-10-21 22:42:07.906649+00'),
	(1, 7, '2025-11-01 22:40:17.145915+00'),
	(2, 7, '2025-11-01 22:57:24.240711+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: folders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."folders_id_seq"', (select max(id) from "public"."folders"), false);


--
-- Name: term_aliases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."term_aliases_id_seq"', (select max(id) from "public"."term_aliases"), true);


--
-- Name: terms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."terms_id_seq"', (select max(id) from "public"."terms"), true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict FcsKs7VAOrwzt1N34B1ojahA1Bdes8R2fp5mceeABqOPeO6slaysrGhETOpvCUh

RESET ALL;

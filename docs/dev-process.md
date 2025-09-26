## ローカルのSupabase関連コマンド

- https://dev.classmethod.jp/articles/nextjs-vercel-supabase-prisma-production-and-local-setup/

Supabase CLIのインストール

```bash
npm install supabase --save-dev
```

セットアップ（supabaseディレクトリが作成され、諸々設定ファイルなどが追加される）

```bash
npx supabase init
```

コンテナの起動

```bash
npx supabase start
```

コンテナの停止

```bash
npx supabase stop
```

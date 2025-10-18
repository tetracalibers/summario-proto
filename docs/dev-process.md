## ローカルのSupabase環境構築

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

## Drizzleの環境構築

- https://orm.drizzle.team/docs/get-started/supabase-new

```bash
npm i drizzle-orm postgres
npm i -D drizzle-kit tsx
```

## スキーマの変更

```bash
npx drizzle-kit generate
npx supabase start
npx supabase db reset
```

## 依存関係の可視化

必要な依存：

```bash
brew install graphviz
```

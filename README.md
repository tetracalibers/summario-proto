# Summario

[Obsidian](https://obsidian.md/)とマインドマップにインスパイアされた要約アプリの試作です。

## 技術スタック

- フレームワーク：[React Router](https://reactrouter.com/) (v7系の[Framework mode](https://reactrouter.com/start/modes#framework))
- バックエンド：[Supabase](https://supabase.com/)
- ORM：[drizzle](https://orm.drizzle.team/)
- データベース：PostgreSQL
- UIコンポーネント：[Mantine](https://mantine.dev/)
- スタイリング：CSS Modules
- 状態管理（client state）：[jotai](https://jotai.org/)
- 状態管理（server state）：[TanStack Query](https://tanstack.com/query/latest)

## ローカル開発

### コンテナの起動

```bash
npx supabase start
```

### コンテナの停止

```bash
npx supabase stop
```

### スキーマの変更

`app/db/schema.ts`に変更を加えた場合は、次の手順でDBに反映します。

1. マイグレーションファイルの生成

```bash
npx drizzle-kit generate
```

2. データベースのリセット

次のコマンドはコンテナを起動した状態で実行する必要があります。

```bash
npx supabase db reset
```

### 依存関係の整備

[Dependency cruiser](https://github.com/sverweij/dependency-cruiser)を利用した、ファイルやディレクトリの依存関係チェックを導入しています。

#### ルールに反する依存がないか

`npm run deps-check`コマンドで確認することができます。

#### 依存関係の可視化

`npm run deps-graph`コマンドで、コードの依存関係を可視化したグラフを`docs/dependency-graph.svg`として生成することができます。

このコマンドの実行には[Graphviz](https://graphviz.org/)が必要となるため、次のようにマシンにインストールしてください。

```bash
brew install graphviz
```

## ディレクトリ構成

ソースコードを配置する`app`ディレクトリは、次のような構成になっています。

### `app/routes/*.tsx`

ページを表すコンポーネントです。
`app/routes.ts`に登録し、React Routerの[Route Module](https://reactrouter.com/start/framework/route-module)として機能します。

- 初期データロードは`loader`内で、`app/queries/**/reader.ts`を介して行います。
- `action`はここでは定義しない方針です。

### `app/routes/api/*.ts`

APIエンドポイントを表すファイルです。
`app/routes.ts`に登録し、React Routerの[Resource Routes](https://reactrouter.com/how-to/resource-routes)として機能します。

- 各ファイルでは`action`か`loader`を1つだけexportします。（GETの場合は`loader`、それ以外は`action`）
- データの取得は`app/queries/**/reader.ts`を介して行います。
- データの変更は`app/usecases/**/feature.ts`を介して行います。

> [!NOTE]
> いずれはAPIを[Nest.js](https://nestjs.com/)等で書き直し、React Routerの仕組みから分離させることを検討しています。

### `app/components`

UIコンポーネントを置く場所です。

- 見た目上の部品単位でディレクトリを分けます。
- そのコンポーネント専用のスタイル（CSS Module）やロジックも合わせて置くことができます。
- ただし、UIの状態は`app/(usecases|aggregates)/**/ui.hooks.ts`から参照するようにします。

> [!NOTE]
> APIの呼び出しについてはTanStack Queryを用いて整理する予定です。

### `app/styles`

ページ全体に適用したいグローバルCSSを置く場所です。

### `app/libs`

特定のライブラリや実行環境に依存するカスタム処理・型定義などはここにまとめます。

### `app/db`

データベースのスキーマ定義や接続設定はここで行います。

> [!WARNING]
> ここで公開している`db`インスタンスには、`app/aggregates/**/repository.ts`または`app/queries/**/readstore.ts`のみがアクセスするようにします。

### `app/aggregates`

1つのオブジェクトで完結するロジックを扱う層です。

- アプリ上で意味を持つ概念（オブジェクト）ごとにディレクトリを分けます。

> [!WARNING]
> `aggregates`配下のディレクトリ同士が依存しないようにします。

#### `repository.ts`

drizzle APIやSQLをラップした関数をここで定義し、データベース操作を隠蔽します。

> [!WARNING]
> `service.ts`のみが`repository.ts`を呼び出すようにします。

#### `service.ts`

`reposiory.ts`が提供する関数をラップし、アプリ上の意味付けを行います。

### `app/usecases`

複数のオブジェクトに依存し、データの書き換えを伴う機能（コマンド）を実現する層です。

- アプリの機能ごとにディレクトリを分けます。

> [!WARNING]
> `usecases`配下のディレクトリ同士が依存しないようにします。

#### `feature.ts`

複数の`aggregates/**/service.ts`を組み合わせて、アプリの機能に即した形でロジックを実装します。

### `app/queries`

複数のオブジェクトに依存するデータの読み取り操作（クエリ）を組み立てる層です。

> [!WARNING]
> `queries`配下のディレクトリ同士が依存しないようにします。

#### `readstore.ts`

drizzle APIやSQLをラップした関数を定義し、データベースからの読み取り操作とその最適化を隠蔽します。

> [!WARNING]
> `reader.ts`のみが`readstore.ts`を呼び出すようにします。

#### `reader.ts`

`readstore.ts`や`aggregates/**/service.ts`が提供する読み取り専用の関数を組み合わせ、アプリ上で必要となる形でデータ取得処理をまとめます。

### `app/(aggregates|usecases)/**/ui.*.ts`

1つのオブジェクトで完結するUIの状態管理は`aggregates`配下で、複数のオブジェクトにまたがるUIの状態管理は`usecases`配下で行います。

#### `ui.atoms.ts`

UIの状態（[jotai](https://jotai.org/)のAtom）を定義します。

> [!WARNING]
> `app/components`配下のUIコンポーネントがここに直接アクセスしないようにします。

#### `ui.selectors.ts`

状態から算出される値（derived Atom）を定義します。

> [!WARNING]
> `app/components`配下のUIコンポーネントがここに直接アクセスしないようにします。

#### `ui.actions.ts`

状態に変更を加える操作（write only Atom）を定義します。

> [!WARNING]
> `app/components`配下のUIコンポーネントがここに直接アクセスしないようにします。

#### `ui.hooks.ts`

UIの状態やその操作は、ここで定義したカスタムフックを介してコンポーネントに公開します。

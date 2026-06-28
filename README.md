# 実装課題2：セキュアな認証・認可機能を備えた Next.js アプリ

## 1. プロジェクト概要

本プロジェクトは教材 `web-sec-playground-2` をベースに、認証機能に特化したセキュアな Next.js アプリケーションです。
- 認証方式: セッションベース認証（JWT は廃止）
- データベース: SQLite + Prisma
- UI: Next.js App Router + React

不要な機能を削ぎ落とし、認証とユーザー管理に集中した実装になっています。

## 2. 実装済み機能

### 2.1 基本機能

- サインアップ
- ログイン / ログアウト
- 認証済みユーザーによるプロフィール表示

### 2.2 追加機能

- **パスワード強度表示**
  - サインアップページで入力中のパスワードをリアルタイム判定
  - 長さ / 大文字 / 小文字 / 数字 / 記号の5項目で判定
  - 進捗バーと強度ラベルで視覚的に表示

- **アカウント削除（退会）**
  - ログイン済みユーザーが自分のアカウントを削除可能
  - 退会時にセッションおよび関連データを物理削除
  - セッション Cookie を即座に破棄

## 3. セキュリティ対策

### 3.1 パスワード管理

- `bcryptjs` を使用し、パスワードをハッシュ化して保存
- ログイン時は `bcrypt.compare` で照合
- 生パスワードはデータベースに保存しない

### 3.2 セキュアな Cookie 設定

セッション Cookie は以下の属性を持ちます:

- `HttpOnly`: JavaScript からアクセス不可
- `Secure`: 本番環境では HTTPS でのみ送信
- `SameSite=Lax`: CSRF リスクを低減しつつ通常の操作を維持
- `maxAge`: 3時間の有効期限

### 3.3 Content Security Policy (CSP)

`next.config.ts` で CSP を設定し、信頼できるソース以外のスクリプト実行を制限しています。

- `default-src 'self'`
- `script-src 'self' 'unsafe-inline' 'unsafe-eval'`
- `style-src 'self' 'unsafe-inline'`
- `img-src 'self' data:`
- `object-src 'none'`

> 開発中の React デバッグでは `unsafe-eval` を許可しています。実運用時に不要であれば削除してください。

## 4. クリーンアップ内容

以下の不要機能を削除し、認証に集中したコードベースに整理しました。

- トークンベース認証（JWT）関連コード
- `news` / `shop` / `cart` などの未使用機能
- 使用しない API ルート、ページ、型定義

## 5. デモンストレーション

1. サインアップ画面: パスワード強度表示
2. ログイン画面: 認証成功
3. プロフィール画面: 認証済み情報表示
4. 退会確認画面: 退会処理

[![デモンストレーションの動画リンク](https://img.youtube.com/vi/動画ID/0.jpg)](https://www.youtube.com/watch?v=KcNORTqldoM)

## 6. セットアップ手順

```bash
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

### 6.1 環境変数

本実装では JWT を使用しないため、JWT 固有の環境変数は不要です。

ただし、`.env` を用意する場合は、必要に応じて以下を設定してください。

```env
# 必要に応じて設定
NEXTAUTH_URL=http://localhost:3000
```

## 7. 使い方

1. `npm run dev` で開発サーバーを起動
2. `http://localhost:3000/signup` で新規登録
3. `http://localhost:3000/login` でログイン
4. ログイン後に表示される「退会」ボタンでアカウント削除

## 8. 主要ファイル

- `src/app/api/login/route.ts` - ログイン処理
- `src/app/api/logout/route.ts` - ログアウト処理
- `src/app/api/account/route.ts` - 退会処理
- `src/app/api/_helper/createSession.ts` - セッション Cookie 発行
- `src/app/api/_helper/verifySession.ts` - セッション検証
- `src/app/_components/PasswordStrengthMeter.tsx` - パスワード強度表示
- `next.config.ts` - CSP 設定

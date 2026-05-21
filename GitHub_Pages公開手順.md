# GitHub Pages公開手順

## 1. GitHubリポジトリを作る

1. GitHubにログインする
2. 右上の `+` から `New repository` を選ぶ
3. Repository name に `revofunding` などを入力する
4. Public を選ぶ
5. `Create repository` を押す

リポジトリ名はそのまま公開URLの一部になります。

例:

`https://ユーザー名.github.io/revofunding/`

## 2. サイトファイルをアップロードする

このフォルダにあるHTML、CSS、JavaScript、画像、ドキュメントをアップロードします。

最低限必要なもの:

- `index.html`
- `styles.css`
- `script.js`
- 各ページのHTML
- `assets/onokun.jpeg`
- `404.html`

GitHub画面から行う場合は、リポジトリの `Add file` から `Upload files` を選びます。

## 3. GitHub Pagesを有効にする

1. リポジトリの `Settings` を開く
2. 左側の `Pages` を開く
3. Source を `Deploy from a branch` にする
4. Branch を `main`、folder を `/root` にする
5. `Save` を押す

数十秒から数分で公開URLが表示されます。

## 4. 公開後に確認するページ

以下のページが開けるか確認します。

- トップ: `/index.html`
- 応援者募集: `/supporters.html`
- グッズ購入: `/shop.html`
- 達成・ファン化: `/achieved.html`
- おのくんライセンス: `/license.html`
- 認定デザイナー: `/designers.html`
- 運営ダッシュボード風: `/dashboard.html`
- 資金の流れ: `/money-flow.html`
- マイページ風: `/mypage.html`
- 紹介リンク発行: `/referral.html`
- 活動レポート詳細: `/report-detail.html`

## 5. SNS共有を確認する

`shop.html` のSNSシェアボタンと埋め込みコードは、公開されたページURLを自動で使用します。

確認するもの:

- Xで共有画面が開く
- Threadsで投稿画面が開く
- LINE共有が開く
- Facebook共有が開く
- Instagram用文面がコピーされる
- 埋め込みコード内のURLがGitHub PagesのURLになる

## 6. 次に接続する外部サービス

公開確認後、以下を順番に接続します。

1. Google Forms: 起案者登録、応援者登録、デザイナー登録、ファン通知登録
2. Google Sheets: 申請一覧、在庫、売上、活動レポート管理
3. BASE: 商品販売ページ
4. LINE公式: 再販通知、二次募集通知、活動報告
5. Canva: SNS素材、商品画像、告知画像

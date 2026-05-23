# SNS共有確認メモ

## 目的

外部の人がSNSで共有したときに、レボファンディングの公開URLが正しく使われるように確認します。

## 今回の調整

- SNS共有URLを `https://hayator11.github.io/revofunding/shop.html` に固定
- 応援者募集、支援者購入、認定アーティスト、達成・ファン化の各ページにSNS共有導線を設置
- 紹介リンクを `https://hayator11.github.io/revofunding/shop.html?ref=revo-bousai-001` に固定
- ブログ埋め込みコードを公開URLで生成
- Instagram用コピー文に購入ページURLを追加
- `shop.html` に canonical URL、OGP URL、OGP画像URLを追加

## 確認するURL

```text
https://hayator11.github.io/revofunding/shop.html
https://hayator11.github.io/revofunding/supporters.html
https://hayator11.github.io/revofunding/designers.html
https://hayator11.github.io/revofunding/achieved.html
https://hayator11.github.io/revofunding/onokun-a.jpeg
```

## 確認するボタン

- X
- Threads
- LINE
- Instagram
- Facebook
- コピー
- 投稿文コピー
- 埋め込みコードコピー

## 注意点

Instagramはブラウザから直接シェア投稿を作る仕様ではないため、文面をコピーしてInstagramアプリで投稿する運用にします。

Threadsは環境によって投稿画面が開かない場合があります。その場合も、コピー文と公開URLを使って投稿できます。

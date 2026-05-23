# Google Sheets レボアート自動転記スクリプト手順

## 目的

レボアート相談フォームの回答を、運営用に見やすい管理タブへ自動転記します。

作られるタブ:

```text
Art Applications
```

## 使う管理表

```text
レボアート 相談・申込み 管理表
https://docs.google.com/spreadsheets/d/1AbtWF5BB3X5XriN-emSFZIiYToCNgS-6wR7mZCefAMM/edit
```

## 手順

1. レボアート相談フォームの回答シートを開く
2. 上のメニューから `拡張機能`
3. `Apps Script`
4. コードを全部消す
5. 以下のファイルの中身を全部貼る

```text
google_sheets_auto_transfer_revo_art.gs
```

6. 保存する
7. 関数で以下を選ぶ

```text
setupRevoArtAutoTransfer
```

8. 実行する

これで、今後フォーム回答が入るたびに `Art Applications` へ転記されます。

## テスト方法

フォームにテスト回答を1件送ります。

そのあとApps Scriptで以下を実行します。

```text
testTransferLatestRevoArtResponse
```

`Art Applications` に1行追加されれば成功です。

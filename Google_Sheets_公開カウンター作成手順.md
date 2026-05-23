# Google Sheets 公開カウンター作成手順

## 目的

サイトの人数、金額、在庫、売上などを、Google Sheetsの公開用集計値から更新できるようにします。

個人情報が入ったフォーム回答シートは公開しません。
公開するのは `Public Counters` シートだけです。

## 1. 管理表を開く

レボファンディングの運営用Google Sheetsを開きます。

## 2. Apps Scriptを開く

上のメニューから以下を開きます。

```text
拡張機能
→ Apps Script
```

## 3. スクリプトを貼る

このファイルの中身をApps Scriptに貼ります。

```text
google_sheets_create_public_counters.gs
```

## 4. 実行する

関数で以下を選びます。

```text
createPublicCountersSheet
```

実行すると、Google Sheets内に以下のシートができます。

```text
Public Counters
```

## 5. 公開用CSVにする

Google Sheetsに戻り、以下を開きます。

```text
ファイル
→ 共有
→ ウェブに公開
```

設定:

```text
公開対象: Public Counters
形式: カンマ区切り値（.csv）
```

公開後にCSV URLをコピーします。

## 6. サイト側へ接続

コピーしたCSV URLを `script.js` の以下に入れます。

```js
const counterDataUrl = window.REVO_COUNTER_DATA_URL || "https://docs.google.com/spreadsheets/d/e/公開CSVのURL";
```

CSVが読めない場合でも、ページ内の初期値が表示されます。
テスト用に手動更新する場合は `counter-data.json` の数値を更新します。

## 7. 運用ルール

- 個人名、メール、電話番号、SNS URLは `Public Counters` に入れない
- 公開してよい集計値だけを入れる
- BASE売上、在庫、支援予定額は運営確認後に更新する
- Google Formsの回答数を自動集計する場合も、公開するのは集計結果だけにする
- 応援者数、希望金額、利用金額、運用額、残、購入者数は `Public Counters` の key とサイト側の `data-counter` 名を一致させる

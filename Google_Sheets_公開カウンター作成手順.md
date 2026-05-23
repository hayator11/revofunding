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

## 8. 自動更新にする

`Public Counters` が入っているGoogleスプレッドシートで、以下を開きます。

```text
拡張機能
→ Apps Script
```

新しいファイルを作り、以下のファイルの中身を貼ります。

```text
google_sheets_auto_update_public_counters.gs
```

最初に実行する関数:

```text
setupRevoCounterAutomation
```

作成されるタブ:

| タブ名 | 役割 |
| --- | --- |
| Public Counters | サイトに公開する数字だけのシート |
| Counter Sources | どのフォーム回答シートを数えるかを設定するシート |
| Product Finance | BASE売上、販売数、在庫、制作費などを入れるシート |
| Counter Update Log | 自動更新の履歴 |

## 9. Counter Sourcesの書き方

`Counter Sources` には、フォーム回答シートを設定します。

| enabled | type | spreadsheetId | sheetName | statusColumn | includeStatuses | memo |
| --- | --- | --- | --- | --- | --- | --- |
| TRUE | supporter |  | フォームの回答 1 |  |  | 応援者フォーム |
| TRUE | fan |  | フォームの回答 1 |  |  | ファン登録フォーム |
| TRUE | challenger |  | フォームの回答 1 |  |  | 起案者申請フォーム |
| TRUE | artist |  | フォームの回答 1 |  |  | 認定アーティスト応募 |
| TRUE | revoArt |  | フォームの回答 1 |  |  | レボアート相談 |

同じスプレッドシート内にフォーム回答タブがある場合、`spreadsheetId` は空欄で大丈夫です。

別のスプレッドシートを数える場合は、URLの `/d/` と `/edit` の間にあるIDを `spreadsheetId` に入れます。

例:

```text
https://docs.google.com/spreadsheets/d/11x5gBvQcis6t2xKtD5NlnnzBWI0ywaQKgXUJOZqOuNo/edit
```

この場合のID:

```text
11x5gBvQcis6t2xKtD5NlnnzBWI0ywaQKgXUJOZqOuNo
```

## 10. BASE連動の考え方

BASEの販売数や売上は、サイトから直接自動取得しません。

公開前の安全な運用では、BASE管理画面を見て `Product Finance` に転記します。
その後、スクリプトが `Public Counters` へ自動反映します。

BASE APIで完全自動化する場合は、別途BASE APIの認証設定が必要です。

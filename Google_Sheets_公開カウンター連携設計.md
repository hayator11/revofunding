# Google Sheets 公開カウンター連携設計

## 目的

Google Formsの回答やBASE販売状況から集計した数値だけを、GitHub Pagesのサイトへ反映します。

個人情報が入った回答シートは公開しません。
公開するのは、人数、件数、金額、在庫などの集計値だけです。

## サイト側の現在の仕組み

サイトは `counter-data.json` を読み込み、HTML内の `data-counter` が付いた数字を更新します。

例:

```html
<strong data-counter="supportersCount">32人</strong>
```

`counter-data.json` 側:

```json
{
  "counters": {
    "supportersCount": "32人"
  }
}
```

## 公開用シートの形

Google Sheetsに `Public Counters` というシートを作ります。

| key | value | memo |
| --- | --- | --- |
| totalSupporters | 74人 | 累計応援者 |
| totalFans | 186人 | 累計ファン |
| supportersCount | 32人 | 防災×帽祭の応援者 |
| fansCount | 118人 | 防災×帽祭のファン |
| soldCount | 64枚 | 販売数 |
| stockCount | 18枚 | 在庫 |
| totalFunds | 320,000円 | 集まった資金 |
| productionCost | 120,000円 | 制作費 |
| salesAmount | 288,000円 | 売上 |
| nextStock | 80,000円 | 次回ストック |
| challengerSupportPlanned | 45,000円 | 起案者支援予定 |
| challengerSupportPaid | 20,000円 | 支援済み |
| snsShares | 47件 | SNS共有 |

## 公開CSVにする場合

1. 個人情報のない `Public Counters` シートだけを作る
2. `ファイル` → `共有` → `ウェブに公開`
3. 公開対象を `Public Counters` にする
4. 形式を `カンマ区切り値（.csv）` にする
5. CSV URLをコピーする
6. `script.js` の `counterDataUrl` をCSV URLへ差し替える

## 注意

- 回答者名、メール、電話、SNS URLなどを公開シートに入れない
- 金額は確定値と予定値を分ける
- BASE売上は自動取得できない場合、運営が管理表に入力する
- まずは `counter-data.json` を更新する手動運用から始めると安全

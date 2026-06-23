# レボファンディングV2 Googleフォーム → Sheet → JSON反映ルール

## 目的

レボファンディングV2では、Googleフォームで受け取った申請内容をそのまま公開せず、Google Sheetで受け取り、運営確認を行ったうえで公開用JSONへ反映する。

このドキュメントは、以下の流れを安全に運用するためのルールを定義する。

```text
Googleフォーム申請
↓
Google Sheetに回答保存
↓
運営確認
↓
公開可否・公開項目を整理
↓
JSONへ反映
↓
V2各ページに表示
```

対象は以下とする。

- スパーカー募集
- ブースター募集
- レボアート申請
- レボアートスポット
- 起案者 / レボマイスター情報
- 全国応援Map掲載情報

## 全体方針

- Googleフォームの回答をそのまま公開しない。
- 必ず運営確認を挟む。
- 公開ページには公開許可済み情報だけを表示する。
- 内部管理情報は公開ページに表示しない。
- 個人情報は公開しない。
- 詳細住所・電話番号・メールアドレスは公開しない。
- 未許可画像は公開しない。
- Googleフォーム編集用URLを公開JSONやHTMLに入れない。
- Google Map URLは自動生成しない。
- iframeは使わない。
- `undefined` / `null` / `NaN` を公開ページに出さない。

## 情報区分

GoogleフォームとGoogle Sheetで扱う情報は、次の3分類で管理する。

### A. 公開表示情報

公開ページに表示してよい情報。公開許可があることを前提とする。

- 公開用タイトル
- 公開用説明文
- 公開用起案者名
- 公開用プロフィール
- 都道府県
- 市町村
- カテゴリ
- 活動地域
- 目的
- 背景
- 応援してほしいこと
- 参加方法
- 公開許可済み画像
- 達成状況
- 募集状況

### B. 内部管理情報

運営確認・連絡・審査のために使う情報。公開ページには表示しない。

- 本名
- メールアドレス
- 電話番号
- 詳細住所
- Googleフォーム回答ID
- 運営メモ
- 審査メモ
- 確認担当者
- 内部ステータス
- 管理用URL
- Google Sheet行番号

### C. 条件付き公開情報

公開許可フラグが `true` の場合のみ表示してよい情報。

- 公開名
- プロフィール
- 顔写真
- 活動写真
- 市町村
- Google Map URL
- 紹介文

条件付き公開情報は、該当項目ごとに許可を確認する。たとえば「市町村は公開可」でも、「顔写真は不可」のように項目単位で扱う。

## スパーカー募集の項目設計

スパーカー募集は、起案者・レボマイスターが立ち上げる挑戦に対して、スパーカーを募るページである。

主語は以下とする。

- 起案者
- レボマイスター
- この挑戦

募集対象は以下とする。

- スパーカー

公開表示項目は以下を基本とする。

- 達成人数
- 目標人数
- 達成率
- 達成目標期日
- 目標組数
- 達成組数
- 目標金額

想定JSON項目:

```json
{
  "type": "spark",
  "status": "published",
  "featured": false,
  "title": "",
  "description": "",
  "category": "",
  "region": "",
  "city": "",
  "publicName": "",
  "organizerName": "",
  "operatorProfile": "",
  "purpose": "",
  "background": "",
  "supportRequest": "",
  "impact": "",
  "targetAudience": "",
  "activityArea": "",
  "schedule": "",
  "howToJoin": "",
  "images": [],
  "sparkAchievedPeople": "",
  "sparkTargetPeople": "",
  "sparkAchievementRate": 0,
  "sparkTargetDate": "",
  "sparkTargetGroups": "",
  "sparkAchievedGroups": "",
  "sparkTargetAmount": ""
}
```

注意:

- スパーカー個人の内部情報を出さない。
- 「運営確認後に掲載」などの内部文言を公開ページに大量表示しない。
- 値がない項目は、原則として非表示または自然な準備中表記にする。
- 架空の人数・組数・金額・期日は入れない。

## ブースター募集の項目設計

ブースター募集は、挑戦を継続的・回数的に広げる仲間を募るページである。

公開表示項目は以下を基本とする。

- 残り人数
- 目標人数
- 達成率
- 達成回数
- 目標回数
- 目標期日

想定JSON項目:

```json
{
  "type": "boost",
  "status": "published",
  "featured": false,
  "title": "",
  "description": "",
  "category": "",
  "region": "",
  "city": "",
  "publicName": "",
  "organizerName": "",
  "operatorProfile": "",
  "purpose": "",
  "background": "",
  "supportRequest": "",
  "impact": "",
  "targetAudience": "",
  "activityArea": "",
  "schedule": "",
  "howToJoin": "",
  "images": [],
  "boostRemainingPeople": "",
  "boostTargetPeople": "",
  "boostAchievementRate": 0,
  "boostAchievedCount": "",
  "boostTargetCount": "",
  "boostTargetDate": ""
}
```

注意:

- `completed` は `type` ではなく `status` として扱う。
- `completed + spark` はスパーカー募集項目を表示する。
- `completed + boost` はブースター募集項目を表示する。
- ブースターを単なる支援金額カードにしない。

## レボアート申請の項目設計

レボアートは次の3カテゴリで扱う。

- `wall`
- `car`
- `hat`

公開ページで扱う情報:

- カテゴリ
- 公開用タイトル
- 公開用説明
- 地域
- 公開用申請者名または団体名
- 公開許可済み紹介文
- 公開許可済み画像
- 申請から掲載までの流れ
- 掲載・紹介のされ方
- 注意事項

内部管理情報:

- 申請者本名
- メールアドレス
- 電話番号
- 詳細住所
- 設置場所の詳細住所
- 運営メモ
- 審査メモ
- 抽選状況
- 確認担当者

想定JSON項目:

```json
{
  "id": "",
  "type": "revoArtSpot",
  "artCategory": "wall",
  "status": "pending",
  "publicTitle": "",
  "publicDescription": "",
  "region": "",
  "city": "",
  "publicName": "",
  "profile": "",
  "images": [],
  "isMapPublished": false,
  "mapOptOut": false,
  "googleMapEnabled": false,
  "googleMapPermission": false,
  "googleMapUrl": ""
}
```

注意:

- 申請中と決定済みを混同しない。
- 当選済みに見える表現を出さない。
- 架空の掲載スポットを作らない。
- 詳細住所・電話番号・メールアドレスを公開しない。

## 全国応援Map反映ルール

通常Map / カウンター掲載条件:

```js
isMapPublished === true
mapOptOut !== true
status !== "hidden"
```

Google Mapピンポイント掲載条件:

```js
googleMapEnabled === true
googleMapPermission === true
mapOptOut !== true
status !== "hidden"
googleMapUrl が https:// で始まる
```

重要:

- 通常Mapに `googleMapEnabled` を必須にしない。
- Google Map URLは自動生成しない。
- iframeは使わない。
- 詳細住所・個人宅ピン・実名・顔写真・連絡先は出さない。
- Google Mapピンポイント表示は許可者のみとする。

## status設計

共通status:

| status | 意味 | 公開ページでの扱い |
| --- | --- | --- |
| `draft` | 下書き | 公開しない |
| `pending` | 申請受付済み、運営確認中 | 原則公開しない、または管理側のみ |
| `approved` | 承認済み、公開準備中 | 必要な場合のみ公開前表示 |
| `published` | 公開中 / 募集中 | 募集中として表示 |
| `completed` | 達成済み / 募集完了 / 掲載完了 | 達成済みとして表示 |
| `hidden` | 非表示 | 表示しない |
| `rejected` | 非採用 | 表示しない |

公開ページ表示ルール:

- `published` → 募集中
- `completed` → 達成済み
- `approved` → 公開準備中
- `pending` → 原則非表示
- `hidden` → 表示しない
- `rejected` → 表示しない

注意:

- `status` をそのまま公開文言として出さない。
- 「公開状態を確認中」などの内部文言を出さない。
- 「運営確認後に掲載」を大量表示しない。

## Googleフォーム項目案

フォーム項目は以下のカテゴリで整理する。

- 申請種別
- 公開用情報
- 活動内容
- 募集内容
- 画像
- 地域情報
- Map掲載希望
- 連絡先
- 公開許可
- 運営確認

### 公開用情報

- 公開用タイトル
- 公開用説明文
- 公開用名前 / 団体名
- 公開用プロフィール
- 公開可能な活動地域

### 内部連絡先

- 申請者本名
- メールアドレス
- 電話番号
- 連絡用SNS
- 詳細住所

### 公開許可

- 公開名を掲載してよいか
- プロフィールを掲載してよいか
- 画像を掲載してよいか
- 市町村まで掲載してよいか
- Google Mapピンポイント掲載を希望するか

## JSON反映時の変換ルール

Google SheetからJSONへ反映する時は、以下を守る。

- 空欄は空文字または項目なしにする。
- `undefined` / `null` / `NaN` を出さない。
- 公開許可がない項目は公開用JSONに入れない。
- 内部情報は公開用JSONに入れない、または表示側で絶対に使わない。
- `status === "hidden"` / `status === "rejected"` は公開一覧に出さない。
- `pending` は原則公開一覧に出さない。
- 数値は表示前に型を確認する。
- 画像は公開許可済みのものだけ配列に入れる。
- Googleフォーム回答ID、Sheet行番号、運営メモは公開用JSONから分離する。

## ページ別の参照項目

### list.html

参照:

- `featured`
- `type`
- `status`
- `title`
- `description`
- `images` / `image`
- `category`
- `region`
- `city`
- スパーカー / ブースター別の進捗項目

### detail.html

参照:

- `type`
- `status`
- `title`
- `description`
- `images`
- `purpose`
- `background`
- `supportRequest`
- `impact`
- `targetAudience`
- `activityArea`
- `schedule`
- `howToJoin`
- `publicName`
- `organizerName`
- `operatorProfile`
- スパーカー / ブースター別の進捗項目

### sparkers.html

参照:

- `type === "spark"`
- `status !== "hidden"`
- `title`
- `description`
- `images`
- `sparkAchievedPeople`
- `sparkTargetPeople`
- `sparkAchievementRate`
- `sparkTargetDate`
- `sparkTargetGroups`
- `sparkAchievedGroups`
- `sparkTargetAmount`

### boosters.html

参照:

- `type === "boost"`
- `status !== "hidden"`
- `title`
- `description`
- `images`
- `boostRemainingPeople`
- `boostTargetPeople`
- `boostAchievementRate`
- `boostAchievedCount`
- `boostTargetCount`
- `boostTargetDate`

### revo-art.html

参照:

- `wall` / `car` / `hat` カテゴリ情報
- 申請CTA
- 当選レボアートスポット
- 全国応援Map

### revo-art-detail.html

参照:

- `artCategory`
- `title`
- `description`
- `image`
- 募集対象
- 申請から掲載まで
- 掲載・紹介のされ方
- 注意事項
- GoogleフォームURL

## 公開前チェックリスト

公開前に以下を確認する。

- 本名が出ていない。
- メールアドレスが出ていない。
- 電話番号が出ていない。
- 詳細住所が出ていない。
- 未許可画像が出ていない。
- 内部メモが出ていない。
- 「運営確認後に掲載」が大量表示されていない。
- 「公開状態を確認中」が出ていない。
- `undefined` / `null` / `NaN` が出ていない。
- Googleフォーム編集用URLが入っていない。
- Google Map URLを自動生成していない。
- iframeを使っていない。

## 将来実装メモ

今回は実装しないが、将来的に以下を検討する。

- Google Apps ScriptでSheetからJSON生成
- GitHub ActionsでJSON反映
- 管理用JSONと公開用JSONの分離
- 公開前プレビュー
- 運営承認フロー
- 画像アップロード権利確認フロー

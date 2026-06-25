# レボファンディングV2 既存Googleフォーム → Sheet → JSON対応表

## 目的

このドキュメントは、既存Googleフォームの回答項目を正として、Google Sheetの回答列とV2公開用JSON項目の対応を整理するためのものです。

新しいGoogleフォーム設計は行わない。新しい質問項目を勝手に追加しない。既存フォームと乖離した設計を作らない。

既存Googleフォームは用途ごとに複数存在するため、単一のフォームURLを正規URLとして扱わない。

```text
本ドキュメントでは、確認済みフォーム一覧 A〜E をもとに、用途別に整理する。
```

参照する既存docs:

```text
docs/v2-google-form-sheet-json-reflection-rules.md
```

## 既存フォームURL一覧と用途

既存Googleフォームは用途ごとに分けて扱う。フォームURLが似ていても、用途が確定していないものを勝手に統合しない。

| フォーム | URL | フォーム名 | 用途 | 分類 | 関連ページ候補 | 関連JSON候補 | 現時点の扱い |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Form A | `https://docs.google.com/forms/d/e/1FAIpQLSdtm4PpMVwWIRXsKLtSahzwWjCu2N4Qi14N-nHQh_ZF6UQzOg/viewform` | レボチャレンジ起案者申請フォーム | 起案者・レボマイスターが、レボチャレンジを立ち上げるための申請フォーム | 起案者申請 / レボチャレンジ立ち上げ / スパーク・ブーストの元になる挑戦情報 | detail.html / sparkers.html / boosters.html / list.html の挑戦をはじめる導線 | `projects-data.json` | 用途確定。フォーム回答をそのまま公開せず、運営確認後に公開用項目へ整理して反映する |
| Form B | `https://docs.google.com/forms/d/e/1FAIpQLSf5NE0ZPj3e3nK_73pUNLz_09j7BS3jK2uGLvLaktCU01OMaQ/viewform?usp=dialog` | レボファンディング認定デザイナー応募フォーム | 認定デザイナー / クリエイター参加用 | 認定デザイナー応募 / クリエイター参加 | 将来の認定デザイナー導線 / 認定アーティスト導線 / クリエイター参加導線 | 未定 | revo-art.html の申請CTAではない |
| Form C | `https://docs.google.com/forms/d/e/1FAIpQLSefNSuP9E7IPldqZKmt_0WgF7SF3htVHMaRfjCzIrZW9acFbQ/viewform?usp=dialog` | レボファンディング 挑戦者申請フォーム | レボファンディングで挑戦を立ち上げたい挑戦者向けの申請フォーム | 挑戦者申請 / 起案者系フォーム | detail.html / list.html の挑戦をはじめる導線候補 | `projects-data.json`候補 | Form A と近い役割を持つため、最終的にどちらをどの導線に使うかは別途確認する |
| Form D | `https://docs.google.com/forms/d/e/1FAIpQLSesxTpGbfAfXhHmIljMGknEFKWp0TfWR1n2R0NuPxt4rGdjKw/viewform?usp=dialog` | レボアート 相談・申込みフォーム | レボアートに関する開催地相談、企業協賛、アーティスト参加、レボファンディング連動の相談受付 | レボアート相談・申込み | revo-art.html / revo-art-detail.html | `revo-art-data.json` / `revo-art-winning-spots.json`候補 | レボアート申請CTAの差し替え候補。ただし、サイト上のURL差し替えはまだ行わない |
| Form E | `https://docs.google.com/forms/d/e/1FAIpQLSezDrOpfyY4sj9ShlTu1OzptzqOOGFHL-nl8yCX8_jTADhUcg/viewform?usp=dialog` | レボチャレンジ応援者参加フォーム | 応援者がレボチャレンジに参加するためのフォーム | 応援者参加 | detail.html / sparkers.html / boosters.html | `projects-data.json`候補 | Form A は起案者側、Form E は応援者側。混同しない |

Form A は、起案者・レボマイスターが挑戦を立ち上げるためのフォームである。

Form E は、応援者がレボチャレンジに参加するためのフォームである。

Form A と Form C はいずれも起案・挑戦者系のフォームであるため、最終的にどちらをどの導線に使うかは別途確認する。

## 古いURL / 一覧外URLの扱い

以下のURLは最新のForm A〜E一覧には含まれていないため、現時点では正規の反映対象として扱わない。

| URL | 現時点の扱い | 備考 |
| --- | --- | --- |
| `https://docs.google.com/forms/d/e/1FAIpQLSf9qATZlfFpGdNfCkIA0a7wjUOGR0pVjp43zlRzobPIM3sagA/viewform?usp=dialog` | 過去確認URL / 要確認 | 最新のForm A〜E一覧には含まれていないため、現時点では正規の反映対象として扱わない |
| `https://docs.google.com/forms/d/e/1FAIpQLSdII732mhijp5vlt-iWxg1qCv-Uli03VYySpiQ3EapsZy0O_w/viewform?usp=dialog` | 現在サイト実装内URL / 差し替え候補 | revo-art.html / render-revo-art.js / revo-art-data.json に入っている。最新のForm A〜E一覧には含まれていない。ただし、今回は差し替えない |

## 基本方針

- 既存Googleフォームの回答項目を正とする。
- 公開ページには公開許可済み情報だけを表示する。
- メールアドレス、電話番号、詳細住所、運営補足などの内部情報は公開ページに出さない。
- 既存フォームにない項目は「既存フォームに項目なし」と明記する。
- 不足項目は、追加済みとして扱わず「追加検討候補」として分離する。
- 架空の値をJSONに入れない。
- GoogleフォームURLを変更しない。
- Apps Scriptや自動連携スクリプトはこのドキュメントでは作成しない。

## 既存フォーム項目の棚卸し

2026-06-24時点で、過去確認URLから確認できたフォーム項目は以下。

| 既存フォーム項目名 | Sheet列名 | 内容 | 分類 | 公開可否 | 対応JSON項目 | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| タイムスタンプ | タイムスタンプ | 回答日時 | 運営管理情報 | 非公開 | なし | Sheet自動列。公開JSONに入れない |
| 申請したいレボアートの種類 | 申請したいレボアートの種類 | wall / car / hat のカテゴリ判定元 | 公開表示情報 | 公開可 | `artCategory` | 選択肢から `wall` / `car` / `hat` に変換 |
| 申請者名または活動名 | 申請者名または活動名 | 申請者または活動名 | 条件付き公開情報 | 許可条件付き | `publicName` | 実名掲載許可に従う |
| 連絡先メールアドレス | 連絡先メールアドレス | 連絡先 | 内部管理情報 | 非公開 | なし | 公開JSONに入れない |
| 連絡先電話番号 | 連絡先電話番号 | 連絡先 | 内部管理情報 | 非公開 | なし | 公開JSONに入れない |
| 都道府県 | 都道府県 | 都道府県 | 条件付き公開情報 | 許可条件付き | `region` | Map掲載にも利用候補 |
| 市区町村 | 市区町村 | 市区町村 | 条件付き公開情報 | 許可条件付き | `city` | 公開許可がある場合のみ |
| 申請したい内容 | 申請したい内容 | 申請内容の本文 | 公開表示情報 | 内容確認後 | `publicDescription` | 公開用説明の元データ候補 |
| 実施したい理由 | 実施したい理由 | 目的・背景 | 公開表示情報 | 内容確認後 | `profile` / `publicDescription` | 紹介文の元データ候補 |
| 応援として届けたいメッセージ | 応援として届けたいメッセージ | 応援メッセージ | 公開表示情報 | 内容確認後 | `profile` / `publicDescription` | 紹介文の元データ候補 |
| 地域や場所との関係 | 地域や場所との関係 | 地域・場所との関係性 | 条件付き公開情報 | 内容確認後 | `profile` | 詳細住所は含めない |
| ウォールアート希望の方：壁面・空間について | ウォールアート希望の方：壁面・空間について | 壁面・空間の補足 | 条件付き公開情報 | 内容確認後 | `profile` / カテゴリ別補足 | wall用 |
| カーアート希望の方：車両・移動媒体について | カーアート希望の方：車両・移動媒体について | 車両・移動媒体の補足 | 条件付き公開情報 | 内容確認後 | `profile` / カテゴリ別補足 | car用 |
| ハットアート希望の方：帽子表現・イベント参加について | ハットアート希望の方：帽子表現・イベント参加について | 帽子表現・イベント補足 | 条件付き公開情報 | 内容確認後 | `profile` / カテゴリ別補足 | hat用 |
| 公開してよい名称 | 公開してよい名称 | 公開名 | 公開表示情報 | 公開可 | `publicName` | 実名掲載許可と合わせて確認 |
| 公開してよい地域 | 公開してよい地域 | 公開地域 | 公開表示情報 | 公開可 | `region` / `city` | 都道府県・市区町村より優先できる公開用地域 |
| 公開してよい説明文 | 公開してよい説明文 | 公開用説明文 | 公開表示情報 | 公開可 | `publicDescription` / `profile` | 公開説明として優先候補 |
| 写真掲載の許可 | 写真掲載の許可 | 写真掲載可否 | 条件付き公開情報 | 条件付き | `images`反映可否 | 許可する / 事前確認後なら許可する / 許可しない / 未定 |
| 実名掲載の許可 | 実名掲載の許可 | 実名掲載可否 | 条件付き公開情報 | 条件付き | `publicName`反映可否 | 公開名のみ許可の場合は公開名を使う |
| 施設名・場所名掲載の許可 | 施設名・場所名掲載の許可 | 施設名・場所名の掲載可否 | 条件付き公開情報 | 条件付き | `publicTitle` / `profile` | 許可しない場合は掲載しない |
| 詳細住所掲載の許可 | 詳細住所掲載の許可 | 詳細住所の掲載可否 | 内部管理情報 | 原則非公開 | なし | V2公開ページでは詳細住所を出さない |
| 確認事項への同意 | 確認事項への同意 | 申請条件への同意 | 運営管理情報 | 非公開 | なし | 掲載確定ではない理解などの確認 |
| 運営への補足 | 運営への補足 | 運営向けメモ | 内部管理情報 | 非公開 | なし | 公開JSONに入れない |
| 連絡可能な時間帯 | 連絡可能な時間帯 | 連絡調整情報 | 内部管理情報 | 非公開 | なし | 公開JSONに入れない |

## 申請カテゴリ変換ルール

| 既存フォーム選択肢 | 変換後JSON項目 | 変換後値 |
| --- | --- | --- |
| ウォールアート｜壁や空間に、応援の物語を描く | `artCategory` | `wall` |
| カーアート｜移動するアートで、応援を街へ届ける | `artCategory` | `car` |
| ハットアート｜帽子に、個性と応援のメッセージをのせる | `artCategory` | `hat` |

## 過去確認URLのレボアート項目への対応

過去確認URLでは「レボアート申請」系の項目が確認できている。ただし、このURLは最新のForm A〜E一覧には含まれていないため、現時点では正規の反映対象として扱わない。

レボアート相談・申込みについては、最新一覧ではForm Dを候補として扱う。

| V2で確認する項目 | 対応JSON項目候補 | 既存フォーム項目 | 現時点の対応 | 備考 |
| --- | --- | --- | --- | --- |
| 申請カテゴリ | `artCategory` | 申請したいレボアートの種類 | 変換可能 | 選択肢から `wall` / `car` / `hat` に変換 |
| 公開用タイトル | `publicTitle` | 公開してよい名称 / 施設名・場所名掲載の許可 | 条件付き | 施設名・場所名掲載許可がある場合のみ |
| 公開用説明 | `publicDescription` | 公開してよい説明文 | 変換可能 | 公開説明として優先 |
| 地域 | `region` | 公開してよい地域 / 都道府県 | 条件付き | 公開用地域を優先 |
| 市町村 | `city` | 市区町村 / 公開してよい地域 | 条件付き | 市区町村まで公開可能な場合のみ |
| 公開用申請者名 / 団体名 | `publicName` | 公開してよい名称 / 申請者名または活動名 | 条件付き | 実名掲載許可に従う |
| 公開許可済み紹介文 | `profile` | 実施したい理由 / 応援として届けたいメッセージ / 地域や場所との関係 | 内容確認後 | 公開用に編集して反映 |
| 公開許可済み画像 | `images` | 写真掲載の許可 | 条件付き | 画像ファイル自体は別管理。許可状態だけ確認 |
| Map掲載可否 | `isMapPublished` / `mapOptOut` | 公開してよい地域 / 詳細住所掲載の許可 | 運営判断 | 通常Mapは詳細住所なしで掲載判断 |
| Google Mapピンポイント掲載可否 | `googleMapEnabled` / `googleMapPermission` | 既存フォームに明示項目なし | 追加検討候補 | 現時点では自動でtrueにしない |
| Google Map URL | `googleMapUrl` | 既存フォームに項目なし | 追加検討候補 | 自動生成しない |

## スパーカー募集への対応

過去確認URLでは、スパーカー募集専用項目は確認できない。

| V2表示項目 | 対応JSON項目 | 既存フォーム項目 | 現時点の対応 | 備考 |
| --- | --- | --- | --- | --- |
| 達成人数 | `sparkAchievedPeople` | 既存フォームに項目なし | Sheet側で運営が追記 / 自動集計候補 | 直接取得不可 |
| 目標人数 | `sparkTargetPeople` | 既存フォームに項目なし | 追加検討候補 | 直接取得不可 |
| 達成率 | `sparkAchievementRate` | 既存フォームに項目なし | JSON反映時に自動計算候補 | 達成人数 / 目標人数が必要 |
| 達成目標期日 | `sparkTargetDate` | 既存フォームに項目なし | 追加検討候補 | 直接取得不可 |
| 目標組数 | `sparkTargetGroups` | 既存フォームに項目なし | 追加検討候補 | 直接取得不可 |
| 達成組数 | `sparkAchievedGroups` | 既存フォームに項目なし | Sheet側で運営が追記 / 自動集計候補 | 直接取得不可 |
| 目標金額 | `sparkTargetAmount` | 既存フォームに項目なし | 追加検討候補 | 直接取得不可 |

## ブースター募集への対応

過去確認URLでは、ブースター募集専用項目は確認できない。

| V2表示項目 | 対応JSON項目 | 既存フォーム項目 | 現時点の対応 | 備考 |
| --- | --- | --- | --- | --- |
| 残り人数 | `boostRemainingPeople` | 既存フォームに項目なし | JSON反映時に自動計算候補 | 計算元が必要 |
| 目標人数 | `boostTargetPeople` | 既存フォームに項目なし | 追加検討候補 | 直接取得不可 |
| 達成率 | `boostAchievementRate` | 既存フォームに項目なし | JSON反映時に自動計算候補 | 計算元が必要 |
| 達成回数 | `boostAchievedCount` | 既存フォームに項目なし | Sheet側で運営が追記 / 自動集計候補 | 直接取得不可 |
| 目標回数 | `boostTargetCount` | 既存フォームに項目なし | 追加検討候補 | 直接取得不可 |
| 目標期日 | `boostTargetDate` | 既存フォームに項目なし | 追加検討候補 | 直接取得不可 |

## Sheet → JSON変換方針

| 既存Sheet列名 | 変換後JSON項目 | 変換方法 | 公開許可条件 | 未入力時の扱い | 内部情報か | 表示ページ |
| --- | --- | --- | --- | --- | --- | --- |
| 申請したいレボアートの種類 | `artCategory` | 選択肢を `wall` / `car` / `hat` に変換 | なし | 未入力なら反映保留 | いいえ | revo-art.html / revo-art-detail.html |
| 申請者名または活動名 | `publicName`候補 | 実名掲載許可を確認して反映 | 実名掲載の許可 | 非表示 | 条件付き | revo-art.html / revo-art-detail.html / Map |
| 連絡先メールアドレス | なし | 変換しない | なし | 公開しない | はい | なし |
| 連絡先電話番号 | なし | 変換しない | なし | 公開しない | はい | なし |
| 都道府県 | `region`候補 | 公開地域と照合して反映 | 公開地域として許可 | 非表示または都道府県のみ | 条件付き | 全国応援Map |
| 市区町村 | `city`候補 | 公開地域と照合して反映 | 市区町村公開許可 | 非表示 | 条件付き | 全国応援Map |
| 申請したい内容 | `publicDescription`候補 | 公開用に整えて反映 | 運営確認 | 非表示 | いいえ | revo-art-detail.html |
| 実施したい理由 | `profile`候補 | 公開用に整えて反映 | 運営確認 | 非表示 | いいえ | revo-art-detail.html |
| 応援として届けたいメッセージ | `profile`候補 | 公開用に整えて反映 | 運営確認 | 非表示 | いいえ | revo-art-detail.html |
| 地域や場所との関係 | `profile`候補 | 詳細住所を除いて反映 | 運営確認 | 非表示 | 条件付き | revo-art-detail.html / Map |
| 公開してよい名称 | `publicName` | そのまま候補にする | 実名掲載許可と照合 | 非表示 | いいえ | revo-art-detail.html / Map |
| 公開してよい地域 | `region` / `city` | 公開地域として反映 | なし | 非表示 | いいえ | 全国応援Map |
| 公開してよい説明文 | `publicDescription` / `profile` | 公開説明として優先反映 | なし | 非表示 | いいえ | revo-art-detail.html |
| 写真掲載の許可 | `images`反映可否 | 許可状態に応じて画像反映 | 許可する / 事前確認後なら許可する | 画像非表示 | 条件付き | revo-art.html / revo-art-detail.html |
| 実名掲載の許可 | `publicName`反映可否 | 許可状態に応じて公開名を判断 | 許可する / 公開名のみ許可する | 公開名のみまたは非表示 | 条件付き | revo-art-detail.html / Map |
| 施設名・場所名掲載の許可 | `publicTitle` / `profile`反映可否 | 許可状態に応じて掲載 | 許可する / 事前確認後なら許可する | 非表示 | 条件付き | revo-art-detail.html / Map |
| 詳細住所掲載の許可 | なし | V2公開ページでは詳細住所を出さない | 原則なし | 非表示 | はい | なし |
| 確認事項への同意 | なし | 運営確認に使用 | なし | 公開しない | はい | なし |
| 運営への補足 | なし | 変換しない | なし | 公開しない | はい | なし |
| 連絡可能な時間帯 | なし | 変換しない | なし | 公開しない | はい | なし |

## Map反映確認

既存フォームには、通常Map掲載可否やGoogle Mapピンポイント掲載可否を直接選ぶ項目は確認できない。

通常Map掲載は、公開してよい地域・都道府県・市区町村をもとに、運営確認後に判断する。

既存仕様:

```js
isMapPublished === true
mapOptOut !== true
status !== "hidden"
```

Google Mapピンポイント:

```js
googleMapEnabled === true
googleMapPermission === true
mapOptOut !== true
status !== "hidden"
googleMapUrl が https:// で始まる
```

注意:

- 通常Mapに `googleMapEnabled` を必須にしない。
- Google Map URLは自動生成しない。
- Google Mapピンポイント掲載は、既存フォームだけでは許可確認が不足している。
- 詳細住所掲載の許可があっても、V2公開ページで詳細住所を出すとは限らない。
- iframeは使わない。

## 不足項目の扱い

既存フォームにV2表示で必要な項目がない場合は、以下のいずれかで扱う。

| 区分 | 扱い |
| --- | --- |
| A. 既存フォーム項目から変換できる | 変換ルールを明記してJSONへ反映 |
| B. Sheet側で運営が追記する | 公開前に運営が確認・補完 |
| C. JSON反映時に自動計算する | 計算元が揃う場合のみ算出 |
| D. 現時点では非表示にする | 架空値を入れず、公開ページでは出さない |
| E. 追加検討候補として残す | ユーザー確認後にフォーム項目追加を検討 |

禁止:

- 既存フォームを無視して新しい項目設計を作る。
- 不足項目を勝手に追加済みとして扱う。
- 架空の値をJSONに入れる。
- 内部情報を公開JSONに入れる。

## 追加検討候補

### スパーカー募集

- 目標人数
- 達成目標期日
- 目標組数
- 目標金額
- 公開用タイトル
- 公開用説明
- 公開用画像

### ブースター募集

- 目標人数
- 目標回数
- 目標期日
- 公開用タイトル
- 公開用説明
- 公開用画像

### レボアート申請

- Google Mapピンポイント掲載可否
- Google Map URL
- 通常Map掲載可否
- Map掲載拒否
- 画像アップロード方法
- 当選後の公開タイトル確定欄

## 公開前チェック

SheetからJSONへ反映する前に、以下を確認する。

- メールアドレスが出ていない。
- 電話番号が出ていない。
- 詳細住所が出ていない。
- Google Sheet行番号が出ていない。
- Googleフォーム回答IDが出ていない。
- 管理用URLが出ていない。
- 運営メモが出ていない。
- 連絡可能な時間帯が出ていない。
- 未許可画像が出ていない。
- `undefined` / `null` / `NaN` が出ていない。
- Googleフォーム編集用URLが入っていない。
- Google Map URLを自動生成していない。
- iframeを使っていない。

## Sheet実列 → V2 JSON → カウンター / Map 対応表

この章は、確認済みのGoogle Sheet実列、既存JSON、既存表示ロジックを接続するための修復設計である。

新しいフォーム設計ではない。Sheet列名をそのまま公開JSONへ流し込まず、公開用JSONへ変換する対応表として扱う。

### 確認済みSheet構成

| 項目 | 内容 |
| --- | --- |
| 対象Sheet | `https://docs.google.com/spreadsheets/d/11x5gBvQcis6t2xKtD5NlnnzBWI0ywaQKgXUJOZqOuNo/edit?gid=47560567#gid=47560567` |
| gid | `47560567` |
| gid=47560567 のタブ | Dashboard |
| 確認できた主なタブ | Dashboard / Supporters / Projects / Public Counters / Applications / Product Finance / Supporter Dashboard / Supporter Role Master / Status Master / Message Templates |

このSheetが、フォーム回答と運営確認情報を集約し、公開用JSON・カウンター・Mapへ反映する中核データソースである。

### Projectsタブ → projects-data.json 対応

Projectsタブは、起案者申請や運営確認後の挑戦情報を管理するタブとして扱う。

Sheet列は `snake_case`、V2 JSONは `camelCase` であるため、変換工程で明示的に項目名を変換する。

| Sheet列 | V2 JSON項目 | 変換方法 | 表示先 | 備考 |
| --- | --- | --- | --- | --- |
| `project_id` | `id` | 文字列としてそのまま反映 | list.html / detail.html / sparkers.html / boosters.html | V2のプロジェクトID |
| `status` | `status` | 公開用ステータスへ変換 | 全プロジェクト表示 | `draft` は公開しない。`published` / `completed` / `hidden` 等へ整理 |
| `title` | `title` | 公開用タイトルとして反映 | list.html / detail.html / 一覧カード | 空欄の場合は公開保留 |
| `short_description` | `description` | 短い説明として反映 | list.html / 一覧カード | 公開向けに整える |
| `detail_description` | `longDescription` | 詳細説明として反映 | detail.html | 内部情報を除外して反映 |
| `category` | `category` | 公開カテゴリとして反映 | list.html / detail.html | 表示名は運営確認後 |
| `main_image_url` | `image` / `mainImageUrl` | 公開許可済み画像のみ反映 | list.html / detail.html | 未許可画像は反映しない |
| `detail_image_urls` | `images` / `storyBlocks`候補 | 複数画像として整形 | detail.html | URL分割・掲載許可確認が必要 |
| `creator_name` | `organizerName` / `publicName`候補 | 公開許可済み名称のみ反映 | detail.html / Map候補 | 実名・団体名の公開許可が必要 |
| `creator_profile` | `operatorProfile`候補 | 公開向けプロフィールへ整形 | detail.html | メール・電話・詳細住所を除外 |
| `target_supporters` | `sparkTargetPeople` または `boostTargetPeople`候補 | typeに応じて振り分け | list.html / detail.html / sparkers.html / boosters.html | spark / boost の判定が必要 |
| `current_supporters` | `sparkAchievedPeople`候補 | 人数表示へ整形 | list.html / detail.html / sparkers.html | スパーカー達成人数候補 |
| `target_amount` | `sparkTargetAmount`候補 | 金額表示へ整形 | list.html / detail.html / sparkers.html | スパーカー目標金額候補 |
| `current_amount` | 直接表示しない / 将来金額集計候補 | 公開表示可否を確認 | detail.html候補 | 現時点では一般支援額カードへ戻さない |
| `booster_target_supporters` | `boostTargetPeople`候補 | 人数表示へ整形 | list.html / detail.html / boosters.html | ブースター目標人数候補 |
| `booster_current_supporters` | `boostRemainingPeople`計算候補 | `booster_target_supporters`との差分で算出 | list.html / detail.html / boosters.html | 残り人数計算候補 |
| `start_date` / `end_date` | `sparkTargetDate` / `boostTargetDate`候補 | 日付表示へ整形 | list.html / detail.html / 一覧 | どちらを期日として使うか運用確認が必要 |
| `source_application_id` | 非公開 / 管理用参照 | 公開JSONへ入れない | なし | 内部管理ID |
| `work_page_url`相当 / `project-work` URL | 非公開 | 公開JSONへ入れない | なし | key付きURLは内部管理情報 |
| `preview_page_url`相当 / `project-preview` URL | 非公開 | 公開JSONへ入れない | なし | key付きURLは内部管理情報 |
| `email`相当 | 非公開 | 公開JSONへ入れない | なし | メールアドレスは公開しない |

### スパーカー集計ルール

V2で必要なスパーカー表示項目は以下。

| 表示項目 | V2 JSON項目 | Sheet候補 | 変換・計算 | 現時点の判断 |
| --- | --- | --- | --- | --- |
| 達成人数 | `sparkAchievedPeople` | `current_supporters` | 人数表示へ整形 | Projectsタブ候補 |
| 目標人数 | `sparkTargetPeople` | `target_supporters` | 人数表示へ整形 | Projectsタブ候補 |
| 達成率 | `sparkAchievementRate` | `current_supporters` / `target_supporters` | `current_supporters / target_supporters * 100` | 計算候補 |
| 達成目標期日 | `sparkTargetDate` | `end_date`候補 | 日付表示へ整形 | どの列を使うか運用確認が必要 |
| 目標組数 | `sparkTargetGroups` | 未確認 | 運営追記列または追加確認候補 | Sheet実列未確認 |
| 達成組数 | `sparkAchievedGroups` | 未確認 | 運営追記列または集計候補 | Sheet実列未確認 |
| 目標金額 | `sparkTargetAmount` | `target_amount` | 金額表示へ整形 | Projectsタブ候補 |

`target_supporters` が空欄または0の場合、`NaN` を出さない。計算不能時は0または非表示にし、架空値を入れない。

`sparkTargetGroups` / `sparkAchievedGroups` / `sparkTargetDate` に対応する確定Sheet列は未確認のため、運営追記列または追加確認候補として扱う。

### ブースター集計ルール

V2で必要なブースター表示項目は以下。

| 表示項目 | V2 JSON項目 | Sheet候補 | 変換・計算 | 現時点の判断 |
| --- | --- | --- | --- | --- |
| 残り人数 | `boostRemainingPeople` | `booster_target_supporters` / `booster_current_supporters` | `booster_target_supporters - booster_current_supporters` | 計算候補 |
| 目標人数 | `boostTargetPeople` | `booster_target_supporters` | 人数表示へ整形 | Projectsタブ候補 |
| 達成率 | `boostAchievementRate` | `booster_current_supporters` / `booster_target_supporters` | `booster_current_supporters / booster_target_supporters * 100` | 計算候補 |
| 達成回数 | `boostAchievedCount` | 未確認 | 運営追記列または集計候補 | Sheet実列未確認 |
| 目標回数 | `boostTargetCount` | 未確認 | 運営追記列または追加確認候補 | Sheet実列未確認 |
| 目標期日 | `boostTargetDate` | `end_date`候補 | 日付表示へ整形 | どの列を使うか運用確認が必要 |

`boostAchievedCount` / `boostTargetCount` に対応するSheet列は未確認。人数基準か回数基準かは運用確認が必要である。

計算不能時に `NaN` を出さない。ブースターを一般的な支援金額カードに戻さない。

### Public Countersタブ → サイトカウンター対応

Public Countersタブは、サイト全体の公開カウンターに使う候補である。ただし、現時点ではV2トップ / Map / detail.html へ直接接続されていない。

確認済みの主なキー:

| Public Counters key | サイト表示候補 | 現時点の扱い |
| --- | --- | --- |
| `activeChallenges` | 進行中の挑戦数 | サイト全体カウンター候補 |
| `totalSupporters` | 全体応援者数候補 | 表示名・意味の運営確認が必要 |
| `totalFans` | ファン数 / 参加者数候補 | 表示名・意味の運営確認が必要 |
| `totalBadges` | 称号付与数候補 | 将来のバッジ表示候補 |
| `productsMade` | 制作商品数候補 | 表示箇所は未接続 |
| `supportersCount` | 応援者数候補 | 防災×帽祭など個別挑戦のカウンター候補 |
| `soldCount` | 販売数 / 達成数候補 | 一般支援額カードへ戻さず用途確認後に使用 |
| `salesAmount` | 売上 / 金額カウンター候補 | 公開表示可否の確認が必要 |

Public Countersはそのまま表示しない。表示名・意味を運営確認してからサイトに反映する。

### Supportersタブ → スパーカー / ブースター集計対応

Supportersタブは、Form E「レボチャレンジ応援者参加フォーム」や応援者情報の集約元になる可能性が高い。

確認済みの主な列:

```text
受付ID
受付日時
ニックネーム / 表示名
氏名
メールアドレス
LINE名
活動地域
SNS URL
参加したいレボチャレンジ
参加区分
協力できること
参加ステータス
付与称号
紹介コード
次アクション
担当者
備考
応援投稿URL
supporter_contact
supporter_message_subject
supporter_message_body
supporter_message_status
supporter_next_action
supporter_action_note
```

Supportersタブの回答数やproject_id別集計が、スパーカーの達成人数やブースターの参加数・残り人数に関係する可能性がある。

ただし、現時点では以下が未接続である。

- SupportersにV2の `projectId` と完全一致する列は未確認。
- Supportersに `spark` / `boost` を直接判別する列は未確認。
- Supportersの行数を `current_supporters` に反映するのか、Projectsタブの `current_supporters` を正とするのか運用確認が必要。

### Applicationsタブ → 申請管理 / 公開反映対応

Applicationsタブは、起案者申請・レボアート申請・認定デザイナー応募などの申請管理に関係する可能性がある。

確認済みの主な列:

```text
受付ID
受付日時
起案者名 / 活動名
担当者名
メールアドレス
挑戦タイトル
活動地域
挑戦カテゴリ
希望商品
審査ステータス
優先度
次アクション
初回ヒアリング日
担当者
掲載予定ページ
備考
目標応援人数
一人あたりの応援金額
達成後のファン募集目標人数
レボスパーク募集プラン
相談したい内容
タイトル周辺に見せたい画像URL
本文中に入れたい画像URLと位置
プロフィール画像URL
画像の使用許可を確認しました
```

Applicationsタブは内部情報を含む可能性が高いため、そのまま公開JSON化しない。

公開JSONへ入れないもの:

- メール
- 電話番号
- 詳細住所
- 管理URL
- key付きURL
- 運営メモ
- 確認担当
- 内部ステータス

### revo-art-data.json への反映ルール

現状:

- `revo-art-data.json` は静的JSONである。
- 現在も一覧外URL `SdII732...` を使用している。
- Form D「レボアート 相談・申込みフォーム」と未接続。
- Sheetからの直接変換ルールも未接続。

修復設計:

- Form D → Sheet → `revo-art-data.json` / 当選レボアートスポット / Map への反映設計が必要。
- 申請中と当選済みを混同しない。
- `status` が `pending` のものは当選スポットとして出さない。
- 運営確認・抽選・決定後に `published` / `completed` 等で反映する。

### revo-support-map-data.json へのMap反映対応

現状:

- `revo-support-map-data.json` は静的JSONである。
- 宮城県5件を保持している。
- Map表示条件は実装済み。
- Sheetからの自動追加は未接続。

通常Map条件:

```js
isMapPublished === true
mapOptOut !== true
status !== "hidden"
```

Google Mapピンポイント条件:

```js
googleMapEnabled === true
googleMapPermission === true
mapOptOut !== true
status !== "hidden"
googleMapUrl が https:// で始まる
```

修復が必要なもの:

- Sheet側に `isMapPublished` / `mapOptOut` / `googleMapEnabled` / `googleMapPermission` / `googleMapUrl` 相当列があるか確認する。
- なければ運営追記列として追加検討する。
- 通常MapとGoogle Mapピンポイントを分離する。
- Google Map URLは自動生成しない。
- 詳細住所は公開しない。

### 内部情報除外ルール

SheetをそのままJSON化すると、メール、管理URL、key付きURLなど内部情報が混入する可能性がある。

`project-work` / `project-preview` / `mypage` 系URLがSheetに存在する可能性があるため、公開用JSON生成時には内部情報除外フィルターを必ず通す。

Sheet列をそのままJSON化しない。公開JSONへ入れる列は許可リスト方式にする。

除外対象:

- `email`
- `phone`
- `privateAddress`
- `internalNote`
- `adminMemo`
- `manager`
- `sheetRow`
- `formResponseId`
- `projectWorkUrl`
- `projectPreviewUrl`
- `mypageUrl`
- key付きURL
- 管理URL
- メール文面
- 担当者
- 運営メモ

### 許可リスト方式

公開用JSONは blacklist ではなく whitelist 方式で生成する。

許可した列だけをJSON化する。未定義列・内部管理列は出力しない。

### 修復優先順位

1. Sheet実列 → V2 JSON項目の対応表を確定
2. Projects → `projects-data.json` 変換ルールを確定
3. Supporters / Public Counters → カウンター集計ルールを確定
4. Form D → `revo-art-data.json` / Map反映ルールを確定
5. 内部情報除外フィルターを定義
6. テスト用JSON生成
7. サイト反映テスト
8. 本番反映

### 今回は実施しないこと

- HTML修正
- CSS修正
- JS修正
- JSON修正
- Sheet編集
- Googleフォーム編集
- URL差し替え
- Apps Script作成
- commit
- push

## Sheet→公開用JSON 変換テスト結果

この章は、Google Sheet実列からV2公開用JSONへ安全に変換できるかを、Projectsタブの代表1件で確認した結果を記録する。

このテストは確認用であり、サイトJSONの書き換えや本番反映ではない。Apps Script作成、JSON生成、Google Sheet編集、URL差し替えはまだ行わない。

### Projects変換サンプル

確認対象:

```text
Projectsタブ 代表行:
project_id = revo-20260606-おのくんキャラバンレボアート
```

公開用JSON変換サンプル:

```json
{
  "id": "revo-20260606-おのくんキャラバンレボアート",
  "type": "spark",
  "status": "published",
  "featured": false,
  "title": "おのくんキャラバンレボアート",
  "description": "クリエイターの挑戦として申請されました。",
  "longDescription": "廃棄予定のペンキや地域の課題を、アートと応援の力で見たくなる形へ変えるプロジェクトです。",
  "category": "クリエイター",
  "image": "revo-funding-guide.png",
  "mainImageUrl": "revo-funding-guide.png",
  "images": ["revo-funding-guide.png"],
  "organizerName": "おのくんキャラバン",
  "operatorProfile": "おのくん、レボリストLab、防災×帽祭と連動し、地域とアートをつなぐ活動です。",
  "sparkAchievedPeople": "0人",
  "sparkTargetPeople": "20人",
  "sparkAchievementRate": 0,
  "sparkTargetDate": "",
  "sparkTargetGroups": "",
  "sparkAchievedGroups": "",
  "sparkTargetAmount": "200,000円"
}
```

注意:

- このサンプルは変換確認用であり、本番JSONではない。
- `type: "spark"` と `featured: false` は、Sheet実列から直接取得できたものではなく、現時点では仮補完・運営追記候補である。
- このまま自動反映しない。
- メール、key付きURL、管理URL、メール文面、担当者、運営メモは含めていない。

### スパーカー変換結果

| Sheet列 / 計算元 | V2 JSON項目 | 変換結果 | 現時点の扱い |
| --- | --- | --- | --- |
| `current_supporters` | `sparkAchievedPeople` | `0人` | 変換可能 |
| `target_supporters` | `sparkTargetPeople` | `20人` | 変換可能 |
| `current_supporters / target_supporters * 100` | `sparkAchievementRate` | `0` | 変換可能。0除算時は `NaN` を出さない |
| `target_amount` | `sparkTargetAmount` | `200,000円` | 変換可能 |

未接続項目:

| V2 JSON項目 | 現時点の扱い |
| --- | --- |
| `sparkTargetDate` | 未接続 / 運営追記候補 / Sheet列追加確認候補 |
| `sparkTargetGroups` | 未接続 / 運営追記候補 / Sheet列追加確認候補 |
| `sparkAchievedGroups` | 未接続 / 運営追記候補 / Sheet列追加確認候補 |

未接続項目には架空値を入れない。

### ブースター変換結果

| Sheet列 / 計算元 | V2 JSON項目 | 変換候補 | 現時点の扱い |
| --- | --- | --- | --- |
| `booster_target_supporters` | `boostTargetPeople` | 人数表示へ整形 | 候補あり |
| `booster_target_supporters - booster_current_supporters` | `boostRemainingPeople` | 残り人数を算出 | 候補あり |
| `booster_current_supporters / booster_target_supporters * 100` | `boostAchievementRate` | 達成率を算出 | 候補あり |

補足:

- 今回の代表行では `booster_target_supporters` が空欄のため、ブースターJSONとしては未完成。
- `boostAchievedCount` / `boostTargetCount` / `boostTargetDate` は未接続。
- 人数基準か回数基準かは要確認。
- 計算不能時に `NaN` を出さない。

### Public Counters確認結果

確認済み候補:

```text
activeChallenges
totalSupporters
totalFans
totalBadges
productsMade
supportersCount
soldCount
salesAmount
```

整理:

| カウンター | 用途候補 | 現時点の扱い |
| --- | --- | --- |
| `activeChallenges` | V2トップ候補 | 表示名・意味の確認後に反映 |
| `totalSupporters` | V2トップ候補 | 表示名・意味の確認後に反映 |
| `totalFans` | V2トップ候補 | 表示名・意味の確認後に反映 |
| `totalBadges` | 将来の称号・バッジ候補 | まだ未接続 |
| `productsMade` | 制作数候補 | まだ未接続 |
| `supportersCount` | 応援者数候補 | 個別挑戦との紐づけ確認が必要 |
| `soldCount` | 内部 / 運営確認後候補 | そのまま表示しない |
| `salesAmount` | 内部 / 運営確認後候補 | そのまま表示しない |

Mapや地域カウンターへ直接使う列は未確認。

Public Countersは、そのまま表示しない。表示名・意味を運営確認してから反映する。

### Supporters集計の未接続点

確認済み列:

```text
参加したいレボチャレンジ
参加区分
参加ステータス
```

未確認:

```text
project_id 相当の明確な列
spark / boost 判別列
```

Form Eの回答を達成人数・参加数へ使うには、Projectsとの紐づけルールが必要。

現状ではSupportersとProjectsの接続キーが未確定である。

修復候補:

- Supporters側に `project_id` または `project_key` を持たせる。
- `参加したいレボチャレンジ` からProjectsの `project_id` へ変換するマスタを持つ。
- `参加区分` から `spark` / `boost` を判定するルールを決める。

### Map反映の未接続点

Sheet側に確認できたもの:

```text
活動地域
```

未確認:

```text
isMapPublished
mapOptOut
googleMapEnabled
googleMapPermission
googleMapUrl
```

現時点では `revo-support-map-data.json` の静的JSON維持が安全である。

Map反映には運営追記列または追加確認列が必要。

必要な列候補:

```text
isMapPublished
mapOptOut
googleMapEnabled
googleMapPermission
googleMapUrl
mapRegion
mapCity
mapCategory
```

注意:

- 通常Mapに `googleMapEnabled` を必須にしない。
- Google Map URLは自動生成しない。
- 詳細住所は公開しない。

### 未接続項目一覧

以下は現在Sheet→V2 JSONへ未接続であり、運営追記列、変換ルール、または追加確認が必要である。

```text
type
featured
sparkTargetDate
sparkTargetGroups
sparkAchievedGroups
boostAchievedCount
boostTargetCount
boostTargetDate
Map公開許可系フラグ一式
```

### 破綻リスク

- Sheet行をそのままJSON化すると、メール・key付きURL・管理URLが混入する。
- `type` がSheetにないため、`spark_plan` 等からの変換ルールが必要。
- `featured` がSheetにないため、トップ注目表示の制御列が未接続。
- カウンター計算ルール未確定のまま反映すると、達成率・残り人数が崩れる。
- Map許可系フラグが未接続のまま反映すると、掲載許可やピンポイント表示の扱いが破綻する。

### 修復方針

1. Projectsに公開用変換列として `type` / `featured` / `targetDate` / Map系フラグを追加するか確認
2. SupportersとProjectsの紐づけ方法を確定
3. `spark` / `boost` 判別ルールを確定
4. Public Countersの表示名と用途を確定
5. Map反映に必要な列を確定
6. 許可リスト方式でテスト用JSON生成
7. 1件のみJSON生成テスト
8. サイト反映テスト
9. 本番反映

### 今回は実施しないこと

- HTML修正
- CSS修正
- JS修正
- JSON修正
- Google Sheet編集
- Googleフォーム編集
- URL差し替え
- Apps Script作成
- commit
- push

## 最終確認

このドキュメントは、新しいGoogleフォームを作るためのものではない。

既存Googleフォームの回答項目を、V2の公開用JSONに安全に反映するための対応表である。

フォーム項目の追加・変更が必要な場合は、別途ユーザー確認を取る。

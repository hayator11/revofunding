# Googleフォーム / BASE 連動整理

## サイト側で連動済みのフォーム

| 用途 | サイト上の導線 | 設定キー | URL |
| --- | --- | --- | --- |
| レボアート相談 | `revo-art.html` | `revoArt` | https://docs.google.com/forms/d/e/1FAIpQLSesxTpGbfAfXhHmIljMGknEFKWp0TfWR1n2R0NuPxt4rGdjKw/viewform?usp=dialog |
| 起案者 / レボチャレンジ申請 | `index.html`, `challenger.html` | `challenger` | https://docs.google.com/forms/d/e/1FAIpQLSdtm4PpMVwWIRXsKLtSahzwWjCu2N4Qi14N-nHQh_ZF6UQzOg/viewform?usp=dialog |
| 応援者参加 | `supporters.html` | `supporter` | https://docs.google.com/forms/d/e/1FAIpQLSezDrOpfyY4sj9ShlTu1OzptzqOOGFHL-nl8yCX8_jTADhUcg/viewform?usp=dialog |
| 認定アーティスト応募 / 相談 | `designers.html` | `artist` | https://docs.google.com/forms/d/e/1FAIpQLSf5NE0ZPj3e3nK_73pUNLz_09j7BS3jK2uGLvLaktCU01OMaQ/viewform?usp=dialog |
| 購入後ファン登録 | `supporters.html`, `shop.html` | `fan` | https://docs.google.com/forms/d/e/1FAIpQLScPbj0Pa-CVw6X06duPbxZk6YU9nildlAjzrFTa6Wu75wWhWw/viewform?usp=dialog |
| おのくんライセンス利用希望 | `license.html` | `license` | https://docs.google.com/forms/d/e/1FAIpQLSfbpc3VAFMKqkPO_JfOoPQ91uJZ-UGZSdBje3jpztW0yFiP5Q/viewform?usp=dialog |

## BASE連動済み

| 用途 | サイト上の導線 | 設定キー | URL |
| --- | --- | --- | --- |
| 防災×帽祭 商品購入 | `shop.html` | `bousaiProduct` | https://onokun.shop.socialimagine.com/items/145050232 |

## カウンター連動

サイトは `script.js` の `publicCountersCsv` からCSVを読み込み、HTML内の `data-counter` に反映します。

必要なCSV列は次の2列です。

| key | value |
| --- | --- |
| totalSupporters | 74人 |
| hopeAmount | 500,000円 |
| usedAmount | 163,000円 |
| operatingAmount | 80,000円 |
| remainingBudget | 257,000円 |
| buyerCount | 64人 |

Googleフォーム回答シートから直接公開サイトへ出すのではなく、公開用に集計した `Public Counters` シートだけをCSV公開する運用が安全です。

## 受領済みスプレッドシート

- https://docs.google.com/spreadsheets/d/11x5gBvQcis6t2xKtD5NlnnzBWI0ywaQKgXUJOZqOuNo/edit?usp=sharing
- https://docs.google.com/spreadsheets/d/1uSPieEo9-W9VCBp-FVG_4lwMJ4ireC217dT1HEliPCs/edit?gid=149106504#gid=149106504
- https://docs.google.com/spreadsheets/d/1znlaaylwX1pydYJlbeEqMULnVU8Ybww0kwFH6YvvWp0/edit
- https://docs.google.com/spreadsheets/d/1AbtWF5BB3X5XriN-emSFZIiYToCNgS-6wR7mZCefAMM/edit?gid=424815998#gid=424815998
- https://docs.google.com/spreadsheets/d/1AKVgptl_E89qoDyEx0LGQAbD9PMqKQaYkvAkzhrwaFg/edit?gid=0#gid=0
- https://docs.google.com/spreadsheets/d/1CuwE7XB1GEmDCyql3LTznVNLdH6kCeI-kL79FtRDyaQ/edit
- https://docs.google.com/spreadsheets/d/1XfS0yNh7TIMbimt8PtoHed9mFAyf0DS1guH6z1JInb8/edit?gid=531798815#gid=531798815
- https://docs.google.com/spreadsheets/d/12Uj0RBGDy1dJFCgXxNMkXPKW4Uz0rRvdGsCAph_gsNc/edit?gid=1487671474#gid=1487671474

## 確認が必要なもの

- 途中でスプレッドシートURLとフォームURLが混ざっている文字列が1件ありました。
- Googleフォームの編集URLが1件あります。公開ページに使う場合は `viewform` URLへ変換してから設定します。
- BASEの購入者数や売上を自動反映するには、BASE API連携か、BASEの売上をGoogle Sheetsへ転記する運用が必要です。

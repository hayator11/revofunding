# レボファンディング MVPサイト

レボファンディングは、起案者の挑戦を「一度きりの支援」で終わらせず、応援者・ファン・デザイナー・運営が一緒に広げ続けるためのプロトタイプサイトです。

## 公開ページ

- `index.html`: トップページ、挑戦一覧、達成済み導線
- `supporters.html`: 応援者募集ページ
- `shop.html`: 支援者購入ページ、SNSシェア、埋め込みコード
- `achieved.html`: 達成・ファン化している挑戦一覧
- `license.html`: おのくんライセンス説明ページ
- `designers.html`: 認定アーティスト募集・紹介ページ
- `challenger.html`: 起案者向け登録ページ
- `dashboard.html`: 運営ダッシュボード風ページ
- `money-flow.html`: 資金の流れ説明ページ
- `mypage.html`: 応援者マイページ風ページ
- `referral.html`: 紹介リンク・QR発行ページ
- `report-detail.html`: 活動レポート詳細ページ
- `legal.html`: 特定商取引法、返品、発送、個人情報の扱い
- `404.html`: 存在しないURLからトップへ戻すページ
- `onokun-a.jpeg`: 通常版おのくん画像
- `onokun-b.jpeg`: クリスタル版おのくん画像
- `Google_Forms_起案者申請フォーム設計.md`: 起案者申請フォームの質問設計
- `Google_Forms_起案者申請フォーム作成手順.md`: Google Formsでの作成手順
- `google_forms_create_challenger_form.gs`: Google Forms自動作成スクリプト
- `Google_Forms_自動作成スクリプト手順.md`: 自動作成スクリプトの使い方
- `Google_Forms_応援者参加フォーム設計.md`: 応援者参加フォームの質問設計
- `google_forms_create_supporter_form.gs`: 応援者参加フォーム自動作成スクリプト
- `Google_Forms_応援者参加フォーム作成手順.md`: 応援者参加フォームの作成手順
- `Google_Sheets_応援者参加管理表_運用設計.md`: 応援者管理表の運用設計
- `google_sheets_auto_transfer_supporters.gs`: 応援者フォーム回答の自動転記スクリプト
- `Google_Sheets_応援者自動転記スクリプト手順.md`: 応援者自動転記の設定手順
- `LINE_オープンチャット運用テンプレート.md`: LINE OC案内文、固定メッセージ、ステータス運用
- `無料通知運用設計.md`: LINE公式に頼らない初期通知設計
- `Google_Forms_ファン案内登録フォーム設計.md`: ファン案内登録フォームの質問設計
- `google_forms_create_fan_notice_form.gs`: ファン案内登録フォーム自動作成スクリプト
- `Google_Forms_ファン案内登録フォーム作成手順.md`: ファン案内登録フォームの作成手順
- `Google_Forms_認定アーティスト応募フォーム設計.md`: 認定アーティスト応募フォームの質問設計
- `google_forms_create_designer_form.gs`: 認定アーティスト応募フォーム自動作成スクリプト
- `Google_Forms_認定アーティスト応募フォーム作成手順.md`: 認定アーティスト応募フォームの作成手順
- `BASE_商品販売ページ設計.md`: BASE商品ページに入れる内容
- `BASE_商品登録手順.md`: BASEへの商品登録手順
- `Canva_SNS素材テンプレート設計.md`: Canvaで作るSNS素材の設計
- `SNS共有確認メモ.md`: SNS共有URL、OGP、コピー導線の確認
- `運営ルール_誤解防止.md`: 配当なし、起案者還元、参加範囲の説明ルール
- `法務情報_正式差し替えチェック.md`: 販売者情報、返品、発送、個人情報の差し替え管理
- `スマホ表示確認メモ.md`: スマホ表示で確認する項目
- `Google_Sheets_起案者申請管理表_運用設計.md`: 起案者申請管理表の運用設計
- `Google_Sheets_公開カウンター連携設計.md`: 公開用カウンター値をサイトに反映する設計
- `Google_Sheets_公開カウンター作成手順.md`: 公開カウンターシートの作成手順
- `google_sheets_create_public_counters.gs`: 公開カウンターシート作成スクリプト
- `counter-data.json`: サイトに表示する公開カウンター値
- `outputs/revo_challenge_application_management.xlsx`: Google Sheetsに取り込める管理表テンプレート
- `google_sheets_auto_transfer_to_management.gs`: フォーム回答から管理表への自動転記スクリプト
- `Google_Sheets_自動転記スクリプト手順.md`: 自動転記の設定手順

## 使用予定の無料・低コストツール

- GitHub Pages: サイト公開
- Google Forms: 起案者、応援者、デザイナー、ファン登録
- Google Sheets: 申請・在庫・売上・活動管理
- BASE: 商品販売、注文管理
- LINEオープンチャット: 応援者交流、共有依頼、活動案内
- LINE公式: 初期は必須にせず、必要になった段階で検討
- Canva: SNS投稿素材、グッズデザイン案、告知画像

## GitHub Pagesで公開する流れ

詳しい手順は `GitHub_Pages公開手順.md` を確認してください。

1. GitHubで新しいリポジトリを作成
2. このフォルダ内のファイルをアップロード
3. GitHubの `Settings` から `Pages` を開く
4. `Deploy from a branch` を選び、`main` / `root` を指定
5. 発行されたURLでサイトを確認

## 公開前に差し替えるもの

公開前チェックは `公開前チェックリスト.md` にまとめています。

- Google Formsの申請リンク
- BASEの商品販売リンク
- LINEオープンチャットの案内リンク
- LINE公式を使う場合は登録リンク
- Canva素材リンク
- 運営者名、問い合わせ先、利用条件
- おのくんライセンスの利用範囲と表記

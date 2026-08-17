// Google SheetsのProjects公開CSVを使う場合は、下の空欄にCSV URLを入れます。
// Google SheetsのProjects公開CSV。読み込みに失敗した場合は、サイト内のprojects-data.jsonをフォールバックとして表示します。
window.REVO_PROJECTS_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRcKmEgg9vkR0RHr8i1dbqnjOCZS7Julyl54k9tqUEBGxEejykf3X5eS4iZOKnsowGrtwiGZ7b7vRBN/pub?gid=563776916&single=true&output=csv";
// 起案者作業ページからProjectsシートへ保存するApps Script WebアプリURL。
// Apps ScriptでWebアプリをデプロイしたあと、発行されたURLをここに入れます。
window.REVO_PROJECT_WORK_SAVE_ENDPOINT = "https://script.google.com/macros/s/AKfycbxVQlH1_-8etzBV8Yn4rkp645yLmCebyNRK_O0MzSZeJf1xW9DPMI3Xbtn_FI8QQMtA/exec";
// 応援者マイページからSupportersシートの参加状況を確認するApps Script WebアプリURL。
// 応援者フォーム側Apps Scriptをウェブアプリとしてデプロイしたあと、発行されたURLをここに入れます。
window.REVO_SUPPORTER_STATUS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwXKd6zVVn80RYQy8Qms7EJUb2YrI6tmDjv_Ef-lCCg0B_lBWtLXxagvSnS4fllc-tf-w/exec";

// レボアート申請者用Project作業ページと公開データAPI。
// 専用Apps Scriptをデプロイ後、同じWebアプリURLを設定します。
window.REVO_ART_WORKSPACE_APP_URL = "https://script.google.com/macros/s/AKfycbzrX3ch9IwN7tqTcELblOWM8CIc2wLibma88K2CqOLGwXGx6Y7idNype_ZM7-0IIpf4/exec";
window.REVO_ART_PUBLIC_DATA_URL = "https://script.google.com/macros/s/AKfycbzrX3ch9IwN7tqTcELblOWM8CIc2wLibma88K2CqOLGwXGx6Y7idNype_ZM7-0IIpf4/exec";

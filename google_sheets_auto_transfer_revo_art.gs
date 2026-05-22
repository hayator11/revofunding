const REVO_ART_MANAGEMENT_SPREADSHEET_ID = "1AbtWF5BB3X5XriN-emSFZIiYToCNgS-6wR7mZCefAMM";
const REVO_ART_MANAGEMENT_SHEET_NAME = "Art Applications";

function setupRevoArtAutoTransfer() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const managementSpreadsheet = SpreadsheetApp.openById(REVO_ART_MANAGEMENT_SPREADSHEET_ID);
  ensureRevoArtManagementSheet_(managementSpreadsheet);

  ScriptApp.getProjectTriggers().forEach((trigger) => {
    if (trigger.getHandlerFunction() === "transferRevoArtResponse") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger("transferRevoArtResponse")
    .forSpreadsheet(spreadsheet)
    .onFormSubmit()
    .create();

  Logger.log("レボアートフォームの自動転記トリガーを設定しました。");
}

function transferRevoArtResponse(event) {
  const values = event.namedValues || {};
  const managementSpreadsheet = SpreadsheetApp.openById(REVO_ART_MANAGEMENT_SPREADSHEET_ID);
  const sheet = ensureRevoArtManagementSheet_(managementSpreadsheet);
  const nextRow = Math.max(sheet.getLastRow() + 1, 2);
  const receptionId = createRevoArtId_(sheet);
  const consultationType = getAnswer_(values, ["相談種別"]);
  const interestedMenus = getAnswer_(values, ["関心のある実施メニュー"]);
  const cooperation = getAnswer_(values, ["協力できること / 相談したいこと"]);
  const fundingLink = getAnswer_(values, ["レボファンディングとの連動希望"]);
  const sponsorLink = getAnswer_(values, ["企業協賛・レボリンク連動への関心"]);
  const checks = getAnswer_(values, ["確認事項"]);

  const row = [
    receptionId,
    getAnswer_(values, ["タイムスタンプ", "Timestamp"]) || new Date(),
    consultationType,
    getAnswer_(values, ["団体名 / 活動名"]),
    getAnswer_(values, ["担当者名"]),
    getAnswer_(values, ["メールアドレス", "Email Address", "連絡先メールアドレス"]),
    getAnswer_(values, ["活動地域 / 開催候補地"]),
    interestedMenus,
    getAnswer_(values, ["相談内容"]),
    cooperation,
    fundingLink,
    sponsorLink,
    checks ? "OK" : "要確認",
    inferRevoArtCategory_(consultationType, interestedMenus, cooperation),
    inferRevoArtPriority_(consultationType, sponsorLink, fundingLink),
    "未確認",
    inferRevoArtNextAction_(consultationType),
    "運営",
    "",
    getAnswer_(values, ["補足・質問"]),
  ];

  sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
}

function testTransferLatestRevoArtResponse() {
  const responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const lastRow = responseSheet.getLastRow();
  const lastColumn = responseSheet.getLastColumn();

  if (lastRow < 2) {
    throw new Error("フォーム回答がまだありません。テスト回答を1件送信してから実行してください。");
  }

  const headers = responseSheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const answers = responseSheet.getRange(lastRow, 1, 1, lastColumn).getValues()[0];
  const namedValues = {};

  headers.forEach((header, index) => {
    namedValues[header] = [answers[index]];
  });

  transferRevoArtResponse({ namedValues });
  Logger.log("最新のレボアート回答を管理表へテスト転記しました。");
}

function ensureRevoArtManagementSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(REVO_ART_MANAGEMENT_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(REVO_ART_MANAGEMENT_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 20).setValues([[
      "受付ID",
      "受付日時",
      "相談種別",
      "団体名 / 活動名",
      "担当者名",
      "メールアドレス",
      "活動地域 / 開催候補地",
      "実施メニュー",
      "相談内容",
      "協力できること",
      "レボファンディング連動",
      "企業協賛・レボリンク",
      "確認事項",
      "分類",
      "優先度",
      "ステータス",
      "次アクション",
      "担当者",
      "掲載予定ページ",
      "備考"
    ]]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 20);
  }

  return sheet;
}

function createRevoArtId_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return "RA-001";
  }

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const maxNumber = ids.reduce((max, id) => {
    const match = String(id).match(/^RA-(\d+)$/);
    if (!match) {
      return max;
    }
    return Math.max(max, Number(match[1]));
  }, 0);

  return "RA-" + String(maxNumber + 1).padStart(3, "0");
}

function getAnswer_(values, names) {
  for (const name of names) {
    if (values[name] && values[name][0] !== "") {
      return values[name][0];
    }
  }
  return "";
}

function inferRevoArtCategory_(consultationType, menus, cooperation) {
  const text = `${consultationType} ${menus} ${cooperation}`;
  if (text.includes("企業") || text.includes("協賛") || text.includes("レボリンク")) return "企業協賛";
  if (text.includes("アーティスト") || text.includes("デザイン")) return "アーティスト";
  if (text.includes("学校") || text.includes("施設")) return "学校・施設";
  if (text.includes("開催地") || text.includes("場所")) return "開催地";
  if (text.includes("レボファンディング")) return "ファンディング連動";
  return "相談";
}

function inferRevoArtPriority_(consultationType, sponsorLink, fundingLink) {
  const text = `${consultationType} ${sponsorLink} ${fundingLink}`;
  if (text.includes("協賛したい") || text.includes("希望する")) return "高";
  if (text.includes("開催地") || text.includes("学校")) return "中";
  return "中";
}

function inferRevoArtNextAction_(consultationType) {
  if (consultationType.includes("企業")) return "協賛内容確認";
  if (consultationType.includes("アーティスト")) return "作品・実績確認";
  if (consultationType.includes("学校") || consultationType.includes("施設") || consultationType.includes("開催地")) return "開催条件確認";
  if (consultationType.includes("レボファンディング")) return "連動設計確認";
  return "内容確認";
}

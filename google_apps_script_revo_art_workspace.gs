const REVO_ART_WORKSPACE_CONFIG = Object.freeze({
  spreadsheetId: "1AbtWF5BB3X5XriN-emSFZIiYToCNgS-6wR7mZCefAMM",
  formResponseSpreadsheetId: "1W8j55gUb6qjLlMFxw8FFUD8vbZaByM73z72OM_cGess",
  formResponseSheet: "フォームの回答 1",
  applicationSheet: "Art Applications",
  workspaceSheet: "Art Project Workspaces",
  updateSheet: "Art Project Updates",
  accountSheet: "Art Applicant Accounts",
  memberSheet: "Art Project Members",
  authSheet: "Art Account Verification",
  rootFolderName: "RevoArt Project Uploads",
  verificationMinutes: 10,
  sessionHours: 12,
  maxImageBytes: 8 * 1024 * 1024
});

const REVO_ART_APPLICATION_HEADERS = [
  "受付ID", "受付日時", "相談種別", "団体名 / 活動名", "担当者名", "メールアドレス",
  "活動地域 / 開催候補地", "実施メニュー", "相談内容", "協力できること", "レボファンディング連動",
  "企業協賛・レボリンク", "確認事項", "分類", "優先度", "ステータス", "次アクション", "担当者",
  "掲載予定ページ", "備考", "Project ID", "作業ページURL", "公開ページURL", "Source Response ID"
];

const REVO_ART_WORKSPACE_HEADERS = [
  "Project ID", "受付ID", "作業ページ名", "地域", "種別", "ステータス", "作業フェーズ",
  "公開ページURL", "作業ページURL", "更新フォームURL", "写真提出フォームURL", "申請者メール",
  "公開できる説明文", "公開NG/要確認", "次回更新予定", "最終更新日", "運営メモ", "レビュー状態",
  "Public Slug", "Public Title", "Public Summary", "Public Body", "Cover Image URL", "公開状態",
  "注目表示", "表示順", "企画区分", "公開カテゴリ", "更新日時", "申請者表示名", "開催日表示", "公開ラベル"
];

const REVO_ART_ACCOUNT_HEADERS = [
  "Account ID", "Email", "表示名", "Password Salt", "Password Hash", "Status", "Failed Attempts",
  "Locked Until", "Session Hash", "Session Expires", "Created At", "Last Login", "Updated At"
];

const REVO_ART_MEMBER_HEADERS = [
  "Project ID", "Account ID", "Role", "Status", "Created At", "Updated At"
];

const REVO_ART_AUTH_HEADERS = [
  "Email", "Verification Hash", "Verification Expires", "Verification Sent At", "Verification Attempts", "Updated At"
];

function setupRevoArtWorkspaceApp() {
  const spreadsheet = SpreadsheetApp.openById(REVO_ART_WORKSPACE_CONFIG.spreadsheetId);
  ensureRevoArtSheet_(spreadsheet, REVO_ART_WORKSPACE_CONFIG.applicationSheet, REVO_ART_APPLICATION_HEADERS);
  ensureRevoArtSheet_(spreadsheet, REVO_ART_WORKSPACE_CONFIG.workspaceSheet, REVO_ART_WORKSPACE_HEADERS);
  ensureRevoArtSheet_(spreadsheet, REVO_ART_WORKSPACE_CONFIG.updateSheet, [
    "Update ID", "Project ID", "受付日時", "更新者", "フェーズ", "タイトル", "本文", "写真URL/Driveリンク",
    "写真掲載許可", "公開してよい地域/場所名", "公開NG情報", "希望公開日", "レビュー状態", "公開可否",
    "公開反映日", "担当者", "備考", "公開ページ反映メモ", "記事本文JSON", "記事概要"
  ]);
  const accountSheet = ensureRevoArtSheet_(spreadsheet, REVO_ART_WORKSPACE_CONFIG.accountSheet, REVO_ART_ACCOUNT_HEADERS);
  const memberSheet = ensureRevoArtSheet_(spreadsheet, REVO_ART_WORKSPACE_CONFIG.memberSheet, REVO_ART_MEMBER_HEADERS);
  const authSheet = ensureRevoArtSheet_(spreadsheet, REVO_ART_WORKSPACE_CONFIG.authSheet, REVO_ART_AUTH_HEADERS);
  accountSheet.hideSheet();
  memberSheet.hideSheet();
  authSheet.hideSheet();

  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty("REVO_ART_AUTH_PEPPER")) {
    properties.setProperty("REVO_ART_AUTH_PEPPER", Utilities.getUuid() + Utilities.getUuid());
  }
  if (!properties.getProperty("REVO_ART_UPLOAD_FOLDER_ID")) {
    properties.setProperty("REVO_ART_UPLOAD_FOLDER_ID", DriveApp.createFolder(REVO_ART_WORKSPACE_CONFIG.rootFolderName).getId());
  }
}

function setupRevoArtPlatformApp() {
  setupRevoArtWorkspaceApp();
  const source = SpreadsheetApp.openById(REVO_ART_WORKSPACE_CONFIG.formResponseSpreadsheetId);
  ScriptApp.getProjectTriggers().forEach((trigger) => {
    if (trigger.getHandlerFunction() === "handleRevoArtFormSubmission") ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger("handleRevoArtFormSubmission").forSpreadsheet(source).onFormSubmit().create();
  backfillRevoArtFormResponses();
}

function handleRevoArtFormSubmission(event) {
  const values = event && event.namedValues ? event.namedValues : {};
  const range = event && event.range;
  if (!range) throw new Error("フォーム回答行を確認できません。");
  const sourceResponseId = [range.getSheet().getParent().getId(), range.getSheet().getSheetId(), range.getRow()].join(":");
  processRevoArtFormSubmission_(values, sourceResponseId, true);
}

function backfillRevoArtFormResponses() {
  setupRevoArtWorkspaceApp();
  const source = SpreadsheetApp.openById(REVO_ART_WORKSPACE_CONFIG.formResponseSpreadsheetId);
  const sheet = source.getSheetByName(REVO_ART_WORKSPACE_CONFIG.formResponseSheet);
  if (!sheet || sheet.getLastRow() < 2) return;
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map(String);
  values.forEach((row, index) => {
    if (!row.some((value) => value !== "")) return;
    const namedValues = {};
    headers.forEach((header, column) => { namedValues[header] = [row[column]]; });
    const sourceResponseId = [source.getId(), sheet.getSheetId(), index + 2].join(":");
    processRevoArtFormSubmission_(namedValues, sourceResponseId, false);
  });
}

function processRevoArtFormSubmission_(values, sourceResponseId, sendInvitation) {
  const management = SpreadsheetApp.openById(REVO_ART_WORKSPACE_CONFIG.spreadsheetId);
  const applicationSheet = ensureRevoArtSheet_(management, REVO_ART_WORKSPACE_CONFIG.applicationSheet, REVO_ART_APPLICATION_HEADERS);
  const email = normalizeRevoArtEmail_(getRevoArtAnswer_(values, ["連絡先メールアドレス", "メールアドレス", "Email Address"]));
  const timestamp = getRevoArtAnswer_(values, ["タイムスタンプ", "Timestamp"]) || new Date();
  let application = findRevoArtRow_(applicationSheet, "Source Response ID", sourceResponseId);
  if (!application) {
    application = readRevoArtRowsWithIndex_(applicationSheet).find((entry) =>
      normalizeComparableRevoArtDate_(entry.values["受付日時"]) === normalizeComparableRevoArtDate_(timestamp) &&
      String(entry.values["メールアドレス"] || "").toLowerCase() === email
    ) || null;
  }

  const receptionId = application ? String(application.values["受付ID"] || "") : nextRevoArtReceptionId_(applicationSheet);
  const existingProjectId = application ? String(application.values["Project ID"] || "") : "";
  const projectId = existingProjectId || "revo-art-" + receptionId.toLowerCase();
  const publicName = getRevoArtAnswer_(values, ["公開してよい名称", "申請者名または活動名"]);
  const prefecture = getRevoArtAnswer_(values, ["都道府県"]);
  const city = getRevoArtAnswer_(values, ["市区町村"]);
  const region = [prefecture, city].filter(Boolean).join(" ");
  const artType = getRevoArtAnswer_(values, ["申請したいレボアートの種類", "相談種別"]);
  const requested = getRevoArtAnswer_(values, ["申請したい内容", "相談内容"]);
  const reason = getRevoArtAnswer_(values, ["実施したい理由"]);
  const publicDescription = getRevoArtAnswer_(values, ["公開してよい説明文"]);
  const detail = [
    requested, reason,
    labelRevoArtAnswer_("壁面・空間", getRevoArtAnswer_(values, ["ウォールアート希望の方：壁面・空間について"])),
    labelRevoArtAnswer_("車両・移動媒体", getRevoArtAnswer_(values, ["カーアート希望の方：車両・移動媒体について"])),
    labelRevoArtAnswer_("帽子・イベント", getRevoArtAnswer_(values, ["ハットアート希望の方：帽子表現・イベント参加について"]))
  ].filter(Boolean).join("\n");
  const permissions = [
    labelRevoArtAnswer_("公開名", publicName), labelRevoArtAnswer_("公開地域", getRevoArtAnswer_(values, ["公開してよい地域"])),
    labelRevoArtAnswer_("写真", getRevoArtAnswer_(values, ["写真掲載の許可"])), labelRevoArtAnswer_("実名", getRevoArtAnswer_(values, ["実名掲載の許可"])),
    labelRevoArtAnswer_("施設名", getRevoArtAnswer_(values, ["施設名・場所名掲載の許可"])), labelRevoArtAnswer_("詳細住所", getRevoArtAnswer_(values, ["詳細住所掲載の許可"]))
  ].filter(Boolean).join("\n");
  const applicationValues = {
    "受付ID": receptionId, "受付日時": timestamp, "相談種別": artType,
    "団体名 / 活動名": getRevoArtAnswer_(values, ["申請者名または活動名", "団体名 / 活動名"]),
    "担当者名": getRevoArtAnswer_(values, ["担当者名"]), "メールアドレス": email,
    "活動地域 / 開催候補地": region, "実施メニュー": requested, "相談内容": detail,
    "協力できること": permissions, "確認事項": getRevoArtAnswer_(values, ["確認事項への同意", "確認事項"]),
    "分類": inferRevoArtWorkspaceCategoryLabel_(artType), "優先度": "中", "ステータス": "確認中",
    "次アクション": "公開範囲確認", "担当者": "運営", "掲載予定ページ": "revo-art-detail.html?id=" + projectId,
    "備考": getRevoArtAnswer_(values, ["運営への補足", "補足・質問"]), "Project ID": projectId,
    "作業ページURL": "https://revofunding.onokun.com/revo-art-workspace.html?id=" + projectId,
    "公開ページURL": "https://revofunding.onokun.com/revo-art-detail.html?id=" + projectId,
    "Source Response ID": sourceResponseId
  };
  if (application) updateRevoArtCells_(applicationSheet, application.row, applicationValues);
  else appendRevoArtObjectRow_(applicationSheet, applicationValues);

  const workspaceSheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.workspaceSheet);
  const workspace = findRevoArtRow_(workspaceSheet, "Project ID", projectId);
  if (!workspace) {
    appendRevoArtObjectRow_(workspaceSheet, {
      "Project ID": projectId, "受付ID": receptionId, "作業ページ名": publicName || "レボアートProject",
      "地域": region, "種別": artType, "ステータス": "確認中", "作業フェーズ": "申請受付・公開範囲確認",
      "公開ページURL": applicationValues["公開ページURL"], "作業ページURL": applicationValues["作業ページURL"],
      "更新フォームURL": "https://revofunding.onokun.com/revo-art-update.html?id=" + projectId,
      "写真提出フォームURL": "https://revofunding.onokun.com/revo-art-update.html?id=" + projectId + "&type=photo",
      "申請者メール": email, "公開できる説明文": publicDescription || "申請内容を確認中です。",
      "公開NG/要確認": "公開許可範囲を運営確認", "次回更新予定": "運営確認後", "最終更新日": new Date(),
      "レビュー状態": "運営確認中", "Public Slug": projectId, "Public Title": publicName || "レボアートProject",
      "Public Summary": publicDescription || "申請内容を確認中です。", "Public Body": publicDescription || "",
      "公開状態": "draft", "注目表示": false, "表示順": 999, "企画区分": "standard",
      "公開カテゴリ": inferRevoArtWorkspaceCategory_(artType), "更新日時": new Date(), "申請者表示名": publicName
    });
  }
  if (sendInvitation) sendRevoArtAccountInvitation_(email, projectId, publicName);
  return { receptionId: receptionId, projectId: projectId };
}

function doGet(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  if (parameters.action === "publicProjects") {
    return createRevoArtPublicResponse_(parameters.callback);
  }

  if (parameters.page === "workspace") {
    const template = HtmlService.createTemplateFromFile("RevoArtWorkspace");
    template.projectId = parameters.id ? sanitizeRevoArtId_(parameters.id) : "";
    return template.evaluate()
      .setTitle("レボアート Project作業ページ")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
  }

  return ContentService.createTextOutput("RevoArt Workspace API is ready.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function requestRevoArtAccountSetup(email) {
  setupRevoArtWorkspaceApp();
  const normalizedEmail = normalizeRevoArtEmail_(email);
  const projects = getRevoArtProjectsForEmail_(normalizedEmail);
  if (!projects.length) throw new Error("申請時に登録したメールアドレスを確認してください。");

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const authSheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.authSheet);
    const auth = findRevoArtRow_(authSheet, "Email", normalizedEmail);
    const now = new Date();
    const lastSent = auth ? new Date(auth.values["Verification Sent At"] || 0) : new Date(0);
    if (now.getTime() - lastSent.getTime() < 60000) {
      throw new Error("確認コードは送信済みです。1分ほど待ってから再送してください。");
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(now.getTime() + REVO_ART_WORKSPACE_CONFIG.verificationMinutes * 60 * 1000);
    const values = {
      "Email": normalizedEmail,
      "Verification Hash": hashRevoArtSecret_(normalizedEmail + ":" + code),
      "Verification Expires": expires,
      "Verification Sent At": now,
      "Verification Attempts": 0,
      "Updated At": now
    };
    upsertRevoArtRow_(authSheet, "Email", normalizedEmail, values);

    MailApp.sendEmail({
      to: normalizedEmail,
      subject: "【レボアート】申請者アカウント設定コード",
      htmlBody: "<p>レボアート申請者アカウントの初期設定・パスワード再設定コードです。</p>" +
        "<p style=\"font-size:32px;font-weight:bold;letter-spacing:8px\">" + code + "</p>" +
        "<p>有効時間は" + REVO_ART_WORKSPACE_CONFIG.verificationMinutes + "分です。通常のログインでは確認コードは使用しません。</p>",
      name: "レボアート運営"
    });
    return { ok: true, email: maskRevoArtEmail_(normalizedEmail) };
  } finally {
    lock.releaseLock();
  }
}

function completeRevoArtAccountSetup(email, code, password, displayName) {
  setupRevoArtWorkspaceApp();
  const normalizedEmail = normalizeRevoArtEmail_(email);
  validateRevoArtPassword_(password);
  const authSheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.authSheet);
  const auth = findRevoArtRow_(authSheet, "Email", normalizedEmail);
  if (!auth) {
    throw new Error("確認コードが正しくありません。");
  }

  const attempts = Number(auth.values["Verification Attempts"] || 0);
  if (attempts >= 5) throw new Error("確認回数の上限に達しました。確認コードを再送してください。");
  const expires = new Date(auth.values["Verification Expires"] || 0);
  if (expires.getTime() < Date.now()) throw new Error("確認コードの有効期限が切れています。再送してください。");

  const expected = String(auth.values["Verification Hash"] || "");
  const actual = hashRevoArtSecret_(normalizedEmail + ":" + String(code || "").trim());
  if (!constantTimeRevoArtEqual_(expected, actual)) {
    updateRevoArtCells_(authSheet, auth.row, { "Verification Attempts": attempts + 1, "Updated At": new Date() });
    throw new Error("確認コードが正しくありません。");
  }

  const accountSheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.accountSheet);
  const existing = findRevoArtRow_(accountSheet, "Email", normalizedEmail);
  const accountId = existing ? existing.values["Account ID"] : "ART-USER-" + Utilities.getUuid();
  const salt = Utilities.getUuid() + Utilities.getUuid();
  upsertRevoArtRow_(accountSheet, "Email", normalizedEmail, {
    "Account ID": accountId, "Email": normalizedEmail, "表示名": cleanRevoArtText_(displayName, 120),
    "Password Salt": salt, "Password Hash": hashRevoArtPassword_(salt, password), "Status": "active",
    "Failed Attempts": 0, "Locked Until": "", "Created At": existing ? existing.values["Created At"] : new Date(), "Updated At": new Date()
  });
  syncRevoArtMemberships_(accountId, normalizedEmail);
  updateRevoArtCells_(authSheet, auth.row, {
    "Verification Hash": "", "Verification Expires": "", "Verification Attempts": 0,
    "Updated At": new Date()
  });
  return createRevoArtAccountSession_(accountId);
}

function loginRevoArtApplicant(email, password) {
  setupRevoArtWorkspaceApp();
  const normalizedEmail = normalizeRevoArtEmail_(email);
  const sheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.accountSheet);
  const account = findRevoArtRow_(sheet, "Email", normalizedEmail);
  if (!account || account.values.Status !== "active") throw new Error("メールアドレスまたはパスワードが正しくありません。");
  const lockedUntil = new Date(account.values["Locked Until"] || 0);
  if (lockedUntil.getTime() > Date.now()) throw new Error("ログインが一時ロックされています。15分後に再度お試しください。");
  const actual = hashRevoArtPassword_(String(account.values["Password Salt"] || ""), password);
  if (!constantTimeRevoArtEqual_(String(account.values["Password Hash"] || ""), actual)) {
    const failed = Number(account.values["Failed Attempts"] || 0) + 1;
    updateRevoArtCells_(sheet, account.row, { "Failed Attempts": failed, "Locked Until": failed >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : "", "Updated At": new Date() });
    throw new Error("メールアドレスまたはパスワードが正しくありません。");
  }
  updateRevoArtCells_(sheet, account.row, { "Failed Attempts": 0, "Locked Until": "", "Last Login": new Date(), "Updated At": new Date() });
  syncRevoArtMemberships_(account.values["Account ID"], normalizedEmail);
  return createRevoArtAccountSession_(account.values["Account ID"]);
}

function resumeRevoArtApplicant(token) {
  const account = requireRevoArtAccountSession_(token);
  return getRevoArtAccountDashboard_(account.values["Account ID"]);
}

function openRevoArtWorkspace(projectId, token) {
  requireRevoArtProjectAccess_(projectId, token);
  return getRevoArtWorkspaceData_(sanitizeRevoArtId_(projectId));
}

function saveRevoArtWorkspace(projectId, token, values, submitForReview) {
  const normalizedProjectId = sanitizeRevoArtId_(projectId);
  requireRevoArtWorkspaceSession_(normalizedProjectId, token);
  const sheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.workspaceSheet);
  const record = findRevoArtRow_(sheet, "Project ID", normalizedProjectId);
  if (!record) throw new Error("Projectが見つかりません。");

  const safe = values || {};
  updateRevoArtCells_(sheet, record.row, {
    "作業ページ名": cleanRevoArtText_(safe.title, 120),
    "地域": cleanRevoArtText_(safe.region, 120),
    "作業フェーズ": cleanRevoArtText_(safe.stage, 80),
    "公開できる説明文": cleanRevoArtText_(safe.summary, 600),
    "Public Title": cleanRevoArtText_(safe.title, 120),
    "Public Summary": cleanRevoArtText_(safe.summary, 240),
    "Public Body": cleanRevoArtText_(safe.body, 5000),
    "Cover Image URL": cleanRevoArtUrl_(safe.coverImageUrl),
    "申請者表示名": cleanRevoArtText_(safe.publicName, 120),
    "開催日表示": cleanRevoArtText_(safe.schedule, 120),
    "レビュー状態": submitForReview ? "運営確認待ち" : "下書き",
    "最終更新日": new Date(),
    "更新日時": new Date()
  });
  return { ok: true, workspace: getRevoArtWorkspaceData_(normalizedProjectId) };
}

function uploadRevoArtWorkspaceImage(projectId, token, file) {
  const normalizedProjectId = sanitizeRevoArtId_(projectId);
  requireRevoArtWorkspaceSession_(normalizedProjectId, token);
  if (!file || !/^image\/(jpeg|png|webp)$/.test(String(file.mimeType || ""))) {
    throw new Error("JPEG、PNG、WebP画像を選択してください。");
  }
  const base64 = String(file.base64 || "").replace(/^data:[^;]+;base64,/, "");
  const bytes = Utilities.base64Decode(base64);
  if (bytes.length > REVO_ART_WORKSPACE_CONFIG.maxImageBytes) {
    throw new Error("画像は1枚8MB以下にしてください。");
  }
  const rootFolder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty("REVO_ART_UPLOAD_FOLDER_ID"));
  const folders = rootFolder.getFoldersByName(normalizedProjectId);
  const projectFolder = folders.hasNext() ? folders.next() : rootFolder.createFolder(normalizedProjectId);
  const safeName = String(file.name || "image").replace(/[^a-zA-Z0-9._-]/g, "_");
  const blob = Utilities.newBlob(bytes, file.mimeType, Date.now() + "-" + safeName);
  const driveFile = projectFolder.createFile(blob);
  driveFile.setDescription("RevoArt Project " + normalizedProjectId + " / applicant upload / review required");
  if (file.publicPermission === true) {
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }
  return {
    id: driveFile.getId(),
    name: driveFile.getName(),
    url: "https://drive.google.com/uc?export=view&id=" + encodeURIComponent(driveFile.getId())
  };
}

function submitRevoArtWorkspaceUpdate(projectId, token, values) {
  const normalizedProjectId = sanitizeRevoArtId_(projectId);
  requireRevoArtWorkspaceSession_(normalizedProjectId, token);
  const workspace = getRevoArtWorkspaceRecord_(normalizedProjectId);
  if (!workspace) throw new Error("Projectが見つかりません。");
  const safe = values || {};
  const sheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.updateSheet);
  const article = normalizeRevoArtArticle_(safe.articleBlocks, safe.body);
  const valuesByHeader = {
    "Update ID": nextRevoArtUpdateId_(sheet), "Project ID": normalizedProjectId, "受付日時": new Date(),
    "更新者": workspace["申請者表示名"] || "申請者", "フェーズ": cleanRevoArtText_(safe.phase, 80),
    "タイトル": cleanRevoArtText_(safe.title, 160), "本文": article.plainText,
    "写真URL/Driveリンク": article.imageUrls.join("\n"),
    "写真掲載許可": article.imageUrls.length ? (safe.imagePermission === true ? "許可済み" : "未許可") : "画像なし",
    "公開してよい地域/場所名": cleanRevoArtText_(safe.publicLocation, 180),
    "公開NG情報": cleanRevoArtText_(safe.privateNote, 600), "希望公開日": cleanRevoArtText_(safe.preferredDate, 80),
    "レビュー状態": "運営確認待ち", "公開可否": "確認中", "公開反映日": "", "担当者": "",
    "備考": "申請者からの活動更新", "公開ページ反映メモ": "運営確認後に公開",
    "記事本文JSON": article.json, "記事概要": cleanRevoArtText_(safe.excerpt, 240)
  };
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  sheet.appendRow(headers.map((header) => Object.prototype.hasOwnProperty.call(valuesByHeader, header) ? valuesByHeader[header] : ""));
  return { ok: true, workspace: getRevoArtWorkspaceData_(normalizedProjectId) };
}

function normalizeRevoArtArticle_(rawBlocks, fallbackBody) {
  const source = Array.isArray(rawBlocks) ? rawBlocks : [];
  if (source.length > 80) throw new Error("記事の内容が多すぎます。ブロックを80個以内にしてください。");
  const imageUrls = [];
  const blocks = source.map((block) => {
    const type = String(block && block.type || "");
    if (type === "paragraph" || type === "heading") {
      const text = cleanRevoArtText_(block.text, type === "heading" ? 200 : 5000);
      return text ? { type: type, text: text } : null;
    }
    if (type === "image") {
      const url = cleanRevoArtUrl_(block.url);
      if (!url) return null;
      imageUrls.push(url);
      return { type: "image", url: url, alt: cleanRevoArtText_(block.alt, 200), caption: cleanRevoArtText_(block.caption, 300) };
    }
    if (type === "link") {
      const url = cleanRevoArtPublicLink_(block.url);
      const label = cleanRevoArtText_(block.label, 160);
      return url && label ? { type: "link", url: url, label: label } : null;
    }
    return null;
  }).filter(Boolean);
  if (!blocks.length && fallbackBody) blocks.push({ type: "paragraph", text: cleanRevoArtText_(fallbackBody, 5000) });
  if (imageUrls.length > 8) throw new Error("画像は1記事8枚までです。");
  const plainText = blocks.filter((block) => block.type === "paragraph" || block.type === "heading").map((block) => block.text).join("\n\n").slice(0, 12000);
  const json = JSON.stringify(blocks);
  if (json.length > 45000) throw new Error("記事が長すぎます。文章や画像説明を短くしてください。");
  return { json: json, plainText: plainText, imageUrls: imageUrls };
}

function cleanRevoArtPublicLink_(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (!/^https:\/\//i.test(url)) throw new Error("リンク先はhttps://から始まるURLを指定してください。");
  return url.slice(0, 1000);
}

function publishRevoArtProject(projectId) {
  const sheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.workspaceSheet);
  const record = findRevoArtRow_(sheet, "Project ID", sanitizeRevoArtId_(projectId));
  if (!record) throw new Error("Projectが見つかりません。");
  updateRevoArtCells_(sheet, record.row, { "公開状態": "published", "レビュー状態": "公開承認", "更新日時": new Date() });
}

function publishRevoArtUpdate(updateId) {
  const sheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.updateSheet);
  const record = findRevoArtRow_(sheet, "Update ID", String(updateId || "").trim());
  if (!record) throw new Error("更新が見つかりません。");
  updateRevoArtCells_(sheet, record.row, { "レビュー状態": "公開承認", "公開可否": "公開", "公開反映日": new Date() });
}

function getRevoArtWorkspaceData_(projectId) {
  const record = getRevoArtWorkspaceRecord_(projectId);
  if (!record) throw new Error("Projectが見つかりません。");
  const updateSheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.updateSheet);
  const updates = readRevoArtRows_(updateSheet)
    .filter((entry) => String(entry["Project ID"] || "") === projectId)
    .map((entry) => ({
      id: entry["Update ID"], phase: entry["フェーズ"], title: entry["タイトル"], body: entry["本文"],
      date: formatRevoArtDate_(entry["受付日時"]), reviewStatus: entry["レビュー状態"], publicStatus: entry["公開可否"],
      imageUrls: String(entry["写真URL/Driveリンク"] || "").split(/\r?\n/).filter(Boolean),
      articleBlocks: parseRevoArtArticleBlocks_(entry["記事本文JSON"]), excerpt: entry["記事概要"] || ""
    }));
  return {
    projectId: record["Project ID"], title: record["Public Title"] || record["作業ページ名"],
    summary: record["Public Summary"] || record["公開できる説明文"], body: record["Public Body"] || "",
    publicName: record["申請者表示名"] || "", region: record["地域"] || "", stage: record["作業フェーズ"] || "",
    schedule: record["開催日表示"] || "", coverImageUrl: record["Cover Image URL"] || "",
    reviewStatus: record["レビュー状態"] || "", publicationStatus: record["公開状態"] || "draft", updates: updates
  };
}

function createRevoArtPublicResponse_(callback) {
  setupRevoArtWorkspaceApp();
  const workspaceRows = readRevoArtRows_(getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.workspaceSheet));
  const updateRows = readRevoArtRows_(getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.updateSheet));
  const projects = workspaceRows
    .filter((row) => String(row["公開状態"] || "").toLowerCase() === "published")
    .map((row) => {
      const projectId = String(row["Project ID"] || "");
      return {
        id: row["Public Slug"] || projectId,
        projectId: projectId,
        categoryId: row["公開カテゴリ"] || "other",
        categoryName: row["企画区分"] === "special" ? "REVO ART 特別企画" : "レボアート",
        title: row["Public Title"] || row["作業ページ名"],
        publicName: row["申請者表示名"] || row["作業ページ名"],
        regionLabel: row["地域"], shortMessage: row["Public Summary"] || row["公開できる説明文"],
        description: row["Public Body"] || row["公開できる説明文"], detailLead: row["Public Summary"] || row["公開できる説明文"],
        mapLabel: row["地域"], coverImageUrl: row["Cover Image URL"], status: "published", isPublished: true,
        featured: String(row["注目表示"] || "").toUpperCase() === "TRUE", displayOrder: Number(row["表示順"] || 999),
        applicationMethodLabel: row["企画区分"] === "special" ? "特別企画" : "Project",
        applicationMonthLabel: row["開催日表示"] || row["作業フェーズ"], selectionMethodLabel: row["作業フェーズ"] || "活動中",
        applicationNote: "公開許可済みの情報を掲載しています。", applicationLinkEnabled: false,
        labels: String(row["公開ラベル"] || "").split(/[,、]/).map((label) => label.trim()).filter(Boolean),
        notice: "公開許可済みの情報と写真のみ掲載しています。",
        detailUrl: "revo-art-detail.html?id=" + encodeURIComponent(row["Public Slug"] || projectId),
        workspaceUrl: "revo-art-workspace.html?id=" + encodeURIComponent(projectId),
        platformUpdates: updateRows.filter((update) => String(update["Project ID"] || "") === projectId && String(update["公開可否"] || "") === "公開")
          .map((update) => ({
            id: update["Update ID"], title: update["タイトル"], body: update["本文"], phase: update["フェーズ"],
            activity_date: formatRevoArtDate_(update["受付日時"]),
            excerpt: update["記事概要"] || "", articleBlocks: parseRevoArtArticleBlocks_(update["記事本文JSON"]),
            media: String(update["写真URL/Driveリンク"] || "").split(/\r?\n/).filter(Boolean).map((url) => ({ signedUrl: url, alt_text: update["タイトル"] }))
          }))
      };
    })
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder);
  const payload = JSON.stringify({ projects: projects, generatedAt: new Date().toISOString() });
  const safeCallback = /^[A-Za-z_$][0-9A-Za-z_$.]*$/.test(String(callback || "")) ? String(callback) : "";
  return ContentService.createTextOutput(safeCallback ? safeCallback + "(" + payload + ");" : payload)
    .setMimeType(safeCallback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function parseRevoArtArticleBlocks_(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function requireRevoArtWorkspaceSession_(projectId, token) {
  return requireRevoArtProjectAccess_(projectId, token);
}

function requireRevoArtAccountSession_(token) {
  const tokenHash = hashRevoArtSecret_(String(token || ""));
  const rows = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.accountSheet).getDataRange().getValues();
  const headers = rows.shift().map(String);
  const hashIndex = headers.indexOf("Session Hash");
  const expiresIndex = headers.indexOf("Session Expires");
  for (let index = 0; index < rows.length; index += 1) {
    if (constantTimeRevoArtEqual_(String(rows[index][hashIndex] || ""), tokenHash) && new Date(rows[index][expiresIndex] || 0).getTime() > Date.now()) {
      return { row: index + 2, headers: headers, values: headers.reduce((entry, header, column) => { entry[header] = rows[index][column]; return entry; }, {}) };
    }
  }
  throw new Error("ログインの有効期限が切れました。再度ログインしてください。");
}

function requireRevoArtProjectAccess_(projectId, token) {
  const normalizedProjectId = sanitizeRevoArtId_(projectId);
  const account = requireRevoArtAccountSession_(token);
  const member = readRevoArtRows_(getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.memberSheet)).find((entry) =>
    String(entry["Project ID"] || "") === normalizedProjectId &&
    String(entry["Account ID"] || "") === String(account.values["Account ID"] || "") &&
    String(entry.Status || "") === "active"
  );
  if (!member) throw new Error("このProjectを編集する権限がありません。");
  return account;
}

function createRevoArtAccountSession_(accountId) {
  const sheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.accountSheet);
  const account = findRevoArtRow_(sheet, "Account ID", accountId);
  if (!account) throw new Error("申請者アカウントが見つかりません。");
  const token = Utilities.getUuid() + Utilities.getUuid();
  updateRevoArtCells_(sheet, account.row, {
    "Session Hash": hashRevoArtSecret_(token),
    "Session Expires": new Date(Date.now() + REVO_ART_WORKSPACE_CONFIG.sessionHours * 60 * 60 * 1000),
    "Last Login": new Date(), "Updated At": new Date()
  });
  return { ok: true, token: token, dashboard: getRevoArtAccountDashboard_(accountId) };
}

function getRevoArtAccountDashboard_(accountId) {
  const account = findRevoArtRow_(getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.accountSheet), "Account ID", accountId);
  if (!account) throw new Error("申請者アカウントが見つかりません。");
  const projectIds = readRevoArtRows_(getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.memberSheet))
    .filter((entry) => String(entry["Account ID"] || "") === String(accountId) && String(entry.Status || "") === "active")
    .map((entry) => String(entry["Project ID"] || ""));
  const projects = projectIds.map((projectId) => getRevoArtWorkspaceData_(projectId));
  return { account: { id: accountId, email: account.values.Email, displayName: account.values["表示名"] || "" }, projects: projects };
}

function getRevoArtProjectsForEmail_(email) {
  return readRevoArtRows_(getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.workspaceSheet))
    .filter((entry) => String(entry["申請者メール"] || "").trim() && normalizeRevoArtEmail_(entry["申請者メール"]) === email);
}

function syncRevoArtMemberships_(accountId, email) {
  const sheet = getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.memberSheet);
  const existing = readRevoArtRows_(sheet);
  getRevoArtProjectsForEmail_(email).forEach((project) => {
    const projectId = String(project["Project ID"] || "");
    const member = existing.find((entry) => String(entry["Project ID"] || "") === projectId && String(entry["Account ID"] || "") === String(accountId));
    if (member) return;
    sheet.appendRow([projectId, accountId, "owner", "active", new Date(), new Date()]);
  });
}

function readRevoArtRowsWithIndex_(sheet) {
  if (sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map(String);
  return values.map((row, index) => ({
    row: index + 2,
    values: headers.reduce((entry, header, column) => { entry[header] = row[column]; return entry; }, {})
  })).filter((entry) => Object.values(entry.values).some((value) => value !== ""));
}

function appendRevoArtObjectRow_(sheet, values) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  sheet.appendRow(headers.map((header) => Object.prototype.hasOwnProperty.call(values, header) ? values[header] : ""));
}

function nextRevoArtReceptionId_(sheet) {
  const max = readRevoArtRows_(sheet).reduce((value, entry) => {
    const match = String(entry["受付ID"] || "").match(/^RA-(\d+)$/);
    return match ? Math.max(value, Number(match[1])) : value;
  }, 0);
  return "RA-" + String(max + 1).padStart(4, "0");
}

function getRevoArtAnswer_(values, names) {
  for (let index = 0; index < names.length; index += 1) {
    const answer = values[names[index]];
    if (answer && answer[0] !== "" && answer[0] !== null) return answer[0];
  }
  return "";
}

function labelRevoArtAnswer_(label, value) {
  return value ? label + ": " + String(value) : "";
}

function normalizeComparableRevoArtDate_(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value || "").trim() : Utilities.formatDate(date, "Asia/Tokyo", "yyyy-MM-dd HH:mm:ss");
}

function inferRevoArtWorkspaceCategory_(value) {
  const text = String(value || "");
  if (text.includes("ウォール") || text.includes("壁")) return "wall";
  if (text.includes("カー") || text.includes("車")) return "car";
  if (text.includes("ハット") || text.includes("帽子")) return "hat";
  return "other";
}

function inferRevoArtWorkspaceCategoryLabel_(value) {
  const category = inferRevoArtWorkspaceCategory_(value);
  return category === "wall" ? "開催地" : category === "car" ? "車両" : category === "hat" ? "アーティスト" : "相談";
}

function sendRevoArtAccountInvitation_(email, projectId, publicName) {
  MailApp.sendEmail({
    to: email,
    subject: "【レボアート】申請者マイページのご案内",
    htmlBody: "<p>" + escapeRevoArtHtml_(publicName || "申請者") + " 様</p>" +
      "<p>レボアートの申請を受け付け、Project作業ページを発行しました。</p>" +
      "<p>Project ID: <strong>" + escapeRevoArtHtml_(projectId) + "</strong></p>" +
      "<p><a href=\"https://revofunding.onokun.com/revo-art-account.html\">申請者マイページを開く</a></p>" +
      "<p>初回は「初期設定・パスワード再設定」から、申請時のメールアドレスでアカウントを設定してください。</p>",
    name: "レボアート運営"
  });
}

function escapeRevoArtHtml_(value) {
  return String(value || "").replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character]));
}

function getRevoArtWorkspaceRecord_(projectId) {
  const found = findRevoArtRow_(getRevoArtSheet_(REVO_ART_WORKSPACE_CONFIG.workspaceSheet), "Project ID", projectId);
  return found ? found.values : null;
}

function getRevoArtSheet_(name) {
  const sheet = SpreadsheetApp.openById(REVO_ART_WORKSPACE_CONFIG.spreadsheetId).getSheetByName(name);
  if (!sheet) throw new Error(name + "シートがありません。setupRevoArtWorkspaceAppを実行してください。");
  return sheet;
}

function ensureRevoArtSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  const current = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0] : [];
  const merged = current.slice();
  headers.forEach((header) => { if (!merged.includes(header)) merged.push(header); });
  if (merged.length) sheet.getRange(1, 1, 1, merged.length).setValues([merged]);
  sheet.setFrozenRows(1);
  return sheet;
}

function readRevoArtRows_(sheet) {
  if (sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map(String);
  return values.filter((row) => row.some((value) => value !== "")).map((row) => headers.reduce((entry, header, index) => {
    entry[header] = row[index];
    return entry;
  }, {}));
}

function findRevoArtRow_(sheet, keyHeader, keyValue) {
  const data = sheet.getDataRange().getValues();
  if (!data.length) return null;
  const headers = data[0].map(String);
  const keyIndex = headers.indexOf(keyHeader);
  if (keyIndex < 0) return null;
  for (let index = 1; index < data.length; index += 1) {
    if (String(data[index][keyIndex] || "") === String(keyValue || "")) {
      return { row: index + 1, headers: headers, values: headers.reduce((entry, header, column) => {
        entry[header] = data[index][column];
        return entry;
      }, {}) };
    }
  }
  return null;
}

function upsertRevoArtRow_(sheet, keyHeader, keyValue, values) {
  const found = findRevoArtRow_(sheet, keyHeader, keyValue);
  if (found) return updateRevoArtCells_(sheet, found.row, values);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  sheet.appendRow(headers.map((header) => Object.prototype.hasOwnProperty.call(values, header) ? values[header] : ""));
}

function updateRevoArtCells_(sheet, row, values) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  Object.keys(values).forEach((header) => {
    const column = headers.indexOf(header);
    if (column >= 0) sheet.getRange(row, column + 1).setValue(values[header]);
  });
}

function nextRevoArtUpdateId_(sheet) {
  const values = sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues().flat();
  const max = values.reduce((value, id) => {
    const match = String(id).match(/^UP-(\d+)$/);
    return match ? Math.max(value, Number(match[1])) : value;
  }, 0);
  return "UP-" + String(max + 1).padStart(4, "0");
}

function hashRevoArtSecret_(value) {
  const pepper = PropertiesService.getScriptProperties().getProperty("REVO_ART_AUTH_PEPPER") || "";
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value || "") + pepper, Utilities.Charset.UTF_8);
  return digest.map((byte) => (byte + 256).toString(16).slice(-2)).join("");
}

function hashRevoArtPassword_(salt, password) {
  const pepper = PropertiesService.getScriptProperties().getProperty("REVO_ART_AUTH_PEPPER") || "";
  let value = String(salt || "") + ":" + String(password || "") + ":" + pepper;
  for (let round = 0; round < 1200; round += 1) {
    const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value + ":" + round, Utilities.Charset.UTF_8);
    value = digest.map((byte) => (byte + 256).toString(16).slice(-2)).join("");
  }
  return value;
}

function validateRevoArtPassword_(password) {
  const value = String(password || "");
  if (value.length < 10 || !/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    throw new Error("パスワードは英字と数字を含む10文字以上にしてください。");
  }
}

function constantTimeRevoArtEqual_(left, right) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return result === 0;
}

function sanitizeRevoArtId_(value) {
  const id = String(value || "").trim();
  if (!/^[a-z0-9][a-z0-9-]{2,79}$/.test(id)) throw new Error("Project IDが正しくありません。");
  return id;
}

function normalizeRevoArtEmail_(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("メールアドレスを確認してください。");
  return email;
}

function maskRevoArtEmail_(email) {
  const parts = email.split("@");
  return parts[0].slice(0, 2) + "***@" + parts[1];
}

function cleanRevoArtText_(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, maxLength);
}

function cleanRevoArtUrl_(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (/^(https:\/\/|assets\/images\/)/.test(url)) return url.slice(0, 1000);
  throw new Error("画像URLはHTTPSまたはサイト内画像を指定してください。");
}

function formatRevoArtDate_(value) {
  if (!value) return "";
  return Utilities.formatDate(new Date(value), "Asia/Tokyo", "yyyy-MM-dd");
}

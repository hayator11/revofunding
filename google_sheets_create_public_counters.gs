const SUPPORTER_MANAGEMENT_SPREADSHEET_ID = '1znlaaylwX1pydYJlbeEqMULnVU8Ybww0kwFH6YvvWp0';

function createPublicCountersSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = 'Public Counters';
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  sheet.clear();
  sheet.getRange(1, 1, 1, 3).setValues([['key', 'value', 'memo']]);

  const rows = [
    ['activeChallenges', '3', '進行中の挑戦'],
    ['totalSupporters', '74人', '累計応援者'],
    ['totalFans', '186人', '累計ファン'],
    ['totalBadges', '11', '称号付与'],
    ['productsMade', '4件', '制作商品'],
    ['waitingSteps', '2件', '次ステップ待ち'],
    ['supportersNumber', '32', '防災×帽祭 応援者 数字のみ'],
    ['supportersCount', '32人', '防災×帽祭 応援者'],
    ['fansNumber', '118', '防災×帽祭 ファン 数字のみ'],
    ['fansCount', '118人', '防災×帽祭 ファン'],
    ['soldNumber', '64', '販売数 数字のみ'],
    ['soldCount', '64枚', '販売数'],
    ['stockCount', '18枚', '在庫数'],
    ['remainingCount', '18枚', '残り枚数'],
    ['reservedCount', '18枚', '予約枠'],
    ['firstLot', '100枚', '初回制作数'],
    ['totalFunds', '320,000円', '集まった資金'],
    ['productionCost', '120,000円', '制作費'],
    ['operationCost', '43,000円', '発送・決済・運営費'],
    ['salesAmount', '288,000円', '売上'],
    ['nextStock', '80,000円', '次回ストック'],
    ['challengerSupportPlanned', '45,000円', '起案者支援予定'],
    ['challengerSupportPaid', '20,000円', '支援済み額'],
    ['snsShares', '47件', 'SNS共有'],
    ['referralVisits', '23件', '紹介流入'],
    ['nextAction', '二次募集', '次アクション']
  ];

  sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 3);
}

function updatePublicCountersFromManagement() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const publicSheet = ensurePublicCountersSheet_(ss);
  const currentCounters = readCounters_(publicSheet);
  const applicationsSheet = ss.getSheetByName('Applications');
  const supportersSheet = ss.getSheetByName('Supporters') || getExternalSheet_(SUPPORTER_MANAGEMENT_SPREADSHEET_ID, 'Supporters');
  const financeSheet = ss.getSheetByName('Product Finance');

  const updates = {};

  if (applicationsSheet) {
    const applicationRows = readDataRows_(applicationsSheet);
    const applicationStatusIndex = 15;
    const licenseIndex = 9;
    const designerIndex = 10;

    updates.activeChallenges = String(countByStatuses_(applicationRows, applicationStatusIndex, ['承認', '掲載準備']));
    updates.waitingSteps = countByStatuses_(applicationRows, applicationStatusIndex, ['追加確認', 'ヒアリング調整', '掲載準備']) + '件';
    updates.productsMade = keepOrDefault_(currentCounters.productsMade, '4件');

    const licenseHopeCount = countContains_(applicationRows, licenseIndex, ['希望', '相談']);
    const designerHopeCount = countContains_(applicationRows, designerIndex, ['希望', '相談']);
    updates.totalBadges = keepOrDefault_(currentCounters.totalBadges, String(licenseHopeCount + designerHopeCount));
  }

  if (supportersSheet) {
    const supporterRows = readDataRows_(supportersSheet);
    const supporterStatusIndex = 16;
    const supporterChallengeIndex = 8;
    const activeSupporters = supporterRows.filter((row) => !String(row[supporterStatusIndex] || '').includes('停止'));
    const bousaiSupporters = activeSupporters.filter((row) => {
      const challenge = String(row[supporterChallengeIndex] || '');
      return challenge === '' || challenge.includes('防災') || challenge.includes('帽祭');
    });

    updates.totalSupporters = activeSupporters.length + '人';
    updates.supportersCount = bousaiSupporters.length + '人';
    updates.supportersNumber = String(bousaiSupporters.length);
  }

  if (financeSheet) {
    Object.assign(updates, readFinanceCounters_(financeSheet));
  }

  writeCounters_(publicSheet, { ...currentCounters, ...updates });
  SpreadsheetApp.flush();
  Logger.log('Public Countersを更新しました。');
}

function createProductFinanceSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Product Finance');

  if (!sheet) {
    sheet = ss.insertSheet('Product Finance');
  }

  sheet.clear();
  sheet.getRange(1, 1, 1, 4).setValues([['key', 'value', 'memo', 'lastUpdated']]);

  const rows = [
    ['firstLot', '100枚', '初回制作数', new Date()],
    ['soldNumber', '64', '販売数 数字のみ', new Date()],
    ['soldCount', '64枚', '販売数', new Date()],
    ['stockCount', '18枚', '在庫数', new Date()],
    ['remainingCount', '18枚', '残り枚数', new Date()],
    ['reservedCount', '18枚', '予約枠', new Date()],
    ['totalFunds', '320,000円', '集まった資金', new Date()],
    ['productionCost', '120,000円', '制作費', new Date()],
    ['operationCost', '43,000円', '発送・決済・運営費', new Date()],
    ['salesAmount', '288,000円', '売上', new Date()],
    ['nextStock', '80,000円', '次回ストック', new Date()],
    ['challengerSupportPlanned', '45,000円', '起案者支援予定', new Date()],
    ['challengerSupportPaid', '20,000円', '支援済み額', new Date()],
    ['nextAction', '二次募集', '次アクション', new Date()]
  ];

  sheet.getRange(2, 1, rows.length, 4).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 4);
  Logger.log('Product Financeシートを作成しました。');
}

function createProjectsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Projects');

  if (!sheet) {
    sheet = ss.insertSheet('Projects');
  }

  sheet.clear();
  sheet.getRange(1, 1, 1, 13).setValues([[
    'projectId',
    'title',
    'status',
    'category',
    'supporters',
    'fans',
    'sales',
    'money',
    'updated',
    'nextAction',
    'summary',
    'pageUrl',
    'visible'
  ]]);

  const rows = [
    [
      'bousai',
      '防災×帽祭 Tシャツプロジェクト',
      'open',
      '防災 グッズ',
      32,
      118,
      64,
      320000,
      '2026-05-22',
      '次の制作まであと18枚',
      '防災をもっと身近に、楽しく、かぶれる形で広げるレボチャレンジ。',
      'supporters.html#detail',
      'TRUE'
    ],
    [
      'revoart',
      'おのくんアートキャラバン連動',
      'open',
      'アート 防災 地域 広告',
      36,
      96,
      16,
      260000,
      '2026-05-22',
      '開催地・企業協賛・アーティスト募集',
      'レボリストLab、防災×帽祭、レボリンクをつなぎ、地域と企業とアーティストが参加する共創プロジェクト。',
      'revo-art.html',
      'TRUE'
    ],
    [
      'revolinks',
      'レボリンクス 広告スポンサー実験',
      'next',
      '広告 地域',
      21,
      44,
      8,
      180000,
      '2026-05-18',
      '二次募集開始まであと3チェック',
      '広告収入型のスポンサー導線を、地域・防災・挑戦の応援へつなげる実験。',
      'supporters.html#challenges',
      'TRUE'
    ],
    [
      'onokun',
      'おのくん 持ち寄り応援グッズ',
      'open',
      '地域 グッズ 防災',
      28,
      72,
      36,
      145000,
      '2026-05-20',
      '認定デザイナー相談中',
      '持ち寄り文化を見える形にして、地域と防災の応援を広げるグッズ展開。',
      'supporters.html#challenges',
      'TRUE'
    ]
  ];

  sheet.getRange(2, 1, rows.length, 13).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 13);
  Logger.log('Projectsシートを作成しました。');
}

function createOperationDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Dashboard');

  if (!sheet) {
    sheet = ss.insertSheet('Dashboard');
  }

  sheet.clear();
  sheet.getRange('A1').setValue('レボファンディング 運営ダッシュボード');
  sheet.getRange('A3:C3').setValues([['確認項目', '現在値', '見る場所']]);

  const rows = [
    ['進行中の挑戦', '=IFERROR(VLOOKUP("activeChallenges",\'Public Counters\'!A:B,2,false),"")', 'Applications / Public Counters'],
    ['累計応援者', '=IFERROR(VLOOKUP("totalSupporters",\'Public Counters\'!A:B,2,false),"")', '応援者参加 管理表 / Public Counters'],
    ['防災×帽祭 応援者', '=IFERROR(VLOOKUP("supportersCount",\'Public Counters\'!A:B,2,false),"")', '応援者参加 管理表 / Public Counters'],
    ['ファン数', '=IFERROR(VLOOKUP("fansCount",\'Public Counters\'!A:B,2,false),"")', 'Public Counters'],
    ['販売数', '=IFERROR(VLOOKUP("soldCount",\'Public Counters\'!A:B,2,false),"")', 'Product Finance'],
    ['在庫数', '=IFERROR(VLOOKUP("stockCount",\'Public Counters\'!A:B,2,false),"")', 'Product Finance'],
    ['売上', '=IFERROR(VLOOKUP("salesAmount",\'Public Counters\'!A:B,2,false),"")', 'Product Finance'],
    ['制作費', '=IFERROR(VLOOKUP("productionCost",\'Public Counters\'!A:B,2,false),"")', 'Product Finance'],
    ['次回ストック', '=IFERROR(VLOOKUP("nextStock",\'Public Counters\'!A:B,2,false),"")', 'Product Finance'],
    ['起案者支援予定', '=IFERROR(VLOOKUP("challengerSupportPlanned",\'Public Counters\'!A:B,2,false),"")', 'Product Finance'],
    ['支援済み額', '=IFERROR(VLOOKUP("challengerSupportPaid",\'Public Counters\'!A:B,2,false),"")', 'Product Finance'],
    ['次アクション', '=IFERROR(VLOOKUP("nextAction",\'Public Counters\'!A:B,2,false),"")', 'Product Finance']
  ];

  sheet.getRange(4, 1, rows.length, 3).setValues(rows);

  const guideStart = rows.length + 6;
  sheet.getRange(guideStart, 1, 1, 3).setValues([['今日やること', '状態', 'メモ']]);
  sheet.getRange(guideStart + 1, 1, 5, 3).setValues([
    ['新しい起案者申請を確認', '未確認', 'Applicationsの未確認を見る'],
    ['新しい応援者参加を確認', '未確認', '応援者参加 管理表を見る'],
    ['BASE販売数・在庫を確認', '未確認', 'Product Financeを更新'],
    ['Public Countersを更新', '未確認', 'updatePublicCountersFromManagementを実行'],
    ['サイト表示を確認', '未確認', '公開サイトをcommand + shift + Rで確認']
  ]);

  sheet.getRange('A1:C1').merge();
  sheet.getRange('A1').setFontSize(18).setFontWeight('bold');
  sheet.getRange('A3:C3').setFontWeight('bold').setBackground('#111827').setFontColor('#ffffff');
  sheet.getRange(guideStart, 1, 1, 3).setFontWeight('bold').setBackground('#2563eb').setFontColor('#ffffff');
  sheet.setFrozenRows(3);
  sheet.autoResizeColumns(1, 3);
  Logger.log('運営ダッシュボードを作成しました。');
}

function setupPublicCountersAutoUpdate() {
  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach((trigger) => {
    if (trigger.getHandlerFunction() === 'updatePublicCountersFromManagement') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('updatePublicCountersFromManagement')
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log('Public Countersを1時間ごとに更新する設定を作りました。');
}

function ensurePublicCountersSheet_(ss) {
  let sheet = ss.getSheetByName('Public Counters');

  if (!sheet) {
    createPublicCountersSheet();
    sheet = ss.getSheetByName('Public Counters');
  }

  return sheet;
}

function readCounters_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return {};
  }

  return sheet.getRange(2, 1, lastRow - 1, 3).getValues().reduce((counters, row) => {
    const key = row[0];
    const value = row[1];
    if (key) {
      counters[key] = value;
    }
    return counters;
  }, {});
}

function writeCounters_(sheet, counters) {
  const memoByKey = readMemos_(sheet);
  const keys = [
    'activeChallenges',
    'totalSupporters',
    'totalFans',
    'totalBadges',
    'productsMade',
    'waitingSteps',
    'supportersNumber',
    'supportersCount',
    'fansNumber',
    'fansCount',
    'soldNumber',
    'soldCount',
    'stockCount',
    'remainingCount',
    'reservedCount',
    'firstLot',
    'totalFunds',
    'productionCost',
    'operationCost',
    'salesAmount',
    'nextStock',
    'challengerSupportPlanned',
    'challengerSupportPaid',
    'snsShares',
    'referralVisits',
    'nextAction'
  ];

  const rows = keys.map((key) => [key, counters[key] || '', memoByKey[key] || defaultMemo_(key)]);
  sheet.clear();
  sheet.getRange(1, 1, 1, 3).setValues([['key', 'value', 'memo']]);
  sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 3);
}

function readMemos_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return {};
  }

  return sheet.getRange(2, 1, lastRow - 1, 3).getValues().reduce((memos, row) => {
    if (row[0]) {
      memos[row[0]] = row[2];
    }
    return memos;
  }, {});
}

function readDataRows_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow < 2 || lastColumn < 1) {
    return [];
  }

  return sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues().filter((row) => row.some((cell) => cell !== ''));
}

function readFinanceCounters_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return {};
  }

  return sheet.getRange(2, 1, lastRow - 1, 2).getValues().reduce((counters, row) => {
    const key = row[0];
    const value = row[1];
    if (key && value !== '') {
      counters[key] = value;
    }
    return counters;
  }, {});
}

function getExternalSheet_(spreadsheetId, sheetName) {
  if (!spreadsheetId || spreadsheetId === 'ここに応援者管理表のスプレッドシートIDを入れる') {
    return null;
  }

  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    return spreadsheet.getSheetByName(sheetName);
  } catch (error) {
    Logger.log('外部管理表を開けませんでした: ' + error.message);
    return null;
  }
}

function countByStatuses_(rows, statusIndex, statuses) {
  return rows.filter((row) => statuses.includes(String(row[statusIndex] || ''))).length;
}

function countContains_(rows, index, words) {
  return rows.filter((row) => {
    const value = String(row[index] || '');
    return words.some((word) => value.includes(word));
  }).length;
}

function keepOrDefault_(value, fallback) {
  return value === undefined || value === '' ? fallback : value;
}

function defaultMemo_(key) {
  const memos = {
    activeChallenges: '進行中の挑戦',
    totalSupporters: '累計応援者',
    totalFans: '累計ファン',
    totalBadges: '称号付与',
    productsMade: '制作商品',
    waitingSteps: '次ステップ待ち',
    supportersNumber: '防災×帽祭 応援者 数字のみ',
    supportersCount: '防災×帽祭 応援者',
    fansNumber: '防災×帽祭 ファン 数字のみ',
    fansCount: '防災×帽祭 ファン',
    soldNumber: '販売数 数字のみ',
    soldCount: '販売数',
    stockCount: '在庫数',
    remainingCount: '残り枚数',
    reservedCount: '予約枠',
    firstLot: '初回制作数',
    totalFunds: '集まった資金',
    productionCost: '制作費',
    operationCost: '発送・決済・運営費',
    salesAmount: '売上',
    nextStock: '次回ストック',
    challengerSupportPlanned: '起案者支援予定',
    challengerSupportPaid: '支援済み額',
    snsShares: 'SNS共有',
    referralVisits: '紹介流入',
    nextAction: '次アクション'
  };

  return memos[key] || '';
}

/**
 * RevoFunding Public Counters auto updater.
 *
 * 使う場所:
 * - Public Counters タブが入っているGoogleスプレッドシートのApps Scriptに貼ります。
 *
 * 最初に実行:
 * - setupRevoCounterAutomation
 *
 * 通常更新:
 * - updateRevoPublicCounters
 */

const REVO_PUBLIC_COUNTERS_SHEET_NAME = 'Public Counters';
const REVO_COUNTER_SOURCES_SHEET_NAME = 'Counter Sources';
const REVO_PRODUCT_FINANCE_SHEET_NAME = 'Product Finance';
const REVO_COUNTER_LOG_SHEET_NAME = 'Counter Update Log';

function setupRevoCounterAutomation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  ensureRevoPublicCountersSheet_(ss);
  ensureRevoProductFinanceSheet_(ss);
  ensureRevoCounterSourcesSheet_(ss);
  ensureRevoCounterLogSheet_(ss);

  ScriptApp.getProjectTriggers().forEach((trigger) => {
    const handler = trigger.getHandlerFunction();
    if (handler === 'updateRevoPublicCounters') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('updateRevoPublicCounters')
    .timeBased()
    .everyHours(1)
    .create();

  updateRevoPublicCounters();
  Logger.log('Public Countersの自動更新を設定しました。1時間ごとに更新されます。');
}

function updateRevoPublicCounters() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const publicSheet = ensureRevoPublicCountersSheet_(ss);
  const currentCounters = readRevoCounters_(publicSheet);
  const sourceRows = readRevoCounterSources_(ss);
  const financeCounters = readRevoProductFinance_(ss);
  const sourceCounts = countRevoSources_(sourceRows);

  const updates = {
    ...financeCounters,
  };

  if (sourceCounts.supporter !== undefined) {
    updates.supportersNumber = String(sourceCounts.supporter);
    updates.supportersCount = `${sourceCounts.supporter}人`;
    updates.totalSupporters = `${sourceCounts.supporter}人`;
  }

  if (sourceCounts.fan !== undefined) {
    updates.fansNumber = String(sourceCounts.fan);
    updates.fansCount = `${sourceCounts.fan}人`;
    updates.totalFans = `${sourceCounts.fan}人`;
  }

  if (sourceCounts.challenger !== undefined) {
    updates.activeChallenges = String(sourceCounts.challenger);
  }

  if (sourceCounts.artist !== undefined) {
    updates.totalBadges = String(sourceCounts.artist);
  }

  if (sourceCounts.revoArt !== undefined) {
    updates.waitingSteps = `${sourceCounts.revoArt}件`;
  }

  if (updates.soldNumber !== undefined && updates.buyerCount === undefined) {
    updates.buyerCount = `${numberFromRevoValue_(updates.soldNumber)}人`;
  }

  if (updates.soldNumber !== undefined && updates.soldCount === undefined) {
    updates.soldCount = `${numberFromRevoValue_(updates.soldNumber)}枚`;
  }

  if (updates.firstLot !== undefined && updates.soldNumber !== undefined && updates.remainingCount === undefined) {
    const firstLot = numberFromRevoValue_(updates.firstLot);
    const sold = numberFromRevoValue_(updates.soldNumber);
    updates.remainingCount = `${Math.max(firstLot - sold, 0)}枚`;
  }

  if (updates.hopeAmount && updates.usedAmount && updates.operatingAmount) {
    const hope = numberFromRevoValue_(updates.hopeAmount);
    const used = numberFromRevoValue_(updates.usedAmount);
    const operating = numberFromRevoValue_(updates.operatingAmount);
    updates.remainingBudget = `${(hope - used - operating).toLocaleString('ja-JP')}円`;
  }

  const mergedCounters = {
    ...currentCounters,
    ...updates,
  };

  writeRevoCounters_(publicSheet, mergedCounters);
  appendRevoCounterLog_(ss, sourceRows, sourceCounts, updates);
  SpreadsheetApp.flush();
}

function ensureRevoPublicCountersSheet_(ss) {
  let sheet = ss.getSheetByName(REVO_PUBLIC_COUNTERS_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(REVO_PUBLIC_COUNTERS_SHEET_NAME);
    sheet.getRange(1, 1, 1, 3).setValues([['key', 'value', 'memo']]);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 3).setValues([['key', 'value', 'memo']]);
  }

  return sheet;
}

function ensureRevoProductFinanceSheet_(ss) {
  let sheet = ss.getSheetByName(REVO_PRODUCT_FINANCE_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(REVO_PRODUCT_FINANCE_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 4).setValues([['key', 'value', 'memo', 'lastUpdated']]);
    sheet.getRange(2, 1, 19, 4).setValues([
      ['firstLot', '100枚', '初回制作数', new Date()],
      ['soldNumber', '64', '販売数 数字のみ', new Date()],
      ['soldCount', '64枚', '販売数', new Date()],
      ['buyerCount', '64人', '購入者数', new Date()],
      ['stockCount', '18枚', '在庫数', new Date()],
      ['remainingCount', '18枚', '残り枚数', new Date()],
      ['reservedCount', '18枚', '予約枠', new Date()],
      ['totalFunds', '320,000円', '集まった資金', new Date()],
      ['hopeAmount', '320,000円', '希望金額', new Date()],
      ['usedAmount', '163,000円', '利用金額', new Date()],
      ['operatingAmount', '80,000円', '運用額', new Date()],
      ['remainingBudget', '77,000円', '残', new Date()],
      ['productionCost', '120,000円', '制作費', new Date()],
      ['operationCost', '43,000円', '発送・決済・運営費', new Date()],
      ['salesAmount', '288,000円', '売上', new Date()],
      ['nextStock', '80,000円', '次回ストック', new Date()],
      ['challengerSupportPlanned', '45,000円', '起案者支援予定', new Date()],
      ['challengerSupportPaid', '20,000円', '支援済み額', new Date()],
      ['nextAction', '二次募集', '次アクション', new Date()],
    ]);
  }

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 4);
  return sheet;
}

function ensureRevoCounterSourcesSheet_(ss) {
  let sheet = ss.getSheetByName(REVO_COUNTER_SOURCES_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(REVO_COUNTER_SOURCES_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 7).setValues([[
      'enabled',
      'type',
      'spreadsheetId',
      'sheetName',
      'statusColumn',
      'includeStatuses',
      'memo',
    ]]);
    sheet.getRange(2, 1, 5, 7).setValues([
      ['TRUE', 'supporter', '', '', '', '', '応援者フォーム回答。空欄ならこのスプレッドシート内から探します。'],
      ['TRUE', 'fan', '', '', '', '', '購入後ファン登録フォーム回答。'],
      ['TRUE', 'challenger', '', '', '', '', '起案者 / レボチャレンジ申請フォーム回答。'],
      ['TRUE', 'artist', '', '', '', '', '認定アーティスト応募フォーム回答。'],
      ['TRUE', 'revoArt', '', '', '', '', 'レボアート相談フォーム回答。'],
    ]);
  }

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 7);
  return sheet;
}

function ensureRevoCounterLogSheet_(ss) {
  let sheet = ss.getSheetByName(REVO_COUNTER_LOG_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(REVO_COUNTER_LOG_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 5).setValues([['updatedAt', 'type', 'count', 'source', 'memo']]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function readRevoCounterSources_(ss) {
  const sheet = ensureRevoCounterSourcesSheet_(ss);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  return sheet.getRange(2, 1, lastRow - 1, 7).getValues()
    .map((row) => ({
      enabled: String(row[0]).toUpperCase() !== 'FALSE',
      type: String(row[1] || '').trim(),
      spreadsheetId: String(row[2] || '').trim(),
      sheetName: String(row[3] || '').trim(),
      statusColumn: String(row[4] || '').trim(),
      includeStatuses: String(row[5] || '').split(',').map((item) => item.trim()).filter(Boolean),
      memo: String(row[6] || ''),
    }))
    .filter((row) => row.enabled && row.type);
}

function countRevoSources_(sourceRows) {
  return sourceRows.reduce((counts, source) => {
    const sheet = getRevoSourceSheet_(source);
    if (!sheet) {
      counts[source.type] = counts[source.type] || 0;
      return counts;
    }

    counts[source.type] = (counts[source.type] || 0) + countRevoDataRows_(sheet, source);
    return counts;
  }, {});
}

function getRevoSourceSheet_(source) {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheet = source.spreadsheetId
    ? SpreadsheetApp.openById(source.spreadsheetId)
    : activeSpreadsheet;

  if (source.sheetName) {
    return spreadsheet.getSheetByName(source.sheetName);
  }

  const candidates = spreadsheet.getSheets().filter((sheet) => {
    const name = sheet.getName();
    if ([REVO_PUBLIC_COUNTERS_SHEET_NAME, REVO_COUNTER_SOURCES_SHEET_NAME, REVO_PRODUCT_FINANCE_SHEET_NAME, REVO_COUNTER_LOG_SHEET_NAME].includes(name)) {
      return false;
    }
    return sheet.getLastRow() > 1;
  });

  return candidates[0] || null;
}

function countRevoDataRows_(sheet, source) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow < 2 || lastColumn < 1) {
    return 0;
  }

  const values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  const headers = values[0].map((header) => String(header || '').trim());
  const statusIndex = source.statusColumn ? headers.indexOf(source.statusColumn) : -1;

  return values.slice(1).filter((row) => {
    const hasValue = row.some((cell) => String(cell || '').trim() !== '');
    if (!hasValue) return false;

    if (statusIndex >= 0 && source.includeStatuses.length) {
      return source.includeStatuses.includes(String(row[statusIndex] || '').trim());
    }

    return true;
  }).length;
}

function readRevoProductFinance_(ss) {
  const sheet = ensureRevoProductFinanceSheet_(ss);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return {};
  }

  return sheet.getRange(2, 1, lastRow - 1, 2).getValues().reduce((counters, row) => {
    const key = String(row[0] || '').trim();
    if (key) {
      counters[key] = row[1];
    }
    return counters;
  }, {});
}

function readRevoCounters_(sheet) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return {};
  }

  return sheet.getRange(2, 1, lastRow - 1, 2).getValues().reduce((counters, row) => {
    const key = String(row[0] || '').trim();
    if (key) {
      counters[key] = row[1];
    }
    return counters;
  }, {});
}

function writeRevoCounters_(sheet, counters) {
  const memoByKey = readRevoMemos_(sheet);
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
    'nextAction',
    'hopeAmount',
    'usedAmount',
    'operatingAmount',
    'remainingBudget',
    'buyerCount',
  ];

  const rows = keys.map((key) => [key, counters[key] ?? '', memoByKey[key] || defaultRevoMemo_(key)]);
  sheet.clear();
  sheet.getRange(1, 1, 1, 3).setValues([['key', 'value', 'memo']]);
  sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 3);
}

function readRevoMemos_(sheet) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return {};
  }

  return sheet.getRange(2, 1, lastRow - 1, 3).getValues().reduce((memos, row) => {
    const key = String(row[0] || '').trim();
    if (key) {
      memos[key] = row[2];
    }
    return memos;
  }, {});
}

function appendRevoCounterLog_(ss, sourceRows, counts, updates) {
  const sheet = ensureRevoCounterLogSheet_(ss);
  const now = new Date();
  const rows = Object.keys(counts).map((type) => {
    const source = sourceRows.find((item) => item.type === type) || {};
    return [
      now,
      type,
      counts[type],
      source.sheetName || source.spreadsheetId || 'active spreadsheet',
      `updated keys: ${Object.keys(updates).join(', ')}`,
    ];
  });

  if (rows.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 5).setValues(rows);
  }
}

function numberFromRevoValue_(value) {
  const match = String(value || '').match(/-?[0-9,]+/);
  return match ? Number(match[0].replace(/,/g, '')) : 0;
}

function defaultRevoMemo_(key) {
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
    nextAction: '次アクション',
    hopeAmount: '希望金額',
    usedAmount: '利用金額',
    operatingAmount: '運用額',
    remainingBudget: '残',
    buyerCount: '購入者数',
  };

  return memos[key] || '';
}

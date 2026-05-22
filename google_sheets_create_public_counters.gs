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

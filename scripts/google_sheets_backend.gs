/**
 * @OnlyCurrentDoc
 * TPI-ICV 2026 Symposium — Automated Google Sheets Registration Backend
 * Bound to Google Sheet:
 * https://docs.google.com/spreadsheets/d/1ghRYq4manys5lGs5IGRlnwgVwxX31G-ksVx-gN4dht8/edit?gid=0#gid=0
 */

const SPREADSHEET_ID = '1ghRYq4manys5lGs5IGRlnwgVwxX31G-ksVx-gN4dht8';
const SHEET_GID = 0;

function getTargetSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets().find(s => s.getSheetId() === SHEET_GID) || ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp (UTC+8)',
      'Name',
      'Affiliation',
      'Attendance Mode',
      'Number of Attendees',
      'Role / Category',
      'Email',
      'Phone / WeChat',
      'Networking Lunch (12:00-13:00)',
      'Other Information / Notes'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#e2e8f0');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const sheet = getTargetSheet();
    const payload = JSON.parse(e.postData.contents);

    const timestamp = Utilities.formatDate(new Date(), 'Asia/Shanghai', 'yyyy-MM-dd HH:mm:ss');
    const count = Math.max(1, parseInt(payload.count || '1', 10) || 1);

    sheet.appendRow([
      timestamp,
      payload.name || '',
      payload.affiliation || '',
      payload.mode || '',
      count,
      payload.role || '',
      payload.email || '',
      payload.phone || '',
      payload.lunch || '',
      payload.notes || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', timestamp: timestamp }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = getTargetSheet();
    const data = sheet.getDataRange().getValues();
    const rows = [];

    for (let i = 1; i < data.length; i++) {
      const r = data[i];
      if (!r[1] && !r[2]) continue;
      rows.push({
        timestamp: String(r[0] || ''),
        name: String(r[1] || ''),
        affiliation: String(r[2] || ''),
        mode: String(r[3] || ''),
        count: Math.max(1, parseInt(r[4], 10) || 1),
        role: String(r[5] || ''),
        email: String(r[6] || ''),
        phone: String(r[7] || ''),
        lunch: String(r[8] || ''),
        notes: String(r[9] || '')
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', rows: rows }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

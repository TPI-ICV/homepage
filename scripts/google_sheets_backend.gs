/**
 * TPI-ICV 2026 Symposium — Automated Google Sheets Registration Backend
 * Bound to Google Sheet:
 * https://docs.google.com/spreadsheets/d/1ghRYq4manys5lGs5IGRlnwgVwxX31G-ksVx-gN4dht8/edit?usp=sharing
 *
 * SETUP (Takes ~30 Seconds inside your Google Sheet):
 * 1. Open https://docs.google.com/spreadsheets/d/1ghRYq4manys5lGs5IGRlnwgVwxX31G-ksVx-gN4dht8/edit
 * 2. Click "Extensions" (扩展程序) -> "Apps Script".
 * 3. Paste this entire file into Code.gs and click Save (Ctrl+S).
 * 4. Click "Deploy" (部署) -> "New deployment" (新建部署):
 *    - Select type: "Web app" (网页应用)
 *    - Execute as: "Me" (我)
 *    - Who has access: "Anyone" (任何人)
 * 5. Copy the generated "Web app URL" (ends with /exec) and paste it into
 *    the "Secretariat Tally & CSV" modal (or DEFAULT_REGISTRATION_WEBHOOK_URL in assets/js/app.js).
 */

const SPREADSHEET_ID = '1ghRYq4manys5lGs5IGRlnwgVwxX31G-ksVx-gN4dht8';
const NOTIFY_TO = 'xi.ai@nusricq.cn';
const NOTIFY_CC = 'barid.x.ai@gmail.com';

function getTargetSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];
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

    try {
      const modeShort = (payload.mode || '').indexOf('Online') === 0 ? 'Online' : 'In-Person';
      const subject = `[TPI-ICV 2026 Registration] - ${modeShort} - ${payload.affiliation} - ${payload.name} (${count} Attendee${count > 1 ? 's' : ''})`;
      const body = [
        `New TPI-ICV 2026 Participant Registration (Saved to Google Sheet):`,
        `Sheet: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
        ``,
        `1. Name: ${payload.name}`,
        `2. Affiliation: ${payload.affiliation}`,
        `3. Attendance Mode: ${payload.mode}`,
        `4. Number of Attendees: ${count}`,
        `5. Role / Category: ${payload.role}`,
        `6. Email: ${payload.email}`,
        `7. Phone / WeChat: ${payload.phone}`,
        `8. Networking Lunch: ${payload.lunch}`,
        `9. Other Notes: ${payload.notes || 'None'}`,
        `10. Timestamp (UTC+8): ${timestamp}`
      ].join('\n');

      MailApp.sendEmail({
        to: NOTIFY_TO,
        cc: NOTIFY_CC,
        subject: subject,
        body: body
      });
    } catch (mailErr) {
      // Ignore if MailApp is not authorized
    }

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

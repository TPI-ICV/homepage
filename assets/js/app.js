/**
 * TPI-ICV 2026 Academic Symposium Client Engine (Academic Light Edition)
 * Features:
 * - Real-time Bilingual Language Switcher (EN / ZH)
 * - Interactive Schedule Categorization
 * - Dynamic Submission Proposal & Mailto Formatter
 * - Standard RFC 5545 iCalendar (.ics) Exporter
 * - Responsive Mobile Drawer & Scrollspy Navigation
 */

// Current Language State: 'en' | 'zh'
let currentLang = localStorage.getItem('tpi_lang') || 'en';

// Connected Google Sheet (https://docs.google.com/spreadsheets/d/1ghRYq4manys5lGs5IGRlnwgVwxX31G-ksVx-gN4dht8/edit?usp=sharing)
const GOOGLE_SHEET_ID = '1ghRYq4manys5lGs5IGRlnwgVwxX31G-ksVx-gN4dht8';
const GOOGLE_SHEET_EDIT_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit?usp=sharing`;
const GOOGLE_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`;
const DEFAULT_REGISTRATION_WEBHOOK_URL = localStorage.getItem('tpi_webhook_url') || GOOGLE_SHEET_EDIT_URL;

// Translations Dictionary for Dynamic Components
const translations = {
  en: {
    heroTag: "Joint Academic Milestone Symposium & Poster Exhibition",
    dateTbd: "Date: 12 Nov 2026 · Chongqing, China / Hybrid",
    submitSuccess: "Email proposal draft copied to clipboard!",
    icsSuccess: "Symposium calendar (.ics) file generated and downloaded!",
    copyEmailSuccess: "Secretariat email copied to clipboard: ",
    filterAll: "All Sessions",
    filterKeynote: "Keynotes",
    filterPoster: "Posters & Demos",
    filterPlenary: "Plenary & Panels",
    filterNetworking: "Networking",
    downloadCalendar: "Export iCalendar (.ics)",
    modalTitle: "Interactive Poster & Demo Submission Composer",
    modalDesc: "Draft your submission proposal according to the laboratory symposium guidelines. This tool automatically formats your email subject and structured abstract for the secretariat.",
    labelFullName: "Corresponding Author / Presenter Name",
    labelPI: "Lab PI Group / Changan Unit",
    labelTitle: "Working Title",
    labelType: "Presentation Format",
    typePoster: "Poster Only (A0 Portrait PDF)",
    typeDemo: "Interactive Demo Only",
    typeBoth: "Both Poster and Interactive Demo",
    labelAbstract: "Structured Abstract / System Brief",
    labelDemoReq: "Demo Setup Requirements (Power, Table, Display, LAN)",
    btnGenerateMail: "Open in Mail Client",
    btnCopyClipboard: "Copy Email Draft",
    btnClose: "Close"
  },
  zh: {
    heroTag: "联合学术研讨会暨成果海报展 · 内部学术交流与技术里程碑",
    dateTbd: "时间：2026年11月12日 · 中国·重庆 / 线上线下结合",
    submitSuccess: "提交邮件草稿已复制到剪贴板！",
    icsSuccess: "研讨会日历日程 (.ics) 文件已生成并开始下载！",
    copyEmailSuccess: "会务秘书组邮箱已复制：",
    filterAll: "全部议程",
    filterKeynote: "特邀主题报告",
    filterPoster: "成果海报与现场Demo",
    filterPlenary: "大会主会报告与圆桌",
    filterNetworking: "交流与茶歇",
    downloadCalendar: "导出研讨会日历 (.ics)",
    modalTitle: "海报与Demo交互式提交生成器",
    modalDesc: "请根据实验室学术研讨会规范拟定成果汇报。本工具将自动按格式生成符合会务组要求的邮件主题与结构化摘要。",
    labelFullName: "汇报人 / 通讯作者姓名",
    labelPI: "所属实验室PI课题组 / 长安汽车部门",
    labelTitle: "汇报论文 / 成果题目",
    labelType: "展示形式",
    typePoster: "仅海报展评 (A0标准竖版PDF)",
    typeDemo: "仅系统实物/交互Demo演示",
    typeBoth: "海报展评 + 实物交互Demo演示",
    labelAbstract: "结构化摘要 / 系统概述",
    labelDemoReq: "Demo现场保障需求 (展台空间、供电、显示器、局域网络)",
    btnGenerateMail: "调用邮件客户端发送",
    btnCopyClipboard: "复制邮件草稿文本",
    btnClose: "关闭"
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initScheduleFilter();
  initSubmissionModal();
  initRegistrationPortal();
  initSecretariatTallyModal();
  initCalendarExport();
  initMobileMenu();
  initScrollspy();
  initKaTeX();
});

// KaTeX auto-render helper
function initKaTeX() {
  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }
}

// Language Switcher Engine
function initLanguage() {
  applyLanguage(currentLang);

  const langToggles = document.querySelectorAll('.lang-toggle-btn');
  langToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      localStorage.setItem('tpi_lang', currentLang);
      applyLanguage(currentLang);
    });
  });
}

function applyLanguage(lang) {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  // Toggle visible elements by data-lang
  const enElements = document.querySelectorAll('[data-lang="en"]');
  const zhElements = document.querySelectorAll('[data-lang="zh"]');

  if (lang === 'zh') {
    enElements.forEach(el => el.classList.add('hidden'));
    zhElements.forEach(el => el.classList.remove('hidden'));
  } else {
    zhElements.forEach(el => el.classList.add('hidden'));
    enElements.forEach(el => el.classList.remove('hidden'));
  }

  // Update button text
  const langLabelSpans = document.querySelectorAll('.lang-label');
  langLabelSpans.forEach(span => {
    span.textContent = lang === 'en' ? '中文' : 'English';
  });

  // Re-render math if language switch revealed hidden formula containers
  setTimeout(initKaTeX, 50);
}

// Schedule Category Filtering
function initScheduleFilter() {
  const filterBtns = document.querySelectorAll('.schedule-filter-btn');
  const scheduleRows = document.querySelectorAll('.schedule-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-[#003D7C]', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-300', 'hover:bg-slate-50');
      });
      btn.classList.add('bg-[#003D7C]', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-300', 'hover:bg-slate-50');

      const filter = btn.getAttribute('data-filter');

      scheduleRows.forEach(row => {
        const category = row.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

// Submission Proposal Assistant Modal
function initSubmissionModal() {
  const modal = document.getElementById('submissionModal');
  const openBtns = document.querySelectorAll('.open-submission-modal-btn');
  const closeBtns = document.querySelectorAll('.close-modal-btn');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    });
  });

  // Close when clicking modal backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  // Email form generator logic
  const openMailBtn = document.getElementById('openMailClientBtn');
  const copyDraftBtn = document.getElementById('copyEmailDraftBtn');

  function buildEmailPayload() {
    const presenter = document.getElementById('subPresenter')?.value || "Author Name";
    const piGroup = document.getElementById('subPIGroup')?.value || "PI Group";
    const title = document.getElementById('subTitle')?.value || "Research Project Title";
    const format = document.getElementById('subFormat')?.value || "Poster & Demo";
    const abstractText = document.getElementById('subAbstract')?.value || "Detailed abstract and methodology...";
    const reqText = document.getElementById('subRequirements')?.value || "Standard poster board only";

    const subject = `[TPI-ICV 2026 Poster] - ${piGroup} - ${title}`;
    const body = `Dear TPI-ICV 2026 Secretariat,

Please find our submission for the 2026 Joint Symposium on Foundation AI, Large Language Models, and Trusted Vehicular Interaction (TPI-ICV 2026).

--- SUBMISSION DETAILS ---
1. Research Title: ${title}
2. Primary Presenter / Author: ${presenter}
3. Laboratory PI Group / Department: ${piGroup}
4. Proposed Format: ${format}

--- STRUCTURED ABSTRACT ---
${abstractText}

--- DEMO / LOGISTICS SETUP REQUIREMENTS ---
${reqText}

--- ATTACHMENTS NOTE ---
Please find attached our:
- Poster Draft (Single-page A0 Portrait PDF: 841 mm × 1189 mm)
- 1-page Structured Summary Document

Sincerely,
${presenter}
${piGroup}
`;
    return { subject, body };
  }

  if (openMailBtn) {
    openMailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const { subject, body } = buildEmailPayload();
      const mailtoUrl = `mailto:xi.ai@nusricq.cn?cc=barid.x.ai@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });
  }

  if (copyDraftBtn) {
    copyDraftBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const { subject, body } = buildEmailPayload();
      const fullText = `TO: xi.ai@nusricq.cn\nCC: barid.x.ai@gmail.com\nSUBJECT: ${subject}\n\n${body}`;

      navigator.clipboard.writeText(fullText).then(() => {
        showToast(currentLang === 'zh' ? '提交邮件草稿与主题已复制到剪贴板！' : 'Email draft & subject copied to clipboard!');
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  }
}

// Participant Registration Portal Logic (Direct Online Submission + Mail/Receipt Helpers)
function initRegistrationPortal() {
  const form = document.getElementById('participantRegistrationForm');
  if (!form) return;

  const modeSelect = document.getElementById('regMode');
  const lunchSelect = document.getElementById('regLunch');
  const copyBtn = document.getElementById('copyRegTextBtn');
  const downloadBtn = document.getElementById('downloadRegReceiptBtn');
  const openMailBtn = document.getElementById('openRegMailBtn');
  const submitOnlineBtn = document.getElementById('submitRegOnlineBtn');
  const banner = document.getElementById('regConfirmationBanner');
  const summaryEl = document.getElementById('regConfirmationSummary');

  // Auto-sync lunch selection when switching between In-Person and Online
  if (modeSelect && lunchSelect) {
    modeSelect.addEventListener('change', () => {
      if (modeSelect.value.startsWith('Online')) {
        lunchSelect.selectedIndex = 2; // N/A - Online Participant
      } else if (lunchSelect.selectedIndex === 2) {
        lunchSelect.selectedIndex = 0; // Yes - Attending Networking Lunch
      }
    });
  }

  function buildRegistrationPayload() {
    const name = document.getElementById('regName')?.value.trim() || "Participant Name";
    const affiliation = document.getElementById('regAffiliation')?.value.trim() || "Affiliation / Unit";
    const mode = document.getElementById('regMode')?.value || "In-Person (Chongqing, NUSRI-CQ) / 线下现场参会";
    const count = Math.max(1, parseInt(document.getElementById('regCount')?.value || "1", 10) || 1);
    const email = document.getElementById('regEmail')?.value.trim() || "Not provided";
    const phone = document.getElementById('regPhone')?.value.trim() || "Not provided";
    const role = document.getElementById('regRole')?.value || "Research Fellow / Postdoctoral Researcher";
    const lunch = document.getElementById('regLunch')?.value || "Yes - Attending Networking Lunch";
    const notes = document.getElementById('regNotes')?.value.trim() || "None";

    const modeShort = mode.startsWith('Online') ? 'Online' : (mode.startsWith('Hybrid') ? 'Hybrid' : 'In-Person');
    const subject = `[TPI-ICV 2026 Registration] - ${modeShort} - ${affiliation} - ${name} (${count} Attendee${count > 1 ? 's' : ''})`;
    const body = `Dear TPI-ICV 2026 Symposium Secretariat,

Please find below our participant registration for the 2026 Joint Symposium on Foundation AI, Large Language Models, and Trusted Vehicular Interaction (TPI-ICV 2026, 12 Nov 2026).

--- PARTICIPANT REGISTRATION DETAILS ---
1. Participant / Contact Name: ${name}
2. Affiliation / Organization: ${affiliation}
3. Attendance Mode: ${mode}
4. Number of Attendees: ${count}
5. Participant Category / Role: ${role}
6. Contact Email: ${email}
7. Phone / WeChat: ${phone}
8. Networking Lunch (12:00-13:00): ${lunch}

--- OTHER INFORMATION & REMARKS ---
${notes}

Sincerely,
${name}
${affiliation}
`;

    const record = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      name,
      affiliation,
      mode,
      modeShort,
      count,
      role,
      email,
      phone,
      lunch,
      notes,
      subject,
      body
    };

    if (banner && summaryEl) {
      banner.classList.remove('hidden');
      summaryEl.textContent = `${name} (${affiliation}) · ${modeShort} · ${count} Attendee(s) · Lunch: ${lunch.split(' ')[0]}`;
    }

    return record;
  }

  function saveLocalRegistrationRecord(record) {
    try {
      const existing = JSON.parse(localStorage.getItem('tpi_registrations_log') || '[]');
      existing.push(record);
      localStorage.setItem('tpi_registrations_log', JSON.stringify(existing));
    } catch (err) {
      console.error('Local registration storage error:', err);
    }
  }

  // Direct Online Submission (Form submit)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const record = buildRegistrationPayload();
    saveLocalRegistrationRecord(record);

    const enLabel = document.getElementById('submitRegBtnLabelEn');
    const zhLabel = document.getElementById('submitRegBtnLabelZh');
    if (submitOnlineBtn) submitOnlineBtn.disabled = true;
    if (enLabel) enLabel.textContent = 'Submitting Online...';
    if (zhLabel) zhLabel.textContent = '正在在线提交...';

    const webhookUrl = (localStorage.getItem('tpi_webhook_url') || DEFAULT_REGISTRATION_WEBHOOK_URL || '').trim();
    let submittedOnline = false;

    // 1. If a Google Apps Script Web App URL is configured, post directly to it
    if (webhookUrl && webhookUrl.includes('script.google.com')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(record)
        });
        submittedOnline = true;
      } catch (err) {
        console.warn('Webhook submission warning:', err);
      }
    }

    // 2. Also post via FormSubmit AJAX endpoint to barid.x.ai@gmail.com & xi.ai@nusricq.cn
    try {
      const resp = await fetch('https://formsubmit.co/ajax/barid.x.ai@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: record.subject,
          _cc: 'xi.ai@nusricq.cn',
          _template: 'table',
          _captcha: 'false',
          Name: record.name,
          Affiliation: record.affiliation,
          Attendance_Mode: record.mode,
          Number_of_Attendees: record.count,
          Role: record.role,
          Email: record.email,
          Phone_WeChat: record.phone,
          Networking_Lunch: record.lunch,
          Other_Notes: record.notes
        })
      });
      if (resp.ok) {
        submittedOnline = true;
      }
    } catch (err) {
      console.warn('FormSubmit AJAX fallback note:', err);
    }

    if (submitOnlineBtn) submitOnlineBtn.disabled = false;
    if (enLabel) enLabel.textContent = 'Registered Online ✓';
    if (zhLabel) zhLabel.textContent = '在线报名成功 ✓';

    if (banner && summaryEl) {
      banner.classList.remove('hidden');
      summaryEl.textContent = submittedOnline
        ? (currentLang === 'zh'
          ? `✅ 已成功在线登记：${record.name} (${record.affiliation}) · ${record.modeShort} · 共 ${record.count} 人。`
          : `✅ Submitted online: ${record.name} (${record.affiliation}) · ${record.modeShort} · ${record.count} Attendee(s).`)
        : (currentLang === 'zh'
          ? `✅ 已在本地保存报名记录：${record.name} (${record.affiliation}) · 共 ${record.count} 人（建议同时点击“邮件客户端”或“下载回执”备份）。`
          : `✅ Saved registration: ${record.name} (${record.affiliation}) · ${record.count} Attendee(s).`);
    }

    showToast(
      currentLang === 'zh'
        ? `参会报名已提交（${record.name}，共 ${record.count} 人）！`
        : `Registration submitted online (${record.name}, ${record.count} attendee(s))!`
    );

    setTimeout(() => {
      if (enLabel) enLabel.textContent = 'Submit Registration Online';
      if (zhLabel) zhLabel.textContent = '一键在线提交报名';
    }, 4000);
  });

  // Secondary button: Open in Mail Client
  if (openMailBtn) {
    openMailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const record = buildRegistrationPayload();
      saveLocalRegistrationRecord(record);
      const mailtoUrl = `mailto:xi.ai@nusricq.cn?cc=barid.x.ai@gmail.com&subject=${encodeURIComponent(record.subject)}&body=${encodeURIComponent(record.body)}`;
      window.location.href = mailtoUrl;
      showToast(currentLang === 'zh' ? '正在打开邮件客户端...' : 'Opening mail client...');
    });
  }

  // Copy registration text to clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const record = buildRegistrationPayload();
      saveLocalRegistrationRecord(record);
      const fullText = `TO: xi.ai@nusricq.cn\nCC: barid.x.ai@gmail.com\nSUBJECT: ${record.subject}\n\n${record.body}`;
      navigator.clipboard.writeText(fullText).then(() => {
        showToast(currentLang === 'zh' ? '参会报名信息已复制到剪贴板！' : 'Registration details copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy registration text:', err);
      });
    });
  }

  // Download registration receipt (.txt)
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const record = buildRegistrationPayload();
      saveLocalRegistrationRecord(record);
      const receiptContent = `================================================================\nTPI-ICV 2026 SYMPOSIUM REGISTRATION RECEIPT\nDate: 12 Nov 2026 (09:00 - 16:00 UTC+8)\nSecretariat: xi.ai@nusricq.cn (CC: barid.x.ai@gmail.com)\n================================================================\n\nSUBJECT: ${record.subject}\n\n${record.body}`;
      const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = record.name.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5-]+/g, '_');
      link.setAttribute('download', `TPI-ICV-2026-Registration-${safeName}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(currentLang === 'zh' ? '参会报名回执单 (.txt) 已下载！' : 'Registration receipt (.txt) downloaded!');
    });
  }
}

// Secretariat Headcount & CSV Roster Exporter Modal
function initSecretariatTallyModal() {
  const modal = document.getElementById('secretariatTallyModal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('.open-tally-modal-btn');
  const closeBtns = document.querySelectorAll('.close-tally-modal-btn');
  const webhookInput = document.getElementById('tallyWebhookInput');
  const syncCloudBtn = document.getElementById('syncCloudSheetBtn');
  const pasteInput = document.getElementById('tallyPasteInput');
  const parseBtn = document.getElementById('parseTallyBtn');
  const clearBtn = document.getElementById('clearTallyBtn');
  const exportCsvBtn = document.getElementById('exportTallyCsvBtn');

  const totalEl = document.getElementById('tallyTotalAttendees');
  const inPersonEl = document.getElementById('tallyInPersonAttendees');
  const onlineEl = document.getElementById('tallyOnlineAttendees');
  const lunchEl = document.getElementById('tallyLunchAttendees');
  const statusEl = document.getElementById('tallyStatusText');
  const tableBody = document.getElementById('tallyTableBody');

  let currentRoster = [];

  if (webhookInput) {
    webhookInput.value = localStorage.getItem('tpi_webhook_url') || DEFAULT_REGISTRATION_WEBHOOK_URL || '';
    webhookInput.addEventListener('change', () => {
      localStorage.setItem('tpi_webhook_url', webhookInput.value.trim());
    });
  }

  function renderRosterAndCounts(records) {
    currentRoster = records;
    let totalAttendees = 0;
    let inPersonAttendees = 0;
    let onlineAttendees = 0;
    let lunchAttendees = 0;

    records.forEach(r => {
      const c = Math.max(1, parseInt(r.count, 10) || 1);
      totalAttendees += c;
      const modeStr = String(r.mode || r.modeShort || '');
      if (modeStr.toLowerCase().includes('online') || modeStr.toLowerCase().includes('hybrid') || modeStr.includes('线上') || modeStr.includes('混合')) {
        onlineAttendees += c;
      } else {
        inPersonAttendees += c;
      }
      const lunchStr = String(r.lunch || '');
      if (lunchStr.toLowerCase().startsWith('yes') || lunchStr.includes('参加交流午餐')) {
        lunchAttendees += c;
      }
    });

    if (totalEl) totalEl.textContent = String(totalAttendees);
    if (inPersonEl) inPersonEl.textContent = String(inPersonAttendees);
    if (onlineEl) onlineEl.textContent = String(onlineAttendees);
    if (lunchEl) lunchEl.textContent = String(lunchAttendees);
    if (statusEl) {
      statusEl.textContent = `${records.length} registration group(s) · ${totalAttendees} total attendee(s) (${inPersonAttendees} In-Person, ${onlineAttendees} Online/Hybrid, ${lunchAttendees} Lunch).`;
    }

    if (tableBody) {
      if (records.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="py-4 text-center text-slate-400">No registration records loaded yet.</td></tr>`;
      } else {
        tableBody.innerHTML = records.map((r, idx) => `
          <tr class="hover:bg-slate-50">
            <td class="py-2 px-3 font-mono text-slate-500">${idx + 1}</td>
            <td class="py-2 px-3 font-bold text-slate-900">${escapeHtml(r.name || '')}</td>
            <td class="py-2 px-3">${escapeHtml(r.affiliation || '')}</td>
            <td class="py-2 px-3 font-mono">${escapeHtml(r.modeShort || r.mode || '')}</td>
            <td class="py-2 px-3 font-mono font-bold text-[#003D7C]">${Math.max(1, parseInt(r.count, 10) || 1)}</td>
            <td class="py-2 px-3">${escapeHtml((r.lunch || '').split('—')[0].split('-')[0].trim())}</td>
            <td class="py-2 px-3 font-mono text-[10px]">${escapeHtml(r.email || '')}${r.phone && r.phone !== 'Not provided' ? ' / ' + escapeHtml(r.phone) : ''}</td>
          </tr>
        `).join('');
      }
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function parseCsvTextToRecords(csvText) {
    const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return [];
    const parsedRows = [];

    for (let i = 0; i < lines.length; i++) {
      // Parse CSV fields respecting quotes
      const cols = [];
      let cur = '';
      let inQuotes = false;
      const line = lines[i];
      for (let c = 0; c < line.length; c++) {
        const ch = line[c];
        if (ch === '"') {
          if (inQuotes && line[c + 1] === '"') {
            cur += '"';
            c++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === ',' && !inQuotes) {
          cols.push(cur.trim());
          cur = '';
        } else {
          cur += ch;
        }
      }
      cols.push(cur.trim());

      // Skip header row
      const firstColLower = (cols[0] || '').toLowerCase();
      const secondColLower = (cols[1] || '').toLowerCase();
      if (i === 0 && (firstColLower.includes('timestamp') || firstColLower.includes('name') || secondColLower === 'name' || firstColLower.includes('姓名'))) {
        continue;
      }

      // Support either 10-column sheet [Timestamp, Name, Affiliation, Mode, Count, Role, Email, Phone, Lunch, Notes]
      // or 5+ column manual sheet [Name, Affiliation, Mode, Count, ...]
      let record;
      if (cols.length >= 8 && /\d{4}/.test(cols[0])) {
        record = {
          timestamp: cols[0] || '',
          name: cols[1] || '',
          affiliation: cols[2] || '',
          mode: cols[3] || 'In-Person',
          count: Math.max(1, parseInt(cols[4], 10) || 1),
          role: cols[5] || '',
          email: cols[6] || '',
          phone: cols[7] || '',
          lunch: cols[8] || 'Yes',
          notes: cols[9] || ''
        };
      } else {
        record = {
          timestamp: '',
          name: cols[0] || '',
          affiliation: cols[1] || '',
          mode: cols[2] || 'In-Person',
          count: Math.max(1, parseInt(cols[3], 10) || 1),
          role: cols[4] || '',
          email: cols[5] || '',
          phone: cols[6] || '',
          lunch: cols[7] || 'Yes',
          notes: cols[8] || ''
        };
      }
      if (record.name || record.affiliation) {
        parsedRows.push(record);
      }
    }
    return parsedRows;
  }

  async function syncFromCloudOrLocal(showFeedback = false) {
    const local = (() => {
      try {
        return JSON.parse(localStorage.getItem('tpi_registrations_log') || '[]');
      } catch (e) {
        return [];
      }
    })();

    const rawUrl = (webhookInput?.value || localStorage.getItem('tpi_webhook_url') || DEFAULT_REGISTRATION_WEBHOOK_URL || '').trim();
    if (!rawUrl) {
      renderRosterAndCounts(local);
      return;
    }

    localStorage.setItem('tpi_webhook_url', rawUrl);

    try {
      if (statusEl) statusEl.textContent = 'Syncing from Google Sheet...';

      // Case 1: Direct Google Sheets URL (https://docs.google.com/spreadsheets/d/<ID>/...)
      const sheetMatch = rawUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (sheetMatch) {
        const sheetId = sheetMatch[1];
        const csvEndpoint = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
        const res = await fetch(csvEndpoint);
        if (res.ok) {
          const csvText = await res.text();
          const sheetRows = parseCsvTextToRecords(csvText);
          const combined = [...sheetRows, ...local];
          renderRosterAndCounts(combined);
          if (showFeedback) {
            showToast(
              currentLang === 'zh'
                ? `已从 Google 表格同步 ${sheetRows.length} 条云端记录（合并本地共 ${combined.length} 条）！`
                : `Synced ${sheetRows.length} row(s) from Google Sheet (${combined.length} total)!`
            );
          }
          return;
        }
      }

      // Case 2: Google Apps Script Web App URL (https://script.google.com/macros/s/.../exec)
      const res = await fetch(rawUrl);
      const data = await res.json();
      if (data && Array.isArray(data.rows)) {
        renderRosterAndCounts(data.rows);
        if (showFeedback) {
          showToast(currentLang === 'zh' ? '云端参会名单同步成功！' : 'Cloud participant roster synced!');
        }
        return;
      }
    } catch (err) {
      console.warn('Cloud sheet sync note:', err);
      if (showFeedback) {
        showToast(currentLang === 'zh' ? '已加载本地缓存记录（云端表格当前为空或受跨域限制）。' : 'Loaded local records.');
      }
    }

    renderRosterAndCounts(local);
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      syncFromCloudOrLocal(false);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  // Sync from Cloud Google Sheet / Web App URL
  if (syncCloudBtn) {
    syncCloudBtn.addEventListener('click', () => {
      syncFromCloudOrLocal(true);
    });
  }

  // Parse pasted emails / subject lines / structured text
  if (parseBtn) {
    parseBtn.addEventListener('click', () => {
      const raw = (pasteInput?.value || '').trim();
      if (!raw) {
        loadLocalRecords();
        return;
      }

      const parsed = [];
      // 1. Parse structured blocks ("--- PARTICIPANT REGISTRATION DETAILS ---")
      const blockRegex = /1\.\s*Participant\s*\/\s*Contact Name:\s*(.+)\r?\n2\.\s*Affiliation\s*\/\s*Organization:\s*(.+)\r?\n3\.\s*Attendance Mode:\s*(.+)\r?\n4\.\s*Number of Attendees:\s*(\d+)\r?\n5\.\s*Participant Category\s*\/\s*Role:\s*(.+)\r?\n6\.\s*Contact Email:\s*(.+)\r?\n7\.\s*Phone\s*\/\s*WeChat:\s*(.+)\r?\n8\.\s*Networking Lunch[^:]*:\s*(.+)/gi;
      let match;
      while ((match = blockRegex.exec(raw)) !== null) {
        const modeVal = match[3].trim();
        parsed.push({
          name: match[1].trim(),
          affiliation: match[2].trim(),
          mode: modeVal,
          modeShort: modeVal.startsWith('Online') ? 'Online' : (modeVal.startsWith('Hybrid') ? 'Hybrid' : 'In-Person'),
          count: parseInt(match[4].trim(), 10) || 1,
          role: match[5].trim(),
          email: match[6].trim(),
          phone: match[7].trim(),
          lunch: match[8].trim(),
          notes: ''
        });
      }

      // 2. Also parse standalone subject lines if user pasted subject list:
      // [TPI-ICV 2026 Registration] - In-Person - NUS - Dr. Jane Doe (3 Attendees)
      if (parsed.length === 0) {
        const subjRegex = /\[TPI-ICV 2026 Registration\]\s*-\s*([^-]+)-\s*([^-]+)-\s*([^\(\r\n]+)\((\d+)\s*Attendee/gi;
        let sm;
        while ((sm = subjRegex.exec(raw)) !== null) {
          const modeShort = sm[1].trim();
          parsed.push({
            name: sm[3].trim(),
            affiliation: sm[2].trim(),
            mode: modeShort,
            modeShort: modeShort,
            count: parseInt(sm[4].trim(), 10) || 1,
            role: '',
            email: '',
            phone: '',
            lunch: modeShort === 'Online' ? 'No' : 'Yes',
            notes: ''
          });
        }
      }

      const local = JSON.parse(localStorage.getItem('tpi_registrations_log') || '[]');
      const combined = [...local, ...parsed];
      renderRosterAndCounts(combined);
      showToast(
        currentLang === 'zh'
          ? `已成功解析并汇总 ${combined.length} 条报名记录！`
          : `Parsed and tallied ${combined.length} registration record(s)!`
      );
    });
  }

  // Clear local & pasted tally
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('tpi_registrations_log');
      if (pasteInput) pasteInput.value = '';
      renderRosterAndCounts([]);
      showToast(currentLang === 'zh' ? '本地参会统计记录已清空。' : 'Cleared registration tally records.');
    });
  }

  // Export CSV Roster (UTF-8 with BOM for Excel compatibility)
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      if (currentRoster.length === 0) {
        showToast(currentLang === 'zh' ? '当前没有可导出的报名记录！' : 'No registration records to export!');
        return;
      }
      const headers = ['No.', 'Timestamp', 'Name', 'Affiliation', 'Attendance Mode', 'Number of Attendees', 'Role', 'Email', 'Phone / WeChat', 'Networking Lunch', 'Other Notes'];
      const csvRows = [headers.join(',')];

      currentRoster.forEach((r, idx) => {
        const row = [
          idx + 1,
          r.timestamp || '',
          r.name || '',
          r.affiliation || '',
          r.mode || r.modeShort || '',
          Math.max(1, parseInt(r.count, 10) || 1),
          r.role || '',
          r.email || '',
          r.phone || '',
          r.lunch || '',
          (r.notes || '').replace(/\r?\n/g, ' ')
        ].map(val => `"${String(val).replace(/"/g, '""')}"`);
        csvRows.push(row.join(','));
      });

      const csvContent = '\uFEFF' + csvRows.join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'TPI-ICV-2026-Participants-Roster.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(currentLang === 'zh' ? '参会签到表 (.csv) 已导出！' : 'Participant roster (.csv) exported!');
    });
  }
}

// iCalendar (.ics) RFC 5545 Generator
function initCalendarExport() {
  const exportBtns = document.querySelectorAll('.export-ics-btn');

  exportBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      generateAndDownloadICS();
    });
  });
}

function generateAndDownloadICS() {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NUSRI-CQ//TPI-ICV 2026 Symposium//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:TPI-ICV 2026 Academic Symposium",
    "X-WR-TIMEZONE:Asia/Chongqing",
    "BEGIN:VEVENT",
    "UID:tpi-icv-2026-full-symposium@nusri.cn",
    "DTSTAMP:20261010T080000Z",
    "DTSTART;TZID=Asia/Chongqing:20261112T090000",
    "DTEND;TZID=Asia/Chongqing:20261112T160000",
    "SUMMARY:The 2026 Joint Symposium on Foundation AI, Large Language Models, and Trusted Vehicular Interaction (TPI-ICV 2026)",
    "DESCRIPTION:Joint academic milestone symposium co-hosted by NUSRI-CQ and Chongqing Key Laboratory of Trusted Perception and Interaction Technology for ICV. Features Keynotes, Academic Posters, Live Demos, and Plenary Sessions.",
    "LOCATION:Chongqing, China / National University of Singapore (Chongqing) Research Institute (NUSRI-CQ)",
    "ORGANIZER;CN=TPI-ICV Secretariat:mailto:xi.ai@nusricq.cn",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'TPI-ICV-2026-Symposium.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast(currentLang === 'zh' ? '研讨会日历日程 (.ics) 文件已下载！' : 'Symposium iCalendar (.ics) downloaded!');
}

// Mobile Hamburger Menu
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// Scrollspy for active navigation links
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-[#003D7C]', 'font-bold');
      link.classList.add('text-slate-700');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('text-[#003D7C]', 'font-bold');
        link.classList.remove('text-slate-700');
      }
    });
  });
}

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-[#003D7C] text-white font-medium shadow-2xl transition-all duration-300 transform translate-y-10 opacity-0 flex items-center space-x-2 border border-blue-400/40';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg class="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.remove('translate-y-10', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3500);
}

// Global copy helper
window.copyToClipboard = function(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${label} copied to clipboard!`);
  }).catch(err => {
    console.error('Failed to copy', err);
  });
};

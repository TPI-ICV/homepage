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

// Translations Dictionary for Dynamic Components
const translations = {
  en: {
    heroTag: "Joint Academic Milestone Symposium & Poster Exhibition",
    dateTbd: "Date: TBD · Chongqing, China / Hybrid",
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
    dateTbd: "时间：待定 (TBD) · 中国·重庆 / 线上线下结合",
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
      const mailtoUrl = `mailto:xi.ai@nusri.cn,xiaohong.liu@nusri.cn?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });
  }

  if (copyDraftBtn) {
    copyDraftBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const { subject, body } = buildEmailPayload();
      const fullText = `TO: xi.ai@nusri.cn, xiaohong.liu@nusri.cn\nSUBJECT: ${subject}\n\n${body}`;

      navigator.clipboard.writeText(fullText).then(() => {
        showToast(currentLang === 'zh' ? '提交邮件草稿与主题已复制到剪贴板！' : 'Email draft & subject copied to clipboard!');
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
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
    "DTSTART;TZID=Asia/Chongqing:20261118T083000",
    "DTEND;TZID=Asia/Chongqing:20261118T200000",
    "SUMMARY:The 2026 Joint Symposium on Foundation AI, Large Language Models, and Trusted Vehicular Interaction (TPI-ICV 2026)",
    "DESCRIPTION:Joint academic milestone symposium co-hosted by NUSRI-CQ and Chongqing Key Laboratory of Trusted Perception and Interaction Technology for ICV. Features Keynotes, Academic Posters, Live Demos, and Plenary Sessions.",
    "LOCATION:Chongqing, China / National University of Singapore (Chongqing) Research Institute (NUSRI-CQ)",
    "ORGANIZER;CN=TPI-ICV Secretariat:mailto:xi.ai@nusri.cn",
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

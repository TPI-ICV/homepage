# TPI-ICV 2026 Academic Symposium Website

> **The 2026 Joint Symposium on Foundation AI, Large Language Models, and Trusted Vehicular Interaction (TPI-ICV 2026)**  
> **2026年大模型与智能网联汽车可信感知交互联合学术研讨会暨成果海报展**

Co-hosted by:
- **National University of Singapore (Chongqing) Research Institute (NUSRI-CQ / 重庆新国大研究院)**
- **Chongqing Key Laboratory of Trusted Perception and Interaction Technology for Intelligent and Connected Vehicles (智能网联汽车可信感知交互技术重庆市重点实验室)**
- Strategic collaboration with **Changan Automobile Forward-looking Technology Research Institute (长安汽车前瞻技术研究院)**

---

## 📬 Official Submission Instructions

All participating laboratory teams and R&D engineers must submit academic posters and interactive system demos **only** to:
- **Primary Recipient (TO):** `xi.ai@nusricq.cn`
- **Carbon Copy (CC):** `barid.x.ai@gmail.com`
- **Standardized Subject Syntax:** `[TPI-ICV 2026 Poster] - PI Group / Unit - Topic`

---

## 🌟 Key Features

- **GitHub Pages Native Architecture**: Pure static modern web standards (HTML5, Tailwind CSS via CDN, modern ES6+ JavaScript, KaTeX for mathematical typesetting). Zero build step required.
- **Academic Light Theme**: Clean academic aesthetic with official NUS Heritage Blue accents (`#003D7C`), off-white backdrop (`#F8FAFC`), and subtle geometric mesh.
- **Bilingual Interface (English / 中文)**: Instant bilingual toggle supporting all overview text, themes, schedules, and committee profiles.
- **Interactive Call for Posters & Demos**:
  - Live modal submission composer.
  - Generates standardized submission subject: `[TPI-ICV 2026 Poster] - PI Group / Unit - Topic`.
  - One-click `mailto:` launch and copy-to-clipboard functionality pre-configured to `xi.ai@nusricq.cn` (cc: `barid.x.ai@gmail.com`).
- **1-Day Program Schedule Timeline**:
  - Filterable by session categories (All, Keynotes, Posters & Demos, Plenary & Panels, Networking).
  - RFC 5545 `.ics` iCalendar export for calendar integration (Apple Calendar, Google Calendar, Outlook).
- **Mathematical Fidelity**: Direct KaTeX rendering for battery energy density, areal capacity, and tensile strength criteria:
  $$\text{Energy Density} \ge 100\text{ Wh/kg}, \quad \text{Areal Capacity} \ge 1.5\text{ kWh/m}^2, \quad \text{Tensile Strength} \ge 300\text{ MPa}$$
- **Full Governance & Committee Roster**:
  - Steering & Management Committee (Co-Chairs, Vice-Chairs, Members).
  - Academic Advisory Committee (Scholars from A*STAR, Academy of Europe, Beihang, NTU, NUS, BIT, Changan).
  - Executive Leadership, Secretariat, and 11+ Laboratory Principal Investigators (PIs).
- **Print & PDF Export Ready**: Integrated `@media print` CSS stylesheet for printing or saving conference brochures and call for posters.

---

## 📁 Repository Structure

```text
.
├── 2026_Joint_Symposium_on_Foundation_AI.docx  # Source symposium document
├── index.html                                 # Single-page symposium web application
├── .nojekyll                                  # GitHub Pages Jekyll bypass flag
├── assets/
│   ├── css/
│   │   └── styles.css                         # Custom theme, typography, KaTeX & print styles
│   ├── js/
│   │   └── app.js                             # Bilingual state, schedule filtering, mailto & .ics generator
│   └── images/
│       ├── logo.svg                           # TPI-ICV 2026 vector emblem
│       ├── nusri-cq.svg                       # NUSRI-CQ institutional vector badge
│       └── keylab.svg                         # Chongqing Key Laboratory & Changan badge
└── README.md                                  # Repository documentation
```

---

## 🚀 Live Deployments

- **Official Production Site**: [https://tpi-icv.github.io/homepage/](https://tpi-icv.github.io/homepage/)
- **Fork Preview Site**: [https://baridxiai.github.io/homepage/](https://baridxiai.github.io/homepage/)

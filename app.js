/**
 * 企業生成式 AI 工具使用現況與導入需求調查 — 前端邏輯與 MIS 統計後台
 * 主辦單位：資訊管理單位（MIS）
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. 系統設定區（MIS 可依需求調整雲端 API 網址或管理員通行碼雜湊）
     ========================================================================== */
  const CONFIG = {
    storageKey: 'mis_ai_survey_records_v1',
    // 預設管理員通行碼之 SHA-256 雜湊值（詳見 README.md 管理說明；未來串接後端時改由伺服器驗證）
    adminPasscodeSha256: '33c57a2b84461562b22cd55ea1b2d1a7d4384fffc15d496788cb14920aff6f51',
    // 預留雲端串接網址（例如 Google Apps Script Web App URL）；空白時採本機儲存模式
    cloudEndpointUrl: '',
    officialDepartments: [
      '董事長室', '總經理室',
      '行政部', '會計部', '財務部', '業務部',
      '工程一部', '製造一部', '品保一部', '資材一部',
      '工程三部', '製造三部', '品保三部', '資材三部'
    ],
    coreTools: ['ChatGPT', 'Claude', 'Gemini', 'Microsoft 365 Copilot']
  };

  /* ==========================================================================
     2. 內建 16 筆擬真預覽範例資料（涵蓋各實際部門，供 MIS 預覽統計報表效果）
     ========================================================================== */
  const DEMO_RECORDS = [
    {
      id: 'DEMO-001',
      submittedAt: '2026-11-24 09:12',
      isDemo: true,
      department: '董事長室',
      employeeName: '林雅筑（範例）',
      currentlyUsing: true,
      currentTools: [{ tool: 'ChatGPT', tier: '付費版（個人自費）' }],
      requestedTools: ['ChatGPT', 'Claude'],
      frequency: '每日重度使用（每天多次）',
      useCases: ['會議紀錄、公文與簡報整理', '合約條款審閱、法規比對與長文摘要'],
      notes: '經常需要整理高階經營會議重點與產業報告摘要，個人自費版希望轉公司帳號。'
    },
    {
      id: 'DEMO-002',
      submittedAt: '2026-11-24 09:35',
      isDemo: true,
      department: '總經理室',
      employeeName: '陳建宏（範例）',
      currentlyUsing: true,
      currentTools: [
        { tool: 'Claude', tier: '免費版' },
        { tool: 'Gemini', tier: '免費版' }
      ],
      requestedTools: ['Claude', 'Gemini'],
      frequency: '經常使用（每週 3～4 天）',
      useCases: ['會議紀錄、公文與簡報整理', 'Excel 公式與生產／資材／財會數據分析'],
      notes: 'Claude 免費版長文額度很容易滿，希望能有企業版分析各廠月報。'
    },
    {
      id: 'DEMO-003',
      submittedAt: '2026-11-24 10:08',
      isDemo: true,
      department: '工程一部',
      employeeName: '張哲瑋（範例）',
      currentlyUsing: true,
      currentTools: [
        { tool: 'Claude', tier: '付費版（個人自費）' },
        { tool: 'ChatGPT', tier: '免費版' }
      ],
      requestedTools: ['Claude', '其他：GitHub Copilot'],
      frequency: '每日重度使用（每天多次）',
      useCases: ['工程技術文件檢索、研發與程式腳本', '信件撰寫與跨國語文翻譯'],
      notes: '撰寫自動化測試腳本與查閱國外規格書每天都會用到。'
    },
    {
      id: 'DEMO-004',
      submittedAt: '2026-11-24 10:42',
      isDemo: true,
      department: '工程三部',
      employeeName: '許家豪（範例）',
      currentlyUsing: true,
      currentTools: [{ tool: 'ChatGPT', tier: '免費版' }],
      requestedTools: ['ChatGPT', 'Claude'],
      frequency: '每日重度使用（每天多次）',
      useCases: ['工程技術文件檢索、研發與程式腳本', 'Excel 公式與生產／資材／財會數據分析'],
      notes: '不敢把內部製程參數貼到免費版，希望能導入有資安保障的商用版。'
    },
    {
      id: 'DEMO-005',
      submittedAt: '2026-11-24 11:15',
      isDemo: true,
      department: '業務部',
      employeeName: '吳佩珊（範例）',
      currentlyUsing: true,
      currentTools: [
        { tool: 'ChatGPT', tier: '付費版（個人自費）' },
        { tool: 'Microsoft 365 Copilot', tier: '付費版（公司既有授權）' }
      ],
      requestedTools: ['ChatGPT', 'Microsoft 365 Copilot'],
      frequency: '每日重度使用（每天多次）',
      useCases: ['信件撰寫與跨國語文翻譯', '會議紀錄、公文與簡報整理'],
      notes: '每日回覆歐美與日本客戶英文／日文開發信，翻譯與潤稿需求極大。'
    },
    {
      id: 'DEMO-006',
      submittedAt: '2026-11-24 13:20',
      isDemo: true,
      department: '品保一部',
      employeeName: '黃詩涵（範例）',
      currentlyUsing: true,
      currentTools: [{ tool: 'ChatGPT', tier: '免費版' }],
      requestedTools: ['Claude', 'ChatGPT'],
      frequency: '經常使用（每週 3～4 天）',
      useCases: ['品保異常分析報告與 SOP 規範編修', '信件撰寫與跨國語文翻譯'],
      notes: '回覆客戶英文 8D 異常改善報告與核對 ISO 規範條文很需要長文比對工具。'
    },
    {
      id: 'DEMO-007',
      submittedAt: '2026-11-24 14:05',
      isDemo: true,
      department: '品保三部',
      employeeName: '劉冠廷（範例）',
      currentlyUsing: false,
      currentTools: [],
      requestedTools: ['ChatGPT'],
      frequency: '偶爾使用（每週 1～2 次）',
      useCases: ['品保異常分析報告與 SOP 規範編修'],
      notes: '希望能有公司核准的工具協助整理檢驗標準書（SIP／SOP）。'
    },
    {
      id: 'DEMO-008',
      submittedAt: '2026-11-24 14:48',
      isDemo: true,
      department: '製造一部',
      employeeName: '蔡明憲（範例）',
      currentlyUsing: true,
      currentTools: [{ tool: 'Gemini', tier: '免費版' }],
      requestedTools: ['ChatGPT', 'Gemini'],
      frequency: '經常使用（每週 3～4 天）',
      useCases: ['Excel 公式與生產／資材／財會數據分析', '會議紀錄、公文與簡報整理'],
      notes: '產線日報與稼動率 Excel 公式除錯常需要 AI 幫忙。'
    },
    {
      id: 'DEMO-009',
      submittedAt: '2026-11-24 15:30',
      isDemo: true,
      department: '製造三部',
      employeeName: '鄭志偉（範例）',
      currentlyUsing: false,
      currentTools: [],
      requestedTools: ['暫無需求'],
      frequency: '暫無使用需求',
      useCases: ['暫無特定用途'],
      notes: '現場作業以 ERP 系統報工為主，目前暫無需求。'
    },
    {
      id: 'DEMO-010',
      submittedAt: '2026-11-24 16:10',
      isDemo: true,
      department: '資材一部',
      employeeName: '楊雅雯（範例）',
      currentlyUsing: true,
      currentTools: [{ tool: 'ChatGPT', tier: '免費版' }],
      requestedTools: ['ChatGPT'],
      frequency: '經常使用（每週 3～4 天）',
      useCases: ['Excel 公式與生產／資材／財會數據分析', '信件撰寫與跨國語文翻譯'],
      notes: '常需比對供應商交期料表（VBA／樞紐公式）與催料英文信件。'
    },
    {
      id: 'DEMO-011',
      submittedAt: '2026-11-25 09:05',
      isDemo: true,
      department: '資材三部',
      employeeName: '謝宗翰（範例）',
      currentlyUsing: false,
      currentTools: [],
      requestedTools: ['ChatGPT'],
      frequency: '視專案需求不定期使用',
      useCases: ['Excel 公式與生產／資材／財會數據分析'],
      notes: '月底盤點對帳時希望用來寫複雜 VLOOKUP / XLOOKUP 公式。'
    },
    {
      id: 'DEMO-012',
      submittedAt: '2026-11-25 10:18',
      isDemo: true,
      department: '會計部',
      employeeName: '周怡君（範例）',
      currentlyUsing: true,
      currentTools: [{ tool: 'Claude', tier: '免費版' }],
      requestedTools: ['Claude', 'ChatGPT'],
      frequency: '經常使用（每週 3～4 天）',
      useCases: ['Excel 公式與生產／資材／財會數據分析', '合約條款審閱、法規比對與長文摘要'],
      notes: '財稅法規解釋令查詢與傳票異常勾稽很實用，但帳務資料需要高度保密版本。'
    },
    {
      id: 'DEMO-013',
      submittedAt: '2026-11-25 11:02',
      isDemo: true,
      department: '財務部',
      employeeName: '王柏鈞（範例）',
      currentlyUsing: true,
      currentTools: [{ tool: 'ChatGPT', tier: '付費版（個人自費）' }],
      requestedTools: ['ChatGPT', 'Claude'],
      frequency: '每日重度使用（每天多次）',
      useCases: ['合約條款審閱、法規比對與長文摘要', 'Excel 公式與生產／資材／財會數據分析'],
      notes: '審閱銀行授信合約與匯率避險研究報告經常使用。'
    },
    {
      id: 'DEMO-014',
      submittedAt: '2026-11-25 13:45',
      isDemo: true,
      department: '行政部',
      employeeName: '洪佳玲（範例）',
      currentlyUsing: true,
      currentTools: [{ tool: 'ChatGPT', tier: '免費版' }],
      requestedTools: ['ChatGPT'],
      frequency: '經常使用（每週 3～4 天）',
      useCases: ['會議紀錄、公文與簡報整理', '合約條款審閱、法規比對與長文摘要'],
      notes: '撰寫內部公告辦法、教育訓練講義大綱與承攬合約初審。'
    },
    {
      id: 'DEMO-015',
      submittedAt: '2026-11-25 15:12',
      isDemo: true,
      department: '工程一部',
      employeeName: '郭俊宏（範例）',
      currentlyUsing: true,
      currentTools: [{ tool: '其他：Perplexity', tier: '免費版' }],
      requestedTools: ['Claude', 'Gemini'],
      frequency: '每日重度使用（每天多次）',
      useCases: ['工程技術文件檢索、研發與程式腳本'],
      notes: '常需一次翻閱好幾份數百頁 IC Datasheet PDF，Gemini 超長視窗很有幫助。'
    },
    {
      id: 'DEMO-016',
      submittedAt: '2026-11-25 16:40',
      isDemo: true,
      department: '業務部',
      employeeName: '曾雅婷（範例）',
      currentlyUsing: true,
      currentTools: [{ tool: 'ChatGPT', tier: '免費版' }],
      requestedTools: ['ChatGPT', 'Claude'],
      frequency: '每日重度使用（每天多次）',
      useCases: ['信件撰寫與跨國語文翻譯', '合約條款審閱、法規比對與長文摘要'],
      notes: '客戶 NDA 與採購合約英文條款希望能用公司授權版快速比對風險。'
    }
  ];

  /* ==========================================================================
     3. 純前端相容 SHA-256 工具（同時支援 HTTPS / localhost 與本機 file:// 開啟）
     ========================================================================== */
  async function sha256Hex(message) {
    if (window.isSecureContext && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    // 非安全上下文（如直接雙擊本機 file:// 預覽時）之標準 SHA-256 純 JS 實作
    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    const rotr = (n, x) => (x >>> n) | (x << (32 - n));
    const bytes = Array.from(new TextEncoder().encode(message));
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) bytes.push(0);
    const hi = Math.floor(bitLen / 0x100000000);
    const lo = bitLen >>> 0;
    for (let i = 3; i >= 0; i--) bytes.push((hi >>> (i * 8)) & 0xff);
    for (let i = 3; i >= 0; i--) bytes.push((lo >>> (i * 8)) & 0xff);

    let [h0, h1, h2, h3, h4, h5, h6, h7] = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const w = new Array(64);
    for (let i = 0; i < bytes.length; i += 64) {
      for (let t = 0; t < 16; t++) {
        const j = i + t * 4;
        w[t] = ((bytes[j] << 24) | (bytes[j + 1] << 16) | (bytes[j + 2] << 8) | bytes[j + 3]) >>> 0;
      }
      for (let t = 16; t < 64; t++) {
        const s0 = rotr(7, w[t - 15]) ^ rotr(18, w[t - 15]) ^ (w[t - 15] >>> 3);
        const s1 = rotr(17, w[t - 2]) ^ rotr(19, w[t - 2]) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, h] = [h0, h1, h2, h3, h4, h5, h6, h7];
      for (let t = 0; t < 64; t++) {
        const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + K[t] + w[t]) >>> 0;
        const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + temp1) >>> 0;
        d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
      }
      h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
    }
    return [h0, h1, h2, h3, h4, h5, h6, h7].map((v) => v.toString(16).padStart(8, '0')).join('');
  }

  /* ==========================================================================
     4. 無障礙驗證與 ARIA 同步工具（遵循 validate-input-after-interaction）
     ========================================================================== */
  const linkError = (el, shown) => {
    const errorId = el.dataset?.error;
    if (!errorId) return;
    const ids = (el.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  };

  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.classList.add('visually-hidden');
  document.body.append(announcer);
  let announceTimer;
  let announcedField;

  const spokenText = (node) => {
    const copy = node.cloneNode(true);
    copy.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    copy.querySelectorAll('[role="img"][aria-label]').forEach((n) => {
      n.replaceWith(`${n.getAttribute('aria-label')}: `);
    });
    return copy.textContent.replace(/\s+/g, ' ').trim();
  };

  const announceError = (el) => {
    const error = document.getElementById(el.dataset.error);
    if (!error) return;
    const label = el.labels?.[0] ? `${spokenText(el.labels[0])}: ` : '';
    clearTimeout(announceTimer);
    announcer.textContent = '';
    announcedField = el;
    announceTimer = setTimeout(() => {
      announcer.textContent = label + spokenText(error);
    }, 500);
  };

  const flagged = new WeakSet();
  const announced = new WeakSet();
  const supportsUserInvalid = CSS.supports('selector(:user-invalid)');

  const syncAria = (el, announce = false) => {
    if (!el.matches?.('input, select, textarea')) return;
    const invalid = supportsUserInvalid
      ? el.matches(':user-invalid')
      : el.classList.contains('user-invalid-fallback');

    if (invalid) {
      if (announce && !announced.has(el)) {
        announceError(el);
        announced.add(el);
      }
      el.setAttribute('aria-invalid', 'true');
      linkError(el, true);
      flagged.add(el);
    } else if (flagged.has(el) || el.getAttribute('aria-invalid') !== 'true') {
      el.setAttribute('aria-invalid', 'false');
      linkError(el, false);
      flagged.delete(el);
      announced.delete(el);
      if (announcedField === el) {
        clearTimeout(announceTimer);
        announcer.textContent = '';
      }
    }
  };

  document.querySelectorAll('input, select, textarea').forEach((el) => syncAria(el));
  document.addEventListener('blur', (e) => syncAria(e.target, true), true);
  document.addEventListener('input', (e) => {
    if (e.target.hasAttribute?.('aria-invalid')) syncAria(e.target);
  });
  document.addEventListener('change', (e) => syncAria(e.target, true), true);
  document.addEventListener('invalid', (e) => {
    announced.add(e.target);
    syncAria(e.target);
  }, true);
  document.addEventListener('reset', (e) => {
    setTimeout(() => [...(e.target.elements || [])].forEach((el) => syncAria(el)));
  }, true);

  // 針對極舊不支援 :user-invalid 之瀏覽器降級支援
  if (!supportsUserInvalid) {
    const dirtyState = new WeakMap();
    const updateFallback = (input) => {
      if (!input.validity) return;
      const isValid = input.validity.valid;
      input.classList.toggle('user-invalid-fallback', !isValid);
      syncAria(input, !isValid);
    };
    document.addEventListener('invalid', (e) => {
      dirtyState.set(e.target, { interacted: true, blurred: true });
      updateFallback(e.target);
    }, true);
    document.addEventListener('input', (e) => {
      const st = dirtyState.get(e.target) || { interacted: false, blurred: false };
      st.interacted = true;
      dirtyState.set(e.target, st);
      if (st.blurred) updateFallback(e.target);
    });
    document.addEventListener('blur', (e) => {
      const st = dirtyState.get(e.target) || { interacted: false, blurred: false };
      st.blurred = true;
      dirtyState.set(e.target, st);
      if (st.interacted) updateFallback(e.target);
    }, true);
  }

  /* ==========================================================================
     5. Dialog 輕點擊關閉相容層（遵循 light-dismiss-a-dialog 規範）
     ========================================================================== */
  const authDialog = document.getElementById('admin-auth-dialog');
  if (!('closedBy' in HTMLDialogElement.prototype) && authDialog) {
    authDialog.addEventListener('click', (event) => {
      if (event.target !== authDialog) return;
      const rect = authDialog.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isDialogContent) {
        authDialog.close();
      }
    });
  }
  authDialog.addEventListener('close', () => {
    authDialog.returnValue = '';
    document.getElementById('admin-auth-error').hidden = true;
    document.getElementById('admin-passcode').value = '';
  });

  /* ==========================================================================
     6. 本機儲存讀寫輔助函式
     ========================================================================== */
  function loadLocalRecords() {
    try {
      const raw = localStorage.getItem(CONFIG.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveLocalRecords(records) {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(records));
  }

  function formatNowTimestamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /* ==========================================================================
     7. 問卷表單動態互動與驗證送出邏輯
     ========================================================================== */
  const surveyForm = document.getElementById('ai-survey-form');
  const deptSelect = document.getElementById('department');
  const customDeptWrapper = document.getElementById('custom-dept-wrapper');
  const customDeptInput = document.getElementById('custom-department');

  // 7-1. 部門選「其他」時展開輸入框
  deptSelect.addEventListener('change', () => {
    const isOther = deptSelect.value === '其他';
    customDeptWrapper.hidden = !isOther;
    customDeptInput.required = isOther;
    if (!isOther) {
      customDeptInput.value = '';
      customDeptInput.setAttribute('aria-invalid', 'false');
    }
  });

  // 7-2. 目前是否使用中展開控制
  const currentToolsPanel = document.getElementById('current-tools-detail');
  const currentToolsError = document.getElementById('current-tools-error');
  const currentToolsErrorText = document.getElementById('current-tools-error-text');

  document.querySelectorAll('input[name="currentlyUsing"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const isUsing = document.getElementById('using-yes').checked;
      currentToolsPanel.hidden = !isUsing;
      if (!isUsing) {
        currentToolsError.hidden = true;
      }
    });
  });

  // 勾選目前正在使用的各別工具時，顯示該工具之免費版／付費版選擇器
  const TOOL_RADIO_NAME_MAP = {
    'ChatGPT': 'tier_ChatGPT',
    'Claude': 'tier_Claude',
    'Gemini': 'tier_Gemini',
    'Microsoft 365 Copilot': 'tier_Copilot',
    '其他': 'tier_Other'
  };

  document.querySelectorAll('input[name="currentTools"]').forEach((chk) => {
    chk.addEventListener('change', () => {
      const toolKey = chk.value;
      const selectorBox = document.querySelector(`.tier-selector[data-tier-for="${toolKey}"]`);
      if (selectorBox) {
        selectorBox.hidden = !chk.checked;
        if (!chk.checked) {
          const radioName = TOOL_RADIO_NAME_MAP[toolKey];
          document.querySelectorAll(`input[name="${radioName}"]`).forEach((r) => { r.checked = false; });
          if (toolKey === '其他') {
            document.getElementById('cur-other-name').value = '';
          }
        }
      }
      currentToolsError.hidden = true;
    });
  });

  document.querySelectorAll('.tier-pills input[type="radio"], #cur-other-name').forEach((el) => {
    el.addEventListener('change', () => { currentToolsError.hidden = true; });
    el.addEventListener('input', () => { currentToolsError.hidden = true; });
  });

  // 7-3. 希望申請工具：「暫無需求」與其他工具互斥處理
  const reqNoneChk = document.getElementById('req-none');
  const reqOtherChk = document.getElementById('req-other');
  const reqOtherWrapper = document.getElementById('req-other-wrapper');
  const reqOtherName = document.getElementById('req-other-name');
  const reqToolsError = document.getElementById('requested-tools-error');
  const reqToolsErrorText = document.getElementById('requested-tools-error-text');
  const useCasesFieldset = document.getElementById('use-cases-fieldset');

  document.querySelectorAll('input[name="requestedTools"]').forEach((chk) => {
    chk.addEventListener('change', () => {
      if (chk === reqNoneChk && chk.checked) {
        document.querySelectorAll('input[name="requestedTools"]').forEach((other) => {
          if (other !== reqNoneChk) other.checked = false;
        });
        reqOtherWrapper.hidden = true;
        reqOtherName.value = '';
        // 若選暫無需求且尚未使用 AI，可貼心預設頻率為「暫無使用需求」
        if (document.getElementById('using-no').checked) {
          document.getElementById('freq-none').checked = true;
        }
      } else if (chk !== reqNoneChk && chk.checked) {
        reqNoneChk.checked = false;
      }

      reqOtherWrapper.hidden = !reqOtherChk.checked;
      if (!reqOtherChk.checked) reqOtherName.value = '';
      reqToolsError.hidden = true;

      // 當勾選「暫無需求」且目前未使用時，用途改為選填提示
      useCasesFieldset.style.opacity = (reqNoneChk.checked && !document.getElementById('using-yes').checked) ? '0.75' : '1';
    });
  });

  // 7-4. 主要工作用途：「其他用途」展開控制
  const useOtherChk = document.getElementById('use-other');
  const useOtherWrapper = document.getElementById('use-other-wrapper');
  const useOtherText = document.getElementById('use-other-text');
  const useCasesError = document.getElementById('use-cases-error');
  const useCasesErrorText = document.getElementById('use-cases-error-text');

  document.querySelectorAll('input[name="useCases"]').forEach((chk) => {
    chk.addEventListener('change', () => {
      useOtherWrapper.hidden = !useOtherChk.checked;
      if (!useOtherChk.checked) useOtherText.value = '';
      useCasesError.hidden = true;
    });
  });

  // 7-5. 自訂複選群組驗證與表單送出
  surveyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let firstInvalidControl = null;

    // 先執行瀏覽器原生必填檢查
    const nativeValid = surveyForm.checkValidity();
    if (!nativeValid) {
      firstInvalidControl = surveyForm.querySelector(':invalid');
      // 觸發 invalid 事件以顯示 :user-invalid / ARIA 狀態
      surveyForm.querySelectorAll(':invalid').forEach((el) => {
        el.dispatchEvent(new Event('invalid', { cancelable: true }));
      });
    }

    // 檢查 1-1：若選擇「目前已在使用」，至少勾選一項工具且必須選免費版／付費版
    const isUsing = document.getElementById('using-yes').checked;
    const selectedCurrentTools = [];
    if (isUsing) {
      const checkedCurrent = [...document.querySelectorAll('input[name="currentTools"]:checked')];
      if (checkedCurrent.length === 0) {
        currentToolsErrorText.textContent = '請至少勾選一項您目前正在使用的 AI 工具。';
        currentToolsError.hidden = false;
        if (!firstInvalidControl) firstInvalidControl = document.getElementById('cur-chatgpt');
      } else {
        let missingTier = false;
        let missingOtherName = false;
        for (const chk of checkedCurrent) {
          const toolKey = chk.value;
          const radioName = TOOL_RADIO_NAME_MAP[toolKey];
          const chosenRadio = document.querySelector(`input[name="${radioName}"]:checked`);
          if (!chosenRadio) {
            missingTier = true;
            if (!firstInvalidControl) {
              firstInvalidControl = document.querySelector(`input[name="${radioName}"]`);
            }
          }
          let displayTool = toolKey;
          if (toolKey === '其他') {
            const customTool = document.getElementById('cur-other-name').value.trim();
            if (!customTool) {
              missingOtherName = true;
              if (!firstInvalidControl) firstInvalidControl = document.getElementById('cur-other-name');
            } else {
              displayTool = `其他：${customTool}`;
            }
          }
          if (chosenRadio) {
            selectedCurrentTools.push({ tool: displayTool, tier: chosenRadio.value });
          }
        }
        if (missingOtherName) {
          currentToolsErrorText.textContent = '您勾選了「其他 AI 工具」，請輸入工具名稱並選擇使用版本。';
          currentToolsError.hidden = false;
        } else if (missingTier) {
          currentToolsErrorText.textContent = '請為每一項勾選的使用中工具點選「免費版」或「付費版」。';
          currentToolsError.hidden = false;
        } else {
          currentToolsError.hidden = true;
        }
      }
    }

    // 檢查 Q2：希望申請的工具必選至少一項
    const checkedReq = [...document.querySelectorAll('input[name="requestedTools"]:checked')];
    const requestedToolsList = [];
    if (checkedReq.length === 0) {
      reqToolsErrorText.textContent = '請至少勾選一項需要的 AI 工具（若無需求可勾選「目前工作暫無需求」）。';
      reqToolsError.hidden = false;
      if (!firstInvalidControl) firstInvalidControl = document.getElementById('req-chatgpt');
    } else if (reqOtherChk.checked && !reqOtherName.value.trim()) {
      reqToolsErrorText.textContent = '您勾選了「其他工具」，請輸入希望申請的工具名稱。';
      reqToolsError.hidden = false;
      if (!firstInvalidControl) firstInvalidControl = reqOtherName;
    } else {
      reqToolsError.hidden = true;
      for (const chk of checkedReq) {
        if (chk.value === '其他') {
          requestedToolsList.push(`其他：${reqOtherName.value.trim()}`);
        } else {
          requestedToolsList.push(chk.value);
        }
      }
    }

    // 檢查 Q3：主要工作用途（若非「尚未使用＋暫無需求」則必選至少一項）
    const checkedUses = [...document.querySelectorAll('input[name="useCases"]:checked')];
    const isNoNeedAtAll = reqNoneChk.checked && !isUsing;
    const useCasesList = [];

    if (!isNoNeedAtAll && checkedUses.length === 0) {
      useCasesErrorText.textContent = '請至少勾選一項主要工作用途。';
      useCasesError.hidden = false;
      if (!firstInvalidControl) firstInvalidControl = document.getElementById('use-mail');
    } else if (useOtherChk.checked && !useOtherText.value.trim()) {
      useCasesErrorText.textContent = '您勾選了「其他用途」，請簡述說明。';
      useCasesError.hidden = false;
      if (!firstInvalidControl) firstInvalidControl = useOtherText;
    } else {
      useCasesError.hidden = true;
      if (checkedUses.length === 0 && isNoNeedAtAll) {
        useCasesList.push('暫無特定用途');
      } else {
        for (const chk of checkedUses) {
          if (chk.value === '其他用途') {
            useCasesList.push(`其他：${useOtherText.value.trim()}`);
          } else {
            useCasesList.push(chk.value);
          }
        }
      }
    }

    // 若有任何欄位未通過驗證，將焦點導向第一個錯誤控制項
    if (firstInvalidControl) {
      firstInvalidControl.focus();
      return;
    }

    // 防重複點擊送出
    const submitBtn = document.getElementById('submit-survey-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '資料送出處理中…';

    const finalDept = deptSelect.value === '其他'
      ? `其他（${customDeptInput.value.trim()}）`
      : deptSelect.value;

    const chosenFreq = document.querySelector('input[name="frequency"]:checked')?.value || '';
    const recordId = `MIS-${Date.now().toString().slice(-6)}`;

    const newRecord = {
      id: recordId,
      submittedAt: formatNowTimestamp(),
      isDemo: false,
      department: finalDept,
      employeeName: document.getElementById('employee-name').value.trim(),
      currentlyUsing: isUsing,
      currentTools: selectedCurrentTools,
      requestedTools: requestedToolsList,
      frequency: chosenFreq,
      useCases: useCasesList,
      notes: document.getElementById('notes').value.trim()
    };

    // 寫入本機儲存
    const existing = loadLocalRecords();
    existing.unshift(newRecord);
    saveLocalRecords(existing);

    // 若日後設定了雲端 API（如 Google Apps Script），自動非同步傳送
    if (CONFIG.cloudEndpointUrl) {
      try {
        await fetch(CONFIG.cloudEndpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(newRecord)
        });
      } catch (err) {
        console.warn('雲端同步暫時失敗，資料已保留於本機紀錄：', err);
      }
    }

    // 呈現送出成功收據卡（全面使用 DOM API 與 textContent 防止 XSS）
    renderSuccessReceipt(newRecord);
    surveyForm.hidden = true;
    const successCard = document.getElementById('submit-success-card');
    successCard.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    submitBtn.disabled = false;
    submitBtn.textContent = '確認無誤，送出調查表';
  });

  function renderSuccessReceipt(rec) {
    const summaryText = document.getElementById('success-summary-text');
    summaryText.textContent = `${rec.department} ${rec.employeeName} 您好，資訊管理單位已收到您的填報紀錄（單號：${rec.id}）。`;

    const receiptBox = document.getElementById('submission-receipt');
    receiptBox.replaceChildren();
    const dl = document.createElement('dl');

    const addRow = (label, value) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      dl.append(dt, dd);
    };

    addRow('填報單號', rec.id);
    addRow('填報時間', rec.submittedAt);
    addRow('部門／姓名', `${rec.department} ／ ${rec.employeeName}`);
    addRow(
      '目前使用現況',
      rec.currentlyUsing
        ? rec.currentTools.map((t) => `${t.tool}（${t.tier}）`).join('、')
        : '目前尚未使用'
    );
    addRow('希望申請工具', rec.requestedTools.join('、'));
    addRow('預計使用頻率', rec.frequency);

    receiptBox.append(dl);
  }

  // 重新填報按鈕
  document.getElementById('fill-another-btn').addEventListener('click', () => {
    surveyForm.reset();
    customDeptWrapper.hidden = true;
    customDeptInput.required = false;
    currentToolsPanel.hidden = true;
    reqOtherWrapper.hidden = true;
    useOtherWrapper.hidden = true;
    document.querySelectorAll('.tier-selector').forEach((el) => { el.hidden = true; });
    document.getElementById('submit-success-card').hidden = true;
    surveyForm.hidden = false;
    deptSelect.focus();
  });

  /* ==========================================================================
     8. 管理員驗證與後台切換邏輯
     ========================================================================== */
  let isAdminAuthenticated = false;
  const surveyView = document.getElementById('survey-view');
  const adminView = document.getElementById('admin-view');
  const openAdminBtn = document.getElementById('open-admin-btn');
  const passcodeField = document.getElementById('admin-passcode');
  const togglePwBtn = document.getElementById('toggle-passcode-btn');

  openAdminBtn.addEventListener('click', () => {
    if (isAdminAuthenticated) {
      showAdminDashboard();
    } else {
      authDialog.showModal();
    }
  });

  document.getElementById('close-dialog-x').addEventListener('click', () => authDialog.close());
  document.getElementById('cancel-dialog-btn').addEventListener('click', () => authDialog.close());

  // 顯示／隱藏通行碼無障礙切換按鈕
  togglePwBtn.addEventListener('click', () => {
    const showing = passcodeField.type === 'text';
    passcodeField.type = showing ? 'password' : 'text';
    togglePwBtn.setAttribute('aria-pressed', String(!showing));
    togglePwBtn.textContent = showing ? '顯示' : '隱藏';
    togglePwBtn.setAttribute('aria-label', showing ? '顯示通行碼' : '隱藏通行碼');
  });

  document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = passcodeField.value.trim();
    const errEl = document.getElementById('admin-auth-error');
    if (!val) {
      errEl.hidden = false;
      passcodeField.focus();
      return;
    }
    const digest = await sha256Hex(val);
    if (digest === CONFIG.adminPasscodeSha256) {
      isAdminAuthenticated = true;
      errEl.hidden = true;
      authDialog.close();
      showAdminDashboard();
    } else {
      errEl.hidden = false;
      passcodeField.select();
    }
  });

  function showAdminDashboard() {
    surveyView.hidden = true;
    adminView.hidden = false;
    populateDeptFilterOptions();
    renderAdminDashboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('back-to-survey-btn').addEventListener('click', () => {
    adminView.hidden = true;
    surveyView.hidden = false;
  });

  document.getElementById('logout-admin-btn').addEventListener('click', () => {
    isAdminAuthenticated = false;
    adminView.hidden = true;
    surveyView.hidden = false;
  });

  /* ==========================================================================
     9. MIS 統計後台計算、圖表繪製、清單篩選與 CSV 匯出
     ========================================================================== */
  const toggleDemoChk = document.getElementById('toggle-demo-data');
  const filterDept = document.getElementById('filter-dept');
  const filterStatus = document.getElementById('filter-status');
  const filterTool = document.getElementById('filter-tool');
  const filterKeyword = document.getElementById('filter-keyword');

  function getActiveRecords() {
    const local = loadLocalRecords();
    return toggleDemoChk.checked ? [...local, ...DEMO_RECORDS] : [...local];
  }

  function populateDeptFilterOptions() {
    const currentVal = filterDept.value || 'ALL';
    filterDept.replaceChildren();
    const allOpt = document.createElement('option');
    allOpt.value = 'ALL';
    allOpt.textContent = '全部部門';
    filterDept.append(allOpt);

    CONFIG.officialDepartments.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      filterDept.append(opt);
    });
    const otherOpt = document.createElement('option');
    otherOpt.value = '其他';
    otherOpt.textContent = '其他自填部門';
    filterDept.append(otherOpt);

    filterDept.value = currentVal;
  }

  function hasFreeTier(rec) {
    return rec.currentlyUsing && rec.currentTools.some((t) => t.tier === '免費版');
  }

  function hasPaidSelfTier(rec) {
    return rec.currentlyUsing && rec.currentTools.some((t) => t.tier.includes('個人自費'));
  }

  function hasPaidCorpTier(rec) {
    return rec.currentlyUsing && rec.currentTools.some((t) => t.tier.includes('公司既有'));
  }

  function filterRecords(records) {
    const deptVal = filterDept.value;
    const statusVal = filterStatus.value;
    const toolVal = filterTool.value;
    const kw = filterKeyword.value.trim().toLowerCase();

    return records.filter((r) => {
      if (deptVal !== 'ALL') {
        if (deptVal === '其他') {
          if (!r.department.startsWith('其他')) return false;
        } else if (r.department !== deptVal) {
          return false;
        }
      }

      if (statusVal === 'USING_FREE' && !hasFreeTier(r)) return false;
      if (statusVal === 'USING_PAID_SELF' && !hasPaidSelfTier(r)) return false;
      if (statusVal === 'USING_PAID_CORP' && !hasPaidCorpTier(r)) return false;
      if (statusVal === 'NOT_USING' && r.currentlyUsing) return false;

      if (toolVal !== 'ALL') {
        if (toolVal === '其他') {
          if (!r.requestedTools.some((t) => t.startsWith('其他'))) return false;
        } else if (!r.requestedTools.includes(toolVal)) {
          return false;
        }
      }

      if (kw) {
        const haystack = [
          r.employeeName,
          r.department,
          ...r.requestedTools,
          ...r.currentTools.map((t) => `${t.tool} ${t.tier}`),
          ...r.useCases,
          r.notes || ''
        ].join(' ').toLowerCase();
        if (!haystack.includes(kw)) return false;
      }

      return true;
    });
  }

  function renderAdminDashboard() {
    const localCount = loadLocalRecords().length;
    const records = getActiveRecords();
    const total = records.length;

    document.getElementById('data-source-status').textContent =
      `目前統計總筆數：${total} 筆（本機實測填報 ${localCount} 筆 ＋ 預覽範例 ${toggleDemoChk.checked ? DEMO_RECORDS.length : 0} 筆）`;

    // 計算五大 KPI
    const coveredOfficialDepts = new Set(
      records.map((r) => r.department).filter((d) => CONFIG.officialDepartments.includes(d))
    );
    const usingCount = records.filter((r) => r.currentlyUsing).length;
    const freeUsersCount = records.filter(hasFreeTier).length;
    const paidSelfCount = records.filter(hasPaidSelfTier).length;
    const paidCorpCount = records.filter(hasPaidCorpTier).length;
    const anyPaidCount = records.filter((r) => hasPaidSelfTier(r) || hasPaidCorpTier(r)).length;
    const highFreqCount = records.filter(
      (r) => r.frequency.startsWith('每日重度') || r.frequency.startsWith('經常使用')
    ).length;

    document.getElementById('kpi-total').textContent = String(total);
    document.getElementById('kpi-dept-coverage').textContent =
      `涵蓋 ${coveredOfficialDepts.size} / ${CONFIG.officialDepartments.length} 個正式部門`;
    document.getElementById('kpi-using').textContent = String(usingCount);
    document.getElementById('kpi-using-pct').textContent =
      `佔總填報 ${total ? Math.round((usingCount / total) * 100) : 0}%`;
    document.getElementById('kpi-free-users').textContent = String(freeUsersCount);
    document.getElementById('kpi-paid-users').textContent = String(anyPaidCount);
    document.getElementById('kpi-paid-breakdown').textContent =
      `個人自費 ${paidSelfCount} 人 ／ 公司既有 ${paidCorpCount} 人`;
    document.getElementById('kpi-high-freq').textContent = String(highFreqCount);

    renderToolStats(records, total);
    renderDeptStats(records);
    renderFreqStats(records, total);
    renderUseCaseStats(records, total);
    renderTableRows(filterRecords(records));
  }

  function createStatBar({ title, count, total, subTags = [] }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    const wrap = document.createElement('div');
    wrap.className = 'stat-bar-item';

    const head = document.createElement('div');
    head.className = 'stat-bar-head';
    const titleSpan = document.createElement('span');
    titleSpan.className = 'stat-bar-title';
    titleSpan.textContent = title;
    const metaSpan = document.createElement('span');
    metaSpan.className = 'stat-bar-meta';
    metaSpan.textContent = `${count} 人（${pct}%）`;
    head.append(titleSpan, metaSpan);

    const track = document.createElement('div');
    track.className = 'stat-track';
    const fill = document.createElement('div');
    fill.className = 'stat-fill';
    fill.style.width = `${pct}%`;
    track.append(fill);

    wrap.append(head, track);

    if (subTags.length > 0) {
      const pillsRow = document.createElement('div');
      pillsRow.className = 'stat-sub-pills';
      subTags.forEach((tag) => {
        const s = document.createElement('span');
        s.className = `mini-tag ${tag.cls || ''}`;
        s.textContent = tag.text;
        pillsRow.append(s);
      });
      wrap.append(pillsRow);
    }

    return wrap;
  }

  function renderToolStats(records, total) {
    const container = document.getElementById('tools-stats-container');
    container.replaceChildren();

    const targets = [...CONFIG.coreTools, '其他', '暫無需求'];
    targets.forEach((toolName) => {
      const reqCount = records.filter((r) =>
        toolName === '其他'
          ? r.requestedTools.some((t) => t.startsWith('其他'))
          : r.requestedTools.includes(toolName)
      ).length;

      const subTags = [];
      if (toolName !== '暫無需求') {
        const matchTool = (tObj) =>
          toolName === '其他' ? tObj.tool.startsWith('其他') : tObj.tool === toolName;
        const curFree = records.filter((r) =>
          r.currentTools.some((t) => matchTool(t) && t.tier === '免費版')
        ).length;
        const curPaidSelf = records.filter((r) =>
          r.currentTools.some((t) => matchTool(t) && t.tier.includes('個人自費'))
        ).length;
        const curPaidCorp = records.filter((r) =>
          r.currentTools.some((t) => matchTool(t) && t.tier.includes('公司既有'))
        ).length;

        if (curFree > 0) subTags.push({ text: `現況免費版：${curFree} 人`, cls: 'tag-free' });
        if (curPaidSelf > 0) subTags.push({ text: `現況個人自費：${curPaidSelf} 人`, cls: 'tag-paid' });
        if (curPaidCorp > 0) subTags.push({ text: `現況公司授權：${curPaidCorp} 人`, cls: 'tag-corp' });
      }

      container.append(
        createStatBar({
          title: toolName === '其他' ? '其他自填工具' : toolName,
          count: reqCount,
          total,
          subTags
        })
      );
    });
  }

  function renderDeptStats(records) {
    const container = document.getElementById('dept-stats-container');
    container.replaceChildren();

    CONFIG.officialDepartments.forEach((dept) => {
      const count = records.filter((r) => r.department === dept).length;
      const chip = document.createElement('div');
      chip.className = `dept-chip ${count > 0 ? 'has-data' : ''}`;
      const nameSpan = document.createElement('span');
      nameSpan.textContent = dept;
      const numSpan = document.createElement('span');
      numSpan.className = 'dept-chip-count';
      numSpan.textContent = `${count} 人`;
      chip.append(nameSpan, numSpan);
      container.append(chip);
    });

    const otherCount = records.filter((r) => r.department.startsWith('其他')).length;
    if (otherCount > 0) {
      const chip = document.createElement('div');
      chip.className = 'dept-chip has-data';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = '其他自填部門';
      const numSpan = document.createElement('span');
      numSpan.className = 'dept-chip-count';
      numSpan.textContent = `${otherCount} 人`;
      chip.append(nameSpan, numSpan);
      container.append(chip);
    }
  }

  function renderFreqStats(records, total) {
    const container = document.getElementById('freq-stats-container');
    container.replaceChildren();
    const levels = [
      '每日重度使用（每天多次）',
      '經常使用（每週 3～4 天）',
      '偶爾使用（每週 1～2 次）',
      '視專案需求不定期使用',
      '暫無使用需求'
    ];
    levels.forEach((lv) => {
      const count = records.filter((r) => r.frequency === lv).length;
      container.append(createStatBar({ title: lv, count, total }));
    });
  }

  function renderUseCaseStats(records, total) {
    const container = document.getElementById('usecase-stats-container');
    container.replaceChildren();
    const map = new Map();
    records.forEach((r) => {
      r.useCases.forEach((u) => {
        const key = u.startsWith('其他：') ? '其他自填用途' : u;
        map.set(key, (map.get(key) || 0) + 1);
      });
    });

    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'hint';
      empty.textContent = '尚無統計資料';
      container.append(empty);
      return;
    }
    sorted.forEach(([title, count]) => {
      container.append(createStatBar({ title, count, total }));
    });
  }

  function renderTableRows(filteredRecords) {
    const tbody = document.getElementById('submissions-tbody');
    tbody.replaceChildren();
    document.getElementById('filtered-count-text').textContent =
      `共篩選出 ${filteredRecords.length} 筆填報紀錄`;

    if (filteredRecords.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 8;
      td.style.textAlign = 'center';
      td.style.padding = '2rem';
      td.textContent = '目前沒有符合篩選條件的填報紀錄。';
      tr.append(td);
      tbody.append(tr);
      return;
    }

    filteredRecords.forEach((rec) => {
      const tr = document.createElement('tr');

      // 1. 員工姓名 (Sticky Row Header <th scope="row">)
      const thName = document.createElement('th');
      thName.scope = 'row';
      thName.textContent = rec.employeeName;

      // 2. 所屬部門
      const tdDept = document.createElement('td');
      tdDept.textContent = rec.department;

      // 3. 目前使用現況（清楚標示免費版／付費版標籤）
      const tdCur = document.createElement('td');
      if (!rec.currentlyUsing || rec.currentTools.length === 0) {
        const tag = document.createElement('span');
        tag.className = 'mini-tag';
        tag.textContent = '尚未使用';
        tdCur.append(tag);
      } else {
        const wrap = document.createElement('div');
        wrap.className = 'stat-sub-pills';
        rec.currentTools.forEach((item) => {
          const badge = document.createElement('span');
          let cls = 'tag-free';
          if (item.tier.includes('個人自費')) cls = 'tag-paid';
          else if (item.tier.includes('公司既有')) cls = 'tag-corp';
          badge.className = `mini-tag ${cls}`;
          badge.textContent = `${item.tool}｜${item.tier}`;
          wrap.append(badge);
        });
        tdCur.append(wrap);
      }

      // 4. 希望申請工具
      const tdReq = document.createElement('td');
      tdReq.textContent = rec.requestedTools.join('、');

      // 5. 使用頻率
      const tdFreq = document.createElement('td');
      tdFreq.textContent = rec.frequency;

      // 6. 主要工作用途
      const tdUse = document.createElement('td');
      tdUse.textContent = rec.useCases.join('；');

      // 7. 補充說明／時間
      const tdNote = document.createElement('td');
      tdNote.className = 'cell-note-time';
      const noteSpan = document.createElement('span');
      noteSpan.textContent = rec.notes || '—';
      const timeSpan = document.createElement('span');
      timeSpan.className = 'time-stamp';
      timeSpan.textContent = `${rec.id} ｜ ${rec.submittedAt}`;
      tdNote.append(noteSpan, timeSpan);

      // 8. 來源／操作
      const tdAction = document.createElement('td');
      if (rec.isDemo) {
        const demoTag = document.createElement('span');
        demoTag.className = 'mini-tag';
        demoTag.textContent = '預覽範例';
        tdAction.append(demoTag);
      } else {
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'btn-row-del';
        delBtn.textContent = '刪除';
        delBtn.setAttribute('aria-label', `刪除 ${rec.employeeName} 的本機測試紀錄`);
        delBtn.addEventListener('click', () => {
          const updated = loadLocalRecords().filter((item) => item.id !== rec.id);
          saveLocalRecords(updated);
          renderAdminDashboard();
        });
        tdAction.append(delBtn);
      }

      tr.append(thName, tdDept, tdCur, tdReq, tdFreq, tdUse, tdNote, tdAction);
      tbody.append(tr);
    });
  }

  // 篩選控制項事件綁定（不自動送出跳頁，即時過濾清單）
  document.getElementById('filter-form').addEventListener('submit', (e) => e.preventDefault());
  [toggleDemoChk, filterDept, filterStatus, filterTool].forEach((el) => {
    el.addEventListener('change', renderAdminDashboard);
  });
  filterKeyword.addEventListener('input', () => {
    renderTableRows(filterRecords(getActiveRecords()));
  });

  // 清除本機測試填報紀錄
  document.getElementById('clear-local-btn').addEventListener('click', () => {
    const local = loadLocalRecords();
    if (local.length === 0) return;
    if (window.confirm(`確定要清除本機儲存的 ${local.length} 筆測試填報紀錄嗎？`)) {
      localStorage.removeItem(CONFIG.storageKey);
      renderAdminDashboard();
    }
  });

  // 匯出 Excel 相容 UTF-8 BOM CSV 檔案
  document.getElementById('export-csv-btn').addEventListener('click', () => {
    const rowsToExport = filterRecords(getActiveRecords());
    const headers = [
      '填報單號',
      '填報時間',
      '資料來源',
      '所屬部門',
      '員工姓名',
      '目前是否使用AI',
      '目前使用工具與版本明細',
      '含免費版使用',
      '含個人自費版',
      '含公司既有授權',
      '希望申請AI工具',
      '預計使用頻率',
      '主要工作用途',
      '補充說明'
    ];

    const escapeCsv = (val) => {
      const str = String(val ?? '');
      if (/[",\r\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvLines = [headers.map(escapeCsv).join(',')];
    rowsToExport.forEach((r) => {
      const curDetail = r.currentlyUsing
        ? r.currentTools.map((t) => `${t.tool}(${t.tier})`).join(' / ')
        : '未使用';

      const row = [
        r.id,
        r.submittedAt,
        r.isDemo ? '預覽範例' : '正式填報',
        r.department,
        r.employeeName,
        r.currentlyUsing ? '是' : '否',
        curDetail,
        hasFreeTier(r) ? '是' : '否',
        hasPaidSelfTier(r) ? '是' : '否',
        hasPaidCorpTier(r) ? '是' : '否',
        r.requestedTools.join(' / '),
        r.frequency,
        r.useCases.join(' / '),
        r.notes || ''
      ];
      csvLines.push(row.map(escapeCsv).join(','));
    });

    // 加入 UTF-8 BOM (\uFEFF) 確保台灣繁體中文 Windows Excel 直接開啟不亂碼
    const blob = new Blob(['\uFEFF' + csvLines.join('\r\n')], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateTag = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `企業AI工具需求調查統計_${dateTag}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
})();

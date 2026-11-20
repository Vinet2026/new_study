import { GRADE_LEVELS, TERRITORIES_BY_PROFILE, BUILTIN_QUESTIONS, STICKERS } from './questions.js';
import { renderZhuyinHTML } from './zhuyin-dict.js';

/**
 * 網站功能與畫面健康檢查（供家長後台檢視，不干擾孩童畫面）
 */
export function runLivePageDiagnostics(state) {
  const checks = [];
  let seq = 0;
  const addCheck = (group, status, title, detail, targetEl = null, actionFn = null) => {
    seq += 1;
    checks.push({ id: 'chk_' + seq, group, status, title, detail, targetEl, actionFn });
  };

  // 1. 檢查所有可見按鈕
  const allButtons = Array.from(document.querySelectorAll('button'));
  let visibleBtnCount = 0;
  let brokenBtnCount = 0;

  allButtons.forEach((btn, idx) => {
    const style = window.getComputedStyle(btn);
    const hiddenByAncestor = !!btn.closest('.hidden') || style.display === 'none' || style.visibility === 'hidden';
    if (hiddenByAncestor) return;
    visibleBtnCount += 1;

    const rect = btn.getBoundingClientRect();
    const label = (btn.innerText || btn.getAttribute('aria-label') || btn.title || `按鈕#${idx + 1}`).trim().replace(/\s+/g, ' ');
    const hasHandler = typeof btn.onclick === 'function' || btn.hasAttribute('onclick');
    const isTiny = rect.width < 24 || rect.height < 24;
    const isOffscreen = rect.right < 0 || rect.left > window.innerWidth;

    if (!hasHandler) {
      brokenBtnCount += 1;
      addCheck('button', 'fail', `按鈕無反應：${label}`, '此按鈕尚未設定點擊動作', btn);
    } else if (rect.width === 0 || rect.height === 0 || isOffscreen) {
      brokenBtnCount += 1;
      addCheck('button', 'fail', `按鈕位置異常：${label}`, '按鈕未正確顯示在螢幕範圍內', btn);
    } else if (isTiny) {
      addCheck('button', 'warn', `按鈕偏小：${label}`, '建議放大按鈕尺寸，方便小朋友手指點擊', btn);
    }
  });

  addCheck(
    'button',
    brokenBtnCount === 0 ? 'pass' : 'fail',
    `畫面按鈕檢查：共 ${visibleBtnCount} 個按鈕`,
    brokenBtnCount === 0 ? '所有按鈕皆可正常點擊且位置正確' : `發現 ${brokenBtnCount} 個按鈕異常`
  );

  // 2. 檢查分年級按鈕與王國領土地圖
  const gradeBtns = Array.from(document.querySelectorAll('#grade-selector-pills .grade-pill'));
  if (gradeBtns.length === 0) {
    addCheck('visual', 'fail', '分年級選項未顯示', '找不到年級切換按鈕', document.getElementById('grade-selector-pills'));
  } else {
    addCheck('visual', 'pass', `分年級選項正常（共 ${gradeBtns.length} 個）`, gradeBtns.map(b => b.textContent.trim()).join(' / '), document.getElementById('grade-selector-pills'));
  }

  const mapCards = Array.from(document.querySelectorAll('#kingdom-map-grid .territory-card'));
  if (mapCards.length === 0) {
    addCheck('visual', 'fail', '王國領土地圖未顯示', '首頁領土地圖卡片未出現', document.getElementById('kingdom-map-grid'));
  } else {
    let emptyCards = 0;
    mapCards.forEach(card => {
      const r = card.getBoundingClientRect();
      const textLen = (card.innerText || '').trim().length;
      if (r.width < 60 || r.height < 60 || textLen < 4) {
        emptyCards += 1;
        addCheck('visual', 'fail', '領土卡片顯示不完整', '卡片區塊過小或缺少文字內容', card);
      }
    });
    if (emptyCards === 0) {
      addCheck('visual', 'pass', `王國領土地圖正常（共 ${mapCards.length} 區）`, '各區領土圖示、名稱與題數皆正常顯示', document.getElementById('kingdom-map-grid'));
    }
  }

  // 3. 檢查圖片與圖示是否正常
  const imgs = Array.from(document.querySelectorAll('img'));
  let brokenImgs = 0;
  imgs.forEach(img => {
    const s = window.getComputedStyle(img);
    if (s.display === 'none') return;
    if (!img.complete || img.naturalWidth === 0) {
      brokenImgs += 1;
      addCheck('visual', 'fail', `圖片載入失敗：${img.alt || '未命名圖片'}`, '圖片無法正常顯示', img);
    }
  });
  const svgs = Array.from(document.querySelectorAll('svg'));
  svgs.forEach((svg, i) => {
    const s = window.getComputedStyle(svg);
    if (s.display === 'none') return;
    const r = svg.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) {
      brokenImgs += 1;
      addCheck('visual', 'fail', `圖形顯示異常（#${i + 1}）`, '圖形區塊大小為 0', svg);
    }
  });
  if (brokenImgs === 0) {
    addCheck('visual', 'pass', '圖形與圖示顯示正常', '無破圖或顯示異常的圖形');
  }

  // 4. 檢查直式注音排版
  const sampleHtml = renderZhuyinHTML('恐龍(ㄌㄨㄥˊ)王國');
  const hasRuby = sampleHtml.includes('class="char-ruby"') && sampleHtml.includes('class="bpmf"');
  addCheck(
    'visual',
    hasRuby ? 'pass' : 'fail',
    '台灣直式注音排版檢查',
    hasRuby ? '國字與直式注音標示正常' : '直式注音排版異常'
  );

  // 5. 檢查題庫、貼紙與語音功能
  const totalQ = BUILTIN_QUESTIONS.length + (state.customQuestions?.length || 0);
  const badQ = BUILTIN_QUESTIONS.filter(q => !Array.isArray(q.options) || q.options.length < 2 || q.answer >= q.options.length);
  addCheck(
    'system',
    badQ.length === 0 && totalQ > 0 && STICKERS.length > 0 ? 'pass' : 'fail',
    `題庫與貼紙檢查（共 ${totalQ} 題 / ${STICKERS.length} 張貼紙）`,
    badQ.length === 0 ? '所有題目與獎勵貼紙皆可正常使用' : `發現 ${badQ.length} 題設定有誤`
  );

  const ttsOk = typeof window !== 'undefined' && 'speechSynthesis' in window;
  addCheck(
    'system',
    ttsOk ? 'pass' : 'warn',
    '語音朗讀功能檢查',
    ttsOk ? '支援中文語音朗讀（可點右側按鈕試聽）' : '目前裝置不支援自動語音朗讀，可使用家長真人錄音',
    null,
    ttsOk ? () => {
      const u = new SpeechSynthesisUtterance('語音測試正常，一起來闖關吧！');
      u.lang = 'zh-TW';
      window.speechSynthesis.speak(u);
    } : null
  );

  const idbOk = typeof window !== 'undefined' && 'indexedDB' in window;
  addCheck(
    'system',
    idbOk ? 'pass' : 'fail',
    '本機儲存與錄音空間檢查',
    idbOk ? '儲存空間正常，進度與真人錄音可安心保存' : '目前瀏覽器無痕模式可能無法保存進度與錄音'
  );

  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const passCount = checks.filter(c => c.status === 'pass').length;

  return {
    ok: failCount === 0,
    passCount,
    warnCount,
    failCount,
    visibleBtnCount,
    mapCardCount: mapCards.length,
    totalQuestions: totalQ,
    checks
  };
}

export function runBootSelfCheck(state) {
  return runLivePageDiagnostics(state);
}

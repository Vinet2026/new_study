import { BUILTIN_QUESTIONS, STICKERS } from './questions.js';
import { renderZhuyinHTML } from './zhuyin-dict.js';

export function runLivePageDiagnostics(state) {
  const checks = [];
  let seq = 0;
  const addCheck = (group, status, title, detail, targetEl = null, actionFn = null) => {
    seq += 1;
    checks.push({ id: 'chk_' + seq, group, status, title, detail, targetEl, actionFn });
  };

  const allButtons = Array.from(document.querySelectorAll('button'));
  let visibleBtnCount = 0;
  let brokenBtnCount = 0;

  allButtons.forEach((btn, idx) => {
    const style = window.getComputedStyle(btn);
    if (btn.closest('.hidden') || style.display === 'none' || style.visibility === 'hidden') return;
    visibleBtnCount += 1;
    const rect = btn.getBoundingClientRect();
    const label = (btn.innerText || btn.title || `按鈕#${idx + 1}`).trim().replace(/\s+/g, ' ');
    const hasHandler = typeof btn.onclick === 'function' || btn.hasAttribute('onclick');
    if (!hasHandler) {
      brokenBtnCount += 1;
      addCheck('button', 'fail', `按鈕缺少動作：${label}`, '未綁定點擊事件', btn);
    } else if (rect.width === 0 || rect.height === 0) {
      brokenBtnCount += 1;
      addCheck('button', 'fail', `按鈕尺寸異常：${label}`, '寬度或高度為 0', btn);
    }
  });

  addCheck('button', brokenBtnCount === 0 ? 'pass' : 'fail', `可見按鈕檢查（共 ${visibleBtnCount} 顆）`,
    brokenBtnCount === 0 ? '所有按鈕皆可正常點擊' : `發現 ${brokenBtnCount} 顆異常`);

  const nodes = document.querySelectorAll('#island-nodes-layer .map-node');
  addCheck('visual', nodes.length === 10 ? 'pass' : 'fail', `島嶼地圖節點檢查（${nodes.length} / 10 區）`,
    nodes.length === 10 ? '10 個島嶼領土節點與移動角色皆正常顯示' : '島嶼節點數量不足',
    document.getElementById('island-map-wrap'));

  const sampleRuby = renderZhuyinHTML('恐龍(ㄌㄨㄥˊ)');
  addCheck('visual', sampleRuby.includes('bpmf') ? 'pass' : 'fail', '直式注音排版檢查',
    sampleRuby.includes('bpmf') ? '國字與直式注音正常' : '直式注音異常');

  const ttsOk = 'speechSynthesis' in window;
  addCheck('system', ttsOk ? 'pass' : 'warn', '語音朗讀功能檢查',
    ttsOk ? '支援中文語音朗讀' : '此瀏覽器不支援自動朗讀', null,
    ttsOk ? () => {
      const u = new SpeechSynthesisUtterance('語音測試正常');
      u.lang = 'zh-TW';
      window.speechSynthesis.speak(u);
    } : null);

  const totalQ = BUILTIN_QUESTIONS.length + (state.customQuestions?.length || 0);
  addCheck('system', totalQ > 0 && STICKERS.length > 0 ? 'pass' : 'fail',
    `題庫與貼紙檢查（${totalQ} 題 / ${STICKERS.length} 張）`, '資料完整');

  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const passCount = checks.filter(c => c.status === 'pass').length;

  return { ok: failCount === 0, passCount, warnCount, failCount, visibleBtnCount, mapCardCount: nodes.length, checks };
}

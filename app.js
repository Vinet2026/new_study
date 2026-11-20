import { renderZhuyinHTML, escapeHTML } from './zhuyin-dict.js';
import { BUILTIN_QUESTIONS, TERRITORIES, STICKERS } from './questions.js';
import { loadAppState, saveAppState, VoiceDB, TransferCode } from './storage.js';
import { buildExpeditionDeck, updateMonsterRecord } from './mistake-pool.js';
import { speakTTS, playFeedbackVoice } from './voice.js';

const voiceDB = new VoiceDB();
let state = loadAppState();
let softLandingPending = false;
let currentMathAnswer = null;
let pendingParentAction = null;

let session = null;
let optionLocked = false;
let isSpeakingNow = false;
let palmState = { left: false, right: false };

function commitState() {
  saveAppState(state);
  renderHeaderAndHome();
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove('show'), 2400);
}

function renderHeaderAndHome() {
  const p4 = state.profiles['4y'];
  const p6 = state.profiles['6y'];
  document.getElementById('header-stats').textContent =
    `🦖 小恐龍 🌱${p4.starsEasy} 🔥${p4.starsHard} | 🚀 太空人 🌱${p6.starsEasy} 🔥${p6.starsHard}`;

  document.getElementById('badge-4y').textContent = `🌱${p4.starsEasy} 🔥${p4.starsHard}`;
  document.getElementById('badge-6y').textContent = `🌱${p6.starsEasy} 🔥${p6.starsHard}`;

  document.getElementById('card-4y').classList.toggle('active', state.activeProfile === '4y');
  document.getElementById('card-6y').classList.toggle('active', state.activeProfile === '6y');

  document.getElementById('toggle-listen-first').checked = !!state.prefs.listenFirst;
  document.getElementById('toggle-debounce').checked = state.prefs.debounce !== false;

  const prof = state.activeProfile;
  const label = prof === '4y' ? '🦖 小恐龍號（幼兒園）' : '🚀 太空人號（國小 108 課綱）';
  document.getElementById('territory-title').textContent = `🗺️ ${label} — 選擇領土出征`;

  const pool = state.wrongPool[prof] || {};
  const dueCount = Object.values(pool).filter(m => m.nextReviewAt <= Date.now()).length;
  document.getElementById('monster-pool-summary').textContent =
    `錯題怪獸池：目前 ${Object.keys(pool).length} 隻（其中 ${dueCount} 隻已可再次挑戰）`;

  document.getElementById('territory-list').innerHTML = TERRITORIES.map(t => `
    <button class="territory-btn" onclick="startTerritory('${t.id}')">
      <div style="font-weight:800; font-size:1.05rem;">${escapeHTML(t.name)}</div>
      <div class="muted" style="margin-top:4px;">${escapeHTML(t.desc)}</div>
    </button>
  `).join('');
}

function selectProfile(prof) {
  state.activeProfile = prof;
  commitState();
}

function togglePref(key, val) {
  state.prefs[key] = val;
  commitState();
}

function goHome() {
  session = null;
  document.getElementById('view-quiz').classList.add('hidden');
  document.getElementById('view-home').classList.remove('hidden');
  renderHeaderAndHome();
}

function abortQuiz() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  goHome();
}

function getAllQuestionsForProfile(prof) {
  return [
    ...BUILTIN_QUESTIONS.filter(q => q.profile === prof),
    ...(state.customQuestions || []).filter(q => q.profile === prof)
  ];
}

function startDailyExpedition(prof) {
  state.activeProfile = prof;
  const deck = buildExpeditionDeck(getAllQuestionsForProfile(prof), state.wrongPool[prof], 'all', 6);
  session = { mode: 'daily', profile: prof, deck, index: 0, combo: 0, earnedEasy: 0, earnedHard: 0 };
  enterQuizView();
}

function startTerritory(catId) {
  const prof = state.activeProfile;
  const deck = buildExpeditionDeck(getAllQuestionsForProfile(prof), state.wrongPool[prof], catId, 5);
  session = { mode: 'territory', profile: prof, deck, index: 0, combo: 0, earnedEasy: 0, earnedHard: 0 };
  enterQuizView();
}

function startCoopBoss() {
  const deck4 = buildExpeditionDeck(getAllQuestionsForProfile('4y'), state.wrongPool['4y'], 'all', 6).map(q => ({ ...q, turnOwner: '4y' }));
  const deck6 = buildExpeditionDeck(getAllQuestionsForProfile('6y'), state.wrongPool['6y'], 'all', 6).map(q => ({ ...q, turnOwner: '6y' }));
  const interleaved = [];
  for (let i = 0; i < 6; i++) {
    if (deck4[i]) interleaved.push(deck4[i]);
    if (deck6[i]) interleaved.push(deck6[i]);
  }
  session = { mode: 'boss', profile: '4y', deck: interleaved, index: 0, combo: 0, bossHp: 10, bossMaxHp: 10, frozen: { '4y': false, '6y': false } };
  palmState = { left: false, right: false };
  enterQuizView();
}

function enterQuizView() {
  document.getElementById('view-home').classList.add('hidden');
  document.getElementById('view-quiz').classList.remove('hidden');
  renderQuestion();
}

function renderQuestion() {
  if (!session) return;
  const q = session.deck[session.index % session.deck.length];
  const isBoss = session.mode === 'boss';
  const currentTurn = isBoss ? q.turnOwner : session.profile;

  const box = document.getElementById('quiz-box');
  box.classList.remove('turn-dino', 'turn-astro');
  box.classList.add(currentTurn === '4y' ? 'turn-dino' : 'turn-astro');

  document.getElementById('quiz-mode-pill').textContent =
    isBoss ? '⚔️ 雙寶協力打 Boss' : (session.mode === 'daily' ? '⚡ 今日一鍵出征' : '🗺️ 領土闖關');
  document.getElementById('quiz-monster-badge').classList.toggle('hidden', !q.isReviewMonster);
  document.getElementById('quiz-progress-pill').textContent =
    isBoss ? `回合 ${session.index + 1}` : `第 ${session.index + 1} / ${session.deck.length} 題`;

  const bossHud = document.getElementById('boss-hud');
  bossHud.classList.toggle('hidden', !isBoss);
  if (isBoss) {
    document.getElementById('boss-hp-fill').style.width = `${Math.max(0, (session.bossHp / session.bossMaxHp) * 100)}%`;
    document.getElementById('boss-name-hp').textContent = `🐉 蛀牙巨龍 HP：${session.bossHp} / ${session.bossMaxHp}`;
    document.getElementById('boss-turn-label').textContent =
      currentTurn === '4y' ? '目前回合：🦖 小恐龍（左）' : '目前回合：🚀 太空人（右）';
    const freezeEl = document.getElementById('boss-freeze-alert');
    const fList = [session.frozen['4y'] ? '🦖 小恐龍被冰凍' : '', session.frozen['6y'] ? '🚀 太空人被冰凍' : ''].filter(Boolean);
    freezeEl.style.display = fList.length ? 'block' : 'none';
    if (fList.length) freezeEl.textContent = `❄️ 狀態：${fList.join('、')}！隊友答對即可破冰並打出 2 點傷害！`;
  }

  document.getElementById('question-text').innerHTML = renderZhuyinHTML(q.q);
  document.getElementById('feedback-msg').textContent = '';

  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  const lockBeforeListen = !!state.prefs.listenFirst;
  isSpeakingNow = lockBeforeListen;

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn' + (lockBeforeListen ? ' listening-lock' : '');
    btn.disabled = lockBeforeListen;
    btn.innerHTML = `<span class="zhuyin-text">${renderZhuyinHTML(opt)}</span>`;
    btn.onclick = () => handleAnswer(idx, btn, q, currentTurn);
    grid.appendChild(btn);
  });

  renderComboPips();
  updatePalmZone();

  speakTTS(q.q, state.prefs.voiceRate, () => {
    isSpeakingNow = false;
    document.querySelectorAll('#options-grid .option-btn').forEach(b => {
      b.disabled = false;
      b.classList.remove('listening-lock');
    });
  });
}

function replayCurrentQuestion() {
  if (!session) return;
  const q = session.deck[session.index % session.deck.length];
  speakTTS(q.q, state.prefs.voiceRate);
}

function renderComboPips() {
  const wrap = document.getElementById('combo-pips');
  wrap.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const pip = document.createElement('div');
    pip.className = 'combo-pip' + (i < session.combo ? ' filled' : '');
    wrap.appendChild(pip);
  }
}

function handleAnswer(selectedIdx, btnEl, q, turnProfile) {
  if (optionLocked || isSpeakingNow) return;
  if (state.prefs.debounce !== false) {
    optionLocked = true;
    setTimeout(() => { optionLocked = false; }, 650);
  }
  document.querySelectorAll('#options-grid .option-btn').forEach(b => b.disabled = true);

  const isCorrect = selectedIdx === q.answer;
  const feedbackEl = document.getElementById('feedback-msg');

  if (session.mode === 'boss') {
    if (isCorrect) {
      btnEl.classList.add('correct');
      session.combo += 1;
      const other = turnProfile === '4y' ? '6y' : '4y';
      let dmg = 1;
      let extra = '';
      if (session.frozen[other]) {
        session.frozen[other] = false;
        dmg = 2;
        extra = ' ❄️ 破冰救援成功！';
      }
      session.bossHp = Math.max(0, session.bossHp - dmg);
      feedbackEl.style.color = '#16a34a';
      feedbackEl.textContent = `⚔️ 命中！扣 Boss ${dmg} 滴血！${extra}`;
      playFeedbackVoice(voiceDB, 'correct', '哇！太厲害了，打中大魔王了！', state.prefs.voiceRate);
      if (session.bossHp <= 0) {
        setTimeout(() => finishBossVictory(), 900);
        return;
      }
    } else {
      btnEl.classList.add('wrong');
      session.combo = 0;
      session.frozen[turnProfile] = true;
      updateMonsterRecord(state.wrongPool[turnProfile], q, false);
      commitState();
      feedbackEl.style.color = '#dc2626';
      feedbackEl.textContent = '❄️ 被冰凍了！換隊友上場救援！';
      playFeedbackVoice(voiceDB, 'wrong', '沒關係，差一點點，換隊友來幫忙！', state.prefs.voiceRate);
    }
    setTimeout(() => { session.index += 1; renderQuestion(); }, 1100);
    return;
  }

  const mStatus = updateMonsterRecord(state.wrongPool[turnProfile], q, isCorrect);
  const pState = state.profiles[turnProfile];

  if (isCorrect) {
    btnEl.classList.add('correct');
    session.combo += 1;
    pState.starsEasy += 1;
    session.earnedEasy += 1;
    let bonus = '';
    if (session.combo >= 3) {
      pState.starsHard += 1;
      session.earnedHard += 1;
      session.combo = 0;
      bonus = ' 🔥 連對3題獲得困難星！';
    }
    if (mStatus === 'captured') {
      pState.starsHard += 1;
      bonus += ' 👾 收服錯題怪獸！';
    } else if (mStatus === 'weakened') {
      bonus += ' 👾 怪獸變虛弱了！';
    }
    unlockProgressStickers(turnProfile);
    commitState();
    feedbackEl.style.color = '#16a34a';
    feedbackEl.textContent = `🌟 答對了！${bonus}`;
    playFeedbackVoice(voiceDB, 'correct', '哇！寶貝答對了，你好棒喔！', state.prefs.voiceRate);
  } else {
    btnEl.classList.add('wrong');
    session.combo = 0;
    commitState();
    feedbackEl.style.color = '#dc2626';
    feedbackEl.textContent = '👾 小怪獸逃跑了，放進錯題怪獸池下次再抓！';
    playFeedbackVoice(voiceDB, 'wrong', '沒關係，差一點點，再聽一次看看喔！', state.prefs.voiceRate);
  }

  setTimeout(() => {
    session.index += 1;
    if (session.index >= session.deck.length) finishStandardSession();
    else renderQuestion();
  }, 1150);
}

function unlockProgressStickers(prof) {
  const p = state.profiles[prof];
  const total = p.starsEasy + p.starsHard * 2;
  [
    { req: 1, id: 's1' }, { req: 4, id: 's2' }, { req: 7, id: 's3' }, { req: 10, id: 's4' },
    { req: 3, id: 's5', needHard: 1 }, { req: 6, id: 's6', needHard: 2 },
    { req: 9, id: 's7', needHard: 3 }, { req: 12, id: 's8', needHard: 4 }
  ].forEach(t => {
    if (total >= t.req && (!t.needHard || p.starsHard >= t.needHard) && !p.unlockedStickers.includes(t.id)) {
      p.unlockedStickers.push(t.id);
    }
  });
}

function finishStandardSession() {
  playFeedbackVoice(voiceDB, 'victory', '太強了吧！全部過關，送你新星星！', state.prefs.voiceRate);
  showToast(`🏆 過關！獲得 🌱${session.earnedEasy} 簡單星、🔥${session.earnedHard} 困難星`);
  goHome();
  checkSoftLandingLock();
}

function finishBossVictory() {
  ['4y', '6y'].forEach(prof => {
    const p = state.profiles[prof];
    p.starsEasy += 3;
    p.starsHard += 2;
    ['c1', 'c2', 'c3', 'c4'].forEach(cid => {
      if (!p.unlockedStickers.includes(cid)) p.unlockedStickers.push(cid);
    });
  });
  commitState();
  playFeedbackVoice(voiceDB, 'victory', '太強了！雙寶聯手打敗大魔王！', state.prefs.voiceRate);
  openTheater(STICKERS.find(s => s.id === 'c3'));
  goHome();
  checkSoftLandingLock();
}

function updatePalmZone() {
  const zone = document.getElementById('dual-palm-zone');
  zone.classList.toggle('hidden', !(session && session.mode === 'boss' && session.combo >= 2));
}

function setPalm(side, pressed) {
  palmState[side] = pressed;
  document.getElementById('palm-left').classList.toggle('pressed', palmState.left);
  document.getElementById('palm-right').classList.toggle('pressed', palmState.right);
  if (palmState.left && palmState.right && session && session.mode === 'boss') {
    palmState = { left: false, right: false };
    session.combo = 0;
    session.bossHp = Math.max(0, session.bossHp - 3);
    renderComboPips();
    updatePalmZone();
    showToast('💥 雙寶合體必殺技！扣 Boss 3 滴血！');
    playFeedbackVoice(voiceDB, 'correct', '合體大絕招發動！', state.prefs.voiceRate);
    if (session.bossHp <= 0) setTimeout(() => finishBossVictory(), 700);
    else renderQuestion();
  }
}

function openStickerModal() {
  document.getElementById('sticker-modal').classList.add('open');
  renderStickerModal(state.activeProfile);
}

function renderStickerModal(prof) {
  document.getElementById('sticker-tab-4y').className = `btn btn-sm ${prof === '4y' ? 'btn-primary' : 'btn-ghost'}`;
  document.getElementById('sticker-tab-6y').className = `btn btn-sm ${prof === '6y' ? 'btn-accent' : 'btn-ghost'}`;
  const unlocked = state.profiles[prof].unlockedStickers || [];
  document.getElementById('sticker-count-pill').textContent = `已解鎖 ${unlocked.length} / ${STICKERS.length} 張`;
  document.getElementById('sticker-grid').innerHTML = STICKERS.map(s => {
    const ok = unlocked.includes(s.id);
    const cls = ['sticker-card', ok ? '' : 'locked', s.tier === 'gold' ? 'gold' : '', s.tier === 'coop' ? 'coop' : ''].join(' ');
    const tag = s.tier === 'gold' ? '🔥 金星小劇場' : (s.tier === 'coop' ? '🤝 雙寶合體' : '🌱 榮譽貼紙');
    return `<div class="${cls}" onclick="${ok ? `openTheaterById('${s.id}')` : ''}">
      <span class="sticker-emoji">${ok ? s.emoji : '🔒'}</span>
      <div style="font-weight:800; font-size:0.92rem;">${escapeHTML(s.name)}</div>
      <div class="muted" style="font-size:0.75rem; margin-top:2px;">${tag}</div>
    </div>`;
  }).join('');
}

function openTheaterById(id) {
  const s = STICKERS.find(x => x.id === id);
  if (s) openTheater(s);
}

function openTheater(s) {
  document.getElementById('theater-emoji').textContent = s.emoji;
  document.getElementById('theater-title').textContent = s.name;
  document.getElementById('theater-story').textContent = s.story;
  document.getElementById('theater-modal').classList.add('open');
  speakTTS(`${s.name}。${s.story}`, state.prefs.voiceRate);
}

function closeTheater() {
  document.getElementById('theater-modal').classList.remove('open');
}

const VOICE_SLOTS = [
  { key: 'correct', title: '🌟 答對題目時的誇獎聲', suggest: '哇！寶貝答對了，你好棒喔！' },
  { key: 'wrong', title: '🌱 答錯時的溫柔鼓勵', suggest: '沒關係，差一點點，再聽一次看看喔！' },
  { key: 'victory', title: '🏆 整關完成的大慶祝', suggest: '太強了吧！全部過關，送你一張新貼紙！' }
];
let activeRecorder = null;
let recordChunks = [];

function openVoiceModal() {
  document.getElementById('voice-rate').value = String(state.prefs.voiceRate || 1.0);
  document.getElementById('voice-modal').classList.add('open');
  renderRecorderList();
}

function saveVoiceRate(val) {
  state.prefs.voiceRate = Number(val);
  commitState();
}

function testTTS() {
  speakTTS('你好，我是小老師，一起來闖關吧！', state.prefs.voiceRate);
}

async function renderRecorderList() {
  const rows = await Promise.all(VOICE_SLOTS.map(async slot => {
    const existing = await voiceDB.get(slot.key);
    return `<div style="border:1px solid var(--border); border-radius:14px; padding:12px; margin-bottom:10px; background:#f8fafc;">
      <div class="row" style="justify-content:space-between;">
        <div><strong>${slot.title}</strong><div class="muted">台詞建議：「${slot.suggest}」</div></div>
        <span class="pill" id="rec-status-${slot.key}">${existing ? '✅ 已錄製真人語音' : '⚪ 尚未錄音'}</span>
      </div>
      <div class="row" style="margin-top:10px;">
        <button class="btn btn-danger btn-sm" onclick="startRecording('${slot.key}')">🔴 開始錄音</button>
        <button class="btn btn-ghost btn-sm" onclick="stopRecording()">⏹ 停止</button>
        <button class="btn btn-primary btn-sm" onclick="previewVoice('${slot.key}', '${slot.suggest}')">▶ 試聽</button>
        <button class="btn btn-ghost btn-sm" onclick="deleteVoice('${slot.key}')">🗑️ 刪除</button>
      </div>
    </div>`;
  }));
  document.getElementById('recorder-list').innerHTML = rows.join('');
}

async function startRecording(key) {
  if (activeRecorder && activeRecorder.state === 'recording') {
    showToast('目前正在錄音中，請先按停止');
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
    activeRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    recordChunks = [];
    activeRecorder.ondataavailable = e => { if (e.data && e.data.size > 0) recordChunks.push(e.data); };
    activeRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      await voiceDB.save(key, new Blob(recordChunks, { type: activeRecorder.mimeType || 'audio/webm' }));
      showToast('🎙️ 真人語音已存入 IndexedDB！');
      renderRecorderList();
    };
    activeRecorder.start();
    document.getElementById(`rec-status-${key}`).textContent = '🔴 錄音中...';
  } catch {
    showToast('無法使用麥克風，請確認瀏覽器權限');
  }
}

function stopRecording() {
  if (activeRecorder && activeRecorder.state === 'recording') activeRecorder.stop();
}

function previewVoice(key, fallback) {
  playFeedbackVoice(voiceDB, key, fallback, state.prefs.voiceRate);
}

async function deleteVoice(key) {
  await voiceDB.remove(key);
  showToast('已刪除該段真人錄音');
  renderRecorderList();
}

function openParentLockModal(afterUnlock) {
  pendingParentAction = afterUnlock || (() => openParentAdminModal());
  const a = Math.floor(Math.random() * 8) + 6;
  const b = Math.floor(Math.random() * 8) + 3;
  const c = Math.floor(Math.random() * 19) + 12;
  currentMathAnswer = a * b + c;
  document.getElementById('math-challenge-question').textContent = `${a} × ${b} + ${c} = ?`;
  document.getElementById('math-challenge-input').value = '';
  document.getElementById('parent-lock-modal').classList.add('open');
  setTimeout(() => document.getElementById('math-challenge-input').focus(), 80);
}

function verifyMathChallenge() {
  if (Number(document.getElementById('math-challenge-input').value) === currentMathAnswer) {
    closeModal('parent-lock-modal');
    if (pendingParentAction) pendingParentAction();
  } else {
    showToast('算數答案不對喔，請再算一次！');
  }
}

function closeEyecareLockToParent() {
  openParentLockModal(() => {
    stopEyecareTimer();
    document.getElementById('eyecare-lock').classList.remove('open');
    openParentAdminModal();
  });
}

function openParentAdminModal() {
  updateCustomPreview();
  refreshCustomCountLabel();
  document.getElementById('parent-admin-modal').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function startEyecareTimer(minutes) {
  state.eyecare.endAt = Date.now() + minutes * 60 * 1000;
  softLandingPending = false;
  commitState();
  showToast(`⏱️ 已啟動 ${minutes} 分鐘護眼計時`);
}

function stopEyecareTimer() {
  state.eyecare.endAt = null;
  softLandingPending = false;
  document.getElementById('soft-landing-banner').classList.remove('show');
  document.getElementById('eyecare-lock').classList.remove('open');
  commitState();
  showToast('已停止護眼計時');
}

function checkSoftLandingLock() {
  if (softLandingPending && state.eyecare.endAt && Date.now() >= state.eyecare.endAt) {
    document.getElementById('eyecare-lock').classList.add('open');
  }
}

setInterval(() => {
  const timerEl = document.getElementById('header-timer');
  const bannerEl = document.getElementById('soft-landing-banner');
  if (!state.eyecare.endAt) {
    timerEl.textContent = '⏱️ 護眼：未啟動';
    bannerEl.classList.remove('show');
    return;
  }
  const remMs = state.eyecare.endAt - Date.now();
  if (remMs > 0) {
    timerEl.textContent = `⏱️ 護眼剩餘 ${Math.ceil(remMs / 60000)} 分`;
    if (remMs <= 2 * 60 * 1000) {
      softLandingPending = true;
      bannerEl.classList.add('show');
    }
  } else {
    softLandingPending = true;
    timerEl.textContent = '⏱️ 時間到（等待本關結算）';
    if (!session) document.getElementById('eyecare-lock').classList.add('open');
  }
}, 2000);

function updateCustomPreview() {
  const text = document.getElementById('custom-q-text').value || '輸入題目後預覽直式注音';
  document.getElementById('custom-q-preview').innerHTML = renderZhuyinHTML(text);
}

function refreshCustomCountLabel() {
  document.getElementById('custom-count-label').textContent =
    `目前自訂題數：${(state.customQuestions || []).length} 題`;
}

function addCustomQuestion() {
  const profile = document.getElementById('custom-profile').value;
  const category = document.getElementById('custom-category').value;
  const q = document.getElementById('custom-q-text').value.trim();
  const opts = [0, 1, 2].map(i => document.getElementById(`custom-opt-${i}`).value.trim());
  const answer = Number(document.getElementById('custom-ans-idx').value);
  if (!q || opts.some(o => !o)) {
    showToast('請完整填寫題目與三個選項！');
    return;
  }
  state.customQuestions.push({
    id: 'custom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    profile, category, q, options: opts, answer
  });
  commitState();
  refreshCustomCountLabel();
  document.getElementById('custom-q-text').value = '';
  [0, 1, 2].forEach(i => { document.getElementById(`custom-opt-${i}`).value = ''; });
  updateCustomPreview();
  showToast('✅ 已新增自訂題目！');
}

function importCustomJSON() {
  try {
    const arr = JSON.parse(document.getElementById('json-bank-io').value.trim());
    if (!Array.isArray(arr)) throw new Error('必須是 JSON 陣列');
    let added = 0;
    arr.forEach((item, idx) => {
      if (item && item.q && Array.isArray(item.options) && item.options.length >= 2) {
        state.customQuestions.push({
          id: item.id || `json_${Date.now()}_${idx}`,
          profile: item.profile === '6y' ? '6y' : '4y',
          category: item.category || 'custom',
          q: String(item.q),
          options: item.options.map(String),
          answer: Number(item.answer) || 0
        });
        added += 1;
      }
    });
    commitState();
    refreshCustomCountLabel();
    showToast(`📥 成功匯入 ${added} 題自訂題目！`);
  } catch (err) {
    showToast('JSON 格式有誤：' + err.message);
  }
}

function exportCustomJSON() {
  document.getElementById('json-bank-io').value = JSON.stringify(state.customQuestions, null, 2);
  showToast('📤 已匯出目前自訂題庫 JSON');
}

async function generateTransferCode() {
  try {
    const code = await TransferCode.encode({
      profiles: state.profiles,
      wrongPool: state.wrongPool,
      customQuestions: state.customQuestions,
      prefs: state.prefs
    });
    document.getElementById('transfer-code-box').value = code;
    showToast(`🔐 已產生壓縮引繼碼（${code.length} 字元）`);
  } catch (err) {
    showToast('產生失敗：' + err.message);
  }
}

async function applyTransferCode() {
  try {
    const decoded = await TransferCode.decode(document.getElementById('transfer-code-box').value);
    state.profiles = decoded.profiles || state.profiles;
    state.wrongPool = decoded.wrongPool || state.wrongPool;
    state.customQuestions = decoded.customQuestions || state.customQuestions;
    state.prefs = { ...state.prefs, ...(decoded.prefs || {}) };
    commitState();
    refreshCustomCountLabel();
    showToast('📲 已套用跨裝置引繼碼！');
  } catch (err) {
    showToast('套用失敗：' + err.message);
  }
}

Object.assign(window, {
  selectProfile, togglePref, goHome, abortQuiz, startDailyExpedition, startTerritory,
  startCoopBoss, replayCurrentQuestion, setPalm, openStickerModal, renderStickerModal,
  openTheaterById, closeTheater, openVoiceModal, saveVoiceRate, testTTS,
  startRecording, stopRecording, previewVoice, deleteVoice, openParentLockModal,
  verifyMathChallenge, closeEyecareLockToParent, closeModal, startEyecareTimer,
  stopEyecareTimer, updateCustomPreview, addCustomQuestion, importCustomJSON,
  exportCustomJSON, generateTransferCode, applyTransferCode
});

renderHeaderAndHome();
if ('speechSynthesis' in window) window.speechSynthesis.getVoices();

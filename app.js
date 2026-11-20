import { renderZhuyinHTML, escapeHTML } from './zhuyin-dict.js';
import { GRADE_LEVELS, SUBJECTS_BY_PROFILE, BUILTIN_QUESTIONS, STICKERS } from './questions.js';
import { MATERIAL_INFO, ISLAND_NODES, BASE_PLOT_COORDS, BASE_CATALOG, getKingdomTitle, renderBuildingSVG } from './map-data.js';
import { loadAppState, saveAppState, VoiceDB, TransferCode } from './storage.js';
import { buildExpeditionDeck, updateMonsterRecord } from './mistake-pool.js';
import { speakTTS, playFeedbackVoice } from './voice.js';
import { runLivePageDiagnostics } from './self-check.js';

const voiceDB = new VoiceDB();
let state = loadAppState();
let softLandingPending = false;
let currentMathAnswer = null;
let pendingParentAction = null;
let session = null;
let optionLocked = false;
let isSpeakingNow = false;
let palmState = { left: false, right: false };
let avatarMovingTimer = null;

function commitState() {
  saveAppState(state);
  renderAll();
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove('show'), 2500);
}

function getTotalBuildingLevel(prof) {
  const p = state.profiles[prof];
  const mapSum = Object.values(p.nodeTowers || {}).reduce((acc, lv) => acc + (Number(lv) || 0), 0);
  const baseSum = (p.basePlots || []).reduce((acc, plot) => acc + (plot ? Number(plot.level) || 0 : 0), 0);
  return mapSum + baseSum;
}

function renderAll() {
  const p4 = state.profiles['4y'];
  const p6 = state.profiles['6y'];
  document.getElementById('badge-4y').textContent = `🌱${p4.starsEasy} 🔥${p4.starsHard} ｜ 🪵${p4.materials}`;
  document.getElementById('badge-6y').textContent = `🌱${p6.starsEasy} 🔥${p6.starsHard} ｜ ⚡${p6.materials}`;
  document.getElementById('card-4y').classList.toggle('active', state.activeProfile === '4y');
  document.getElementById('card-6y').classList.toggle('active', state.activeProfile === '6y');

  const prof = state.activeProfile;
  const p = state.profiles[prof];
  const mat = MATERIAL_INFO[prof];
  const totalLv = getTotalBuildingLevel(prof);
  const kTitle = getKingdomTitle(totalLv);

  document.getElementById('kingdom-title-display').textContent = `${kTitle.icon} ${kTitle.title}`;
  document.getElementById('kingdom-lv-display').textContent =
    `全島＋基地建築總等級：Lv.${totalLv}（繼續蓋塔與升級基地可晉升更高稱號！）`;
  document.getElementById('material-pill').textContent = `${mat.icon} ${mat.name}：${p.materials}`;
  document.getElementById('base-material-pill').textContent = `${mat.icon} 可用${mat.name}：${p.materials}`;

  document.getElementById('tab-btn-map').classList.toggle('active', state.activeTab === 'map');
  document.getElementById('tab-btn-base').classList.toggle('active', state.activeTab === 'base');
  document.getElementById('panel-map').classList.toggle('hidden', state.activeTab !== 'map');
  document.getElementById('panel-base').classList.toggle('hidden', state.activeTab !== 'base');

  renderSubjectsAndGrades();
  renderIslandMap();
  renderSelectedNodeCard();
  renderBaseGrid();
}

function renderSubjectsAndGrades() {
  const prof = state.activeProfile;
  const p = state.profiles[prof];
  const subjects = SUBJECTS_BY_PROFILE[prof];
  const activeSubj = state.activeSubject[prof] || subjects[0].id;

  document.getElementById('subject-pills').innerHTML = subjects.map(s => {
    const done = ISLAND_NODES.filter(n => p.conqueredNodes[`${s.id}_${n.id}`]).length;
    return `<button type="button" class="subj-pill ${activeSubj === s.id ? 'active' : ''}" onclick="selectSubject('${s.id}')">
      <span>${s.icon} ${escapeHTML(s.name)}</span>
      <span style="opacity:0.8; font-size:0.78rem;">${done}/10</span>
    </button>`;
  }).join('');

  const grades = [{ id: 'ALL', label: '✨ 全部年級' }, ...(GRADE_LEVELS[prof] || [])];
  const activeGrade = state.selectedGrade[prof] || 'ALL';
  document.getElementById('grade-pills').innerHTML = grades.map(g => `
    <button type="button" class="grade-pill ${activeGrade === g.id ? 'active' : ''}" onclick="selectGrade('${g.id}')">
      ${escapeHTML(g.label)}
    </button>
  `).join('');
}

function renderIslandMap() {
  const prof = state.activeProfile;
  const p = state.profiles[prof];
  const subj = state.activeSubject[prof];
  const curNodeId = p.currentNode || 1;

  const layer = document.getElementById('island-nodes-layer');
  layer.innerHTML = ISLAND_NODES.map(n => {
    const key = `${subj}_${n.id}`;
    const isConquered = !!p.conqueredNodes[key];
    const towerLv = p.nodeTowers[key] || 0;
    const isSelected = curNodeId === n.id;

    const visual = towerLv > 0
      ? renderBuildingSVG(prof, 'tower', towerLv).replace('class="bldg-svg', 'class="bldg-svg-sm')
      : `<span style="font-size:1.45rem;">${n.emoji}</span>`;

    return `<button type="button" class="map-node ${isConquered ? 'conquered' : ''} ${isSelected ? 'selected' : ''}"
              style="left:${n.x}%; top:${n.y}%;" onclick="moveToNode(${n.id})">
      ${visual}
      <span class="map-node-label">${n.id}.${towerLv > 0 ? `Lv.${towerLv}` : escapeHTML(n.shortZone)}</span>
    </button>`;
  }).join('');

  const curNode = ISLAND_NODES.find(n => n.id === curNodeId) || ISLAND_NODES[0];
  const avatar = document.getElementById('map-avatar');
  avatar.textContent = prof === '4y' ? '🦖' : '🚀';
  avatar.style.left = `${curNode.x}%`;
  avatar.style.top = `${curNode.y}%`;
}

function moveToNode(targetId) {
  const prof = state.activeProfile;
  const p = state.profiles[prof];
  const startId = p.currentNode || 1;
  if (startId === targetId) {
    renderSelectedNodeCard();
    return;
  }

  // 角色逐格跳動移動動畫
  clearInterval(avatarMovingTimer);
  const avatar = document.getElementById('map-avatar');
  avatar.classList.add('hopping');
  let step = startId;
  const dir = targetId > startId ? 1 : -1;

  avatarMovingTimer = setInterval(() => {
    step += dir;
    const node = ISLAND_NODES.find(n => n.id === step);
    if (node) {
      avatar.style.left = `${node.x}%`;
      avatar.style.top = `${node.y}%`;
    }
    if (step === targetId) {
      clearInterval(avatarMovingTimer);
      avatar.classList.remove('hopping');
      p.currentNode = targetId;
      commitState();
    }
  }, 240);
}

function renderSelectedNodeCard() {
  const prof = state.activeProfile;
  const p = state.profiles[prof];
  const subj = state.activeSubject[prof];
  const mat = MATERIAL_INFO[prof];
  const node = ISLAND_NODES.find(n => n.id === (p.currentNode || 1)) || ISLAND_NODES[0];
  const key = `${subj}_${node.id}`;
  const isConquered = !!p.conqueredNodes[key];
  const towerLv = p.nodeTowers[key] || 0;
  const upgradeCost = (towerLv + 1) * 2;

  const towerLabel = towerLv === 0 ? '尚未蓋塔' : (towerLv === 1 ? 'Lv.1 簡易營地' : (towerLv === 2 ? 'Lv.2 精緻防禦塔' : 'Lv.3 黃金傳奇堡壘'));
  const buildBtnHtml = !isConquered
    ? `<button type="button" class="btn btn-ghost" style="width:100%;" disabled>🔒 先打敗怪獸佔領再蓋塔</button>`
    : (towerLv >= 3
      ? `<button type="button" class="btn btn-warning" style="width:100%;" disabled>👑 此領土已升級至最高 Lv.3 傳奇外觀！</button>`
      : `<button type="button" class="btn btn-warning" style="width:100%;" onclick="upgradeMapTower('${key}')">
          🔨 ${towerLv === 0 ? '建造 Lv.1 領土建築' : `升級至 Lv.${towerLv + 1} 更精細外觀`}（花費 ${mat.icon}${upgradeCost}）
        </button>`);

  document.getElementById('node-action-card').innerHTML = `
    <div class="row" style="justify-content:space-between; margin-bottom:12px;">
      <div class="row">
        <div style="width:62px; height:62px; border-radius:16px; background:#f8fafc; border:1px solid var(--border); display:flex; align-items:center; justify-content:center;">
          ${towerLv > 0 ? renderBuildingSVG(prof, 'tower', towerLv) : `<span style="font-size:2.2rem;">${node.emoji}</span>`}
        </div>
        <div>
          <div class="muted">第 ${node.id} 區・${escapeHTML(node.zone)}</div>
          <div style="font-size:1.25rem; font-weight:900;">${escapeHTML(node.monster)}</div>
          <div class="row" style="margin-top:4px;">
            <span class="pill" style="font-size:0.76rem;">${isConquered ? '🚩 已佔領' : '尚未佔領'}</span>
            <span class="pill" style="font-size:0.76rem;">${towerLabel}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <button type="button" class="btn btn-sm ${state.difficulty === 'easy' ? 'btn-primary' : 'btn-ghost'}" onclick="setDifficulty('easy')">🌱 簡單</button>
        <button type="button" class="btn btn-sm ${state.difficulty === 'hard' ? 'btn-danger' : 'btn-ghost'}" onclick="setDifficulty('hard')">🔥 困難(材料×2)</button>
      </div>
    </div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <button type="button" class="btn btn-accent" style="width:100%; font-size:1.05rem;" onclick="startNodeBattle(${node.id})">
        ⚔️ 攻打 ${escapeHTML(node.monster)}！（勝利賺 ${mat.icon}）
      </button>
      ${buildBtnHtml}
    </div>
  `;
}

function upgradeMapTower(key) {
  const prof = state.activeProfile;
  const p = state.profiles[prof];
  const curLv = p.nodeTowers[key] || 0;
  if (curLv >= 3) return;
  const cost = (curLv + 1) * 2;
  if (p.materials < cost) {
    showToast(`${MATERIAL_INFO[prof].icon} 材料不足！還差 ${cost - p.materials} 個，快去打怪賺材料！`);
    return;
  }
  p.materials -= cost;
  p.nodeTowers[key] = curLv + 1;
  commitState();
  showToast(`🎉 建築升級至 Lv.${curLv + 1}！外觀變得更精細華麗了！`);
}

/**
 * 自由設計基地（6 塊空地）
 */
function getBaseBackgroundSVG(prof) {
  if (prof === '6y') {
    return `<svg viewBox="0 0 800 500" preserveAspectRatio="none" style="width:100%;height:100%;">
      <rect width="800" height="500" fill="#1e1b4b"/>
      <circle cx="90" cy="70" r="3" fill="#fef08a"/><circle cx="240" cy="45" r="2" fill="#fff"/>
      <circle cx="620" cy="60" r="3" fill="#93c5fd"/><circle cx="720" cy="90" r="2.5" fill="#fef08a"/>
      <ellipse cx="400" cy="360" rx="370" ry="220" fill="#312e81" stroke="#6366f1" stroke-width="6"/>
      <polyline points="176,170 416,130 640,180 632,375 400,360 160,370 176,170"
                fill="none" stroke="#38bdf8" stroke-width="5" stroke-dasharray="10 8" opacity="0.65"/>
      <circle cx="400" cy="250" r="38" fill="#1e293b" stroke="#38bdf8" stroke-width="3" opacity="0.7"/>
      <text x="400" y="255" text-anchor="middle" fill="#7dd3fc" font-size="14" font-weight="bold">星際核心</text>
    </svg>`;
  }
  return `<svg viewBox="0 0 800 500" preserveAspectRatio="none" style="width:100%;height:100%;">
    <rect width="800" height="500" fill="#bbf7d0"/>
    <ellipse cx="400" cy="260" rx="355" ry="215" fill="#dcfce7" stroke="#4ade80" stroke-width="8"/>
    <ellipse cx="640" cy="390" rx="75" ry="42" fill="#7dd3fc" stroke="#38bdf8" stroke-width="4" opacity="0.8"/>
    <polyline points="176,170 416,130 640,180 632,375 400,360 160,370 176,170"
              fill="none" stroke="#d97706" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>
    <text x="80" y="95" font-size="28">🌲</text><text x="705" y="95" font-size="28">🌴</text>
    <text x="65" y="455" font-size="26">🌿</text><text x="720" y="460" font-size="26">🌸</text>
  </svg>`;
}

function renderBaseGrid() {
  const prof = state.activeProfile;
  const p = state.profiles[prof];
  const catalog = BASE_CATALOG[prof];
  const plots = p.basePlots || [null, null, null, null, null, null];

  const wrap = document.getElementById('base-map-wrap');
  wrap.classList.toggle('astro-theme', prof === '6y');
  document.getElementById('base-map-title').textContent =
    prof === '4y' ? '🏗️ 小恐龍的恐龍樂園小地圖' : '🏗️ 太空人的星際基地小地圖';
  document.getElementById('base-bg-svg-holder').innerHTML = getBaseBackgroundSVG(prof);

  document.getElementById('base-nodes-layer').innerHTML = BASE_PLOT_COORDS.map((coord, idx) => {
    const plot = plots[idx];
    if (!plot) {
      return `<button type="button" class="base-plot-node" style="left:${coord.x}%; top:${coord.y}%;" onclick="walkToBasePlot(${idx})">
        ${renderBuildingSVG(prof, 'empty', 0)}
        <span class="base-plot-tag">＋ ${coord.label}</span>
      </button>`;
    }
    const item = catalog.find(c => c.type === plot.type) || catalog[0];
    return `<button type="button" class="base-plot-node lv${plot.level}" style="left:${coord.x}%; top:${coord.y}%;" onclick="walkToBasePlot(${idx})">
      ${renderBuildingSVG(prof, plot.type, plot.level)}
      <span class="base-plot-tag">${escapeHTML(item.name)} Lv.${plot.level}</span>
    </button>`;
  }).join('');

  const avatar = document.getElementById('base-avatar');
  avatar.textContent = prof === '4y' ? '🦖' : '🚀';
}

function walkToBasePlot(plotIdx) {
  const coord = BASE_PLOT_COORDS[plotIdx];
  const avatar = document.getElementById('base-avatar');
  if (coord && avatar) {
    avatar.classList.add('hopping');
    avatar.style.left = `${coord.x}%`;
    avatar.style.top = `${coord.y}%`;
    setTimeout(() => {
      avatar.classList.remove('hopping');
      openBasePlotModal(plotIdx);
    }, 340);
  } else {
    openBasePlotModal(plotIdx);
  }
}

function openBasePlotModal(plotIdx) {
  const prof = state.activeProfile;
  const p = state.profiles[prof];
  const mat = MATERIAL_INFO[prof];
  const catalog = BASE_CATALOG[prof];
  const existing = p.basePlots[plotIdx];

  const body = document.getElementById('base-modal-body');
  if (!existing) {
    document.getElementById('base-modal-title').textContent = `🏗️ 空地 #${plotIdx + 1} — 選擇建築風格`;
    body.innerHTML = catalog.map(c => `
      <div class="diag-item" style="background:#f8fafc;">
        <div class="row">
          ${renderBuildingSVG(prof, c.type, 1)}
          <div>
            <strong>${escapeHTML(c.name)}</strong>
            <div class="muted">${escapeHTML(c.desc)}</div>
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="buildOnBasePlot(${plotIdx}, '${c.type}')">
          建造 (${mat.icon}${c.cost[0]})
        </button>
      </div>
    `).join('');
  } else {
    const item = catalog.find(c => c.type === existing.type) || catalog[0];
    const nextLv = existing.level + 1;
    const cost = item.cost[existing.level] || 6;
    document.getElementById('base-modal-title').textContent = `✨ 管理：${item.name}（Lv.${existing.level}）`;
    body.innerHTML = `
      <div class="row" style="justify-content:center; gap:24px; margin:12px 0;">
        <div style="text-align:center;">
          <div class="muted">目前外觀 (Lv.${existing.level})</div>
          ${renderBuildingSVG(prof, existing.type, existing.level)}
        </div>
        ${existing.level < 3 ? `
          <div style="font-size:1.5rem;">➔</div>
          <div style="text-align:center;">
            <div class="muted">升級後外觀 (Lv.${nextLv})</div>
            ${renderBuildingSVG(prof, existing.type, nextLv)}
          </div>
        ` : ''}
      </div>
      <div class="row" style="justify-content:center; margin-top:14px;">
        ${existing.level < 3
          ? `<button type="button" class="btn btn-warning" onclick="upgradeBasePlot(${plotIdx})">🔨 升級至 Lv.${nextLv}（花費 ${mat.icon}${cost}）</button>`
          : `<span class="pill" style="background:#fef3c7;">👑 已達最高傳奇等級！</span>`}
        <button type="button" class="btn btn-ghost btn-sm" onclick="clearBasePlot(${plotIdx})">🗑️ 拆除改建</button>
      </div>
    `;
  }
  document.getElementById('base-build-modal').classList.add('open');
}

function buildOnBasePlot(plotIdx, type) {
  const prof = state.activeProfile;
  const p = state.profiles[prof];
  const item = BASE_CATALOG[prof].find(c => c.type === type);
  const cost = item ? item.cost[0] : 2;
  if (p.materials < cost) {
    showToast(`${MATERIAL_INFO[prof].icon} 材料不足！快去島嶼打怪賺材料吧！`);
    return;
  }
  p.materials -= cost;
  p.basePlots[plotIdx] = { type, level: 1 };
  closeModal('base-build-modal');
  commitState();
  showToast(`🏗️ 已建造 ${item.name} (Lv.1)！繼續升級外觀會更華麗！`);
}

function upgradeBasePlot(plotIdx) {
  const prof = state.activeProfile;
  const p = state.profiles[prof];
  const plot = p.basePlots[plotIdx];
  if (!plot || plot.level >= 3) return;
  const item = BASE_CATALOG[prof].find(c => c.type === plot.type);
  const cost = item ? item.cost[plot.level] : 4;
  if (p.materials < cost) {
    showToast(`${MATERIAL_INFO[prof].icon} 材料不足！還差 ${cost - p.materials} 個！`);
    return;
  }
  p.materials -= cost;
  plot.level += 1;
  closeModal('base-build-modal');
  commitState();
  showToast(`✨ ${item.name} 升到 Lv.${plot.level} 囉！裝飾變超豐富！`);
}

function clearBasePlot(plotIdx) {
  state.profiles[state.activeProfile].basePlots[plotIdx] = null;
  closeModal('base-build-modal');
  commitState();
  showToast('已清空這塊空地，可以重新設計建築！');
}

/**
 * 切換與出戰控制
 */
function selectProfile(prof) { state.activeProfile = prof; commitState(); }
function switchHomeTab(tab) { state.activeTab = tab; commitState(); }
function selectSubject(subjId) { state.activeSubject[state.activeProfile] = subjId; commitState(); }
function selectGrade(gradeId) { state.selectedGrade[state.activeProfile] = gradeId; commitState(); }
function setDifficulty(diff) { state.difficulty = diff; commitState(); }

function goHome() {
  session = null;
  document.getElementById('view-quiz').classList.add('hidden');
  document.getElementById('view-home').classList.remove('hidden');
  renderAll();
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

function startNodeBattle(nodeId) {
  const prof = state.activeProfile;
  const subj = state.activeSubject[prof];
  const grade = state.selectedGrade[prof] || 'ALL';
  const deck = buildExpeditionDeck(getAllQuestionsForProfile(prof), state.wrongPool[prof], subj, grade, 5);
  session = { mode: 'node', nodeKey: `${subj}_${nodeId}`, profile: prof, deck, index: 0, combo: 0, earnedMat: 0 };
  enterQuizView();
}

function startDailyExpedition() {
  const prof = state.activeProfile;
  const grade = state.selectedGrade[prof] || 'ALL';
  const deck = buildExpeditionDeck(getAllQuestionsForProfile(prof), state.wrongPool[prof], 'all', grade, 5);
  session = { mode: 'daily', nodeKey: null, profile: prof, deck, index: 0, combo: 0, earnedMat: 0 };
  enterQuizView();
}

function startCoopBoss() {
  const d4 = buildExpeditionDeck(getAllQuestionsForProfile('4y'), state.wrongPool['4y'], 'all', state.selectedGrade['4y'], 6).map(q => ({ ...q, turnOwner: '4y' }));
  const d6 = buildExpeditionDeck(getAllQuestionsForProfile('6y'), state.wrongPool['6y'], 'all', state.selectedGrade['6y'], 6).map(q => ({ ...q, turnOwner: '6y' }));
  const deck = [];
  for (let i = 0; i < 6; i++) { if (d4[i]) deck.push(d4[i]); if (d6[i]) deck.push(d6[i]); }
  session = { mode: 'boss', profile: '4y', deck, index: 0, combo: 0, bossHp: 10, bossMaxHp: 10, frozen: { '4y': false, '6y': false } };
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
  const turnProf = isBoss ? q.turnOwner : session.profile;

  const box = document.getElementById('quiz-box');
  box.classList.remove('turn-dino', 'turn-astro');
  box.classList.add(turnProf === '4y' ? 'turn-dino' : 'turn-astro');

  document.getElementById('quiz-mode-pill').textContent = isBoss ? '⚔️ 雙寶協力大魔王' : '⚔️ 領土攻打戰';
  document.getElementById('quiz-progress-pill').textContent = isBoss ? `回合 ${session.index + 1}` : `第 ${session.index + 1} / ${session.deck.length} 題`;

  const hud = document.getElementById('boss-hud');
  hud.classList.toggle('hidden', !isBoss);
  if (isBoss) {
    document.getElementById('boss-hp-fill').style.width = `${Math.max(0, (session.bossHp / session.bossMaxHp) * 100)}%`;
    document.getElementById('boss-name-hp').textContent = `🐉 蛀牙巨龍體力：${session.bossHp} / ${session.bossMaxHp}`;
    document.getElementById('boss-turn-label').textContent = turnProf === '4y' ? '目前回合：🦖 小恐龍' : '目前回合：🚀 太空人';
    const fEl = document.getElementById('boss-freeze-alert');
    const fList = [session.frozen['4y'] ? '🦖小恐龍被冰凍' : '', session.frozen['6y'] ? '🚀太空人被冰凍' : ''].filter(Boolean);
    fEl.style.display = fList.length ? 'block' : 'none';
    if (fList.length) fEl.textContent = `❄️ ${fList.join('、')}！隊友答對即可破冰打 2 點傷害！`;
  }

  document.getElementById('question-text').innerHTML = renderZhuyinHTML(q.q);
  document.getElementById('feedback-msg').textContent = '';

  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  const lockListen = !!state.prefs.listenFirst;
  isSpeakingNow = lockListen;

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn' + (lockListen ? ' listening-lock' : '');
    btn.disabled = lockListen;
    btn.innerHTML = `<span class="zhuyin-text">${renderZhuyinHTML(opt)}</span>`;
    btn.onclick = () => handleAnswer(idx, btn, q, turnProf);
    grid.appendChild(btn);
  });

  renderComboPips();
  updatePalmZone();

  speakTTS(q.q, state.prefs.voiceRate, () => {
    isSpeakingNow = false;
    document.querySelectorAll('#options-grid .option-btn').forEach(b => { b.disabled = false; b.classList.remove('listening-lock'); });
  });
}

function replayCurrentQuestion() {
  if (!session) return;
  speakTTS(session.deck[session.index % session.deck.length].q, state.prefs.voiceRate);
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

function handleAnswer(idx, btnEl, q, turnProf) {
  if (optionLocked || isSpeakingNow) return;
  optionLocked = true;
  setTimeout(() => { optionLocked = false; }, 600);
  document.querySelectorAll('#options-grid .option-btn').forEach(b => b.disabled = true);

  const isCorrect = idx === q.answer;
  const fb = document.getElementById('feedback-msg');

  if (session.mode === 'boss') {
    if (isCorrect) {
      btnEl.classList.add('correct');
      session.combo += 1;
      const other = turnProf === '4y' ? '6y' : '4y';
      let dmg = session.frozen[other] ? 2 : 1;
      session.frozen[other] = false;
      session.bossHp = Math.max(0, session.bossHp - dmg);
      fb.style.color = '#16a34a';
      fb.textContent = `⚔️ 命中！扣魔王 ${dmg} 滴血！`;
      playFeedbackVoice(voiceDB, 'correct', '太棒了，打中大魔王了！', state.prefs.voiceRate);
      if (session.bossHp <= 0) { setTimeout(() => finishBossVictory(), 800); return; }
    } else {
      btnEl.classList.add('wrong');
      session.combo = 0;
      session.frozen[turnProf] = true;
      updateMonsterRecord(state.wrongPool[turnProf], q, false);
      fb.style.color = '#dc2626';
      fb.textContent = '❄️ 被冰凍了！換隊友救援！';
      playFeedbackVoice(voiceDB, 'wrong', '沒關係，換隊友來幫忙！', state.prefs.voiceRate);
    }
    setTimeout(() => { session.index += 1; renderQuestion(); }, 1050);
    return;
  }

  updateMonsterRecord(state.wrongPool[turnProf], q, isCorrect);
  const p = state.profiles[turnProf];
  const matIcon = MATERIAL_INFO[turnProf].icon;

  if (isCorrect) {
    btnEl.classList.add('correct');
    session.combo += 1;
    const matGain = state.difficulty === 'hard' ? 2 : 1;
    p.materials += matGain;
    session.earnedMat += matGain;
    if (state.difficulty === 'hard') p.starsHard += 1; else p.starsEasy += 1;
    commitState();
    fb.style.color = '#16a34a';
    fb.textContent = `🌟 答對！獲得 ${matIcon}+${matGain}`;
    playFeedbackVoice(voiceDB, 'correct', '哇！寶貝答對了，你好棒喔！', state.prefs.voiceRate);
  } else {
    btnEl.classList.add('wrong');
    session.combo = 0;
    commitState();
    fb.style.color = '#dc2626';
    fb.textContent = '🌱 差一點點，下次一定會！';
    playFeedbackVoice(voiceDB, 'wrong', '沒關係，差一點點，再聽一次看看喔！', state.prefs.voiceRate);
  }

  setTimeout(() => {
    session.index += 1;
    if (session.index >= session.deck.length) finishStandardSession();
    else renderQuestion();
  }, 1050);
}

function finishStandardSession() {
  const prof = session.profile;
  const p = state.profiles[prof];
  if (session.mode === 'node' && session.nodeKey) {
    p.conqueredNodes[session.nodeKey] = true;
    commitState();
  }
  playFeedbackVoice(voiceDB, 'victory', '太強了！成功佔領領土，可以蓋建築囉！', state.prefs.voiceRate);
  showToast(`🏆 勝利！獲得 ${MATERIAL_INFO[prof].icon}+${session.earnedMat}，快去蓋塔或升級基地！`);
  goHome();
  checkSoftLandingLock();
}

function finishBossVictory() {
  ['4y', '6y'].forEach(prof => {
    const p = state.profiles[prof];
    p.materials += 5;
    p.starsHard += 2;
    ['c1', 'c2', 'c3', 'c4'].forEach(cid => { if (!p.unlockedStickers.includes(cid)) p.unlockedStickers.push(cid); });
  });
  commitState();
  playFeedbackVoice(voiceDB, 'victory', '太強了！雙寶打敗大魔王！', state.prefs.voiceRate);
  openTheater(STICKERS.find(s => s.id === 'c3'));
  goHome();
  checkSoftLandingLock();
}

function updatePalmZone() {
  document.getElementById('dual-palm-zone').classList.toggle('hidden', !(session && session.mode === 'boss' && session.combo >= 2));
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
    showToast('💥 雙寶合體大絕招！扣魔王 3 滴血！');
    if (session.bossHp <= 0) setTimeout(() => finishBossVictory(), 650);
    else renderQuestion();
  }
}

/**
 * 貼紙簿、錄音、家長設定與檢測
 */
function openStickerModal() { document.getElementById('sticker-modal').classList.add('open'); renderStickerModal(state.activeProfile); }
function renderStickerModal(prof) {
  document.getElementById('sticker-tab-4y').className = `btn btn-sm ${prof === '4y' ? 'btn-primary' : 'btn-ghost'}`;
  document.getElementById('sticker-tab-6y').className = `btn btn-sm ${prof === '6y' ? 'btn-accent' : 'btn-ghost'}`;
  const unlocked = state.profiles[prof].unlockedStickers || [];
  document.getElementById('sticker-count-pill').textContent = `已解鎖 ${unlocked.length} / ${STICKERS.length} 張`;
  document.getElementById('sticker-grid').innerHTML = STICKERS.map(s => {
    const ok = unlocked.includes(s.id);
    return `<div class="sticker-card ${ok ? '' : 'locked'} ${s.tier === 'gold' ? 'gold' : ''} ${s.tier === 'coop' ? 'coop' : ''}"
                 onclick="${ok ? `openTheaterById('${s.id}')` : ''}">
      <div style="font-size:2rem;">${ok ? s.emoji : '🔒'}</div>
      <div style="font-weight:800; font-size:0.86rem;">${escapeHTML(s.name)}</div>
    </div>`;
  }).join('');
}
function openTheaterById(id) { const s = STICKERS.find(x => x.id === id); if (s) openTheater(s); }
function openTheater(s) {
  document.getElementById('theater-emoji').textContent = s.emoji;
  document.getElementById('theater-title').textContent = s.name;
  document.getElementById('theater-story').textContent = s.story;
  document.getElementById('theater-modal').classList.add('open');
  speakTTS(`${s.name}。${s.story}`, state.prefs.voiceRate);
}
function closeTheater() { document.getElementById('theater-modal').classList.remove('open'); }

const VOICE_SLOTS = [
  { key: 'correct', title: '🌟 答對誇獎聲', suggest: '哇！寶貝答對了，你好棒喔！' },
  { key: 'wrong',   title: '🌱 答錯鼓勵聲', suggest: '沒關係，差一點點，再聽一次看看喔！' },
  { key: 'victory', title: '🏆 過關慶祝聲', suggest: '太強了！全部過關，快去蓋城堡！' }
];
let activeRecorder = null;
let recordChunks = [];

function openVoiceModal() {
  document.getElementById('voice-rate').value = String(state.prefs.voiceRate || 1.0);
  document.getElementById('voice-modal').classList.add('open');
  renderRecorderList();
}
function saveVoiceRate(v) { state.prefs.voiceRate = Number(v); commitState(); }
function testTTS() { speakTTS('你好，我是小老師，一起來冒險吧！', state.prefs.voiceRate); }
async function renderRecorderList() {
  const rows = await Promise.all(VOICE_SLOTS.map(async s => {
    const ok = await voiceDB.get(s.key);
    return `<div class="diag-item" style="flex-direction:column; align-items:stretch;">
      <div class="row" style="justify-content:space-between;"><strong>${s.title}</strong><span class="pill" id="rec-status-${s.key}">${ok ? '✅ 已錄製' : '⚪ 未錄製'}</span></div>
      <div class="row">
        <button class="btn btn-danger btn-sm" onclick="startRecording('${s.key}')">🔴 錄音</button>
        <button class="btn btn-ghost btn-sm" onclick="stopRecording()">⏹ 停止</button>
        <button class="btn btn-primary btn-sm" onclick="previewVoice('${s.key}','${s.suggest}')">▶ 試聽</button>
        <button class="btn btn-ghost btn-sm" onclick="deleteVoice('${s.key}')">🗑️ 刪除</button>
      </div>
    </div>`;
  }));
  document.getElementById('recorder-list').innerHTML = rows.join('');
}
async function startRecording(key) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
    activeRecorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    recordChunks = [];
    activeRecorder.ondataavailable = e => { if (e.data.size > 0) recordChunks.push(e.data); };
    activeRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      await voiceDB.save(key, new Blob(recordChunks, { type: activeRecorder.mimeType || 'audio/webm' }));
      showToast('🎙️ 錄音已儲存！');
      renderRecorderList();
    };
    activeRecorder.start();
    document.getElementById(`rec-status-${key}`).textContent = '🔴 錄音中...';
  } catch { showToast('請允許麥克風權限'); }
}
function stopRecording() { if (activeRecorder && activeRecorder.state === 'recording') activeRecorder.stop(); }
function previewVoice(key, fb) { playFeedbackVoice(voiceDB, key, fb, state.prefs.voiceRate); }
async function deleteVoice(key) { await voiceDB.remove(key); showToast('已刪除錄音'); renderRecorderList(); }

function openParentLockModal(afterFn) {
  pendingParentAction = afterFn || (() => openParentAdminModal());
  const a = Math.floor(Math.random() * 8) + 6;
  const b = Math.floor(Math.random() * 8) + 3;
  const c = Math.floor(Math.random() * 19) + 12;
  currentMathAnswer = a * b + c;
  document.getElementById('math-challenge-question').textContent = `${a} × ${b} + ${c} = ?`;
  document.getElementById('math-challenge-input').value = '';
  document.getElementById('parent-lock-modal').classList.add('open');
}
function verifyMathChallenge() {
  if (Number(document.getElementById('math-challenge-input').value) === currentMathAnswer) {
    closeModal('parent-lock-modal');
    if (pendingParentAction) pendingParentAction();
  } else { showToast('算數答案不對喔！'); }
}
function closeEyecareLockToParent() {
  openParentLockModal(() => { stopEyecareTimer(); document.getElementById('eyecare-lock').classList.remove('open'); openParentAdminModal(); });
}
function updateCustomCategoryOptions() {
  const prof = document.getElementById('custom-profile').value;
  document.getElementById('custom-grade').innerHTML = (GRADE_LEVELS[prof] || []).map(g => `<option value="${g.id}">${escapeHTML(g.label)}</option>`).join('');
  document.getElementById('custom-category').innerHTML = (SUBJECTS_BY_PROFILE[prof] || []).map(s => `<option value="${s.id}">${s.icon} ${escapeHTML(s.name)}</option>`).join('');
}
function openParentAdminModal() {
  updateCustomCategoryOptions();
  updateCustomPreview();
  document.getElementById('custom-count-label').textContent = `目前自訂：${state.customQuestions.length} 題`;
  document.getElementById('parent-admin-modal').classList.add('open');
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function startEyecareTimer(m) { state.eyecare.endAt = Date.now() + m * 60000; softLandingPending = false; commitState(); showToast(`⏱️ 已設定 ${m} 分鐘護眼時間`); }
function stopEyecareTimer() { state.eyecare.endAt = null; softLandingPending = false; document.getElementById('soft-landing-banner').classList.remove('show'); document.getElementById('eyecare-lock').classList.remove('open'); commitState(); }
function checkSoftLandingLock() { if (softLandingPending && state.eyecare.endAt && Date.now() >= state.eyecare.endAt) document.getElementById('eyecare-lock').classList.add('open'); }

setInterval(() => {
  const el = document.getElementById('header-timer');
  const bn = document.getElementById('soft-landing-banner');
  if (!state.eyecare.endAt) { el.textContent = '⏱️ 護眼：未啟動'; bn.classList.remove('show'); return; }
  const rem = state.eyecare.endAt - Date.now();
  if (rem > 0) {
    el.textContent = `⏱️ 剩餘 ${Math.ceil(rem / 60000)} 分`;
    if (rem <= 120000) { softLandingPending = true; bn.classList.add('show'); }
  } else {
    softLandingPending = true;
    el.textContent = '⏱️ 時間到';
    if (!session) document.getElementById('eyecare-lock').classList.add('open');
  }
}, 2000);

function updateCustomPreview() {
  document.getElementById('custom-q-preview').innerHTML = renderZhuyinHTML(document.getElementById('custom-q-text').value || '預覽直式注音');
}
function addCustomQuestion() {
  const profile = document.getElementById('custom-profile').value;
  const grade = document.getElementById('custom-grade').value;
  const category = document.getElementById('custom-category').value;
  const q = document.getElementById('custom-q-text').value.trim();
  const opts = [0, 1, 2].map(i => document.getElementById(`custom-opt-${i}`).value.trim());
  const answer = Number(document.getElementById('custom-ans-idx').value);
  if (!q || opts.some(o => !o)) { showToast('請填寫完整題目與三個選項'); return; }
  state.customQuestions.push({ id: 'c_' + Date.now(), profile, grade, category, q, options: opts, answer });
  commitState();
  document.getElementById('custom-count-label').textContent = `目前自訂：${state.customQuestions.length} 題`;
  document.getElementById('custom-q-text').value = '';
  [0, 1, 2].forEach(i => { document.getElementById(`custom-opt-${i}`).value = ''; });
  updateCustomPreview();
  showToast('✅ 已新增題目！');
}
async function generateTransferCode() {
  try {
    document.getElementById('transfer-code-box').value = await TransferCode.encode({ profiles: state.profiles, wrongPool: state.wrongPool, customQuestions: state.customQuestions });
    showToast('🔐 已產生轉移碼！');
  } catch { showToast('產生失敗'); }
}
async function applyTransferCode() {
  try {
    const d = await TransferCode.decode(document.getElementById('transfer-code-box').value);
    if (d.profiles) state.profiles = d.profiles;
    if (d.wrongPool) state.wrongPool = d.wrongPool;
    if (d.customQuestions) state.customQuestions = d.customQuestions;
    commitState();
    showToast('📲 已還原學習進度！');
  } catch { showToast('還原失敗，請確認代碼是否完整'); }
}

function openDiagModal() {
  const r = runLivePageDiagnostics(state);
  document.getElementById('diag-list').innerHTML = r.checks.map(c => `
    <div class="diag-item ${c.status}">
      <div><strong>${c.status === 'pass' ? '✅' : '⚠️'} ${escapeHTML(c.title)}</strong><div class="muted">${escapeHTML(c.detail)}</div></div>
    </div>
  `).join('');
  document.getElementById('diag-modal').classList.add('open');
}


// 隱藏測試觸發：3 秒內連續點擊左上角 Logo 7 次開啟
let brandTapCount = 0;
let brandTapResetTimer = null;

function handleBrandTap() {
  brandTapCount += 1;
  clearTimeout(brandTapResetTimer);
  if (brandTapCount >= 7) {
    brandTapCount = 0;
    document.getElementById('cheat-modal').classList.add('open');
    showToast('🧪 已開啟隱藏測試工具箱！');
    return;
  }
  brandTapResetTimer = setTimeout(() => { brandTapCount = 0; }, 2500);
  goHome();
}

function cheatAddResources() {
  const p = state.profiles[state.activeProfile];
  p.materials += 999;
  p.starsEasy += 99;
  p.starsHard += 99;
  commitState();
  showToast('💎 已加入無限資源（建材 +999、星星 +99）！');
}

function cheatUnlockAllStages() {
  const prof = state.activeProfile;
  const p = state.profiles[prof];
  for (const s of SUBJECTS_BY_PROFILE[prof]) {
    for (const n of ISLAND_NODES) {
      p.conqueredNodes[`${s.id}_${n.id}`] = true;
    }
  }
  p.unlockedStickers = STICKERS.map(s => s.id);
  commitState();
  showToast('🚩 已一鍵全通關並解鎖全部貼紙！');
}

function cheatMaxAllBuildings() {
  const prof = state.activeProfile;
  const p = state.profiles[prof];
  const subj = state.activeSubject[prof];
  for (const n of ISLAND_NODES) {
    const key = `${subj}_${n.id}`;
    p.conqueredNodes[key] = true;
    p.nodeTowers[key] = 3;
  }
  const catalog = BASE_CATALOG[prof];
  p.basePlots = BASE_PLOT_COORDS.map((_, idx) => ({
    type: catalog[idx % catalog.length].type,
    level: 3
  }));
  commitState();
  showToast('🏰 全島與基地建築皆已升級至 Lv.3 傳奇外觀！');
}

function cheatResetProfile() {
  const prof = state.activeProfile;
  state.profiles[prof] = {
    starsEasy: 0, starsHard: 0, materials: 4, unlockedStickers: ['s1'],
    currentNode: 1, conqueredNodes: {}, nodeTowers: {},
    basePlots: [null, null, null, null, null, null]
  };
  state.wrongPool[prof] = {};
  closeModal('cheat-modal');
  commitState();
  showToast('🔄 已重置目前帳號進度！');
}

Object.assign(window, {
  handleBrandTap, walkToBasePlot, cheatAddResources, cheatUnlockAllStages, cheatMaxAllBuildings, cheatResetProfile,
  selectProfile, switchHomeTab, selectSubject, selectGrade, setDifficulty,
  moveToNode, startNodeBattle, upgradeMapTower, openBasePlotModal, buildOnBasePlot,
  upgradeBasePlot, clearBasePlot, goHome, abortQuiz, startDailyExpedition, startCoopBoss,
  replayCurrentQuestion, setPalm, openStickerModal, renderStickerModal, openTheaterById,
  closeTheater, openVoiceModal, saveVoiceRate, testTTS, startRecording, stopRecording,
  previewVoice, deleteVoice, openParentLockModal, verifyMathChallenge, closeEyecareLockToParent,
  updateCustomCategoryOptions, closeModal, startEyecareTimer, stopEyecareTimer,
  updateCustomPreview, addCustomQuestion, generateTransferCode, applyTransferCode, openDiagModal
});

renderAll();
if ('speechSynthesis' in window) window.speechSynthesis.getVoices();

export const MATERIAL_INFO = {
  '4y': { icon: '🪵', name: '魔法木頭' },
  '6y': { icon: '⚡', name: '能量水晶' }
};

export const KINGDOM_TITLES = [
  { minLv: 0,  icon: '⛺', title: '初出茅廬營地' },
  { minLv: 4,  icon: '🏡', title: '熱鬧冒險小鎮' },
  { minLv: 10, icon: '🛡️', title: '星光守護堡壘' },
  { minLv: 18, icon: '👑', title: '翡翠榮耀王國' },
  { minLv: 28, icon: '🏰', title: '黃金傳奇王國' }
];

export function getKingdomTitle(totalLevel) {
  let current = KINGDOM_TITLES[0];
  for (const t of KINGDOM_TITLES) {
    if (totalLevel >= t.minLv) current = t;
  }
  return current;
}

export const ISLAND_NODES = [
  { id: 1,  x: 19, y: 80, zone: '翠綠新手村', shortZone: '新手村', monster: '迷糊史萊姆', emoji: '👾' },
  { id: 2,  x: 41, y: 84, zone: '微風小溪畔', shortZone: '小溪畔', monster: '愛睡章魚怪', emoji: '🐙' },
  { id: 3,  x: 65, y: 82, zone: '橡果森林區', shortZone: '橡果林', monster: '頑皮松鼠精', emoji: '🐿️' },
  { id: 4,  x: 82, y: 63, zone: '陽光麥田原', shortZone: '麥田原', monster: '稻草小精靈', emoji: '🌾' },
  { id: 5,  x: 59, y: 60, zone: '迷霧古橋頭', shortZone: '古橋頭', monster: '石頭小傀儡', emoji: '🗿' },
  { id: 6,  x: 35, y: 58, zone: '靜謐月光谷', shortZone: '月光谷', monster: '灰狼小隊長', emoji: '🐺' },
  { id: 7,  x: 16, y: 45, zone: '蜘蛛絲秘境', shortZone: '蜘蛛谷', monster: '織網小蜘蛛', emoji: '🕷️' },
  { id: 8,  x: 31, y: 29, zone: '白骨化石坡', shortZone: '化石坡', monster: '搞笑骷髏兵', emoji: '💀' },
  { id: 9,  x: 54, y: 32, zone: '恐龍腳印谷', shortZone: '恐龍谷', monster: '暴躁小暴龍', emoji: '🦖' },
  { id: 10, x: 78, y: 31, zone: '翡翠飛龍崖', shortZone: '飛龍崖', monster: '閃電小青龍', emoji: '🐉' }
];

export const BASE_PLOT_COORDS = [
  { id: 0, x: 22, y: 34, label: '北區高地' },
  { id: 1, x: 52, y: 26, label: '中央廣場' },
  { id: 2, x: 80, y: 36, label: '東區花園' },
  { id: 3, x: 20, y: 74, label: '西區草坪' },
  { id: 4, x: 50, y: 72, label: '南區大道' },
  { id: 5, x: 79, y: 75, label: '湖畔營地' }
];

export const BASE_CATALOG = {
  '4y': [
    { type: 'hq',     name: '恐龍主堡',   lvNames: ['破舊帳篷', '溫馨木石堡', '黃金恐龍城堡'], desc: '主基地：從簡易帳篷升級成黃金恐龍城堡', cost: [2, 4, 6] },
    { type: 'radar',  name: '巨石瞭望塔', lvNames: ['歪斜木樁', '碎石防禦塔', '巨龍火炬塔'],   desc: '防禦設施：從木樁升級成發光火炬塔',     cost: [2, 4, 6] },
    { type: 'rocket', name: '翼龍驛站',   lvNames: ['乾草巢穴', '木造飛棚',   '恐龍飛艇總站'], desc: '載具中心：從草巢升級成恐龍飛艇總站',   cost: [2, 4, 6] },
    { type: 'dome',   name: '果實農場',   lvNames: ['雜亂菜圃', '圍欄果園',   '彩虹水晶溫室'], desc: '資源農場：從菜圃升級成彩虹水晶溫室',   cost: [2, 4, 6] },
    { type: 'park',   name: '恐龍樂園',   lvNames: ['木頭鞦韆', '歡樂旋轉馬', '閃亮摩天輪'],   desc: '娛樂場：從鞦韆升級成閃亮摩天輪',       cost: [2, 4, 6] },
    { type: 'core',   name: '魔法樹屋',   lvNames: ['小樹苗',   '雙層木樹屋', '發光空中樹屋'], desc: '魔法核心：從樹苗長成發光空中樹屋',     cost: [2, 4, 6] }
  ],
  '6y': [
    { type: 'hq',     name: '星際總部',   lvNames: ['簡陋鐵皮屋', '合金指揮所', '巨型銀河司令部'], desc: '主基地：從鐵皮屋升級成巨型銀河司令部', cost: [2, 4, 6] },
    { type: 'radar',  name: '太空雷達站', lvNames: ['生鏽天線',   '旋轉雷達波', '量子深空陣列'],   desc: '防禦偵測：從天線升級成量子深空陣列',   cost: [2, 4, 6] },
    { type: 'rocket', name: '火箭發射台', lvNames: ['小紙飛機',   '鋼構發射架', '超光速艦射坪'],   desc: '載具中心：從紙飛機升級成超光速艦射坪', cost: [2, 4, 6] },
    { type: 'dome',   name: '生態光罩',   lvNames: ['玻璃培植槽', '鋼棚溫室',   '能量生態穹頂'],   desc: '資源溫室：從培植槽升級成能量生態穹頂', cost: [2, 4, 6] },
    { type: 'park',   name: '重力訓練場', lvNames: ['露天重力墊', '圓頂離心機', '反重力炫光環'],   desc: '訓練場：從重力墊升級成反重力炫光環',   cost: [2, 4, 6] },
    { type: 'core',   name: '能量核心',   lvNames: ['廢棄電池',   '小型核聚變', '中央能量核心'],   desc: '能源核心：從電池升級成中央能量核心',   cost: [2, 4, 6] }
  ]
};

export function renderBaseSceneSVG(theme) {
  const isAstro = theme === '6y';
  const imgPath = `./base-bg-${theme}.jpg`;
  const fallbackBg = isAstro ? '#0f172a' : '#86efac';
  return `<div style="position:relative;width:100%;height:100%;background:${fallbackBg};">
    <img src="${imgPath}" alt="基地場景" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;" />
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.06) 0%,rgba(0,0,0,0.16) 100%);pointer-events:none;"></div>
  </div>`;
}

// 6 種建築各自的專屬 Lv.1 / Lv.2 / Lv.3 手繪風 SVG（確保每棟建築外觀完全不同）
function getDistinctBuildingSVG(theme, type, level) {
  const isAstro = theme === '6y';
  const glow = level >= 3 ? '<circle cx="40" cy="40" r="34" fill="#fde047" opacity="0.28"/>' : '';
  const spark = level >= 3 ? '<text x="6" y="18" font-size="11">✨</text><text x="62" y="18" font-size="11">✨</text>' : '';

  // 1. 防禦塔 / 太空雷達站 (radar)
  if (type === 'radar') {
    if (isAstro) {
      if (level === 1) return `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="34" y="42" width="12" height="24" fill="#64748b" stroke="#1e293b" stroke-width="2"/><line x1="40" y1="42" x2="40" y2="18" stroke="#94a3b8" stroke-width="3"/><circle cx="40" cy="17" r="4" fill="#ef4444"/></svg>`;
      if (level === 2) return `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="28" y="44" width="24" height="22" rx="4" fill="#3b82f6" stroke="#0f172a" stroke-width="2"/><path d="M24,24 Q40,42 56,24" fill="none" stroke="#93c5fd" stroke-width="5"/><line x1="40" y1="33" x2="40" y2="44" stroke="#0f172a" stroke-width="3"/><circle cx="40" cy="24" r="4" fill="#38bdf8"/></svg>`;
      return `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">${glow}<rect x="24" y="46" width="32" height="20" rx="5" fill="#1d4ed8" stroke="#fbbf24" stroke-width="2.2"/><ellipse cx="40" cy="28" rx="20" ry="12" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/><circle cx="40" cy="28" r="5" fill="#fef08a"/>${spark}</svg>`;
    } else {
      if (level === 1) return `<svg viewBox="0 0 80 80" class="bldg-svg"><line x1="30" y1="66" x2="36" y2="26" stroke="#78350f" stroke-width="4"/><line x1="50" y1="66" x2="44" y2="26" stroke="#78350f" stroke-width="4"/><rect x="28" y="22" width="24" height="12" fill="#b45309" stroke="#292524" stroke-width="2"/></svg>`;
      if (level === 2) return `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="26" y="26" width="28" height="40" rx="3" fill="#94a3b8" stroke="#1e293b" stroke-width="2"/><rect x="22" y="18" width="36" height="10" fill="#64748b" stroke="#1e293b" stroke-width="2"/><rect x="35" y="48" width="10" height="18" fill="#334155"/></svg>`;
      return `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">${glow}<rect x="25" y="28" width="30" height="38" rx="4" fill="#cbd5e1" stroke="#b45309" stroke-width="2.2"/><path d="M40,6 Q52,20 40,28 Q28,20 40,6 Z" fill="#f97316" stroke="#b45309" stroke-width="1.5"/>${spark}</svg>`;
    }
  }

  // 2. 載具中心：火箭發射台 / 翼龍驛站 (rocket)
  if (type === 'rocket') {
    if (isAstro) {
      if (level === 1) return `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="18" y="54" width="44" height="10" rx="3" fill="#64748b" stroke="#1e293b" stroke-width="2"/><polygon points="20,44 60,30 46,48" fill="#e2e8f0" stroke="#334155" stroke-width="2"/></svg>`;
      if (level === 2) return `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="18" y="56" width="44" height="10" rx="3" fill="#475569" stroke="#0f172a" stroke-width="2"/><path d="M40,14 Q50,28 48,54 L32,54 Q30,28 40,14 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/><polygon points="40,14 34,26 46,26" fill="#ef4444"/></svg>`;
      return `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">${glow}<rect x="14" y="56" width="52" height="10" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/><path d="M40,10 Q54,26 50,54 L30,54 Q26,26 40,10 Z" fill="#fbbf24" stroke="#78350f" stroke-width="2"/><circle cx="40" cy="34" r="5" fill="#38bdf8"/>${spark}</svg>`;
    } else {
      if (level === 1) return `<svg viewBox="0 0 80 80" class="bldg-svg"><ellipse cx="40" cy="54" rx="24" ry="12" fill="#d97706" stroke="#78350f" stroke-width="2"/><ellipse cx="40" cy="50" rx="16" ry="7" fill="#fef3c7"/></svg>`;
      if (level === 2) return `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="20" y="36" width="40" height="28" fill="#b45309" stroke="#292524" stroke-width="2"/><polygon points="14,38 40,18 66,38" fill="#d97706" stroke="#292524" stroke-width="2"/></svg>`;
      return `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">${glow}<ellipse cx="40" cy="34" rx="24" ry="14" fill="#fbbf24" stroke="#78350f" stroke-width="2.2"/><rect x="30" y="48" width="20" height="14" rx="3" fill="#92400e" stroke="#292524" stroke-width="2"/>${spark}</svg>`;
    }
  }

  // 3. 資源溫室：生態光罩 / 果實農場 (dome)
  if (type === 'dome') {
    if (level === 1) return `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="16" y="44" width="48" height="20" rx="4" fill="${isAstro ? '#64748b' : '#92400e'}" stroke="#1e293b" stroke-width="2"/><circle cx="30" cy="48" r="5" fill="#22c55e"/><circle cx="46" cy="48" r="5" fill="#4ade80"/></svg>`;
    if (level === 2) return `<svg viewBox="0 0 80 80" class="bldg-svg"><path d="M16,58 Q16,24 40,24 Q64,24 64,58 Z" fill="#bbf7d0" stroke="#047857" stroke-width="2.2"/><line x1="40" y1="24" x2="40" y2="58" stroke="#047857" stroke-width="1.5"/><rect x="14" y="56" width="52" height="8" rx="3" fill="#475569"/></svg>`;
    return `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">${glow}<path d="M14,58 Q14,18 40,18 Q66,18 66,58 Z" fill="#a7f3d0" stroke="#0ea5e9" stroke-width="2.5"/><path d="M26,56 Q40,28 54,56 Z" fill="#f472b6" opacity="0.6"/><rect x="12" y="56" width="56" height="9" rx="4" fill="#fbbf24" stroke="#78350f" stroke-width="1.8"/>${spark}</svg>`;
  }

  // 4. 娛樂訓練場：恐龍樂園(摩天輪) / 重力訓練場 (park)
  if (type === 'park') {
    if (level === 1) return `<svg viewBox="0 0 80 80" class="bldg-svg"><line x1="22" y1="64" x2="32" y2="24" stroke="#78350f" stroke-width="3"/><line x1="58" y1="64" x2="48" y2="24" stroke="#78350f" stroke-width="3"/><line x1="28" y1="24" x2="52" y2="24" stroke="#78350f" stroke-width="3"/><rect x="34" y="44" width="12" height="5" fill="#f59e0b"/></svg>`;
    if (level === 2) return `<svg viewBox="0 0 80 80" class="bldg-svg"><polygon points="40,14 16,34 64,34" fill="#f43f5e" stroke="#1e293b" stroke-width="2"/><rect x="22" y="34" width="36" height="28" fill="#fef08a" stroke="#1e293b" stroke-width="2"/><line x1="40" y1="34" x2="40" y2="62" stroke="#b45309" stroke-width="3"/></svg>`;
    return `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">${glow}<circle cx="40" cy="36" r="22" fill="none" stroke="#f59e0b" stroke-width="3.5"/><circle cx="40" cy="36" r="12" fill="none" stroke="#38bdf8" stroke-width="2"/><line x1="26" y1="66" x2="40" y2="36" stroke="#78350f" stroke-width="3"/><line x1="54" y1="66" x2="40" y2="36" stroke="#78350f" stroke-width="3"/>${spark}</svg>`;
  }

  // 5. 魔法核心：魔法樹屋 / 能量核心 (core)
  if (type === 'core') {
    if (isAstro) {
      if (level === 1) return `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="26" y="34" width="28" height="30" rx="4" fill="#64748b" stroke="#1e293b" stroke-width="2"/><text x="33" y="54" font-size="14">⚡</text></svg>`;
      if (level === 2) return `<svg viewBox="0 0 80 80" class="bldg-svg"><circle cx="40" cy="40" r="18" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/><circle cx="40" cy="40" r="9" fill="#e0f2fe"/></svg>`;
      return `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">${glow}<polygon points="40,12 62,40 40,68 18,40" fill="#a855f7" stroke="#fbbf24" stroke-width="2.5"/><circle cx="40" cy="40" r="10" fill="#fef08a"/>${spark}</svg>`;
    } else {
      if (level === 1) return `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="36" y="42" width="8" height="22" fill="#78350f"/><circle cx="40" cy="36" r="14" fill="#4ade80" stroke="#15803d" stroke-width="2"/></svg>`;
      if (level === 2) return `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="33" y="40" width="14" height="26" fill="#78350f"/><circle cx="40" cy="32" r="22" fill="#22c55e" stroke="#14532d" stroke-width="2"/><rect x="30" y="24" width="20" height="16" fill="#fef3c7" stroke="#78350f" stroke-width="2"/></svg>`;
      return `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">${glow}<rect x="32" y="42" width="16" height="24" fill="#78350f"/><circle cx="40" cy="30" r="24" fill="#4ade80" stroke="#fbbf24" stroke-width="2.5"/><polygon points="40,12 26,28 54,28" fill="#f59e0b" stroke="#78350f" stroke-width="1.8"/><rect x="30" y="28" width="20" height="14" fill="#fef08a" stroke="#78350f" stroke-width="1.8"/>${spark}</svg>`;
    }
  }

  // 6. 預設主堡 / 領土防禦塔 (hq / tower)
  if (level === 1) {
    return isAstro
      ? `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="22" y="40" width="36" height="24" rx="3" fill="#64748b" stroke="#1e293b" stroke-width="2.2"/><rect x="35" y="50" width="10" height="14" fill="#334155"/></svg>`
      : `<svg viewBox="0 0 80 80" class="bldg-svg"><polygon points="40,24 16,64 64,64" fill="#b45309" stroke="#292524" stroke-width="2.2"/><polygon points="40,44 33,64 47,64" fill="#292524"/></svg>`;
  }
  if (level === 2) {
    return isAstro
      ? `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="18" y="34" width="44" height="30" rx="6" fill="#3b82f6" stroke="#0f172a" stroke-width="2.2"/><polygon points="40,14 22,34 58,34" fill="#93c5fd" stroke="#0f172a" stroke-width="2.2"/><circle cx="30" cy="48" r="4" fill="#fef08a"/><circle cx="50" cy="48" r="4" fill="#fef08a"/></svg>`
      : `<svg viewBox="0 0 80 80" class="bldg-svg"><rect x="20" y="36" width="40" height="28" rx="4" fill="#fef3c7" stroke="#1e293b" stroke-width="2.2"/><polygon points="40,14 14,38 66,38" fill="#10b981" stroke="#1e293b" stroke-width="2.2"/><rect x="35" y="50" width="10" height="14" fill="#92400e"/></svg>`;
  }
  return isAstro
    ? `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">${glow}<rect x="16" y="34" width="48" height="32" rx="7" fill="#2563eb" stroke="#fbbf24" stroke-width="2.5"/><polygon points="40,8 24,34 56,34" fill="#fbbf24" stroke="#0f172a" stroke-width="2"/><circle cx="40" cy="24" r="5" fill="#e0f2fe"/>${spark}</svg>`
    : `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">${glow}<rect x="17" y="35" width="46" height="31" rx="5" fill="#fef08a" stroke="#b45309" stroke-width="2.5"/><polygon points="40,8 22,35 58,35" fill="#f59e0b" stroke="#78350f" stroke-width="2.2"/><rect x="12" y="27" width="11" height="39" rx="3" fill="#fde047" stroke="#78350f" stroke-width="2"/><rect x="57" y="27" width="11" height="39" rx="3" fill="#fde047" stroke="#78350f" stroke-width="2"/><text x="34" y="27" font-size="11">👑</text>${spark}</svg>`;
}

export function renderBuildingArt(theme, type, level) {
  if (level <= 0) {
    return `<svg viewBox="0 0 80 80" class="bldg-svg">
      <ellipse cx="40" cy="64" rx="28" ry="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="24" y="46" width="32" height="15" rx="5" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="40" y="57" text-anchor="middle" font-size="11" fill="#475569" font-weight="bold">空地</text>
    </svg>`;
  }
  const imgUrl = `./bldg-${theme}-${type}-lv${level}.png`;
  return `<div style="position:relative;display:inline-flex;align-items:center;justify-content:center;">
    ${getDistinctBuildingSVG(theme, type, level)}
    <img src="${imgUrl}" alt="" class="bldg-svg ${level >= 3 ? 'bldg-glow' : ''}"
         style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;"
         onerror="this.style.display='none'" />
  </div>`;
}

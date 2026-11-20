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

// 10 個島嶼領土節點（百分比座標，供 SVG 地圖與角色移動使用）
export const ISLAND_NODES = [
  { id: 1,  x: 19, y: 80, zone: '翠綠新手村',   monster: '迷糊史萊姆', emoji: '👾' },
  { id: 2,  x: 41, y: 84, zone: '微風小溪畔',   monster: '愛睡章魚怪', emoji: '🐙' },
  { id: 3,  x: 65, y: 82, zone: '橡果森林區',   monster: '頑皮松鼠精', emoji: '🐿️' },
  { id: 4,  x: 82, y: 63, zone: '陽光麥田原',   monster: '稻草小精靈', emoji: '🌾' },
  { id: 5,  x: 59, y: 60, zone: '迷霧古橋頭',   monster: '石頭小傀儡', emoji: '🗿' },
  { id: 6,  x: 35, y: 58, zone: '靜謐月光谷',   monster: '灰狼小隊長', emoji: '🐺' },
  { id: 7,  x: 16, y: 45, zone: '蜘蛛絲秘境',   monster: '織網小蜘蛛', emoji: '🕷️' },
  { id: 8,  x: 31, y: 29, zone: '白骨化石坡',   monster: '搞笑骷髏兵', emoji: '💀' },
  { id: 9,  x: 54, y: 32, zone: '恐龍腳印谷',   monster: '暴躁小暴龍', emoji: '🦖' },
  { id: 10, x: 78, y: 31, zone: '翡翠飛龍崖',   monster: '閃電小青龍', emoji: '🐉' }
];

export const BASE_CATALOG = {
  '4y': [
    { type: 'camp',   name: '恐龍主堡',   desc: '從破舊帳篷升級成黃金恐龍城堡', cost: [2, 4, 6] },
    { type: 'tree',   name: '魔法樹屋',   desc: '從小樹苗長成發光空中樹屋',     cost: [2, 4, 6] },
    { type: 'wheel',  name: '恐龍樂園',   desc: '從木頭鞦韆升級成閃亮摩天輪',   cost: [2, 4, 6] },
    { type: 'garden', name: '果實農場',   desc: '從小菜圃升級成彩虹水晶溫室',   cost: [2, 4, 6] }
  ],
  '6y': [
    { type: 'hq',     name: '星際總部',   desc: '從簡易鐵皮屋升級成銀河司令部', cost: [2, 4, 6] },
    { type: 'radar',  name: '太空雷達站', desc: '從生鏽天線升級成量子星際雷達', cost: [2, 4, 6] },
    { type: 'rocket', name: '火箭發射台', desc: '從小紙飛機升級成黃金超光速艦', cost: [2, 4, 6] },
    { type: 'dome',   name: '生態光罩',   desc: '從小玻璃罩升級成星際生態穹頂', cost: [2, 4, 6] }
  ]
};

/**
 * 建築視覺進化 SVG 產生器：
 * Lv.1 簡陋/落後（木頭/灰舊、線條簡單）
 * Lv.2 進階/精緻（彩色屋頂、窗戶、小旗幟、草叢）
 * Lv.3 華麗/傳奇（金色屋頂、雙旗幟、發光光環、閃亮星星與精緻裝飾）
 */
export function renderBuildingSVG(theme, type, level) {
  if (level <= 0) {
    return `<svg viewBox="0 0 80 80" class="bldg-svg">
      <ellipse cx="40" cy="64" rx="28" ry="8" fill="#e2e8f0"/>
      <rect x="24" y="48" width="32" height="14" rx="4" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="40" y="59" text-anchor="middle" font-size="11" fill="#64748b" font-weight="bold">空地</text>
    </svg>`;
  }

  const isAstro = theme === '6y';

  if (level === 1) {
    // Lv.1：簡陋、落後感（土黃色/灰暗、歪斜木樁或生鏽小天線）
    if (isAstro) {
      return `<svg viewBox="0 0 80 80" class="bldg-svg">
        <ellipse cx="40" cy="68" rx="26" ry="6" fill="#cbd5e1"/>
        <rect x="25" y="42" width="30" height="24" rx="3" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
        <line x1="40" y1="42" x2="40" y2="26" stroke="#475569" stroke-width="2.5"/>
        <circle cx="40" cy="24" r="3.5" fill="#64748b"/>
        <rect x="35" y="52" width="10" height="14" fill="#475569"/>
        <line x1="28" y1="47" x2="34" y2="47" stroke="#64748b" stroke-width="2"/>
      </svg>`;
    }
    return `<svg viewBox="0 0 80 80" class="bldg-svg">
      <ellipse cx="40" cy="68" rx="26" ry="6" fill="#d6d3d1"/>
      <polygon points="40,28 18,66 62,66" fill="#d6b38c" stroke="#78350f" stroke-width="2"/>
      <polygon points="40,46 33,66 47,66" fill="#78350f"/>
      <line x1="40" y1="28" x2="40" y2="20" stroke="#78350f" stroke-width="2"/>
      <circle cx="22" cy="66" r="2.5" fill="#78716c"/>
      <circle cx="58" cy="66" r="2.5" fill="#78716c"/>
    </svg>`;
  }

  if (level === 2) {
    // Lv.2：進階精緻（鮮明色彩、窗戶、旗幟、裝飾物）
    if (isAstro) {
      return `<svg viewBox="0 0 80 80" class="bldg-svg">
        <ellipse cx="40" cy="68" rx="30" ry="7" fill="#bfdbfe"/>
        <rect x="20" y="38" width="40" height="28" rx="6" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
        <path d="M26 38 Q40 16 54 38 Z" fill="#93c5fd" stroke="#1d4ed8" stroke-width="2"/>
        <circle cx="31" cy="49" r="4" fill="#fef08a"/>
        <circle cx="49" cy="49" r="4" fill="#fef08a"/>
        <rect x="36" y="54" width="8" height="12" rx="2" fill="#1e3a8a"/>
        <line x1="40" y1="22" x2="40" y2="12" stroke="#1d4ed8" stroke-width="2.5"/>
        <circle cx="40" cy="11" r="3.5" fill="#38bdf8"/>
      </svg>`;
    }
    return `<svg viewBox="0 0 80 80" class="bldg-svg">
      <ellipse cx="40" cy="68" rx="30" ry="7" fill="#bbf7d0"/>
      <rect x="21" y="38" width="38" height="28" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
      <polygon points="40,18 15,40 65,40" fill="#10b981" stroke="#047857" stroke-width="2"/>
      <rect x="35" y="51" width="10" height="15" rx="2" fill="#b45309"/>
      <circle cx="28" cy="48" r="3.5" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5"/>
      <circle cx="52" cy="48" r="3.5" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5"/>
      <line x1="40" y1="18" x2="40" y2="8" stroke="#b45309" stroke-width="2"/>
      <polygon points="40,8 51,12 40,16" fill="#f59e0b"/>
    </svg>`;
  }

  // Lv.3：華麗傳奇（金色尖塔、發光光環、雙旗幟、閃亮星星裝飾）
  if (isAstro) {
    return `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">
      <circle cx="40" cy="42" r="33" fill="#fef08a" opacity="0.28"/>
      <ellipse cx="40" cy="70" rx="33" ry="7" fill="#93c5fd"/>
      <rect x="16" y="36" width="48" height="32" rx="7" fill="#1d4ed8" stroke="#f59e0b" stroke-width="2.5"/>
      <rect x="26" y="24" width="28" height="16" rx="4" fill="#3b82f6" stroke="#fbbf24" stroke-width="2"/>
      <polygon points="40,7 31,24 49,24" fill="#fbbf24" stroke="#b45309" stroke-width="1.8"/>
      <circle cx="27" cy="49" r="4.5" fill="#fef08a"/>
      <circle cx="53" cy="49" r="4.5" fill="#fef08a"/>
      <rect x="35" y="52" width="10" height="16" rx="3" fill="#fbbf24"/>
      <text x="12" y="22" font-size="12">✨</text>
      <text x="58" y="20" font-size="12">⭐</text>
    </svg>`;
  }
  return `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">
    <circle cx="40" cy="42" r="33" fill="#fde047" opacity="0.32"/>
    <ellipse cx="40" cy="70" rx="33" ry="7" fill="#86efac"/>
    <rect x="16" y="36" width="48" height="32" rx="5" fill="#fffbeb" stroke="#d97706" stroke-width="2.5"/>
    <rect x="12" y="28" width="12" height="40" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <rect x="56" y="28" width="12" height="40" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <polygon points="18,16 10,29 26,29" fill="#f59e0b"/>
    <polygon points="62,16 54,29 70,29" fill="#f59e0b"/>
    <polygon points="40,10 24,36 56,36" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>
    <path d="M33 68 L33 52 Q40 44 47 52 L47 68 Z" fill="#b45309"/>
    <text x="34" y="30" font-size="11">👑</text>
    <text x="4" y="18" font-size="11">✨</text>
    <text x="64" y="18" font-size="11">✨</text>
  </svg>`;
}

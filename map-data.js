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

// 10 個島嶼領土節點（完整 3 字短名，不截字）
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

// 基地小地圖 6 塊建築空地座標
export const BASE_PLOT_COORDS = [
  { id: 0, x: 22, y: 34, label: '北區高地' },
  { id: 1, x: 52, y: 26, label: '中央廣場' },
  { id: 2, x: 80, y: 36, label: '東區花園' },
  { id: 3, x: 20, y: 74, label: '西區草坪' },
  { id: 4, x: 50, y: 72, label: '南區大道' },
  { id: 5, x: 79, y: 75, label: '湖畔營地' }
];

// 雙主題對應的 6 大建築形式與 Lv.1 -> Lv.2 -> Lv.3 進化描述
export const BASE_CATALOG = {
  '4y': [
    { type: 'hq',     name: '恐龍主堡',   lvNames: ['破舊帳篷', '溫馨木石堡', '黃金恐龍城堡'], desc: '主基地：從簡易帳篷升級成黃金恐龍城堡', cost: [2, 4, 6] },
    { type: 'radar',  name: '巨石瞭望塔', lvNames: ['歪斜木樁', '碎石防禦塔', '巨龍火炬塔'],   desc: '防禦設施：從木樁升級成發光火炬塔',     cost: [2, 4, 6] },
    { type: 'rocket', name: '翼龍驛站',   lvNames: ['乾草巢穴', '木造飛棚',   '恐龍飛機總站'], desc: '載具中心：從草巢升級成恐龍飛艇總站',   cost: [2, 4, 6] },
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

/**
 * 乾淨的基地背景圖（支援 ./assets/base-bg-<theme>.png，未放圖時自動使用手繪風 SVG 場景）
 */
export function renderBaseSceneSVG(theme) {
  const isAstro = theme === '6y';
  const imgPath = `./base-bg-${theme}.png`;

  if (isAstro) {
    return `<div style="position:relative;width:100%;height:100%;">
      <svg viewBox="0 0 800 500" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
        <defs>
          <radialGradient id="spaceGlow" cx="50%" cy="48%" r="55%">
            <stop offset="0%" stop-color="#312e81"/>
            <stop offset="65%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
        </defs>
        <rect width="800" height="500" fill="url(#spaceGlow)"/>
        <!-- 星空、星雲與行星 -->
        <circle cx="85" cy="72" r="2.5" fill="#fef08a"/><circle cx="195" cy="48" r="2" fill="#e0e7ff"/>
        <circle cx="670" cy="65" r="3" fill="#93c5fd"/><circle cx="745" cy="135" r="2" fill="#fef08a"/>
        <circle cx="710" cy="82" r="22" fill="#6366f1" opacity="0.55"/>
        <ellipse cx="710" cy="82" rx="38" ry="9" fill="none" stroke="#a5b4fc" stroke-width="3" transform="rotate(-18 710 82)" opacity="0.7"/>
        <!-- 太空小行星基地平台 -->
        <path d="M90,390 Q55,260 140,145 Q280,60 440,68 Q620,62 715,175 Q765,300 680,415 Q490,475 240,455 Q120,440 90,390 Z"
              fill="#334155" stroke="#64748b" stroke-width="8"/>
        <path d="M125,375 Q95,265 170,165 Q290,90 435,96 Q595,92 680,190 Q725,295 650,395 Q480,445 255,428 Q150,415 125,375 Z"
              fill="#475569" stroke="#94a3b8" stroke-width="3"/>
        <!-- 發光能量軌道 -->
        <polyline points="176,170 416,130 640,180 632,375 400,360 160,370 176,170"
                  fill="none" stroke="#38bdf8" stroke-width="5" stroke-dasharray="10 8" opacity="0.75"/>
      </svg>
      <img src="${imgPath}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
           onload="this.style.opacity=1" onerror="this.style.display='none'" />
    </div>`;
  }

  return `<div style="position:relative;width:100%;height:100%;">
    <svg viewBox="0 0 800 500" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
      <rect width="800" height="500" fill="#86efac"/>
      <!-- 森林山丘與綠色草地 -->
      <path d="M0,120 Q130,30 270,105 Q410,20 560,100 Q690,35 800,115 L800,500 L0,500 Z"
            fill="#bbf7d0" stroke="#1e293b" stroke-width="4"/>
      <ellipse cx="400" cy="275" rx="345" ry="195" fill="#d9f99d" stroke="#15803d" stroke-width="4"/>
      <!-- 石板小徑與水池 -->
      <ellipse cx="655" cy="395" rx="68" ry="38" fill="#7dd3fc" stroke="#0284c7" stroke-width="3"/>
      <polyline points="176,170 416,130 640,180 632,375 400,360 160,370 176,170"
                fill="none" stroke="#d97706" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
      <text x="68" y="92" font-size="28">🌲</text><text x="235" y="75" font-size="26">🌳</text>
      <text x="530" y="78" font-size="26">🌳</text><text x="725" y="120" font-size="26">🌲</text>
      <text x="52" y="455" font-size="24">🌿</text><text x="735" y="465" font-size="24">🌸</text>
    </svg>
    <img src="${imgPath}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
         onload="this.style.opacity=1" onerror="this.style.display='none'" />
  </div>`;
}

/**
 * 建築物各等級外觀（支援 ./assets/bldg-<theme>-<type>-lv<level>.png，無圖時自動用乾淨向量圖形）
 */
export function renderBuildingArt(theme, type, level) {
  if (level <= 0) {
    return `<svg viewBox="0 0 80 80" class="bldg-svg">
      <ellipse cx="40" cy="64" rx="28" ry="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="24" y="46" width="32" height="15" rx="5" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="40" y="57" text-anchor="middle" font-size="11" fill="#475569" font-weight="bold">空地</text>
    </svg>`;
  }

  const isAstro = theme === '6y';
  const imgUrl = `./bldg-${theme}-${type}-lv${level}.png`;

  let fallbackSvg = '';
  if (level === 1) {
    // Lv.1：簡陋 / 落後外觀（破舊帳篷、歪斜木樁、廢棄電池、生鏽天線）
    fallbackSvg = isAstro
      ? `<svg viewBox="0 0 80 80" class="bldg-svg">
          <ellipse cx="40" cy="67" rx="26" ry="6" fill="#475569"/>
          <rect x="23" y="42" width="34" height="22" rx="3" fill="#64748b" stroke="#1e293b" stroke-width="2.2"/>
          <line x1="40" y1="42" x2="43" y2="23" stroke="#94a3b8" stroke-width="2.5"/>
          <circle cx="43" cy="21" r="3" fill="#ef4444"/>
          <rect x="35" y="52" width="10" height="12" fill="#334155"/>
        </svg>`
      : `<svg viewBox="0 0 80 80" class="bldg-svg">
          <ellipse cx="40" cy="67" rx="26" ry="6" fill="#a8a29e"/>
          <polygon points="40,26 17,65 63,65" fill="#b45309" stroke="#292524" stroke-width="2.2"/>
          <polygon points="40,46 33,65 47,65" fill="#292524"/>
          <line x1="19" y1="65" x2="23" y2="54" stroke="#57534e" stroke-width="2"/>
          <line x1="61" y1="65" x2="57" y2="54" stroke="#57534e" stroke-width="2"/>
        </svg>`;
  } else if (level === 2) {
    // Lv.2：進階 / 合金／木石精緻外觀
    fallbackSvg = isAstro
      ? `<svg viewBox="0 0 80 80" class="bldg-svg">
          <ellipse cx="40" cy="68" rx="30" ry="7" fill="#1d4ed8" opacity="0.45"/>
          <rect x="19" y="36" width="42" height="28" rx="6" fill="#3b82f6" stroke="#0f172a" stroke-width="2.2"/>
          <polygon points="40,14 22,36 58,36" fill="#93c5fd" stroke="#0f172a" stroke-width="2.2"/>
          <circle cx="30" cy="48" r="4" fill="#fef08a" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="50" cy="48" r="4" fill="#fef08a" stroke="#0f172a" stroke-width="1.5"/>
          <rect x="36" y="52" width="8" height="12" rx="2" fill="#1e293b"/>
        </svg>`
      : `<svg viewBox="0 0 80 80" class="bldg-svg">
          <ellipse cx="40" cy="68" rx="30" ry="7" fill="#4ade80" opacity="0.45"/>
          <rect x="20" y="37" width="40" height="27" rx="4" fill="#fef3c7" stroke="#1e293b" stroke-width="2.2"/>
          <polygon points="40,15 15,39 65,39" fill="#10b981" stroke="#1e293b" stroke-width="2.2"/>
          <rect x="35" y="50" width="10" height="14" rx="2" fill="#92400e" stroke="#1e293b" stroke-width="1.5"/>
          <circle cx="27" cy="47" r="3.5" fill="#38bdf8" stroke="#1e293b" stroke-width="1.5"/>
          <circle cx="53" cy="47" r="3.5" fill="#38bdf8" stroke="#1e293b" stroke-width="1.5"/>
        </svg>`;
  } else {
    // Lv.3：傳奇 / 金色／水晶發光華麗外觀
    fallbackSvg = isAstro
      ? `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">
          <circle cx="40" cy="40" r="34" fill="#38bdf8" opacity="0.25"/>
          <rect x="16" y="34" width="48" height="32" rx="7" fill="#2563eb" stroke="#fbbf24" stroke-width="2.5"/>
          <polygon points="40,8 25,34 55,34" fill="#fbbf24" stroke="#0f172a" stroke-width="2"/>
          <circle cx="40" cy="24" r="5" fill="#e0f2fe"/>
          <circle cx="27" cy="48" r="4.5" fill="#fef08a"/>
          <circle cx="53" cy="48" r="4.5" fill="#fef08a"/>
          <text x="10" y="19" font-size="12">✨</text>
          <text x="58" y="19" font-size="12">💎</text>
        </svg>`
      : `<svg viewBox="0 0 80 80" class="bldg-svg bldg-glow">
          <circle cx="40" cy="40" r="34" fill="#facc15" opacity="0.28"/>
          <rect x="17" y="35" width="46" height="31" rx="5" fill="#fef08a" stroke="#b45309" stroke-width="2.5"/>
          <polygon points="40,8 22,35 58,35" fill="#f59e0b" stroke="#78350f" stroke-width="2.2"/>
          <rect x="12" y="27" width="11" height="39" rx="3" fill="#fde047" stroke="#78350f" stroke-width="2"/>
          <rect x="57" y="27" width="11" height="39" rx="3" fill="#fde047" stroke="#78350f" stroke-width="2"/>
          <text x="34" y="27" font-size="11">👑</text>
          <text x="8" y="17" font-size="11">✨</text>
          <text x="61" y="17" font-size="11">✨</text>
        </svg>`;
  }

  return `<div style="position:relative;display:inline-flex;align-items:center;justify-content:center;">
    ${fallbackSvg}
    <img src="${imgUrl}" alt="" class="bldg-svg ${level >= 3 ? 'bldg-glow' : ''}"
         style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;"
         onerror="this.style.display='none'" />
  </div>`;
}

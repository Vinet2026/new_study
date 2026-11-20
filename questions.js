export const GRADE_LEVELS = {
  '4y': [
    { id: 'K2', label: '中班 (K2)' },
    { id: 'K3', label: '大班 (K3)' }
  ],
  '6y': [
    { id: 'G1', label: '小一 (G1)' },
    { id: 'G2', label: '小二 (G2)' },
    { id: 'G3', label: '小三 (G3)' },
    { id: 'G4', label: '小四 (G4)' },
    { id: 'G5', label: '小五 (G5)' },
    { id: 'G6', label: '小六 (G6)' }
  ]
};

export const TERRITORIES_BY_PROFILE = {
  '4y': [
    { id: 'k_math', icon: '🧠', name: 'STEAM 數理與空間', desc: '數字、形狀與比較', color: '#ecfdf5', border: '#10b981' },
    { id: 'k_lang', icon: '🗣️', name: '語文邏輯與分類', desc: '生活詞彙與因果推理', color: '#eff6ff', border: '#3b82f6' },
    { id: 'k_english', icon: '🔤', name: '雙語自然發音美語', desc: '水果、動物與日常英語', color: '#fefce8', border: '#eab308' },
    { id: 'k_science', icon: '🔬', name: '自然探索與感官', desc: '動物、天氣與物理變化', color: '#f5f3ff', border: '#8b5cf6' },
    { id: 'k_sel', icon: '🛡️', name: '自理自律與情緒品格', desc: '禮貌、刷牙與安全習慣', color: '#fff1f2', border: '#f43f5e' },
    { id: 'custom', icon: '🌟', name: '爸媽自訂專屬關卡', desc: '爸爸媽媽親自出的題目', color: '#fff7ed', border: '#f97316' }
  ],
  '6y': [
    { id: 'chinese', icon: '📖', name: '國語文領域', desc: '成語、讀音與閱讀理解', color: '#eff6ff', border: '#3b82f6' },
    { id: 'math', icon: '🧮', name: '數學領域', desc: '四則運算、時間與幾何', color: '#ecfdf5', border: '#10b981' },
    { id: 'english', icon: '🔤', name: '英語文領域', desc: '單字、句型與生活會話', color: '#fefce8', border: '#eab308' },
    { id: 'science', icon: '🔬', name: '自然科學領域', desc: '植物、物質變化與能源', color: '#f5f3ff', border: '#8b5cf6' },
    { id: 'social', icon: '🌍', name: '社會與素養邏輯', desc: '人際溝通、生活安全與公民', color: '#fff1f2', border: '#f43f5e' },
    { id: 'custom', icon: '🌟', name: '爸媽自訂專屬關卡', desc: '爸爸媽媽親自出的題目', color: '#fff7ed', border: '#f97316' }
  ]
};

export const BUILTIN_QUESTIONS = [
  // 4y 幼兒園 (K2, K3)
  { id: '4y_m1', profile: '4y', grade: 'K2', category: 'k_math', q: '小恐龍有 2 顆蘋果，媽媽又給了 1 顆，現在有幾顆？', options: ['3 顆', '4 顆', '1 顆'], answer: 0 },
  { id: '4y_m2', profile: '4y', grade: 'K3', category: 'k_math', q: '哪一個形狀有 3 個角、3 條邊？', options: ['圓形', '三角形', '正方形'], answer: 1 },
  { id: '4y_l1', profile: '4y', grade: 'K2', category: 'k_lang', q: '哪一個是可以吃的水果？', options: ['香蕉', '汽車', '椅子'], answer: 0 },
  { id: '4y_l2', profile: '4y', grade: 'K3', category: 'k_lang', q: '下雨天出門，我們要帶什麼才不會淋濕？', options: ['雨傘', '墨鏡', '扇子'], answer: 0 },
  { id: '4y_e1', profile: '4y', grade: 'K2', category: 'k_english', q: 'Apple 是哪一種水果？', options: ['蘋果', '西瓜', '葡萄'], answer: 0 },
  { id: '4y_e2', profile: '4y', grade: 'K3', category: 'k_english', q: 'Cat 代表哪一種小動物？', options: ['小狗', '小貓', '小鳥'], answer: 1 },
  { id: '4y_s1', profile: '4y', grade: 'K2', category: 'k_science', q: '哪一種動物會在天上飛？', options: ['小鳥', '金魚', '小狗'], answer: 0 },
  { id: '4y_s2', profile: '4y', grade: 'K3', category: 'k_science', q: '冰塊放在太陽下久了會變成什麼？', options: ['水', '石頭', '木頭'], answer: 0 },
  { id: '4y_sel1', profile: '4y', grade: 'K2', category: 'k_sel', q: '吃飽飯後，我們要做什麼保護牙齒？', options: ['刷牙', '看電視', '大叫'], answer: 0 },
  { id: '4y_sel2', profile: '4y', grade: 'K3', category: 'k_sel', q: '不小心撞到別人時，應該說什麼？', options: ['對不起', '走開', '沒看到'], answer: 0 },

  // 6y 國小 108 課綱 (G1 ~ G6)
  { id: '6y_c1', profile: '6y', grade: 'G1', category: 'chinese', q: '「日行(ㄒㄧㄥˊ)千里」的「行」讀作什麼？', options: ['ㄒㄧㄥˊ', 'ㄏㄤˊ', 'ㄏㄥˊ'], answer: 0 },
  { id: '6y_c2', profile: '6y', grade: 'G3', category: 'chinese', q: '「一碧千里」通常用來形容什麼？', options: ['草原或綠意遼闊', '天氣非常炎熱', '高樓大廈很多'], answer: 0 },
  { id: '6y_m1', profile: '6y', grade: 'G1', category: 'math', q: '1 小時有幾分鐘？', options: ['30 分鐘', '60 分鐘', '100 分鐘'], answer: 1 },
  { id: '6y_m2', profile: '6y', grade: 'G2', category: 'math', q: '8 × 7 等於多少？', options: ['54', '56', '63'], answer: 1 },
  { id: '6y_m3', profile: '6y', grade: 'G4', category: 'math', q: '一個長方形長 8 公分、寬 5 公分，面積是多少平方公分？', options: ['13', '26', '40'], answer: 2 },
  { id: '6y_e1', profile: '6y', grade: 'G1', category: 'english', q: '「Thank you」的意思是？', options: ['謝謝你', '早安', '再見'], answer: 0 },
  { id: '6y_e2', profile: '6y', grade: 'G2', category: 'english', q: '「Blue」是什麼顏色？', options: ['紅色', '藍色', '黃色'], answer: 1 },
  { id: '6y_s1', profile: '6y', grade: 'G3', category: 'science', q: '水加熱到攝氏幾度會沸騰？', options: ['50 度', '100 度', '0 度'], answer: 1 },
  { id: '6y_s2', profile: '6y', grade: 'G5', category: 'science', q: '植物行光合作用需要陽光、水和什麼氣體？', options: ['二氧化碳', '氦氣', '甲烷'], answer: 0 },
  { id: '6y_so1', profile: '6y', grade: 'G1', category: 'social', q: '在班上和同學意見不同時，最好的做法是？', options: ['理性溝通討論', '搶對方東西', '生氣不理人'], answer: 0 },
  { id: '6y_so2', profile: '6y', grade: 'G4', category: 'social', q: '使用平板超過時間，眼睛覺得痠應該怎麼做？', options: ['望遠休息與眨眼', '把亮度調到最亮', '湊更近看'], answer: 0 }
];

export const STICKERS = [
  { id: 's1', emoji: '🌱', name: '萌芽小芽', tier: 'bronze', story: '你踏出了第一步，學習的小芽正在冒出頭！' },
  { id: 's2', emoji: '🦖', name: '森林小恐龍', tier: 'silver', story: '小恐龍在茂密森林裡奔跑，尋找閃亮寶石！' },
  { id: 's3', emoji: '🚀', name: '星際太空梭', tier: 'silver', story: '點燃推進器，向著未知的銀河系出發！' },
  { id: 's4', emoji: '🌈', name: '彩虹橋守護者', tier: 'silver', story: '雨過天晴，七色彩虹架起了通往王國的橋樑。' },
  { id: 's5', emoji: '👑', name: '金星龍王傳說', tier: 'gold', story: '金光閃耀的小恐龍登上王國寶座，全體歡呼！' },
  { id: 's6', emoji: '🌌', name: '金星銀河探險家', tier: 'gold', story: '穿越璀璨星雲，發現了傳說中的黃金星球！' },
  { id: 's7', emoji: '⚡', name: '金星閃電戰神', tier: 'gold', story: '連對火花四射，一道閃電劃破黑暗夜空！' },
  { id: 's8', emoji: '🏆', name: '金星榮譽冠軍', tier: 'gold', story: '堅持不懈的努力化作最耀眼的金星獎盃！' },
  { id: 'c1', emoji: '🤝', name: '雙寶合體：龍騎飛船', tier: 'coop', story: '小恐龍坐上太空船副駕，雙寶合力衝向宇宙！' },
  { id: 'c2', emoji: '🛡️', name: '雙寶合體：破冰雙星', tier: 'coop', story: '互相救援、絕不放棄，雙星光芒融化了寒冰！' },
  { id: 'c3', emoji: '🐉', name: '雙寶合體：屠龍勇者', tier: 'coop', story: '聯手擊敗蛀牙巨龍，守護了全王國的笑容！' },
  { id: 'c4', emoji: '🌟', name: '雙寶合體：無敵拍檔', tier: 'coop', story: '最棒的兄弟姊妹默契，一起解鎖終極傳奇！' }
];

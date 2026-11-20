export const BUILTIN_QUESTIONS = [
  { id: '4y_m1', profile: '4y', category: 'math', q: '小恐龍有 2 顆蘋果，媽媽又給了 1 顆，現在有幾顆？', options: ['3 顆', '4 顆', '1 顆'], answer: 0 },
  { id: '4y_m2', profile: '4y', category: 'math', q: '哪一個形狀有 3 個角、3 條邊？', options: ['圓形', '三角形', '正方形'], answer: 1 },
  { id: '4y_l1', profile: '4y', category: 'lang', q: '哪一個是水果？', options: ['香蕉', '汽車', '椅子'], answer: 0 },
  { id: '4y_l2', profile: '4y', category: 'lang', q: '下雨天出門，我們要帶什麼才不會淋濕？', options: ['雨傘', '墨鏡', '扇子'], answer: 0 },
  { id: '4y_e1', profile: '4y', category: 'english', q: 'Apple 是哪一種水果？', options: ['蘋果', '西瓜', '葡萄'], answer: 0 },
  { id: '4y_e2', profile: '4y', category: 'english', q: 'Cat 代表哪一種小動物？', options: ['小狗', '小貓', '小鳥'], answer: 1 },
  { id: '4y_s1', profile: '4y', category: 'science', q: '哪一種動物會在天上飛？', options: ['小鳥', '金魚', '小狗'], answer: 0 },
  { id: '4y_s2', profile: '4y', category: 'science', q: '冰塊放久了會變成什麼？', options: ['水', '石頭', '木頭'], answer: 0 },
  { id: '4y_c1', profile: '4y', category: 'custom', q: '吃飽飯後，我們要做什麼保護牙齒？', options: ['刷牙', '看電視', '大叫'], answer: 0 },
  { id: '4y_c2', profile: '4y', category: 'custom', q: '不小心撞到別人時，應該說什麼？', options: ['對不起', '走開', '沒看到'], answer: 0 },

  { id: '6y_m1', profile: '6y', category: 'math', q: '8 × 7 等於多少？', options: ['54', '56', '63'], answer: 1 },
  { id: '6y_m2', profile: '6y', category: 'math', q: '1 小時有幾分鐘？', options: ['30 分鐘', '60 分鐘', '100 分鐘'], answer: 1 },
  { id: '6y_l1', profile: '6y', category: 'lang', q: '「一碧千里」通常用來形容什麼？', options: ['草原或綠意遼闊', '天氣非常炎熱', '高樓大廈很多'], answer: 0 },
  { id: '6y_l2', profile: '6y', category: 'lang', q: '「日行(ㄒㄧㄥˊ)千里」的「行」讀作什麼？', options: ['ㄒㄧㄥˊ', 'ㄏㄤˊ', 'ㄏㄥˊ'], answer: 0 },
  { id: '6y_e1', profile: '6y', category: 'english', q: '「Thank you」的意思是？', options: ['謝謝你', '早安', '再見'], answer: 0 },
  { id: '6y_e2', profile: '6y', category: 'english', q: '「Blue」是什麼顏色？', options: ['紅色', '藍色', '黃色'], answer: 1 },
  { id: '6y_s1', profile: '6y', category: 'science', q: '植物行光合作用需要陽光、水和什麼氣體？', options: ['二氧化碳', '氦氣', '甲烷'], answer: 0 },
  { id: '6y_s2', profile: '6y', category: 'science', q: '水加熱到攝氏幾度會沸騰？', options: ['50 度', '100 度', '0 度'], answer: 1 },
  { id: '6y_c1', profile: '6y', category: 'custom', q: '在班上和同學意見不同時，最好的做法是？', options: ['理性溝通討論', '搶對方東西', '生氣不理人'], answer: 0 },
  { id: '6y_c2', profile: '6y', category: 'custom', q: '使用平板超過時間，眼睛覺得痠應該怎麼做？', options: ['望遠休息與眨眼', '把亮度調到最亮', '湊更近看'], answer: 0 }
];

export const TERRITORIES = [
  { id: 'all', name: '🌟 全領域綜合特訓', desc: '隨機挑戰各科題目' },
  { id: 'math', name: '🧠 數理邏輯領地', desc: '數字、形狀與運算' },
  { id: 'lang', name: '🗣️ 語文國語領地', desc: '詞彙、理解與讀音' },
  { id: 'english', name: '🔤 雙語英語領地', desc: '單字與生活用語' },
  { id: 'science', name: '🔬 自然探索領地', desc: '生物、現象與常識' },
  { id: 'custom', name: '🛠️ 爸媽自訂＆生活領地', desc: '生活習慣與自訂題庫' }
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

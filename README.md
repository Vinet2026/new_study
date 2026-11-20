# 雙寶學習王國 v2（手機上傳專用・同資料夾平整版）

所有檔案都在**同一層目錄**，沒有任何子資料夾，方便直接用手機瀏覽器上傳到 GitHub / Vercel / Netlify。

## 檔案清單（共 8 個核心檔）
- `index.html`：頁面骨架與 Modal 視窗
- `styles.css`：直式注音排版、遊戲化樣式與動畫
- `zhuyin-dict.js`：台灣國字注音字典與直式排版解析（支援 `字(ㄓˋ)` 指定破音字）
- `questions.js`：內建題庫（幼兒園 / 國小 108 課綱）、領土設定與貼紙設定
- `storage.js`：`localStorage` 存檔、`IndexedDB` 真人錄音音檔、`CompressionStream` (gzip) 引繼碼
- `mistake-pool.js`：錯題怪獸池與間隔重複抽題
- `voice.js`：Web Speech API (`zh-TW`) 與真人錄音播放
- `app.js`：主流程控制、雙寶協力打 Boss、護眼軟著陸計時、家長後台

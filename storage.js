const STATE_KEY = 'childGame_v6_state';

function createProfileData() {
  return {
    starsEasy: 0,
    starsHard: 0,
    materials: 4, // 初始送 4 個建材讓小孩立刻能體驗蓋第一棟建築
    unlockedStickers: ['s1'],
    currentNode: 1,
    conqueredNodes: {}, // { 'subject_nodeId': true }
    nodeTowers: {},     // { 'subject_nodeId': 1 | 2 | 3 }
    basePlots: [null, null, null, null, null, null] // 6 塊自由設計基地空地 { type, level }
  };
}

export function createDefaultState() {
  return {
    activeProfile: '4y',
    activeTab: 'map', // 'map' | 'base'
    activeSubject: { '4y': 'k_lang', '6y': 'chinese' },
    selectedGrade: { '4y': 'ALL', '6y': 'ALL' },
    difficulty: 'easy', // 'easy' | 'hard'
    prefs: { listenFirst: false, debounce: true, voiceRate: 1.0 },
    profiles: {
      '4y': createProfileData(),
      '6y': createProfileData()
    },
    wrongPool: { '4y': {}, '6y': {} },
    customQuestions: [],
    eyecare: { endAt: null }
  };
}

export function loadAppState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    const def = createDefaultState();
    return {
      ...def,
      ...parsed,
      activeSubject: { ...def.activeSubject, ...(parsed.activeSubject || {}) },
      selectedGrade: { ...def.selectedGrade, ...(parsed.selectedGrade || {}) },
      prefs: { ...def.prefs, ...(parsed.prefs || {}) },
      profiles: {
        '4y': { ...createProfileData(), ...(parsed.profiles?.['4y'] || {}) },
        '6y': { ...createProfileData(), ...(parsed.profiles?.['6y'] || {}) }
      }
    };
  } catch {
    return createDefaultState();
  }
}

export function saveAppState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export class VoiceDB {
  constructor() {
    this.dbName = 'ChildGameAudioDB_v2';
    this.storeName = 'parentVoices';
  }
  _open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) db.createObjectStore(this.storeName);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async save(key, blob) {
    const db = await this._open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).put(blob, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }
  async get(key) {
    const db = await this._open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const req = tx.objectStore(this.storeName).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }
  async remove(key) {
    const db = await this._open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const TransferCode = {
  async encode(obj) {
    const stream = new Blob([JSON.stringify(obj)]).stream().pipeThrough(new CompressionStream('gzip'));
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    let bin = '';
    for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
    return 'V2_' + btoa(bin);
  },
  async decode(code) {
    const trimmed = (code || '').trim();
    if (!trimmed.startsWith('V2_')) throw new Error('轉移碼格式不正確');
    const bin = atob(trimmed.slice(3));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return JSON.parse(await new Response(stream).text());
  }
};

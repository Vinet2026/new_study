import { getPlainSpeakText } from './zhuyin-dict.js';

export function speakTTS(text, rate = 1.0, onDone) {
  const clean = getPlainSpeakText(text);
  if (!('speechSynthesis' in window)) {
    if (onDone) onDone();
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = 'zh-TW';
  utter.rate = Number(rate || 1.0);
  const tw = window.speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().includes('zh-tw'));
  if (tw) utter.voice = tw;
  utter.onend = () => { if (onDone) onDone(); };
  utter.onerror = () => { if (onDone) onDone(); };
  window.speechSynthesis.speak(utter);
}

export async function playFeedbackVoice(voiceDB, type, fallbackText, rate = 1.0) {
  const blob = await voiceDB.get(type);
  if (blob) {
    try {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
      return;
    } catch { /* fallback to TTS */ }
  }
  speakTTS(fallbackText, rate);
}

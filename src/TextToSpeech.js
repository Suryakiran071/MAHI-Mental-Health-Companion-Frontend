let currentUtterance = null;

export function speakText(text) {
  if (!('speechSynthesis' in window)) return alert('TTS not supported');

  stopSpeech();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 0.7;
  currentUtterance.pitch = 0.8;
  currentUtterance.volume = 0.6;

  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes("Zira") || v.name.includes("Google") || v.lang === "en-US");
  if (preferred) currentUtterance.voice = preferred;

  speechSynthesis.speak(currentUtterance);
}

export function stopSpeech() {
  if (speechSynthesis.speaking) speechSynthesis.cancel();
}

export function isSpeaking() {
  return speechSynthesis.speaking;
}

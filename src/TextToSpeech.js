let currentUtterance = null;
let selectedVoice = null;

// Load available voices and pick a preferred female voice
function loadVoices() {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return;

  // Try to find a high-quality female voice
  const femaleVoice = voices.find(v =>
    /female|zira|Google UK English Female|Jenny/i.test(v.name) && v.lang.startsWith('en')
  );

  const googleVoice = voices.find(v =>
    /Google (UK|US)? English/i.test(v.name) && v.lang.startsWith('en')
  );

  const defaultVoice = voices.find(v => v.lang === 'en-US');

  // Priority: natural female > Google > default
  selectedVoice = femaleVoice || googleVoice || defaultVoice || voices[0];
}

// Ensure voices are loaded before use
speechSynthesis.onvoiceschanged = loadVoices;

// Immediately try to load if available
loadVoices();

export function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert('Text-to-Speech is not supported in your browser.');
    return;
  }

  stopSpeech(); // Cancel any previous speech

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 0.7;
  currentUtterance.pitch = 1.0; // more natural tone
  currentUtterance.volume = 1.5;

  // Recheck voice before speaking
  if (!selectedVoice) loadVoices();
  if (selectedVoice) currentUtterance.voice = selectedVoice;

  speechSynthesis.speak(currentUtterance);
}

export function stopSpeech() {
  if (speechSynthesis.speaking || speechSynthesis.pending) {
    speechSynthesis.cancel();
  }
}

export function isSpeaking() {
  return speechSynthesis.speaking;
}
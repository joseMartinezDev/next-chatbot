export const initSpeechRecognition = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  return new SpeechRecognition();
};

export const synthVoice = (text) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();

  var voices = window.speechSynthesis.getVoices();
  utterance.voice = voices[2];

  utterance.text = text;
  synth.speak(utterance);
  return utterance;
};

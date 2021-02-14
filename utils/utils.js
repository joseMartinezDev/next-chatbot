export const initSpeechRecognition = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  return new SpeechRecognition();
};

function setSpeech() {
  return new Promise(function (resolve) {
    let synth = window.speechSynthesis;
    let id;

    id = setInterval(() => {
      if (synth.getVoices().length !== 0) {
        resolve(synth.getVoices());
        clearInterval(id);
      }
    }, 10);
  });
}

export const changeVoice = () => {
  let s = setSpeech();
  return s.then((voices) => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.voice = voices[50];

    return utterance;
  });
};
export const synthVoice = (utterance, text) => {
  const synth = window.speechSynthesis;
  utterance.text = text;
  synth.speak(utterance);
};

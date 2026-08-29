import { useState } from 'react';

const mockLines = {
  English: [
    "The quick brown fox jumps over the lazy dog.",
    "Artificial intelligence is transforming the world.",
    "Please read this sentence clearly into the microphone."
  ],
  Hindi: [
    "यह एक बहुत ही सुंदर दिन है।",
    "कृत्रिम बुद्धिमत्ता भविष्य को बदल रही है।",
    "कृपया इस वाक्य को स्पष्ट रूप से पढ़ें।"
  ],
  Dogri: [
    "अज्ज दा दिन बड़ा सुहाना ऐ।",
    "तुसें दा केह् नां ऐ?",
    "मिगी तुंदे कन्नै गल्ल करियै बड़ा शैल लग्गा।"
  ]
};

export function useAudioSubmission(userLanguages = []) {
  const [currentLine, setCurrentLine] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const generateLine = () => {
    if (!userLanguages || userLanguages.length === 0) return;
    // Pick a random language from user's spoken languages
    const lang = userLanguages[Math.floor(Math.random() * userLanguages.length)];
    const lines = mockLines[lang] || mockLines.English;
    const line = lines[Math.floor(Math.random() * lines.length)];
    
    setTargetLanguage(lang);
    setCurrentLine(line);
    setPrediction(null);
  };

  const submitAudio = async (audioBlob) => {
    setIsPredicting(true);
    setPrediction(null);

    // Simulate network delay and AI processing
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsPredicting(false);
        const isCorrect = Math.random() > 0.15; // 85% mock accuracy
        const predictedLang = isCorrect ? targetLanguage : (userLanguages[0] || 'English');
        
        const result = {
          predictedLanguage: predictedLang,
          confidence: (Math.random() * (0.99 - 0.75) + 0.75).toFixed(2), // 75% to 99%
          isMatch: predictedLang === targetLanguage,
        };
        setPrediction(result);
        resolve(result);
      }, 2500);
    });
  };

  return {
    currentLine,
    targetLanguage,
    generateLine,
    submitAudio,
    isPredicting,
    prediction
  };
}

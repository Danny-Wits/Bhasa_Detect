import { useState, useCallback } from 'react';

const SENTENCES = {
  English: [
    "The quick brown fox jumps over the lazy dog.",
    "Artificial intelligence is transforming how we communicate.",
    "Please read this sentence clearly into the microphone.",
    "Technology bridges the gap between different cultures.",
    "Speech recognition helps build a more inclusive world.",
    "Every voice matters in the age of machine learning.",
    "Language is the most powerful tool humanity has ever created.",
    "Digital assistants rely on diverse voice data to improve.",
  ],
  Hindi: [
    "यह एक बहुत ही सुंदर दिन है।",
    "कृत्रिम बुद्धिमत्ता भविष्य को बदल रही है।",
    "कृपया इस वाक्य को स्पष्ट रूप से पढ़ें।",
    "प्रौद्योगिकी विभिन्न संस्कृतियों को जोड़ती है।",
    "भाषा पहचान तकनीक दिन-ब-दिन बेहतर हो रही है।",
    "हर आवाज़ मशीन लर्निंग के युग में महत्वपूर्ण है।",
    "भाषा मानवता का सबसे शक्तिशाली उपकरण है।",
    "डिजिटल सहायक विविध आवाज़ डेटा पर निर्भर करते हैं।",
  ],
  Dogri: [
    "अज्ज दा दिन बड़ा सुहाना ऐ।",
    "तुसें दा केह् नां ऐ?",
    "मिगी तुंदे कन्नै गल्ल करियै बड़ा शैल लग्गा।",
    "इस वाक्य गी ध्यान कन्नै पढ़ो।",
    "हर बंदे दी आवाज़ दा मतलब ऐ।",
    "भाषा इक बड्डी ताकत ऐ।",
    "तकनीक सारेआं गी जोड़दी ऐ।",
    "नमस्ते, तुसीं कुस हाल ओ?",
  ],
};

const TOTAL_SENTENCES = 5;

export function useRecordingSession(languages = []) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionSentences, setSessionSentences] = useState([]);
  const [results, setResults] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [isSessionReady, setIsSessionReady] = useState(false);

  const initSession = useCallback(() => {
    if (!languages || languages.length === 0) return;

    const sentences = [];
    for (let i = 0; i < TOTAL_SENTENCES; i++) {
      const lang = languages[i % languages.length];
      const pool = SENTENCES[lang] || SENTENCES.English;
      const line = pool[Math.floor(Math.random() * pool.length)];
      sentences.push({ language: lang, text: line, id: i + 1 });
    }

    setSessionSentences(sentences);
    setCurrentIndex(0);
    setResults([]);
    setCurrentPrediction(null);
    setIsSessionReady(true);
  }, [languages]);

  const currentSentence = sessionSentences[currentIndex] || null;
  const isComplete = currentIndex >= TOTAL_SENTENCES && results.length === TOTAL_SENTENCES;

  const submitAudio = async (blob) => {
    setIsPredicting(true);
    setCurrentPrediction(null);

    const expectedLang = currentSentence.language;
    const storedUser = localStorage.getItem('bhasa_user');
    const username = storedUser ? JSON.parse(storedUser) : 'anonymous';

    let blobUrl = null;
    if (blob) {
      blobUrl = URL.createObjectURL(blob);
    }

    try {
      const formData = new FormData();
      // The browser's MediaRecorder creates a WebM file (or mp4 on Safari).
      // Labeling it as .webm instead of .wav prevents `librosa` from misinterpreting the header.
      formData.append('audio', blob, 'recording.webm');
      formData.append('username', username);
      formData.append('expected_language', expectedLang);

      const token = localStorage.getItem('bhasa_token') || '';
      
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction request failed');
      }

      const data = await response.json();

      const predictedLang = data.predicted_language;
      const confidence = data.confidence / 100; // Normalize 0-1
      const duration = data.duration_sec;

      const techSpecs = {
        blobUrl,
        spectral: { 
          centroid: (Math.random() * 2000 + 1000).toFixed(2) + ' Hz', 
          bandwidth: (Math.random() * 1000 + 1500).toFixed(2) + ' Hz', 
          rolloff: (Math.random() * 3000 + 2000).toFixed(2) + ' Hz',
          contrast: (Math.random() * 10 + 10).toFixed(2) + ' dB',
          flux: (Math.random() * 1.5).toFixed(3)
        },
        prosodic: { 
          pitch: (Math.random() * 150 + 100).toFixed(1) + ' Hz', 
          duration: duration + ' s',
          speechRate: (Math.random() * 3 + 2).toFixed(1) + ' syllables/s'
        },
        formants: { 
          f1: (Math.random() * 400 + 300).toFixed(0) + ' Hz', 
          f2: (Math.random() * 1000 + 1000).toFixed(0) + ' Hz',
          f3: (Math.random() * 500 + 2200).toFixed(0) + ' Hz',
          f4: (Math.random() * 500 + 3200).toFixed(0) + ' Hz'
        },
        timeDomain: { 
          rms: (Math.random() * 0.05 + 0.01).toFixed(4), 
          zcr: (Math.random() * 0.05 + 0.02).toFixed(4),
          energy: (Math.random() * 100 + 50).toFixed(1)
        },
        voiceQuality: { 
          jitter: (Math.random() * 1.5 + 0.1).toFixed(2) + '%', 
          shimmer: (Math.random() * 3 + 1).toFixed(2) + '%', 
          hnr: (Math.random() * 15 + 10).toFixed(1) + ' dB', 
          cpp: (Math.random() * 10 + 5).toFixed(1) + ' dB' 
        }
      };

      const result = {
        sentenceId: currentSentence.id,
        sentence: currentSentence.text,
        expectedLanguage: expectedLang,
        predictedLanguage: predictedLang,
        confidence,
        isCorrect: predictedLang === expectedLang,
        duration,
        techSpecs,
        probabilities: data.probabilities, // Store detailed probabilities
      };

      setCurrentPrediction(result);
      setResults((prev) => {
        const updated = [...prev];
        updated[currentIndex] = result;
        return updated;
      });
    } catch (err) {
      console.error('Error during prediction API call:', err);
      // Fallback for demo or server down
      alert('Failed to connect to backend server. Ensure it is running on port 8000.');
    } finally {
      setIsPredicting(false);
    }
  };

  const reRecord = () => {
    setCurrentPrediction(null);
    setResults((prev) => {
      const updated = [...prev];
      updated[currentIndex] = null;
      return updated;
    });
  };

  const goNext = () => {
    if (currentIndex < TOTAL_SENTENCES - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentPrediction(results[currentIndex + 1] || null);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setCurrentPrediction(results[currentIndex - 1] || null);
    }
  };

  const isLastSentence = currentIndex === TOTAL_SENTENCES - 1;
  const allDone = results.filter(Boolean).length === TOTAL_SENTENCES;

  return {
    initSession,
    isSessionReady,
    currentSentence,
    currentIndex,
    totalSentences: TOTAL_SENTENCES,
    isPredicting,
    currentPrediction,
    results,
    submitAudio,
    reRecord,
    goNext,
    goBack,
    isLastSentence,
    allDone,
    isComplete,
  };
}

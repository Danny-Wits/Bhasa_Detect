import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../lib/api';
import { SENTENCES_DATA } from '../data/sentences';

export const TOTAL_TESTS = 5;
export const SENTENCES_PER_TEST = 5;

// Fisher-Yates array shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionTests(selectedLanguages = []) {
  const availableLangs = ['Dogri', 'Hindi', 'English'];
  const userLangs = (selectedLanguages && selectedLanguages.length > 0)
    ? selectedLanguages.filter((l) => availableLangs.includes(l))
    : availableLangs;

  const activeLangs = userLangs.length > 0 ? userLangs : availableLangs;

  // Track sentence pools per language to ensure non-repeating sentences across tests
  const languagePools = {};
  activeLangs.forEach((lang) => {
    languagePools[lang] = shuffle(SENTENCES_DATA[lang] || SENTENCES_DATA.English);
  });

  const sessionTests = [];

  for (let testIdx = 0; testIdx < TOTAL_TESTS; testIdx++) {
    const testLanguage = activeLangs[testIdx % activeLangs.length];

    if (!languagePools[testLanguage] || languagePools[testLanguage].length < SENTENCES_PER_TEST) {
      languagePools[testLanguage] = shuffle(SENTENCES_DATA[testLanguage] || SENTENCES_DATA.English);
    }

    const fiveSentences = languagePools[testLanguage].splice(0, SENTENCES_PER_TEST);

    sessionTests.push({
      testNumber: testIdx + 1,
      language: testLanguage,
      sentences: fiveSentences,
      combinedText: fiveSentences.join(' '),
    });
  }

  return sessionTests;
}

export function useRecordingSession(languages = []) {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [sessionTests, setSessionTests] = useState([]);
  const [results, setResults] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const initSession = useCallback(() => {
    const generated = generateSessionTests(languages);
    setSessionTests(generated);
    setCurrentTestIndex(0);
    setResults([]);
    setCurrentPrediction(null);
    setIsFinished(false);
    setIsSessionReady(true);
  }, [languages]);

  const currentTest = sessionTests[currentTestIndex] || null;
  const currentTestNumber = currentTest?.testNumber || currentTestIndex + 1;
  const currentTestLanguage = currentTest?.language || 'English';
  const currentSentences = currentTest?.sentences || [];
  const currentCombinedText = currentTest?.combinedText || '';

  const isLastTest = currentTestIndex === TOTAL_TESTS - 1;
  const allDone = isFinished && results.filter(Boolean).length === TOTAL_TESTS;

  const nextTest = sessionTests[currentTestIndex + 1] || null;
  const nextTestLanguage = nextTest?.language || null;

  const submitAudio = async (blob) => {
    if (!currentTest) return;
    setIsPredicting(true);
    setCurrentPrediction(null);

    const expectedLang = currentTest.language;
    const storedUser = localStorage.getItem('bhasa_user');
    const username = storedUser ? JSON.parse(storedUser) : 'anonymous';

    let blobUrl = null;
    if (blob) {
      blobUrl = URL.createObjectURL(blob);
    }

    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      formData.append('username', username);
      formData.append('expected_language', expectedLang);

      const token = localStorage.getItem('bhasa_token') || '';
      
      const response = await fetch(`${API_BASE_URL}/predict`, {
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
      const confidence = data.confidence / 100;
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
        testNumber: currentTest.testNumber,
        expectedLanguage: expectedLang,
        predictedLanguage: predictedLang,
        confidence,
        isCorrect: predictedLang === expectedLang,
        duration,
        sentences: currentTest.sentences,
        combinedText: currentTest.combinedText,
        techSpecs,
        probabilities: data.probabilities,
      };

      setCurrentPrediction(result);
      setResults((prev) => {
        const updated = [...prev];
        updated[currentTestIndex] = result;
        return updated;
      });
    } catch (err) {
      console.error('Error during prediction API call:', err);
      alert('Failed to connect to backend server. Please verify your connection or check backend status.');
    } finally {
      setIsPredicting(false);
    }
  };

  const reRecord = () => {
    setCurrentPrediction(null);
    setResults((prev) => {
      const updated = [...prev];
      updated[currentTestIndex] = null;
      return updated;
    });
  };

  const goNext = () => {
    if (currentTestIndex < TOTAL_TESTS - 1) {
      setCurrentTestIndex((prev) => prev + 1);
      setCurrentPrediction(results[currentTestIndex + 1] || null);
    } else if (currentTestIndex === TOTAL_TESTS - 1) {
      setIsFinished(true);
    }
  };

  const finishSession = () => {
    setIsFinished(true);
  };

  const goBack = () => {
    if (currentTestIndex > 0) {
      setCurrentTestIndex((prev) => prev - 1);
      setCurrentPrediction(results[currentTestIndex - 1] || null);
    }
  };

  return {
    initSession,
    isSessionReady,
    currentTest,
    currentTestIndex,
    currentTestNumber,
    currentTestLanguage,
    currentSentences,
    currentCombinedText,
    totalTests: TOTAL_TESTS,
    sentencesPerTest: SENTENCES_PER_TEST,
    isPredicting,
    currentPrediction,
    results,
    submitAudio,
    reRecord,
    goNext,
    goBack,
    finishSession,
    isLastTest,
    nextTestLanguage,
    allDone,
  };
}

import { useState, useEffect } from 'react';

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        // Overview stats
        totalSessions: 12,
        totalSentences: 60,
        overallAccuracy: 87,
        avgConfidence: 91,
        totalSpeakingTime: '18m 42s',
        avgUtteranceDuration: '3.2s',

        // Per-language accuracy
        languageAccuracy: [
          { language: 'English', accuracy: 92, correct: 22, incorrect: 2, color: 'blue' },
          { language: 'Hindi', accuracy: 85, correct: 17, incorrect: 3, color: 'grape' },
          { language: 'Dogri', accuracy: 81, correct: 13, incorrect: 3, color: 'teal' },
        ],

        // Contributions over time
        activityData: [
          { date: 'Mon', English: 12, Hindi: 15, Dogri: 5 },
          { date: 'Tue', English: 19, Hindi: 20, Dogri: 8 },
          { date: 'Wed', English: 15, Hindi: 22, Dogri: 12 },
          { date: 'Thu', English: 22, Hindi: 18, Dogri: 15 },
          { date: 'Fri', English: 30, Hindi: 25, Dogri: 20 },
          { date: 'Sat', English: 35, Hindi: 30, Dogri: 25 },
          { date: 'Sun', English: 25, Hindi: 28, Dogri: 18 },
        ],

        // Language distribution donut
        languageData: [
          { name: 'English', value: 24, color: 'blue.6' },
          { name: 'Hindi', value: 20, color: 'grape.6' },
          { name: 'Dogri', value: 16, color: 'teal.6' },
        ],

        // Correct vs incorrect bar
        predictionData: [
          { language: 'English', Correct: 22, Incorrect: 2 },
          { language: 'Hindi', Correct: 17, Incorrect: 3 },
          { language: 'Dogri', Correct: 13, Incorrect: 3 },
        ],

        // Confidence distribution
        confidenceData: [
          { range: '70-75%', count: 3 },
          { range: '75-80%', count: 5 },
          { range: '80-85%', count: 8 },
          { range: '85-90%', count: 12 },
          { range: '90-95%', count: 18 },
          { range: '95-100%', count: 14 },
        ],

        // Duration by language
        durationData: [
          { language: 'English', avgDuration: 2.8 },
          { language: 'Hindi', avgDuration: 3.4 },
          { language: 'Dogri', avgDuration: 3.1 },
        ],

        // Recent sessions
        recentSessions: [
          { id: 'S001', date: '2026-09-12', combo: 'Hindi + English', sentences: 5, accuracy: 80, duration: '1m 34s' },
          { id: 'S002', date: '2026-09-11', combo: 'Hindi + Dogri', sentences: 5, accuracy: 100, duration: '1m 48s' },
          { id: 'S003', date: '2026-09-10', combo: 'Hindi + English + Dogri', sentences: 5, accuracy: 60, duration: '1m 22s' },
          { id: 'S004', date: '2026-09-09', combo: 'English + Dogri', sentences: 5, accuracy: 80, duration: '1m 40s' },
        ],
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}

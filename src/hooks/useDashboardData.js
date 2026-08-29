import { useState, useEffect } from 'react';

export function useDashboardData() {
  const [data, setData] = useState({
    contributions: 0,
    avgConfidence: 0,
    activeLanguages: 0,
    activityData: [],
    languageData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch for dashboard metrics
    const timer = setTimeout(() => {
      setData({
        contributions: 142,
        avgConfidence: 94,
        activeLanguages: 3,
        activityData: [
          { date: 'Mon', English: 12, Hindi: 15, Dogri: 5 },
          { date: 'Tue', English: 19, Hindi: 20, Dogri: 8 },
          { date: 'Wed', English: 15, Hindi: 22, Dogri: 12 },
          { date: 'Thu', English: 22, Hindi: 18, Dogri: 15 },
          { date: 'Fri', English: 30, Hindi: 25, Dogri: 20 },
          { date: 'Sat', English: 35, Hindi: 30, Dogri: 25 },
          { date: 'Sun', English: 25, Hindi: 28, Dogri: 18 },
        ],
        languageData: [
          { name: 'English', value: 158, color: 'blue.6' },
          { name: 'Hindi', value: 158, color: 'grape.6' },
          { name: 'Dogri', value: 103, color: 'teal.6' },
        ]
      });
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}

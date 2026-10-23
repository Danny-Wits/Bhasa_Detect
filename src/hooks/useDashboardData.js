import { useState, useEffect } from 'react';
import { useAuth } from '../lib/authContext';
import { API_BASE_URL } from '../lib/api';

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        } else {
          console.error("Failed to fetch stats");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [getToken]);

  return { data, loading };
}

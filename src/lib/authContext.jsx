import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});
const API_URL = 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('bhasa_token');
      if (token) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setProfile(data.profile);
          } else {
            localStorage.removeItem('bhasa_token');
          }
        } catch (e) {
          console.error("Failed to fetch user", e);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Login failed");
    }
    
    const data = await res.json();
    localStorage.setItem('bhasa_token', data.token);
    setUser(data.user);
    
    // Fetch profile
    const profRes = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${data.token}` }
    });
    if (profRes.ok) {
      const pData = await profRes.json();
      setProfile(pData.profile);
    }
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Registration failed");
    }
    
    const data = await res.json();
    localStorage.setItem('bhasa_token', data.token);
    setUser(data.user);
    setProfile(null);
  };

  const logout = () => {
    localStorage.removeItem('bhasa_token');
    setUser(null);
    setProfile(null);
  };

  const saveProfile = async (profileData) => {
    const token = localStorage.getItem('bhasa_token');
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    if (res.ok) {
      setProfile(profileData);
    } else {
      throw new Error("Failed to save profile");
    }
  };

  const getToken = () => localStorage.getItem('bhasa_token');

  return (
    <AuthContext.Provider value={{ user, login, register, logout, profile, saveProfile, loading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

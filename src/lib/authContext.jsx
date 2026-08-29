import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('bhasa_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      const storedProfile = localStorage.getItem(`bhasa_profile_${parsedUser.id}`);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    }
    setLoading(false);
  }, []);

  const login = (username) => {
    const newUser = { id: Date.now().toString(), username };
    localStorage.setItem('bhasa_user', JSON.stringify(newUser));
    setUser(newUser);
    setProfile(null);
  };

  const logout = () => {
    localStorage.removeItem('bhasa_user');
    setUser(null);
    setProfile(null);
  };

  const saveProfile = (data) => {
    if (user) {
      localStorage.setItem(`bhasa_profile_${user.id}`, JSON.stringify(data));
      setProfile(data);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, profile, saveProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

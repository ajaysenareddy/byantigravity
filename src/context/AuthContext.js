import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'John Doe',
        email: email,
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      });
      setIsLoading(false);
    }, 1000);
  };

  const signup = async (name, email, password) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: '1',
        name: name,
        email: email,
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      });
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

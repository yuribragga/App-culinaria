import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  favorites: Recipe[];
  fetchFavorites: () => Promise<void>;
  addFavorite: (recipeId: number) => Promise<void>;
  removeFavorite: (recipeId: number) => Promise<void>;
}

interface User {
  id: number;
  name: string;
  socialName: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  profileImage?: string;
}

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  setUser: () => {},
  login: async () => {},
  logout: () => {},
  favorites: [],
  fetchFavorites: async () => {},
  addFavorite: async () => {},
  removeFavorite: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Dados enviados para o backend:', { email, password }); 
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
  
      console.log('Token JWT armazenado:', token);
      await AsyncStorage.setItem('token', token); 
      setIsLoggedIn(true);
      setUser(user);
  
      
      console.log('ID do usuário após login:', user.id);
  
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      if (error.response?.status === 400) {
        alert('Credenciais inválidas. Verifique seu email e senha.');
      } else {
        alert('Erro ao fazer login. Tente novamente mais tarde.');
      }
    }
  };
  
  
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setFavorites([]);
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites/list');
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  const addFavorite = async (recipeId: number) => {
    try {
      const response = await api.post('/favorites/add', { recipeId });
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
    }
  };

  const removeFavorite = async (recipeId: number) => {
    try {
      const response = await api.post('/favorites/remove', { recipeId });
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        setUser,
        login,
        logout,
        favorites,
        fetchFavorites,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
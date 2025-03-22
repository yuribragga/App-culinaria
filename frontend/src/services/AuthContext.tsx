import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  favorites: Recipe[];
  fetchFavorites: () => Promise<void>;
  addFavorite: (recipeId: number) => Promise<void>;
  removeFavorite: (recipeId: number) => Promise<void>;
}

interface User {
  name: string;
  email: string;
  phoneNumber: string;
  nationality: string;
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
      console.log('Dados enviados para o backend:', { email, password }); // Log para verificar os dados
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      console.log('Token JWT armazenado:', token); // Log para verificar o token armazenado
      await AsyncStorage.setItem('token', token); // Armazena o token no AsyncStorage
      setIsLoggedIn(true);
      setUser(user); // Atualiza o estado do usuário
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
    setFavorites([]); // Limpa os favoritos ao fazer logout
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites/list'); // Endpoint para listar favoritos
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  const addFavorite = async (recipeId: number) => {
    try {
      const response = await api.post('/favorites/add', { recipeId }); // Endpoint para adicionar favorito
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
    }
  };

  const removeFavorite = async (recipeId: number) => {
    try {
      const response = await api.post('/favorites/remove', { recipeId }); // Endpoint para remover favorito
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
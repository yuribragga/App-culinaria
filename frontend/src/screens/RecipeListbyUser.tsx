import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../services/api';
import CircularMenu from '../components/CircularMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  userId: number;
}

const RecipeListbyUser: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Erro ao recuperar o token:', error);
      return null;
    }
  };

  const decodeToken = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token JWT
      return payload.id; // Retorna o ID do usuário
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  };

  const fetchRecipesByUser = async (userId: number) => {
    const token = await getToken();

    if (!token) {
      console.log('Usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      console.log('Token enviado:', token);
      const response = await api.get(`/recipes/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Receitas recebidas:', response.data);
      setRecipes(response.data.recipes);
    } catch (error: any) {
      console.error('Erro ao buscar receitas do usuário:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserIdAndRecipes = async () => {
        const token = await getToken();
        if (!token) {
          console.log('Usuário não autenticado');
          setLoading(false);
          return;
        }

        const userId = decodeToken(token); // Decodifica o token para obter o ID do usuário
        if (!userId) {
          console.error('ID do usuário não encontrado no token');
          setLoading(false);
          return;
        }

        fetchRecipesByUser(userId); // Busca as receitas do usuário com o ID correto
      };

      fetchUserIdAndRecipes();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7c74" />
        <Text>Carregando receitas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => navigation.navigate('RecipeDetails', { id: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.recipeDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <CircularMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeInfo: {
    flex: 1,
    padding: 8,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default RecipeListbyUser;

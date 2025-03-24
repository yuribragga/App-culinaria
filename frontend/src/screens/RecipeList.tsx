import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Title } from 'react-native-paper';
import api from '../services/api';
import CircularMenu from '../components/CircularMenu';
import { useFocusEffect } from '@react-navigation/native';

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
}

const RecipeList: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRecipes = async () => {
    try {
      const response = await api.get('/recipes');
      setRecipes(response.data.recipes);
    } catch (error: any) {
      console.error('Erro ao buscar receitas:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
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
      <Title style={styles.title}>Receitas</Title>
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
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
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

export default RecipeList;

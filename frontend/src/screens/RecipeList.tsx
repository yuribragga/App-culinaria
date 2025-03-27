import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Title, Searchbar } from 'react-native-paper';
import api from '../services/api';
import CircularMenu from '../components/CircularMenu';
import { useFocusEffect } from '@react-navigation/native';

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  ingredients?: string; 
}

const RecipeList: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(''); 

  const fetchRecipes = async () => {
    try {
      const response = await api.get('/recipes');
      setRecipes(response.data.recipes);
      setFilteredRecipes(response.data.recipes); 
    } catch (error: any) {
      console.error('Erro ao buscar receitas:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  
    const filtered = recipes.filter((recipe) => {
      const ingredients = recipe.ingredients || ''; 
      return (
        recipe.name.toLowerCase().includes(query.toLowerCase()) || 
        ingredients.toLowerCase().includes(query.toLowerCase())   
      );
    });
  
    setFilteredRecipes(filtered);
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

      <Searchbar
        placeholder="Pesquisar Receita"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredRecipes} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => navigation.navigate('RecipeDetails', { id: item.id })}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Sem Imagem</Text>
              </View>
            )}
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
    fontSize: 24,
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: 'bold',
    color: '#FFF',
    backgroundColor: '#9BC584',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchbar: {
    marginBottom: 16,
    borderRadius: 8,
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
  placeholderImage: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  placeholderText: {
    color: '#666',
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

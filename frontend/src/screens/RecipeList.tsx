import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Title, Searchbar, Menu, Button } from 'react-native-paper';
import api from '../services/api';
import CircularMenu from '../components/CircularMenu';
import { useFocusEffect } from '@react-navigation/native';

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  classification: string;
  ingredients?: string;
}

const RecipeList: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [classification, setClassification] = useState<string>('');

  const classifications = [
    { label: 'Todos', value: '' },
    { label: 'Doce', value: 'Doce' },
    { label: 'Salgado', value: 'Salgado' },
    { label: 'Bebida', value: 'Bebida' },
    { label: 'Sobremesa', value: 'Sobremesa' },
    { label: 'Lanche', value: 'Lanche' },
  ];

  const fetchRecipes = async (classification?: string) => {
    try {
      setLoading(true);
      const response = await api.get('/recipes', {
        params: { classification },
      });
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
      return recipe.name.toLowerCase().includes(query.toLowerCase());
    });

    setFilteredRecipes(filtered);
  };

  const handleFilter = (value: string) => {
    setClassification(value);
    setMenuVisible(false);

    if (value) {
      // Filtra as receitas com base na classificação selecionada
      const filtered = recipes.filter((recipe) => recipe.classification === value);
      setFilteredRecipes(filtered);
    } else {
      // Exibe todas as receitas se "Todos" for selecionado
      setFilteredRecipes(recipes);
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
      <Searchbar
        placeholder="Pesquisar Receita"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.menuContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setMenuVisible(true)}>
              {classification || 'Filtrar por Classificação'}
            </Button>
          }
        >
          {classifications.map((item) => (
            <Menu.Item
              key={item.value}
              onPress={() => handleFilter(item.value)}
              title={item.label}
            />
          ))}
        </Menu>
      </View>

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
              <Text style={styles.recipeClassiification}>#{item.classification}</Text>
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
  searchbar: {
    marginBottom: 16,
    borderRadius: 8,
  },
  menuContainer: {
    marginBottom: 16,
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
  recipeClassiification: {
    fontSize: 12,
    color: '#604490',
    marginBottom: 4,
  },
});

export default RecipeList;

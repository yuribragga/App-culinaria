import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { AuthContext } from '../services/AuthContext';

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: string | string[];
  time: number;
  servings: number;
  classification: string;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
    nationality: string;
  };
}

const RecipeDetails: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { id } = route.params; 
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false); 
  const { addFavorite, removeFavorite, favorites, isLoggedIn } = useContext(AuthContext);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/recipes/${id}`);
      const recipeData = response.data.recipe;

      if (typeof recipeData.instructions === 'string') {
        recipeData.instructions = recipeData.instructions.split(',');
      }

      setRecipe(recipeData);

      const isFav = favorites.some((fav) => fav.id === id);
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Erro ao buscar detalhes da receita:', error);
      setError('Erro ao carregar os detalhes da receita.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoggedInUserId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
        setLoggedInUserId(decodedToken.id);
      }
    } catch (error) {
      console.error('Erro ao obter o ID do usuário logado:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLoggedInUserId();
      fetchRecipeDetails();
    }, [id, favorites])
  );

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(recipe!.id);
        alert('Receita removida dos favoritos!');
      } else {
        await addFavorite(recipe!.id);
        alert('Receita adicionada aos favoritos!');
      }
      setIsFavorite(!isFavorite); 
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Sessão expirada. Por favor, faça login novamente.');

      } else {
        alert('Erro ao atualizar favoritos.');
      }
      console.error('Erro ao atualizar favoritos:', error);
    }
  };

  const handleUpdate = async (recipeData: any) => {
    try {
      console.log('Dados antes do envio:', recipeData);

      // Converte os ingredientes para uma string separada por vírgulas
      recipeData.ingredients = recipeData.ingredients
        .map((ingredient: { name: string; quantity: string; unit: string }) =>
          `${ingredient.name} ${ingredient.quantity} ${ingredient.unit}`
        )
        .join(',');

      // Converte as instruções para uma string separada por vírgulas
      recipeData.instructions = recipeData.instructions.join(',');

      console.log('Dados após conversão:', recipeData);

      await api.put(`/recipes/${id}`, recipeData);
      Alert.alert('Receita atualizada com sucesso');
      navigation.goBack();
    } catch (error: any) {
      console.error('Erro ao atualizar receita:', error.response?.data || error.message);
      Alert.alert('Erro ao atualizar receita');
    }
  };

  const getFlagEmoji = (isoCode: string) => {
    if (!isoCode) return '🏳️'; // Retorna uma bandeira genérica se o código ISO não for válido
    return isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9BC584" />
        <Text>Carregando detalhes da receita...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Receita não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Sem Imagem</Text>
        </View>
      )}
      {Number(loggedInUserId) === Number(recipe.user?.id) && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('RecipeEdit', { id: recipe.id })}
        >
          <Text style={styles.editButtonText}>Editar Receita</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('RecipeStepByStep', { recipe })}
      >
        <Text style={styles.editButtonText}>Seguir Receita</Text>
      </TouchableOpacity>

      <Text style={styles.recipeClassiification}>#{recipe.classification}</Text>
      
      <View style={styles.header}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        {isLoggedIn && (
          <TouchableOpacity onPress={handleToggleFavorite}>
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={30}
              color={isFavorite ? 'red' : '#666'}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.recipeDescription}>{recipe.description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
          recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              - {ingredient.name} {ingredient.quantity} {ingredient.unit}
            </Text>
          ))
        ) : (
          <Text style={styles.info}>Nenhum ingrediente disponível.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instruções</Text>
        {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
          recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.instructions}>
                {index + 1}. {instruction}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.info}>Nenhuma instrução disponível.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Adicionais</Text>
        <Text style={styles.info}>Tempo de preparo: {recipe.time} minutos</Text>
        <Text style={styles.info}>Porções: {recipe.servings}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Receita criada por:</Text>
        <Text style={styles.info}>Nome: {recipe.user?.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Nacionalidade: </Text>
          <Text style={styles.info}>{getFlagEmoji(recipe.user?.nationality || '')}</Text>
          <Text style={[styles.info, { marginLeft: 8 }]}>{recipe.user?.nationality}</Text>
        </View>
      </View>
    </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 32,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  recipeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  recipeClassiification: {
    fontSize: 24,
    flex:1,
    color: "#604490",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#9BC584',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RecipeDetails;


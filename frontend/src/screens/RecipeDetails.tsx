import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import api from '../services/api';

const RecipeDetails: React.FC<{ route: any }> = ({ route }) => {
  const { id } = route.params;
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await api.get(`/recipes/${id}`);
        setRecipe(response.data.recipe); 
      } catch (error) {
        console.error('Erro ao buscar detalhes da receita:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9BC584" />
        <Text>Carregando detalhes da receita...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar os detalhes da receita.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <Text style={styles.recipeName}>{recipe.name}</Text>
      <Text style={styles.recipeDescription}>{recipe.description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
          recipe.ingredients.map((ingredient: string, index: number) => (
            <Text key={index} style={styles.ingredient}>
              - {ingredient}
            </Text>
          ))
        ) : (
          <Text style={styles.info}>Nenhum ingrediente disponível.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instruções</Text>
        <Text style={styles.instructions}>{recipe.instructions}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Adicionais</Text>
        <Text style={styles.info}>Tempo de preparo: {recipe.time} minutos</Text>
        <Text style={styles.info}>Porções: {recipe.servings}</Text>
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
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
});

export default RecipeDetails;
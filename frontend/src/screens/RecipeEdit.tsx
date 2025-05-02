import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import api from '../services/api';
import RecipeForm from '../components/RecipeForm';

const RecipeEdit: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { id } = route.params;
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Função para buscar os detalhes da receita
  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/recipes/${id}`);
      const recipeData = response.data.recipe;

      // Verifica se as instruções são uma string e converte para um array
      if (typeof recipeData.instructions === 'string') {
        recipeData.instructions = recipeData.instructions.split(',');
      }

      // Certifique-se de que os ingredientes são um array de objetos
      if (!Array.isArray(recipeData.ingredients)) {
        recipeData.ingredients = [];
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

  // Função para atualizar a receita
  const handleUpdate = async (recipeData: any) => {
    try {
      console.log('Dados antes do envio:', recipeData);

      // Converte os ingredientes para uma string separada por vírgulas
      recipeData.ingredients = recipeData.ingredients
        .map((ingredient: { name: string; quantity: string; unit: string }) =>
          `${ingredient.name} ${ingredient.quantity} ${ingredient.unit}`.trim()
        )
        .filter((ingredient: string) => ingredient !== '') // Remove ingredientes vazios
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

  // Função para deletar a receita
  const handleDelete = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja deletar esta receita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/recipes/${id}`);
              Alert.alert('Receita deletada com sucesso');
              navigation.navigate('Main');
            } catch (error: any) {
              console.error('Erro ao deletar receita:', error.response?.data || error.message);
              Alert.alert('Erro ao deletar receita');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9BC584" />
        <Text>Carregando receita...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Receita não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RecipeForm
        initialValues={{
          ...recipe,
          ingredients: recipe.ingredients || [{ name: '', quantity: '', unit: '' }], // Garante valores padrão
          instructions: recipe.instructions || [''], // Garante valores padrão
        }}
        onSubmit={handleUpdate}
        submitButtonLabel="Atualizar Receita"
        navigation={navigation}
      />
      <Button title="Deletar Receita" onPress={handleDelete} color="#FF6B6B" />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default RecipeEdit;

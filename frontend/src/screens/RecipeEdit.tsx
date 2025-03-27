import React, { useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator, Text, StyleSheet, Button } from 'react-native';
import api from '../services/api';
import RecipeForm from '../components/RecipeForm';

const RecipeEdit: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { id } = route.params;
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/recipes/${id}`);
        setRecipe(response.data.recipe); 
      } catch (error: any) {
        console.error('Erro ao carregar receita:', error.response?.data || error.message);
        setError('Erro ao carregar a receita. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleUpdate = async (recipeData: any) => {
    try {
      await api.put(`/recipes/${id}`, recipeData);
      Alert.alert('Receita atualizada com sucesso');
      navigation.goBack();
    } catch (error: any) {
      console.error('Erro ao atualizar receita:', error.response?.data || error.message);
      Alert.alert('Erro ao atualizar receita');
    }
  };

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
      <RecipeForm initialValues={recipe} onSubmit={handleUpdate} submitButtonLabel="Atualizar Receita" navigation={navigation} />
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

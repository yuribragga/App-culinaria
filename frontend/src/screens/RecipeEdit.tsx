import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import api from '../services/api';
import RecipeForm from '../components/RecipeForm';

const RecipeEdit: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { id } = route.params;
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    api.get(`/recipes/${id}`)
      .then(response => setRecipe(response.data))
      .catch(error => console.error('Erro ao carregar receita:', error));
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

  if (!recipe) return null;

  return (
    <View>
      <RecipeForm initialValues={recipe} onSubmit={handleUpdate} submitButtonLabel="Atualizar Receita" />
    </View>
  );
};

export default RecipeEdit;

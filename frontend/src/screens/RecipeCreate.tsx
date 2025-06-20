import React from 'react';
import { View, Alert } from 'react-native';
import api from '../services/api';
import RecipeForm from '../components/RecipeForm';

const RecipeCreate: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleCreate = async (recipeData: any) => {
    try {
      const formData = new FormData();
      formData.append('name', recipeData.name);
      formData.append('description', recipeData.description);
      formData.append('ingredients', JSON.stringify(recipeData.ingredients));
      formData.append('instructions', JSON.stringify(recipeData.instructions));
      formData.append('time', String(recipeData.time));
      formData.append('servings', String(recipeData.servings));
      formData.append('classification', recipeData.classification);

      // Adiciona a imagem, se houver e for local
      if (recipeData.image && !recipeData.image.startsWith('http')) {
        const filename = recipeData.image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const mimeType = match ? `image/${match[1]}` : 'image';
        formData.append('image', { uri: recipeData.image, name: filename, type: mimeType } as any);
      }

      await api.post('/recipes/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Alert.alert('Receita criada com sucesso');
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Erro ao criar receita:', error.response?.data || error.message);
      Alert.alert('Erro ao criar receita');
    }
  };

  return (
    <View>
      <RecipeForm onSubmit={handleCreate} submitButtonLabel="Criar Receita" navigation={navigation} />
    </View>
  );
};

export default RecipeCreate;

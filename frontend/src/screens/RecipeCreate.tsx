import React from 'react';
import { View, Alert } from 'react-native';
import api from '../services/api';
import RecipeForm from '../components/RecipeForm';

const RecipeCreate: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleCreate = async (recipeData: any) => {
    try {
      await api.post('/recipes/create', recipeData);
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

import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import api from '../services/api';

const RecipeCreate: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [ingredients, setIngredients] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [servings, setServings] = useState<string>('');
  const [image, setImage] = useState<string>('');

  const handleSubmit = async () => {
    try {
      const recipeData = {
        name,
        description,
        ingredients: ingredients.split(','),
        instructions,
        time: parseInt(time),
        servings: parseInt(servings),
        image,
      };

      await api.post('/recipes', recipeData);
      alert('Receita criada com sucesso');
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Erro ao criar receita:', error.response?.data || error.message);
      alert('Erro ao criar receita');
    }
  };

  return (
    <View>
      <Text>Nome</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>Descrição</Text>
      <TextInput value={description} onChangeText={setDescription} />
      <Text>Ingredientes</Text>
      <TextInput value={ingredients} onChangeText={setIngredients} />
      <Text>Instruções</Text>
      <TextInput value={instructions} onChangeText={setInstructions} />
      <Text>Tempo (em minutos)</Text>
      <TextInput value={time} onChangeText={setTime} keyboardType="numeric" />
      <Text>Porções</Text>
      <TextInput value={servings} onChangeText={setServings} keyboardType="numeric" />
      <Text>Imagem (URL)</Text>
      <TextInput value={image} onChangeText={setImage} />

      <Button title="Criar Receita" onPress={handleSubmit} />
    </View>
  );
};

export default RecipeCreate;

import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';

const RecipeEdit: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const { id } = route.params;
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/recipes/${id}`)
      .then(response => setRecipe(response.data.recipe))
      .catch(error => console.error('Erro ao buscar receita:', error));
  }, [id]);

  const handleUpdate = () => {
    axios.put(`http://10.0.2.2:3000/api/recipes/${id}`, recipe)
      .then(() => {
        alert('Receita atualizada com sucesso');
        navigation.navigate('Home');
      })
      .catch(error => {
        console.error('Erro ao atualizar receita:', error);
        alert('Erro ao atualizar receita');
      });
  };

  if (!recipe) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View>
      <Text>Nome</Text>
      <TextInput value={recipe.name} onChangeText={(text) => setRecipe({ ...recipe, name: text })} />
      <Text>Descrição</Text>
      <TextInput value={recipe.description} onChangeText={(text) => setRecipe({ ...recipe, description: text })} />
      <Text>Ingredientes</Text>
      <TextInput value={recipe.ingredients.join(', ')} onChangeText={(text) => setRecipe({ ...recipe, ingredients: text.split(',') })} />
      <Text>Instruções</Text>
      <TextInput value={recipe.instructions} onChangeText={(text) => setRecipe({ ...recipe, instructions: text })} />
      <Text>Tempo (em minutos)</Text>
      <TextInput value={recipe.time.toString()} onChangeText={(text) => setRecipe({ ...recipe, time: parseInt(text) })} keyboardType="numeric" />
      <Text>Porções</Text>
      <TextInput value={recipe.servings.toString()} onChangeText={(text) => setRecipe({ ...recipe, servings: parseInt(text) })} keyboardType="numeric" />
      <Text>Imagem (URL)</Text>
      <TextInput value={recipe.image} onChangeText={(text) => setRecipe({ ...recipe, image: text })} />

      <Button title="Atualizar Receita" onPress={handleUpdate} />
    </View>
  );
};

export default RecipeEdit;

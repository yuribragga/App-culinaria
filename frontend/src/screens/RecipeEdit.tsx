import React, { useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator, Text, StyleSheet, Button, FlatList } from 'react-native';
import api from '../services/api';
import RecipeForm from '../components/RecipeForm';

const RecipeEdit: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { id } = route.params;
  const [recipe, setRecipe] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]); // Todas as receitas
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]); // Receitas filtradas
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [classification, setClassification] = useState<string>(''); // Classificação selecionada

  const classifications = [
    { label: 'Fitness', value: 'Fitness' },
    { label: 'Alto Carboidrato', value: 'Alto Carboidrato' },
    { label: 'Saudável', value: 'Saudável' },
    { label: 'Vegano', value: 'Vegano' },
    { label: 'Vegetariano', value: 'Vegetariano' },
  ];

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/recipes/${id}`);
        setRecipe(response.data.recipe);
        setRecipes(response.data.recipe); // Carregar todas as receitas
        setFilteredRecipes(response.data.recipe); // Inicialmente, todas as receitas são exibidas
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

  const handleFilter = (value: string) => {
    setClassification(value); // Atualiza a classificação selecionada
    if (value) {
      const filtered = recipes.filter((recipe) => recipe.classification === value);
      setFilteredRecipes(filtered); // Atualiza as receitas filtradas
    } else {
      setFilteredRecipes(recipes); // Exibe todas as receitas se nenhuma classificação for selecionada
    }
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
      {/* Dropdown para Classificação */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Filtrar por Classificação:</Text>
        {classifications.map((item) => (
          <Button
            key={item.value}
            title={item.label}
            onPress={() => handleFilter(item.value)}
            color={classification === item.value ? '#9BC584' : '#ccc'}
          />
        ))}
      </View>

      {/* Lista de Receitas Filtradas */}
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeDescription}>{item.description}</Text>
          </View>
        )}
      />

      <RecipeForm
        initialValues={recipe}
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
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  recipeCard: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default RecipeEdit;

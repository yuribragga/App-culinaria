import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, TextInput, FlatList, Pressable } from 'react-native';
import api from '../services/api';

const days = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];
const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];

const mealLabels: Record<string, string> = {
  breakfast: 'Café da manhã',
  lunch: 'Almoço',
  snack: 'Lanche',
  dinner: 'Jantar',
};

const dayLabels: Record<string, string> = {
  monday: 'Segunda',
  tuesday: 'Terça',
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const MealPlanScreen = ({ navigation }: any) => {
  const [weekPlan, setWeekPlan] = useState(
    days.reduce((acc, day) => ({
      ...acc,
      [day]: { breakfast: null, lunch: null, snack: null, dinner: null }
    }), {} as any)
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDay, setModalDay] = useState<string | null>(null);
  const [modalMeal, setModalMeal] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchRecipes(); 
      const res = await api.get('/mealplan');
      if (res.data && res.data.week) setWeekPlan(res.data.week);
    };
    loadData();
  }, []);

  const fetchRecipes = async () => {
    setRecipesLoading(true);
    try {
      const res = await api.get('/recipes');

      const receitas = Array.isArray(res.data.recipes) ? res.data.recipes : [];
      setRecipes(receitas);
      setFilteredRecipes(receitas);
    } catch (e) {
      setRecipes([]);
      setFilteredRecipes([]);
      Alert.alert('Erro', 'Não foi possível buscar receitas.');
    } finally {
      setRecipesLoading(false);
    }
  };

  const selectRecipe = (day: string, meal: string) => {
    setModalDay(day);
    setModalMeal(meal);
    setModalVisible(true);
    setSearch('');
    setFilteredRecipes(recipes); // <-- Mostra todas as receitas ao abrir o modal
  };

  const handleSave = async () => {
    try {
      await api.post('/mealplan', { week: weekPlan });
      Alert.alert('Planejamento salvo!', 'Seu planejamento semanal foi salvo com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o planejamento.');
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    setFilteredRecipes(
      Array.isArray(recipes)
        ? recipes.filter(r => r.name && r.name.toLowerCase().includes(text.toLowerCase()))
        : []
    );
  };

  const handleSelectRecipe = (recipeId: number) => {
    if (modalDay && modalMeal) {
      setWeekPlan((prev: any) => ({
        ...prev,
        [modalDay]: { ...prev[modalDay], [modalMeal]: Number(recipeId) }
      }));
    }
    setModalVisible(false);
  };

  const handleConsolidateList = async () => {

    const selectedIds = days.flatMap(day =>
      mealTypes.map(meal => weekPlan[day][meal])
    ).filter(id => id !== null && id !== undefined);

    const receitasDetalhadas = await Promise.all(
      selectedIds.map(async (id) => {
        try {
          const res = await api.get(`/recipes/${id}`);
          return res.data.recipe;
        } catch {
          return null;
        }
      })
    );

    // Filtre receitas válidas
    const validas = receitasDetalhadas.filter(Boolean);

    // Consolide os ingredientes
    const ingredientes = consolidarIngredientes(validas);


    navigation.navigate('MealPlanItemsScreen', {
      ingredients: ingredientes, 
    });
  };

  function consolidarIngredientes(receitas: any[]) {
    const ingredientes: { [nome: string]: { quantidade: number, unidade: string } } = {};
    receitas.forEach(receita => {
      if (Array.isArray(receita.ingredients)) {
        receita.ingredients.forEach((ing: any) => {
          if (ingredientes[ing.name]) {
            ingredientes[ing.name].quantidade += Number(ing.quantity);
          } else {
            ingredientes[ing.name] = { quantidade: Number(ing.quantity), unidade: ing.unit };
          }
        });
      }
    });
   
    return Object.entries(ingredientes).map(([name, { quantidade, unidade }]) => ({
      name,
      quantity: quantidade,
      unit: unidade,
    }));
  }


  if (recipesLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Planejamento Semanal de Refeições</Text>
      {days.map(day => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{dayLabels[day]}</Text>
          {mealTypes.map(meal => (
            <TouchableOpacity
              key={meal}
              style={styles.mealButton}
              onPress={() => selectRecipe(day, meal)}
            >
              <Text style={styles.mealLabel}>
                {mealLabels[meal]}: {
                  weekPlan[day][meal]
                    ? (recipes.find(r => String(r.id) === String(weekPlan[day][meal]))?.name || 'Selecionar')
                    : 'Selecionar'
                }
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar Planejamento</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#388e3c', marginTop: 8 }]} onPress={handleConsolidateList}>
        <Text style={styles.saveButtonText}>Gerar Lista de Compras</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 20,
            width: '90%',
            maxHeight: '80%'
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Selecione uma receita</Text>
            <TextInput
              placeholder="Buscar receita pelo nome"
              value={search}
              onChangeText={handleSearch}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 8,
                marginBottom: 12
              }}
            />
            {recipesLoading ? (
              <Text style={{ textAlign: 'center', marginVertical: 20 }}>Carregando receitas...</Text>
            ) : (
              <FlatList
                data={filteredRecipes}
                keyExtractor={item => item.id?.toString() ?? Math.random().toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee'
                    }}
                    onPress={() => handleSelectRecipe(item.id)}
                  >
                    <Text>{item.name}</Text>
                  </Pressable>
                )}
                style={{ maxHeight: 300 }}
                ListEmptyComponent={
                  <Text style={{ textAlign: 'center', marginVertical: 20, color: '#888' }}>
                    Nenhuma receita encontrada.
                  </Text>
                }
              />
            )}
            <TouchableOpacity
              style={{ marginTop: 10, alignSelf: 'flex-end' }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#604490', fontWeight: 'bold' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  dayContainer: { marginBottom: 18, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 8 },
  dayTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  mealButton: { padding: 10, backgroundColor: '#9BC584', borderRadius: 6, marginBottom: 6 },
  mealLabel: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#604490', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default MealPlanScreen;
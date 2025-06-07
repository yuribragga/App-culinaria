import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface MealPlanItemsScreenProps {
  route: any;
}

const MealPlanItemsScreen: React.FC<MealPlanItemsScreenProps> = ({ route }) => {
  const { ingredients } = route.params;
  const [checked, setChecked] = useState<boolean[]>(Array(ingredients.length).fill(false));

  const toggleCheck = (idx: number) => {
    const updated = [...checked];
    updated[idx] = !updated[idx];
    setChecked(updated);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Itens Consolidados do Planejamento</Text>
      {ingredients && ingredients.length > 0 ? (
        ingredients.map((ingredient: { name: string; quantity: number | string; unit: string }, idx: number) => (
          <View key={idx} style={styles.item}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                checked[idx] && styles.checkboxChecked
              ]}
              onPress={() => toggleCheck(idx)}
            >
              {checked[idx] && <Text style={styles.checkboxText}>✔</Text>}
            </TouchableOpacity>
            <Text
              style={[
                styles.itemText,
                checked[idx] && styles.itemTextChecked
              ]}
            >
              - {ingredient.name}: {Number(ingredient.quantity)} {ingredient.unit}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Nenhum ingrediente encontrado.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e6f2e6',
    borderRadius: 8,
    marginBottom: 10,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9BC584',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#9BC584',
    borderColor: '#388e3c',
  },
  checkboxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default MealPlanItemsScreen;
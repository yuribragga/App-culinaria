import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';

interface ShoppingListProps {
  route: any;
  navigation: any;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [servings, setServings] = useState(recipe.servings);
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    Array(recipe.ingredients.length).fill(false)
  );
  const [purchasedQuantities, setPurchasedQuantities] = useState<number[]>(
    Array(recipe.ingredients.length).fill(0)
  ); 

  const isConsolidated = recipe.name === 'Lista Consolidada';

  const calculateIngredients = () => {
    return recipe.ingredients.map((ingredient: { name: string; quantity: number | string; unit: string }) => ({
      ...ingredient,
      quantity: Number(ingredient.quantity), // só garante que é número
    }));
  };

  const toggleIngredientCheck = (index: number) => {
    const updatedCheckedIngredients = [...checkedIngredients];
    const updatedQuantities = [...purchasedQuantities];

    updatedCheckedIngredients[index] = !updatedCheckedIngredients[index];
    if (updatedCheckedIngredients[index]) {
      updatedQuantities[index] = adjustedIngredients[index].quantity;
    }

    setCheckedIngredients(updatedCheckedIngredients);
    setPurchasedQuantities(updatedQuantities);
  };

  const adjustedIngredients = calculateIngredients();

  const handleFindMarkets = async () => {
    const url = 'https://www.google.com/maps/search/mercado/';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o Google Maps.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lista de Compras (Opcional) </Text>

      {!isConsolidated && (
        <View style={styles.servingsContainer}>
          <Text style={styles.servingsLabel}>Porções:</Text>
          <TouchableOpacity
            style={styles.servingsButton}
            onPress={() => setServings(servings + 1)}
          >
            <Text style={styles.servingsButtonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.servingsValue}>{servings}</Text>
          <TouchableOpacity
            style={styles.servingsButton}
            onPress={() => setServings(servings > 1 ? servings - 1 : 1)}
          >
            <Text style={styles.servingsButtonText}>-</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {adjustedIngredients.map((ingredient: { name: string; quantity: number; unit: string }, index: number) => (
          <View
            key={index}
            style={[
              styles.ingredientContainer,
              checkedIngredients[index] ? styles.ingredientChecked : styles.ingredientUnchecked,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.checkbox,
                checkedIngredients[index] && styles.checkboxChecked,
              ]}
              onPress={() => toggleIngredientCheck(index)}
            >
              {checkedIngredients[index] && <Text style={styles.checkboxText}>✔</Text>}
            </TouchableOpacity>
            <View style={styles.ingredientDetails}>
              <Text
                style={[
                  styles.ingredient,
                  checkedIngredients[index] ? styles.ingredientTextChecked : styles.ingredientTextUnchecked,
                ]}
              >
                - {ingredient.name}: {ingredient.quantity.toFixed(2)} {ingredient.unit}
              </Text>
              {purchasedQuantities[index] > 0 && (
                <Text style={styles.purchasedText}>
                  Comprado: {purchasedQuantities[index].toFixed(2)} {ingredient.unit}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {!isConsolidated && (
        <TouchableOpacity style={styles.marketButton} onPress={handleFindMarkets}>
          <Text style={styles.marketButtonText}>Encontrar mercados próximos</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  servingsLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#555',
  },
  servingsValue: {
    fontSize: 18,
    color: '#333',
    marginHorizontal: 8,
  },
  servingsButton: {
    backgroundColor: '#9BC584',
    padding: 8,
    borderRadius: 8,
  },
  servingsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#555',
  },
  ingredientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  ingredientChecked: {
    backgroundColor: '#d4edda',
    borderLeftColor: '#28a745',
  },
  ingredientUnchecked: {
    backgroundColor: '#f8d7da',
    borderLeftColor: '#dc3545',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#9BC584',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  checkboxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ingredientDetails: {
    flex: 1,
  },
  ingredient: {
    fontSize: 16,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: '#28a745',
  },
  ingredientTextUnchecked: {
    color: '#dc3545',
  },
  purchasedText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  marketButton: {
    backgroundColor: '#604490',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  marketButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ShoppingList;
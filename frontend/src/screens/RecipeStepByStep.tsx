import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface RecipeStepByStepProps {
  route: any;
  navigation: any;
}

const RecipeStepByStep: React.FC<RecipeStepByStepProps> = ({ route, navigation }) => {
  const { recipe } = route.params; 
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(Array(recipe.instructions.length).fill(false));

  const toggleStepCompletion = (index: number) => {
    const updatedSteps = [...completedSteps];
    updatedSteps[index] = !updatedSteps[index];
    setCompletedSteps(updatedSteps);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.name}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Passo a Passo</Text>
        {recipe.instructions.map((instruction: string, index: number) => (
          <View key={index} style={styles.step}>
            <TouchableOpacity
              style={[
                styles.checkButton,
                completedSteps[index] && styles.checkButtonCompleted,
              ]}
              onPress={() => toggleStepCompletion(index)}
            >
              <Text style={styles.checkButtonText}>
                {completedSteps[index] ? '✔' : ''}
              </Text>
            </TouchableOpacity>
            <View style={styles.stepContent}>
              <Text style={styles.stepNumber}>Passo {index + 1}</Text>
              <Text
                style={[
                  styles.stepText,
                  completedSteps[index] && styles.stepTextCompleted,
                ]}
              >
                {instruction}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.shoppingListButton}
        onPress={() => navigation.navigate('ShoppingList', { recipe })}
      >
        <Text style={styles.shoppingListButtonText}>Ir para Lista de Compras</Text>
      </TouchableOpacity>

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
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#9BC584',
  },
  checkButton: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#9BC584',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkButtonCompleted: {
    backgroundColor: '#9BC584',
  },
  checkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#555',
  },
  stepText: {
    fontSize: 16,
    color: '#333',
  },
  stepTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  shoppingListButton: {
    backgroundColor: '#604490',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  shoppingListButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RecipeStepByStep;
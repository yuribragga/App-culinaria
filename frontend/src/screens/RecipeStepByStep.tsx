import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';

interface RecipeStepByStepProps {
  route: any;
  navigation: any;
}

const RecipeStepByStep: React.FC<RecipeStepByStepProps> = ({ route, navigation }) => {
  const { recipe } = route.params; // Recebe a receita como parâmetro
  const [adjustedServings, setAdjustedServings] = useState(recipe.servings);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(Array(recipe.instructions.length).fill(false));

  // Calcula os ingredientes ajustados com base nas porções
  const calculateAdjustedIngredients = () => {
    const factor = adjustedServings / recipe.servings;
    return recipe.ingredients.map((ingredient: { name: string; quantity: string; unit: string }) => {
      const adjustedQuantity = (parseFloat(ingredient.quantity) * factor).toFixed(2);
      return `${ingredient.name} ${adjustedQuantity} ${ingredient.unit}`;
    });
  };

  // Marca ou desmarca um passo como concluído
  const toggleStepCompletion = (index: number) => {
    const updatedSteps = [...completedSteps];
    updatedSteps[index] = !updatedSteps[index];
    setCompletedSteps(updatedSteps);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título da Receita */}
      <Text style={styles.title}>{recipe.name}</Text>

      {/* Ajuste de Porções */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ajustar Porções</Text>
        <TextInput
          style={styles.input}
          value={adjustedServings.toString()}
          onChangeText={(value) => setAdjustedServings(Number(value))}
          keyboardType="numeric"
        />
        <Text style={styles.info}>Porções originais: {recipe.servings}</Text>
      </View>

      {/* Ingredientes Ajustados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {calculateAdjustedIngredients().map((ingredient: string, index: number) => (
          <Text key={index} style={styles.ingredient}>
            - {ingredient}
          </Text>
        ))}
      </View>

      {/* Passo a Passo */}
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

      {/* Botão Voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar</Text>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: '#f7f7f7',
  },
  info: {
    fontSize: 16,
    color: '#666',
  },
  ingredient: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
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
  backButton: {
    backgroundColor: '#9BC584',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RecipeStepByStep;
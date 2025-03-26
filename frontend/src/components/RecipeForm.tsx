import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

interface RecipeFormProps {
  initialValues?: {
    name: string;
    description: string;
    ingredients: string;
    instructions: string;
    time: string;
    servings: string;
    image: string;
  };
  onSubmit: (data: any) => void;
  submitButtonLabel: string;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ initialValues, onSubmit, submitButtonLabel }) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [ingredients, setIngredients] = useState(
    Array.isArray(initialValues?.ingredients)
      ? initialValues.ingredients
          .map((item: any) => (typeof item === 'string' ? item : item.name || ''))
          .join(', ')
      : initialValues?.ingredients || ''
  );
  const [instructions, setInstructions] = useState(initialValues?.instructions || '');
  const [time, setTime] = useState(String(initialValues?.time || '')); // Garantir que seja string
  const [servings, setServings] = useState(String(initialValues?.servings || '')); // Garantir que seja string
  const [image, setImage] = useState<string | null>(initialValues?.image || '');
  const [errorMessage, setErrorMessage] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Precisamos da permissão para acessar sua galeria!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Precisamos da permissão para acessar sua câmera!');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || !ingredients || !instructions || !time || !servings) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const recipeData = {
      name,
      description,
      ingredients: ingredients.split(','), // Converte a string de ingredientes em um array
      instructions,
      time: Number(time),
      servings: Number(servings),
      image,
    };

    try {
      onSubmit(recipeData);
      Alert.alert('Sucesso', 'Receita salva com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar receita:', error.message);
      setErrorMessage('Erro ao salvar receita. Tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Cadastro de Receita</Title>

      <TextInput
        label="Nome da Receita"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="food" />}
      />
      <TextInput
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
        multiline
        left={<TextInput.Icon icon="text" />}
      />
      <TextInput
        label="Ingredientes (separados por vírgula)"
        value={ingredients}
        onChangeText={setIngredients}
        mode="outlined"
        style={styles.input}
        multiline
        left={<TextInput.Icon icon="format-list-bulleted" />}
      />
      <TextInput
        label="Instruções"
        value={instructions}
        onChangeText={setInstructions}
        mode="outlined"
        style={styles.input}
        multiline
        left={<TextInput.Icon icon="script-text" />}
      />
      <TextInput
        label="Tempo de Preparo (em minutos)"
        value={time}
        onChangeText={setTime}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="timer" />}
      />
      <TextInput
        label="Porções"
        value={servings}
        onChangeText={setServings}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account-group" />}
      />

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button mode="outlined" onPress={pickImage} style={styles.button}>
        Escolher Imagem da Galeria
      </Button>

      <Button mode="outlined" onPress={takePhoto} style={styles.button}>
        Tirar Foto
      </Button>

      {errorMessage ? (
        <HelperText type="error" visible={!!errorMessage} style={styles.error}>
          {errorMessage}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        contentStyle={styles.buttonContent}
      >
        {submitButtonLabel}
      </Button>
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
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#9BC584',
  },
  buttonContent: {
    height: 50,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
  error: {
    marginTop: -8,
    marginBottom: 12,
    textAlign: 'center',
    color: '#BE3B3D',
  },
});

export default RecipeForm;

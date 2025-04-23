import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Title, HelperText, Menu } from 'react-native-paper';
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
    classification?: string;
  };
  onSubmit: (data: any) => void;
  submitButtonLabel: string;
  navigation: any;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ initialValues, onSubmit, submitButtonLabel, navigation }) => {
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
  const [time, setTime] = useState(String(initialValues?.time || '')); 
  const [servings, setServings] = useState(String(initialValues?.servings || '')); 
  const [image, setImage] = useState<string | null>(initialValues?.image || '');
  const [classification, setClassification] = useState(initialValues?.classification || '');
  const [menuVisible, setMenuVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const classifications = [
    { label: 'Fitness', value: 'Fitness' },
    { label: 'Alto Carboidrato', value: 'Alto Carboidrato' },
    { label: 'Saudável', value: 'Saudável' },
    { label: 'Vegano', value: 'Vegano' },
    { label: 'Vegetariano', value: 'Vegetariano' },
  ];

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
    if (!name || !description || !ingredients || !instructions || !time || !servings || !classification) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const recipeData = {
      name,
      description,
      ingredients: ingredients.split(','),
      instructions,
      time: Number(time),
      servings: Number(servings),
      image,
      classification,
    };

    console.log('Dados enviados para o backend:', recipeData); // Verificar os dados enviados

    try {
      await onSubmit(recipeData);
      Alert.alert('Sucesso', 'Receita salva com sucesso!');
      navigation.navigate('Main', { screen: 'Recipes' });
    } catch (error: any) {
      console.error('Erro ao salvar receita:', error.message);
      setErrorMessage('Erro ao salvar receita. Tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

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

      <View style={styles.menuContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setMenuVisible(true)}>
              {classification || 'Selecione a Classificação'}
            </Button>
          }
        >
          {classifications.map((item) => (
            <Menu.Item
              key={item.value}
              onPress={() => {
                console.log('Classificação selecionada:', item.value); // Verificar a classificação selecionada
                setClassification(item.value);
                setMenuVisible(false);
              }}
              title={item.label}
            />
          ))}
        </Menu>
      </View>

      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : null}

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
  menuContainer: {
    marginBottom: 12,
  },
});

export default RecipeForm;

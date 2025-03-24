import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
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
  const [ingredients, setIngredients] = useState(initialValues?.ingredients || '');
  const [instructions, setInstructions] = useState(initialValues?.instructions || '');
  const [time, setTime] = useState(initialValues?.time || '');
  const [servings, setServings] = useState(initialValues?.servings || '');
  const [image, setImage] = useState<string | null>(initialValues?.image || '');


  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Precisamos da permissão para acessar sua galeria!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images", 
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

  const handleSubmit = () => {
    onSubmit({
      name,
      description,
      ingredients: ingredients.split(','),
      instructions,
      time: parseInt(time),
      servings: parseInt(servings),
      image,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Nova Receita" titleStyle={styles.cardTitle} />
        <Card.Content>
          <TextInput label="Nome" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
          <TextInput label="Descrição" value={description} onChangeText={setDescription} mode="outlined" multiline style={styles.input} />
          <TextInput label="Ingredientes (separados por vírgula)" value={ingredients} onChangeText={setIngredients} mode="outlined" multiline style={styles.input} />
          <TextInput label="Instruções" value={instructions} onChangeText={setInstructions} mode="outlined" multiline style={styles.input} />
          <TextInput label="Tempo (em minutos)" value={time} onChangeText={setTime} keyboardType="numeric" mode="outlined" style={styles.input} />
          <TextInput label="Porções" value={servings} onChangeText={setServings} keyboardType="numeric" mode="outlined" style={styles.input} />

          {/* Exibe a imagem se estiver selecionada */}
          {image && <Image source={{ uri: image }} style={styles.image} />}

          <Button mode="outlined" onPress={pickImage} style={styles.button}>
            Escolher da Galeria
          </Button>

          <Button mode="outlined" onPress={takePhoto} style={styles.button}>
            Tirar Foto
          </Button>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
            {submitButtonLabel}
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  card: {
    padding: 10,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
  },
  submitButton: {
    marginTop: 10,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
});

export default RecipeForm;

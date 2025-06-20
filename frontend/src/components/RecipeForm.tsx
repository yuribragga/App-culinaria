import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Title, HelperText, Menu, List } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api'; 
import { useDispatch } from 'react-redux';


const defaultImage = require('../../assets/images/default-image.jpeg'); 

interface RecipeFormProps {
  initialValues?: {
    id?: string;
    name: string;
    description: string;
    ingredients: { name: string; quantity: string; unit: string }[];
    instructions: string[];
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
  const dispatch = useDispatch();
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [ingredientsList, setIngredientsList] = useState<{ name: string; quantity: string; unit: string }[]>(
    Array.isArray(initialValues?.ingredients) && initialValues.ingredients.length > 0
      ? initialValues.ingredients
      : [{ name: '', quantity: '', unit: '' }]
  );
  const [instructionsList, setInstructionsList] = useState<string[]>(
    Array.isArray(initialValues?.instructions) ? initialValues.instructions : ['']
  );
  const [time, setTime] = useState(String(initialValues?.time || ''));
  const [servings, setServings] = useState(String(initialValues?.servings || ''));
  const [image, setImage] = useState<string | null>(initialValues?.image || null);
  const [classification, setClassification] = useState(initialValues?.classification || '');
  const [menuVisible, setMenuVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);

  const classifications = [
    { label: 'Doce', value: 'Doce' },
    { label: 'Salgado', value: 'Salgado' },
    { label: 'Bebida', value: 'Bebida' },
    { label: 'Sobremesa', value: 'Sobremesa' },
    { label: 'Lanche', value: 'Lanche' },
  ];

  const uploadToServer = async (uri: string, setImage: (url: string) => void) => {
    const filename = uri.split('/').pop()!;
    const match = /\.(\w+)$/.exec(filename);
    const mimeType = match ? `image/${match[1]}` : 'image';

    const formData = new FormData();
    formData.append('file', { uri, name: filename, type: mimeType } as any);

    try {
      const res = await api.post('/imagem', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success && res.data.imagemUrl) {
        const novaUrl = `${res.data.imagemUrl}?ts=${Date.now()}`;
        setImage(novaUrl); // Atualiza o estado local da imagem
        Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
      } else {
        Alert.alert('Erro', 'Falha ao enviar imagem.');
      }
    } catch (err) {
      console.error('[FRONT] Erro ao enviar imagem:', err);
      Alert.alert('Erro', 'Falha ao enviar imagem.');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Precisamos da permissão para acessar sua galeria!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const addIngredient = () => {
    setIngredientsList([...ingredientsList, { name: '', quantity: '', unit: '' }]);
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const updated = [...ingredientsList];
    updated[index] = { ...updated[index], [field]: value };
    setIngredientsList(updated);
  };

  const removeIngredient = (index: number) => {
    const updated = ingredientsList.filter((_, i) => i !== index);
    setIngredientsList(updated);
  };

  const addInstruction = () => setInstructionsList([...instructionsList, '']);

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructionsList];
    updated[index] = value;
    setInstructionsList(updated);
  };

  const handleSubmit = async () => {
    if (!name || !description || ingredientsList.length === 0 || instructionsList.length === 0 || !time || !servings || !classification) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const recipeData = {
      id: initialValues?.id,
      name,
      description,
      ingredients: ingredientsList,
      instructions: instructionsList,
      time: Number(time),
      servings: Number(servings),
      image: image || Image.resolveAssetSource(defaultImage).uri,
      classification,
    };

    console.log('Dados enviados no handleSubmit:', recipeData);

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
      <List.Accordion
        title="Ingredientes"
        expanded={ingredientsExpanded}
        onPress={() => setIngredientsExpanded(!ingredientsExpanded)}
        style={styles.accordion}
      >
        {ingredientsList.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
            <TextInput
              label="Nome"
              value={ingredient.name}
              onChangeText={(value: string) => updateIngredient(index, 'name', value)}
              mode="outlined"
              style={[styles.input, styles.ingredientNameInput]}
              left={<TextInput.Icon icon="format-list-bulleted" />}
            />
            <TextInput
              label="Quantidade"
              value={ingredient.quantity}
              onChangeText={(value: string) => {

              const numericValue = value.replace(/[^0-9]/g, '');
              updateIngredient(index, 'quantity', numericValue);
              }}
              mode="outlined"
              style={[styles.input, styles.ingredientSmallInput]}
              keyboardType="numeric"
              maxLength={7} 
              left={<TextInput.Icon icon="scale" />}
            />
            <TextInput
              label="Unidade"
              value={ingredient.unit}
              onChangeText={(value: string) => updateIngredient(index, 'unit', value)}
              mode="outlined"
              style={[styles.input, styles.ingredientSmallInput]}
              left={<TextInput.Icon icon="ruler" />}
            />
            <Button
              mode="text"
              onPress={() => removeIngredient(index)}
              style={styles.removeButton}
              labelStyle={styles.removeButtonText}
            >
              Remover
            </Button>
          </View>
        ))}
        <Button mode="outlined" onPress={addIngredient} style={styles.button}>
          Adicionar Ingrediente
        </Button>
      </List.Accordion>
      <List.Accordion
        title="Instruções"
        expanded={instructionsExpanded}
        onPress={() => setInstructionsExpanded(!instructionsExpanded)}
        style={styles.accordion}
      >
        {instructionsList.map((instruction, index) => (
          <TextInput
            key={index}
            label={`Instrução ${index + 1}`}
            value={instruction}
            onChangeText={(value) => updateInstruction(index, value)}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="script-text" />}
          />
        ))}
        <Button mode="outlined" onPress={addInstruction} style={styles.button}>
          Adicionar Instrução
        </Button>
      </List.Accordion>
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
      ) : (
        <Image source={defaultImage} style={styles.image} />
      )}
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
  accordion: {
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  ingredientRow: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  ingredientNameInput: {
    marginBottom: 8,
  },
  quantityUnitRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ingredientSmallInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    marginTop: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default RecipeForm;

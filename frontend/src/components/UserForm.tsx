import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Modal, FlatList, Text, Image, Alert } from 'react-native';
import { TextInput, Button, Title, HelperText, Searchbar } from 'react-native-paper';
import PhoneInput from 'react-native-phone-number-input';
import validator from 'validator';
import countries from 'world-countries';
import * as ImagePicker from 'expo-image-picker';

const countryList = countries
  .map((country) => ({
    name: country.name.common,
    code: country.cca2,
    flag: country.flag,
  }))
  .filter((country, index, self) => 
    index === self.findIndex((c) => c.code === country.code)
  );

interface UserFormProps {
  initialValues?: {
    name?: string;
    socialName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber?: string;
    nationality?: string;
    profileImage?: string;
  };
  onSubmit: (data: any) => void;
  submitButtonLabel: string;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialValues = {}, onSubmit, submitButtonLabel, isEditing = false }) => {
  const [name, setName] = useState(initialValues.name || '');
  const [socialName, setSocialName] = useState(initialValues.socialName || '');
  const [email, setEmail] = useState(initialValues.email || '');
  const [password, setPassword] = useState(initialValues.password || '');
  const [confirmPassword, setConfirmPassword] = useState(initialValues.confirmPassword || '');
  const [phoneNumber, setPhoneNumber] = useState(initialValues.phoneNumber || '');
  const [nationality, setNationality] = useState<string>(initialValues.nationality || 'BR');
  const [profileImage, setProfileImage] = useState<string | null>(initialValues.profileImage || null);
  const [oldPassword, setOldPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  const filteredCountries = countryList.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Imagem selecionada:', result.assets[0].uri);
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua câmera!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSelectCountry = (country: string) => {
    setNationality(country);
    setModalVisible(false);
  };

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem');
      return;
    }

    if (!validator.isEmail(email)) {
      setIsEmailValid(false);
      return;
    }

    const userData = {
      name,
      socialName,
      email,
      password,
      phoneNumber,
      nationality,
      profileImage,
      oldPassword: isEditing ? oldPassword : undefined,
    };

    onSubmit(userData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>{isEditing ? 'Editar Perfil' : 'Cadastro de Usuário'}</Title>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Searchbar
              placeholder="Pesquisar Nacionalidade"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
            />
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => handleSelectCountry(item.code)}
                >
                  <Text style={styles.countryText}>
                    {item.flag} {item.name} ({item.code})
                  </Text>
                </TouchableOpacity>
              )}
            />
            <Button mode="text" onPress={() => setModalVisible(false)} style={styles.closeButton}>
              Fechar
            </Button>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.nationalityField}>
        <Text style={styles.nationalityText}>Nacionalidade: {nationality}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Title style={styles.imagePlaceholderText}>Selecionar Foto</Title>
          </View>
        )}
      </TouchableOpacity>

      <Button mode="outlined" onPress={pickImage} style={styles.button}>
        Escolher Imagem da Galeria
      </Button>

      <Button mode="outlined" onPress={takePhoto} style={styles.button}>
        Tirar Foto
      </Button>

      <TextInput
        label="Nome"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />
      <TextInput
        label="Nome Social"
        value={socialName}
        onChangeText={setSocialName}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />
      <TextInput
        label="E-mail"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setIsEmailValid(validator.isEmail(text));
        }}
        keyboardType="email-address"
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
        error={!isEmailValid}
      />
      {!isEmailValid && (
        <HelperText type="error" visible={!isEmailValid}>
          E-mail inválido
        </HelperText>
      )}
      <PhoneInput
        defaultValue={phoneNumber}
        defaultCode="BR"
        onChangeFormattedText={(text) => setPhoneNumber(text)}
        containerStyle={styles.phoneInputContainer}
        textContainerStyle={styles.phoneInputTextContainer}
      />
      {isEditing && (
        <TextInput
          label="Senha Antiga"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
        />
      )}
      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
      />
      <TextInput
        label="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="lock-check" />}
      />

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
  phoneInputContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  phoneInputTextContainer: {
    backgroundColor: '#fff',
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#9BC584',
  },
  buttonContent: {
    height: 50,
  },
  nationalityField: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  nationalityText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  searchbar: {
    marginBottom: 16,
  },
  countryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  countryText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  error: {
    marginTop: -8,
    marginBottom: 12,
    textAlign: 'center',
    color: '#BE3B3D',
  },
});

export default UserForm;
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import api from '../services/api';

const RegisterPage: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [socialName, setSocialName] = useState('');
  const [nationality, setNationality] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem');
      return;
    }

    try {
      const response = await api.post('auth/register', {
        email,
        password,
        name,
        socialName,
        nationality,
        phoneNumber,
      });
      Alert.alert('Cadastro bem-sucedido', 'Usuário registrado com sucesso!');
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'Erro ao registrar usuário');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Cadastro</Title>

      <TextInput
        label="Nome"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />
      <TextInput
        label="Nome Social (opcional)"
        value={socialName}
        onChangeText={setSocialName}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account-circle" />}
      />
      <TextInput
        label="Nacionalidade"
        value={nationality}
        onChangeText={setNationality}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="flag" />}
      />
      <TextInput
        label="Número de Telefone"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="phone" />}
      />
      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
      />
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
        onPress={handleRegister}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Cadastrar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#9BC584', 
  },
  buttonContent: {
    height: 50,
  },
  loginButton: {
    marginTop: 10,
    color: '#9BC584',
  },
  error: {
    marginTop: -8,
    marginBottom: 12,
    textAlign: 'center',
    color: '#BE3B3D', 
  },
});

export default RegisterPage;
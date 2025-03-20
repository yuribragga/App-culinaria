import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { AuthContext } from '../services/AuthContext';

const Login: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await api.post('auth/login', { email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem('userToken', token);
      console.log('Token JWT armazenado:', token);

      login(user);


      navigation.navigate('Main', { screen: 'Recipes' });
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Bem-vindo de volta!</Title>
      <Text style={styles.subtitle}>Faça login para continuar</Text>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
        keyboardType="email-address"
      />
      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
        secureTextEntry
      />
      {errorMessage ? (
        <HelperText type="error" visible={!!errorMessage} style={styles.error}>
          {errorMessage}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Entrar
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
        style={styles.registerButton}
      >
        Não tem uma conta? Cadastre-se
      </Button>
    </View>
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
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
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
  registerButton: {
    marginTop: 10,
    color: '#ff7c74',
  },
  error: {
    marginTop: -8,
    marginBottom: 12,
    textAlign: 'center',
    color: '#ff7c74', 
  },
});

export default Login;
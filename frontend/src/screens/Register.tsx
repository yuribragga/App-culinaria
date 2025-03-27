import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import api from '../services/api';
import UserForm from '../components/UserForm';

const RegisterPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleRegister = async (userData: any) => {
    try {
      await api.post('/auth/register', userData);
      Alert.alert('', 'Usuário registrado com sucesso!');
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível registrar o usuário.');
    }
  };

  return (
    <View style={styles.container}>
      <UserForm onSubmit={handleRegister} submitButtonLabel="Cadastrar" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});

export default RegisterPage;
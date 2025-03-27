import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import UserForm from '../components/UserForm';
import { AuthContext } from '../services/AuthContext';
import api from '../services/api';

const UserEdit: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setInitialValues({
        name: user.name,
        socialName: user.socialName || '',
        email: user.email,
        phoneNumber: user.phoneNumber,
        nationality: user.nationality,
        profileImage: user.profileImage,
        password: '', 
      });
      setLoading(false);
    } else {
      setError('Usuário não encontrado.');
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (data: any) => {
    try {
      if (!user) {
        Alert.alert('Erro', 'Usuário não encontrado.');
        return;
      }

      console.log('Dados enviados:', data);
      console.log('URL:', `/auth/edit/${user.id}`);

      const response = await api.put(`/auth/edit/${user.id}`, data);
      setUser(response.data.user); 
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Erro ao atualizar o perfil:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível atualizar o perfil.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9BC584" />
        <Text>Carregando usuário...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!initialValues) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButtonLabel="Salvar Alterações"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default UserEdit;
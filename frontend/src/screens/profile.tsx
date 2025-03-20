import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Title, Button } from 'react-native-paper';
import { AuthContext } from '../services/AuthContext'; 

const Profile: React.FC = () => {
  const { user, logout } = useContext(AuthContext); 

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Perfil</Title>
      {user ? (
        <>
          <Text style={styles.info}>Nome: {user.name}</Text>
          <Text style={styles.info}>E-mail: {user.email}</Text>
          <Text style={styles.info}>Telefone: {user.phoneNumber}</Text>
          <Text style={styles.info}>Nacionalidade: {user.nationality}</Text>
          <Button mode="contained" onPress={logout} style={styles.button}>
            Sair
          </Button>
        </>
      ) : (
        <Text style={styles.info}>Nenhum usuário logado</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default Profile;
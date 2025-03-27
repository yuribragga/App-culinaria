import React, { useContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Title, Button } from 'react-native-paper';
import { AuthContext } from '../services/AuthContext';

const Profile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleEditProfile = () => {
    navigation.navigate('UserEdit'); // Navega para a página de edição de usuário
  };

  const getFlagEmoji = (isoCode: string) => {
    if (!isoCode) return '🏳️';
    return isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Perfil</Title>
      {user ? (
        <>
          <View style={styles.imageContainer}>
            {user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Sem Foto</Text>
              </View>
            )}
          </View>

          <Text style={styles.info}>Nome: {user.name}</Text>
          <Text style={styles.info}>E-mail: {user.email}</Text>
          <Text style={styles.info}>Telefone: {user.phoneNumber}</Text>
          <Text style={styles.info}>Nacionalidade: {user.nationality}</Text>

          <View style={styles.flagContainer}>
            <Text style={styles.flag}>{getFlagEmoji(user.nationality)}</Text>
          </View>

          <Button
            mode="contained"
            onPress={handleEditProfile}
            style={styles.editButton}
          >
            Editar Perfil
          </Button>
          <Button
            mode="outlined"
            onPress={logout}
            style={styles.logoutButton}
          >
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
 
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24, 
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: 'bold',
    color: '#FFF',
    backgroundColor: '#9BC584',
    borderRadius: 8, 
    overflow: 'hidden', 
    marginBottom: 16,
    marginTop:8, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    
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
  info: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  flagContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  flag: {
    lineHeight: 10,
    fontSize: 30,
    textAlign: 'center',
  },
  editButton: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#9BC584',
  },
  logoutButton: {
    marginTop: 10,
    borderRadius: 8,
    borderColor: '#9BC584',
  },
});

export default Profile;
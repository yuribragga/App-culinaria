import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, Alert, Modal, TouchableOpacity } from 'react-native';
import { Text, Title, Button } from 'react-native-paper';
import { AuthContext } from '../services/AuthContext';
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      if (user) {
        await api.delete(`/auth/delete/${user.id}`);
        Alert.alert('Conta deletada com sucesso!');
        logout(); 
        navigation.navigate('Login'); 
      } else {
        throw new Error('Usuário não encontrado.');
      }
    } catch (error: any) {
      console.error('Erro ao deletar conta:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível deletar a conta. Tente novamente mais tarde.');
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('UserEdit'); 
  };

  const getFlagEmoji = (isoCode: string) => {
    if (!isoCode) return '🏳️';
    return isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Button
            mode="contained"
            onPress={() => setModalVisible(true)}
            style={styles.deleteButton}
          >
            Deletar Conta
          </Button>

          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Tem certeza de que deseja deletar sua conta? Essa ação não pode ser desfeita.
                </Text>
                <View style={styles.modalButtons}>
                  <Button
                    mode="contained"
                    onPress={handleDeleteAccount}
                    style={styles.confirmButton}
                  >
                    Confirmar
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => setModalVisible(false)}
                    style={styles.cancelButton}
                  >
                    Cancelar
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <Text style={styles.info}>Nenhum usuário logado</Text>
      )}
    </SafeAreaView>
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
    marginTop: 8,
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
    lineHeight: 30,
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
  deleteButton: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#FF6B6B',
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10,
    borderColor: '#9BC584',
  },
});

export default Profile;
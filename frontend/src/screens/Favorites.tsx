import React, { useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../services/AuthContext';
import { Title } from 'react-native-paper';

const Favorites: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isLoggedIn, favorites, fetchFavorites } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Você precisa estar logado para ver seus favoritos.</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Você ainda não tem receitas favoritas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => navigation.navigate('RecipeDetails', { id: item.id })}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Sem Imagem</Text>
              </View>
            )}
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.recipeClassiification}>#{item.classification}</Text>
              <Text style={styles.recipeDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  
  recipeCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  placeholderText: {
    color: '#666',
  },
  recipeInfo: {
    flex: 1,
    padding: 8,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  recipeClassiification: {
    fontSize: 12,
    color: '#604490',
    marginBottom: 4,
  },
});

export default Favorites;
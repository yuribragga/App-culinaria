import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AuthContext } from '../services/AuthContext';
import api from '../services/api';

interface Ingredient {
    name: string;
    [key: string]: any;
}

interface Recipe {
    id: number;
    name: string;
    classification: string;
    image?: string;
    ingredients?: Ingredient[];
    [key: string]: any;
}

function getRecommendedRecipes(
    allRecipes: Recipe[],
    favoriteRecipes: Recipe[]
): Recipe[] {
    if (!favoriteRecipes || favoriteRecipes.length === 0) return [];
    const favCategories = new Set(favoriteRecipes.map(r => r.classification));
    const favIngredients = new Set(
        favoriteRecipes.flatMap(r => (r.ingredients || []).map(i => i.name))
    );
    return allRecipes.filter(r =>
        !favoriteRecipes.some(fav => fav.id === r.id) &&
        (
            (r.classification && favCategories.has(r.classification)) ||
            (Array.isArray(r.ingredients) && r.ingredients.some(i => favIngredients.has(i.name)))
        )
    );
}

export default function RecommendationsScreen({ navigation }: any) {
  const { favorites } = useContext(AuthContext);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        const response = await api.get('/recipes');
        setAllRecipes(response.data.recipes || []);
      } catch {
        setAllRecipes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  const recommended = favorites.length > 0
    ? getRecommendedRecipes(allRecipes, favorites)
    : allRecipes.slice(0, 10);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>
        Recomendadas para você
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#9BC584" />
      ) : (
        <FlatList
          data={recommended}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RecipeDetails', { id: item.id })}
            >
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.cardImage} />
              )}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.classification}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40 }}>
              {favorites.length === 0
                ? 'Adicione receitas aos favoritos para receber recomendações!'
                : 'Nenhuma recomendação encontrada.'}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 16,
    alignItems: 'center',
    padding: 10,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#888',
    marginTop: 2,
  },
});
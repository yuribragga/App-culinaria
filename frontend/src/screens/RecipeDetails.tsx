import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert, TextInput, Share } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { AuthContext } from '../services/AuthContext';
import * as FileSystem from 'expo-file-system';

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: string | string[];
  time: number;
  servings: number;
  classification: string;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
    nationality: string;
  };
}

const RecipeDetails: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { id } = route.params; 
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false); 
  const { addFavorite, removeFavorite, favorites, isLoggedIn } = useContext(AuthContext);
  interface Comment {
    id: number;
    text: string;
    createdAt: string;
    user: { id: number; name: string; profileImage?: string };
  }
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userRatingComment, setUserRatingComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<any[]>([]);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/recipes/${id}`);
      console.log('Dados da receita recebidos:', response.data.recipe);

      const recipeData = response.data.recipe;

      if (typeof recipeData.instructions === 'string') {
        recipeData.instructions = (recipeData.instructions as string).split(',').map((instruction: string) => instruction.trim());
      }

      setRecipe(recipeData);

      const isFav = favorites.some((fav) => fav.id === id);
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Erro ao buscar detalhes da receita:', error);
      setError('Erro ao carregar os detalhes da receita.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoggedInUserId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
        setLoggedInUserId(decodedToken.id);
      }
    } catch (error) {
      console.error('Erro ao obter o ID do usuário logado:', error);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await api.get(`/comments/recipe/${id}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await api.get(`/recipes/${id}/ratings`);
      // Garante que ratings sempre será um array
      if (Array.isArray(res.data.ratings)) {
        setRatings(res.data.ratings);
      } else if (Array.isArray(res.data)) {
        setRatings(res.data);
      } else {
        setRatings([]);
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      setRatings([]); // Garante que nunca será undefined
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      console.log('Enviando comentário:', { recipeId: id, userId: loggedInUserId, text: newComment });
      const response = await api.post('/comments/comments', { recipeId: id, userId: loggedInUserId, text: newComment });
      console.log('Resposta do backend:', response.data);
      setNewComment('');
      fetchComments();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao adicionar comentário:', (error as any).response?.data || error.message);
      } else {
        console.error('Erro ao adicionar comentário:', error);
      }
      Alert.alert('Erro ao adicionar comentário.');
    }
  };

  const handleSendRating = async () => {
    if (userRating === 0) return;

    try {
      setRatingLoading(true);
      const response = await api.post(`/recipes/${id}/ratings`, {
        stars: userRating,
        comment: userRatingComment,
      });
      console.log('Resposta ao enviar avaliação:', response.data);
      setUserRating(0);
      setUserRatingComment('');
      fetchRatings();
    } catch (error) {
      if (error instanceof Error) {
        setRatingError((error as any).response?.data?.message || error.message);
      } else {
        setRatingError('Erro desconhecido ao enviar avaliação.');
      }
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setRatingLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLoggedInUserId();
      fetchRecipeDetails();
      fetchComments(); 
      fetchRatings();
    }, [id, favorites])
  );

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(recipe!.id);
        alert('Receita removida dos favoritos!');
      } else {
        await addFavorite(recipe!.id);
        alert('Receita adicionada aos favoritos!');
      }
      setIsFavorite(!isFavorite); 
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Sessão expirada. Por favor, faça login novamente.');
      } else {
        alert('Erro ao atualizar favoritos.');
      }
      console.error('Erro ao atualizar favoritos:', error);
    }
  };

  const handleShare = async () => {
    try {
      const url = `https://10.0.2.2:3000//recipes/${recipe?.id}`;
      const message = `Confira esta receita: ${recipe?.name}\n${url}`;
      await Share.share({
        message,
        url,
        title: `Confira esta receita: ${recipe?.name}`,
      });
    } catch (error) {
      Alert.alert('Erro ao compartilhar o link da receita.');
    }
  };

  const getFlagEmoji = (isoCode: string) => {
    if (!isoCode) return '🏳️';
    return isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
  };

  const getAverageRating = () => {
    if (!Array.isArray(ratings) || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + (r.stars || 0), 0);
    return (total / ratings.length).toFixed(1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9BC584" />
        <Text>Carregando detalhes da receita...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Receita não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Sem Imagem</Text>
        </View>
      )}

      {Number(loggedInUserId) === Number(recipe.user?.id) && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('RecipeEdit', { id: recipe.id })}
        >
          <Text style={styles.editButtonText}>Editar Receita</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.followButton}
        onPress={() => navigation.navigate('RecipeStepByStep', { recipe })}
      >
        <Text style={styles.followButtonText}>Seguir Receita</Text>
      </TouchableOpacity>

      <Text style={styles.recipeClassification}>#{recipe.classification}</Text>

      <View style={styles.header}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        {isLoggedIn && (
          <TouchableOpacity onPress={handleToggleFavorite}>
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={30}
              color={isFavorite ? 'red' : '#666'}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.recipeDescription}>{recipe.description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
          recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientContainer}>
              <Text style={styles.ingredient}>
                - {ingredient.name} {ingredient.quantity} {ingredient.unit}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.info}>Nenhum ingrediente disponível.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instruções</Text>
        {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
          recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionContainer}>
              <Text style={styles.instructions}>
                {index + 1}. {instruction}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.info}>Nenhuma instrução disponível.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Adicionais</Text>
        <Text style={styles.info}>⏱ Tempo de preparo: {recipe.time} minutos</Text>
        <Text style={styles.info}>🍽 Porções: {recipe.servings}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Receita criada por:</Text>
        <Text style={styles.info}>👤 Nome: {recipe.user?.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.info}>🌍 Nacionalidade: </Text>
          <Text style={styles.info}>{getFlagEmoji(recipe.user?.nationality || '')}</Text>
          <Text style={[styles.info, { marginLeft: 8 }]}>{recipe.user?.nationality}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comentários</Text>
        {loadingComments ? (
          <ActivityIndicator size="small" color="#9BC584" />
        ) : (
          <>
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map((comment, index) => (
                <View key={index} style={styles.comment}>
                  <Text style={styles.commentUser}>{comment.user.name}:</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.info}>Nenhum comentário disponível.</Text>
            )}
          </>
        )}
      </View>

      {isLoggedIn && (
        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Escreva um comentário..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
            <Text style={styles.addCommentButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avalie esta receita</Text>
        {isLoggedIn ? (
          <>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setUserRating(star)}
                  style={{ marginHorizontal: 2 }}
                >
                  <Icon
                    name={userRating >= star ? 'star' : 'star-border'}
                    size={32}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.commentInput, { marginBottom: 8 }]}
              placeholder="Deixe um comentário (opcional)"
              value={userRatingComment}
              onChangeText={setUserRatingComment}
            />
            <TouchableOpacity
              style={styles.addCommentButton}
              onPress={handleSendRating}
              disabled={userRating === 0 || ratingLoading}
            >
              <Text style={styles.addCommentButtonText}>
                {ratingLoading ? 'Enviando...' : 'Enviar Avaliação'}
              </Text>
            </TouchableOpacity>
            {ratingError ? (
              <Text style={{ color: 'red', marginTop: 4 }}>{ratingError}</Text>
            ) : null}
          </>
        ) : (
          <Text style={styles.info}>Faça login para avaliar esta receita.</Text>
        )}
      </View>

      {/* Exibir avaliações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avaliações</Text>
        {Array.isArray(ratings) && ratings.length === 0 ? (
          <Text style={styles.info}>Nenhuma avaliação ainda.</Text>
        ) : (
          Array.isArray(ratings) && ratings.map((rating, idx) => (
            <View key={idx} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    name={rating.stars >= star ? 'star' : 'star-border'}
                    size={20}
                    color="#FFD700"
                  />
                ))}
                <Text style={{ marginLeft: 8, fontWeight: 'bold' }}>{rating.user?.name || 'Usuário'}</Text>
              </View>
              {rating.comment ? (
                <Text style={{ color: '#333', marginLeft: 2 }}>{rating.comment}</Text>
              ) : null}
            </View>
          ))
        )}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={Number(getAverageRating()) >= star ? 'star' : 'star-border'}
            size={24}
            color="#FFD700"
          />
        ))}
        <Text style={{ marginLeft: 8, fontWeight: 'bold', fontSize: 16 }}>
          {getAverageRating()} / 5
        </Text>
        <Text style={{ marginLeft: 8, color: '#666' }}>
          ({ratings.length} avaliação{ratings.length === 1 ? '' : 's'})
        </Text>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Compartilhar Receita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 32,
  },
  recipeImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  recipeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  recipeClassification: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#604490',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  ingredientContainer: {
    marginBottom: 4,
  },
  ingredient: {
    fontSize: 16,
    color: '#333',
  },
  instructionContainer: {
    marginBottom: 8,
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#9BC584',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  followButton: {
    backgroundColor: '#604490',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  comment: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 16,
    color: '#333',
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  addCommentButton: {
    backgroundColor: '#9BC584',
    padding: 12,
    borderRadius: 8,
  },
  addCommentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationButton: {
    color: '#9BC584',
    fontWeight: 'bold',
  },
  paginationInfo: {
    fontSize: 16,
    color: '#333',
  },
  shareButton: {
    backgroundColor: '#9BC584',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RecipeDetails;


import React from 'react';
import { View, Text, TouchableOpacity, Image,  } from 'react-native';

const RecipeCard = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Image source={{ uri: recipe.image }} style={{ width: 100, height: 100 }} />
        <Text>{recipe.name}</Text>
        <Text>{recipe.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;
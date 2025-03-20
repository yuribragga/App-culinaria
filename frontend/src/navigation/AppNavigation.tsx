import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RecipeList from '../screens/RecipeList';
import RecipeCreate from '../screens/RecipeCreate';
import RecipeDetails from '../screens/RecipeDetails';
import RecipeEdit from '../screens/RecipeEdit';

type RootStackParamList = {
  Home: undefined;
  RecipeCreate: undefined;
  RecipeDetails: { recipeId: string };
  RecipeEdit: { recipeId: string };
};

const Stack = createStackNavigator<RootStackParamList>()

const AppNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={RecipeList} />
        <Stack.Screen name="RecipeCreate" component={RecipeCreate} />
        <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
        <Stack.Screen name="RecipeEdit" component={RecipeEdit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;

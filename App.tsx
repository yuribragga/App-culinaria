import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './frontend/src/screens/Welcome';
import Navbar from './frontend/src/components/Navbar';
import { AuthProvider } from './frontend/src/services/AuthContext';
import RecipeCreate from './frontend/src/screens/RecipeCreate';
import RecipeEdit from './frontend/src/screens/RecipeEdit';
import RecipeListbyUser from './frontend/src/screens/RecipeListbyUser';
import RecipeDetails from './frontend/src/screens/RecipeDetails';
import { LogBox, SafeAreaView, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import RecipeStepByStep from './frontend/src/screens/RecipeStepByStep';
import ShoppingList from './frontend/src/screens/ShoppingList';
import MealPlanScreen from './frontend/src/screens/MealPlanScreen';
import MealPlanItemsScreen from './frontend/src/screens/MealPlanItemsScreen';
import RecommendationsScreen from './frontend/src/screens/RecommendationsScreen';

LogBox.ignoreLogs([
  'Warning: CountryModal: Support for defaultProps will be removed',
]);

const Stack = createStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#9BC584' }}>
        <StatusBar backgroundColor="#9BC584" barStyle="light-content" />
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Welcome" component={Welcome} />
              <Stack.Screen name="Main" component={Navbar} />
              <Stack.Screen name="RecipeCreate" component={RecipeCreate} options={{
                  headerShown: true,
                  title: 'Criar Receita',
                  headerStyle: {
                    backgroundColor: '#9BC584',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}/>
              <Stack.Screen name="RecipeEdit" component={RecipeEdit} />
              <Stack.Screen
                name="RecipeDetails"
                component={RecipeDetails}
                options={{
                  headerShown: true,
                  title: 'Detalhes da Receita',
                  headerStyle: {
                    backgroundColor: '#9BC584',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
              <Stack.Screen
                name="RecipeListbyUser"
                component={RecipeListbyUser}
                options={{
                  headerShown: true,
                  title: 'Minhas Receitas',
                  headerStyle: {
                    backgroundColor: '#9BC584',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
              <Stack.Screen
                name="RecipeStepByStep"
                component={RecipeStepByStep}
                options={{
                  headerShown: true,
                  title: 'Passo a Passo',
                  headerStyle: {
                    backgroundColor: '#9BC584',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
              }} />
              <Stack.Screen
                name="ShoppingList"
                component={ShoppingList}
                options={{
                  headerShown: true,
                  title: '',
                  headerStyle: {
                    backgroundColor: '#9BC584',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  }, 
                }} />
              <Stack.Screen
                name="MealPlanScreen"
                component={MealPlanScreen}
                options={{
                  headerShown: true,
                  title: 'Planejamento Semanal',
                  headerStyle: {
                    backgroundColor: '#9BC584',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }} />
              <Stack.Screen
                name="MealPlanItemsScreen"
                component={MealPlanItemsScreen}
                options={{
                  headerShown: true,
                  title: 'Itens do Planejamento',
                  headerStyle: {
                    backgroundColor: '#9BC584',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }} />
              <Stack.Screen
                name="RecommendationsScreen"
                component={RecommendationsScreen}
                options={{
                  headerShown: true,
                  title: 'Recomendações',
                  headerStyle: {
                    backgroundColor: '#9BC584',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
        <Toast/>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;
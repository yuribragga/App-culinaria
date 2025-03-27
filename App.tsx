import React from 'react';
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
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';

LogBox.ignoreLogs([
  'Warning: CountryModal: Support for defaultProps will be removed',
]);

const Stack = createStackNavigator();

const App = () => {
  return (
    <PaperProvider>
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
                title: 'Editar Receita',
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
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
      <Toast/>
    </PaperProvider>
  );
};

export default App;
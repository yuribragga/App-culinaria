import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import RecipeList from '../screens/RecipeList';
import RecipeDetails from '../screens/RecipeDetails';
import Profile from '../screens/profile';
import RecipeListbyUser from '../screens/RecipeListbyUser';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Favorites from '../screens/Favorites';
import { AuthContext } from '../services/AuthContext';
import UserEdit from '../screens/UserEdit';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RecipeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RecipeList"
      component={RecipeList}
      options={{
        headerShown: true,
        title: 'Receitas',
        headerStyle: {
          backgroundColor: '#9BC584',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => null,
      }}
    />

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

  </Stack.Navigator>
);

const ProfileStack = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!isLoggedIn ? (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerShown: true,
              title: 'Cadastro',
              headerStyle: {
                backgroundColor: '#9BC584',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserEdit"
            component={UserEdit}
            options={{
              headerShown: true,
              title: 'Editar Perfil',
              headerStyle: {
                backgroundColor: '#9BC584',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const Navbar: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';

          if (route.name === 'Receitas') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Favoritos') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#604490',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#9BC584',
          borderTopWidth: 0,
          elevation: 5,
        },
      })}
    >
      <Tab.Screen name="Receitas" component={RecipeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={ProfileStack} options={{ headerShown: false }} />
      <Tab.Screen name="Favoritos" component={Favorites} options={{
        headerShown: true,
        title: 'Favoritos',
        headerStyle: {
          backgroundColor: '#9BC584',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => null,
      }} />
    </Tab.Navigator>
  );
};

export default Navbar;
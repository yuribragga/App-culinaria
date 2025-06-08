import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../services/AuthContext'; 
import Ionicons from '@expo/vector-icons/Ionicons';

const CircularMenu: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null); // Estado para controlar o botão pressionado
  const rotation = new Animated.Value(0);
  const { isLoggedIn } = useContext(AuthContext);

  const toggleMenu = () => {
    Animated.timing(rotation, {
      toValue: menuOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setMenuOpen(!menuOpen);
  };

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  if (!isLoggedIn) {
    return null;
  }

  return (
    <View style={styles.container}>
      {menuOpen && (
        <View style={styles.options}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('RecipeCreate')}
            onPressIn={() => setHoveredButton('Criar Receita')} // Exibe o texto "Criar Receita"
            onPressOut={() => setHoveredButton(null)} // Oculta o texto
          >
            <AntDesign name="plus" size={24} color="white" />
          </TouchableOpacity>
          {hoveredButton === 'Criar Receita' && <Text style={styles.hoverText}>Criar Receita</Text>}

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('RecipeListbyUser')}
            onPressIn={() => setHoveredButton('Minhas Receitas')} // Exibe o texto "Minhas Receitas"
            onPressOut={() => setHoveredButton(null)} // Oculta o texto
          >
            <AntDesign name="bars" size={24} color="white" />
          </TouchableOpacity>
          {hoveredButton === 'Minhas Receitas' && <Text style={styles.hoverText}>Minhas Receitas</Text>}

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('MealPlanScreen')}
            onPressIn={() => setHoveredButton('Planejamento')} // Exibe o texto "Planejamento"
            onPressOut={() => setHoveredButton(null)} // Oculta o texto
          >
            <Ionicons name="calendar" size={24} color="white" />
          </TouchableOpacity>
          {hoveredButton === 'Planejamento' && <Text style={styles.hoverText}>Planejamento</Text>}

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('RecommendationsScreen')}
            onPressIn={() => setHoveredButton('Recomendações')} 
            onPressOut={() => setHoveredButton(null)} 
          >
            <AntDesign name="star" size={24} color="white" />
          </TouchableOpacity>
          {hoveredButton === 'Recomendações' && <Text style={styles.hoverText}>Recomendações</Text>}
        </View>
      )}

      <TouchableOpacity
        style={styles.menuButton}
        onPress={toggleMenu}
        onPressIn={() => setHoveredButton('Menu')} 
        onPressOut={() => setHoveredButton(null)} 
      >
        <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
          <Ionicons name="ellipsis-horizontal-circle-sharp" size={64} color="#9BC584" />
        </Animated.View>
      </TouchableOpacity>
      {hoveredButton === 'Menu' && <Text style={styles.hoverText}>Menu</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignItems: 'center',
  },
  options: {
    position: 'absolute',
    bottom: 70,
    alignItems: 'center',
    zIndex: 1000,
  },
  optionButton: {
    backgroundColor: '#9BC584',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18, // Aumentado o espaçamento entre os botões
    elevation: 5,
  },
  menuButton: {
    elevation: 5,
  },
  hoverText: {
    position: 'absolute',
    left: -120, // Move o texto para o lado esquerdo
    top: '50%', // Centraliza verticalmente em relação ao botão
    transform: [{ translateY: -10 }], // Ajusta o alinhamento vertical
    color: '#9BC584',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 8,
    elevation: 5,
    textAlign: 'center',
    width: 100, // Define uma largura fixa para o texto
  },
});

export default CircularMenu;

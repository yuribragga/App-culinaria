import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CircularMenu: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const rotation = new Animated.Value(0);

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

  return (
    <View style={styles.container}>
      {menuOpen && (
        <View style={styles.options}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('RecipeCreate')}
          >
            <AntDesign name="plus" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('RecipeListbyUser')}
          >
            <AntDesign name="bars" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
          <AntDesign name="pluscircle" size={60} color="#9BC584" />
        </Animated.View>
      </TouchableOpacity>
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
  },
  optionButton: {
    backgroundColor: '#9BC584',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
  },
  menuButton: {
    elevation: 5,
  },
});

export default CircularMenu;

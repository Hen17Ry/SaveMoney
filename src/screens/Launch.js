import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import de useNavigation

export default function Launch() {
  const navigation = useNavigation(); // Initialisation de la navigation

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Connexion'); // Redirige vers la page Connexion
    }, 2000); // 2000 ms = 2 secondes

    return () => clearTimeout(timer); // Nettoie le timer
  }, [navigation]); // Ajout de navigation dans les dépendances

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aeff7f',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
});

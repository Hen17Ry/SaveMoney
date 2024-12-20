import React, {useState} from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

export default function Connexion() {
  
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [numero, setNumero] = useState('');
  const [confirm, setConfirm] = useState(null);

  const handleLogin = async () => {
    if (numero.length === 0) {
        Alert.alert('Attention', 'Champ Vide');
        return;
    }
    try {
        const user = await db.getFirstAsync('SELECT * FROM users WHERE numero_telephone = ?', [numero]);
        if (!user) {
            Alert.alert('Error', 'Username does not exist !');
            return;
        }

        const userId = user.id; // Récupère l'ID de l'utilisateur depuis la base de données
        Alert.alert('Success', 'Connexion Réussi');
        navigation.navigate('Home', { userId }); // Transmet l'ID lors de la navigation
    } catch (error) {
        console.log('Error during login: ', error);
        const errorMessage = error.message || 'Une erreur inconnue est survenue'; // Utilise le message d'erreur s'il existe
        Alert.alert('Erreur', errorMessage);
    }
};


  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Connectez-vous</Text>
      <TextInput
        placeholder="Numéro de téléphone"
        placeholderTextColor="black"
        keyboardType="phone-pad"
        style={styles.input}
        value={numero}
        onChangeText={setNumero}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>
      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate('Inscription')}
      >
        Êtes-vous inscrit ?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aeff7f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    color: 'black',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#aeff7f',
    fontWeight: 'bold',
  },
  registerText: {
    fontSize: 16,
    color: 'black',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
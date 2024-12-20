import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';



export default function Inscription() {

  const db = useSQLiteContext();   

  const navigation = useNavigation();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [numero, setNumero] = useState('');
  const [pin, setPin] = useState('');
  const [taux, setTaux] = useState('');

 
  const register = async() =>{
    if (!nom || !prenom || !numero || !pin || !taux) {
        Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
        return;
      }
    
      try {
            const existingUser = await db.getFirstAsync('SELECT * FROM users WHERE numero_telephone = ?', [numero]);
            if (existingUser) {
                Alert.alert('Error', 'Username already exists.');
                return;
            }

            await db.runAsync('INSERT INTO users (nom, prenom, numero_telephone, code_pin, taux_epargne) VALUES (?, ?, ?, ?, ?)', [nom, prenom, numero, pin, taux]);
            Alert.alert('Success', 'Registration successful!');
             navigation.navigate('Connexion');
        } catch (error) {
            console.log('Error during registration : ', error);
        }
  }


  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Inscription</Text>

      <TextInput
        placeholder="Nom"
        placeholderTextColor="black"
        style={styles.input}
        value={nom}
        onChangeText={setNom}
      />

      <TextInput
        placeholder="Prénom"
        placeholderTextColor="black"
        style={styles.input}
        value={prenom}
        onChangeText={setPrenom}
      />

      <TextInput
        placeholder="Numéro de téléphone"
        placeholderTextColor="black"
        keyboardType="phone-pad"
        style={styles.input}
        value={numero}
        onChangeText={setNumero}
      />

      <TextInput
        placeholder="Code PIN"
        placeholderTextColor="black"
        secureTextEntry
        style={styles.input}
        value={pin}
        onChangeText={setPin}
      />

      <TextInput
        placeholder="Taux d'épargne (%)"
        placeholderTextColor="black"
        keyboardType="numeric"
        style={styles.input}
        value={taux}
        onChangeText={setTaux}
      />

      <TouchableOpacity style={styles.button} onPress={register}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      <Text
        style={styles.loginText}
        onPress={() => navigation.navigate('Connexion')}
      >
        Déjà inscrit ? Connectez-vous.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#aeff7f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 180,
    height: 180,
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
  loginText: {
    fontSize: 16,
    color: 'black',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
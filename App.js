import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/screens/Home';
import Launch from './src/screens/Launch';
import Connexion from './src/screens/Connexion';
import Odt from './src/screens/Odt';  
import Inscription from './src/screens/Inscription';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';


const initializeDatabase = async(db) => {
    try {
        await db.execAsync(`
            PRAGMA journal_node = WAL;
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                prenom TEXT NOT NULL,
                numero_telephone INTEGER NOT NULL,
                code_pin INTEGER NOT NULL,
                taux_epargne REAL NOT NULL
            );
            `);
            console.log('Database innitialized')
    } catch (error) {
        console.log('Error:', error)
    }
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <SQLiteProvider databaseName='save.db' onInit={initializeDatabase}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Launch">
          <Stack.Screen 
            name="Launch" 
            component={Launch} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Connexion" 
            component={Connexion} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Inscription" 
            component={Inscription} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Odt" 
            component={Odt} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
    </NavigationContainer>
    </SQLiteProvider>
    
  );
}

import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    Alert, 
    Platform, 
    PermissionsAndroid, 
    Linking 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
    const route = useRoute();
    const db = useSQLiteContext();
    const { userId } = route.params;
    const [userData, setUserData] = useState(null);

    // Fonction pour demander la permission d'accès aux SMS
    const requestSmsPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const alreadyGranted = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.READ_SMS
                );

                if (alreadyGranted) {
                    console.log('Permission déjà accordée');
                    Alert.alert('Info', 'Permission déjà accordée.');
                    return;
                }

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_SMS,
                    {
                        title: 'Permission d\'accès aux SMS',
                        message: 'L\'application a besoin d\'accéder à vos SMS pour continuer.',
                        buttonNeutral: 'Demander plus tard',
                        buttonNegative: 'Annuler',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Permission accordée');
                    Alert.alert('Permission accordée', 'Vous pouvez maintenant lire les SMS.');
                } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Alert.alert(
                        'Permission refusée',
                        'Vous avez choisi de ne plus demander cette permission. Veuillez activer la permission manuellement dans les paramètres de l\'application.'
                    );
                } else {
                    console.log('Permission refusée');
                    Alert.alert('Permission refusée', 'Vous ne pourrez pas lire les SMS.');
                }
            } catch (err) {
                console.warn('Erreur lors de la demande de permission:', err);
            }
        } else {
            Alert.alert('Non supporté', 'La lecture des SMS est uniquement disponible sur Android.');
        }
    };

    // Redirection vers les paramètres
    const openAppSettings = () => {
        Linking.openSettings();
    };

    // Fonction pour récupérer les données utilisateur
    const fetchUserData = async () => {
        try {
            const result = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [userId]);
            setUserData(result);
        } catch (error) {
            console.log('Erreur lors de la récupération des données utilisateur:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
        requestSmsPermission(); // Demander la permission à l'arrivée sur la page
    }, []);

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text>Chargement...</Text>
                <TouchableOpacity onPress={openAppSettings} style={styles.settingsButton}>
                    <Text style={styles.settingsButtonText}>Ouvrir les paramètres</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="menu" size={32} color="#333" />
                </TouchableOpacity>
            </View>

            <Text style={styles.welcomeText}>
                Bienvenue, {userData.prenom} {userData.nom} !
            </Text>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Créer votre compte épargne</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    menuButton: {
        padding: 10,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 40,
        textAlign: 'center',
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: '#0066CC',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    settingsButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#0066CC',
        borderRadius: 5,
    },
    settingsButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

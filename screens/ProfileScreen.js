import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const user = auth.currentUser;
    const navigation = useNavigation();
    const signOutUser = () => {
        signOut(auth).then(() => {
            navigation.replace("Login");
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.welcomeText}>Welcome, {user.email}</Text>

            <Pressable onPress={signOutUser} style={styles.signOutButton}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
            </Pressable>
            <Pressable style={styles.signOutButton} onPress={()=>navigation.navigate('ViewOrders')}><Text style={styles.signOutButtonText}>View orders</Text></Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    signOutButton: {
      marginTop:10,
        backgroundColor: "#367588",
        padding: 10,
        borderRadius: 8,
    },
    signOutButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
});

export default ProfileScreen;

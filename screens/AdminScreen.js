import { SafeAreaView, StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserPress = (userId) => {
    console.log('Pressed user with ID:', userId);
    // Perform navigation or any other action here
    navigation.navigate('AdminOrders', { userId });

  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Users List</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleUserPress(item.id)}>
            <View style={styles.card}>
              <Text style={styles.userId}>User ID: {item.id}</Text>
              <Text style={styles.userData}>Email: {item.email}</Text>
              {/* Add more fields you want to display */}
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ddd',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000', // Purple color
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    marginHorizontal:12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Dark color for user ID
  },
  userData: {
    fontSize: 16,
    color: '#555', // Slightly darker color for user data
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default AdminScreen;

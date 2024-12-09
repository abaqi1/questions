import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { collection, query, where, getDoc, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseConfig';
import { useRoute } from '@react-navigation/native';

const AddUser = () => {
    const [searchInput, setSearchInput] = useState('');
    const route = useRoute();
    const { groupId } = route.params as { groupId: string };

    const handleAddUser = async () => {
        try {
            // Search for user by email or username
            const usersRef = collection(FIREBASE_DB, 'users');
            const q = query(
                usersRef,
                where('email', '==', searchInput.toLowerCase())
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Get the first matching user
                const user = querySnapshot.docs[0];

                // Add user to group
                const groupRef = doc(FIREBASE_DB, 'groups', groupId);
                await updateDoc(groupRef, {
                    members: arrayUnion(user.id)
                });
                alert('User added successfully to Groups collection!');

                // Update the user's groups array
                const userRef = doc(FIREBASE_DB, 'users', user.id);
                const userSnap = await getDoc(userRef);
                const currentGroups = userSnap.data()?.groups || [];
                await updateDoc(userRef, {
                    groups: [...currentGroups, groupRef.id]
                });
                console.log('Group added to user colllection group field: ', groupRef.id);

                setSearchInput('');
            } else {
                alert('User not found');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Error adding user');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter user email"
                value={searchInput}
                onChangeText={setSearchInput}
                autoCapitalize="none"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleAddUser}
            >
                <Text style={styles.buttonText}>Add User</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AddUser;
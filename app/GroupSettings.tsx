import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { collection, query, where, getDoc, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseConfig';
import { useRoute } from '@react-navigation/native';

const GroupSettings = () => {
    const [searchInput, setSearchInput] = useState('');
    const [interestsInput, setInterestsInput] = useState('');
    const [dynamicsInput, setDynamicsInput] = useState('');
    const [currentInterests, setCurrentInterests] = useState<string[]>([]);
    const [currentDynamics, setCurrentDynamics] = useState<string[]>([]);
    const route = useRoute();
    const { groupId } = route.params as { groupId: string };


    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const groupRef = doc(FIREBASE_DB, 'groups', groupId);
                const groupSnap = await getDoc(groupRef);
                if (groupSnap.exists()) {
                    const groupData = groupSnap.data();
                    setCurrentInterests(groupData?.interests || []);
                    setCurrentDynamics(groupData?.dynamics || []);
                }
            } catch (error) {
                console.error('Error fetching group details:', error);
            }
        };

        fetchGroupDetails();
    }, [groupId]);

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

    const handleUpdateGroupDetails = async () => {
        try {
            const groupRef = doc(FIREBASE_DB, 'groups', groupId);
            await updateDoc(groupRef, {
                interests: arrayUnion(interestsInput),
                dynamics: arrayUnion(dynamicsInput)
            });

            // Update the current interests and dynamics
            setCurrentInterests(prevInterests => [...prevInterests, interestsInput]);
            setCurrentDynamics(prevDynamics => [...prevDynamics, dynamicsInput]);

            setInterestsInput('');
            setDynamicsInput('');
            alert('Group interests and dynamics updated successfully!');
        } catch (error) {
            console.error('Error updating group details:', error);
            alert('Error updating group details');
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

            <TextInput
                style={styles.input}
                placeholder="Enter interests"
                value={interestsInput}
                onChangeText={setInterestsInput}
                autoCapitalize="none"
            />
            <Text style={styles.currentText}>Current Interests: {currentInterests.join(', ')}</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter dynamics"
                value={dynamicsInput}
                onChangeText={setDynamicsInput}
                autoCapitalize="none"
            />
            <Text style={styles.currentText}>Current Dynamics: {currentDynamics.join(', ')}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handleUpdateGroupDetails}
            >
                <Text style={styles.buttonText}>Update Group Details</Text>
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
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    currentText: {
        marginVertical: 10,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
    },
});

export default GroupSettings;
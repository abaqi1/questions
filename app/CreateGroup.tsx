import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import { FIREBASE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc } from 'firebase/firestore';

const CreateGroup = ({ navigation }: any) => {
    const [groupName, setGroupName] = useState('');
    const currentUser = FIREBASE_AUTH.currentUser;

    const createGroup = async () => {
        if (!groupName.trim() || !currentUser) return;

        try {
            // Create the group document
            const groupRef = await addDoc(collection(FIREBASE_DB, 'groups'), {
                created: serverTimestamp(),
                members: [currentUser.uid],
                messages: {},
                name: groupName.trim()
            });

            // Update the user's groups array
            const userRef = doc(FIREBASE_DB, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            const currentGroups = userSnap.data()?.groups || [];
            await updateDoc(userRef, {
                groups: [...currentGroups, groupRef.id]
            });
            console.log('Group created with ID: ', groupRef.id);

            navigation.navigate('Groups');
        } catch (error) {
            console.error('Error creating group: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Group Name:</Text>
            <TextInput
                style={styles.input}
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Enter group name"
            />
            <Button title="Create Group" onPress={createGroup} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
});

export default CreateGroup;
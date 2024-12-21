import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import { FIREBASE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc } from 'firebase/firestore';

const CreateGroup = ({ navigation }: any) => {
    const [groupName, setGroupName] = useState('');
    const [interestInput, setInterestInput] = useState('');
    const [dynamicInput, setDynamicInput] = useState('');
    const [interests, setInterests] = useState<string[]>([]);
    const [dynamics, setDynamics] = useState<string[]>([]);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const currentUser = FIREBASE_AUTH.currentUser;


    const setGroupDetails = () => {
        if (!groupName.trim()) return;
        setShowAdditionalFields(true);
    };

    const handleInterestSubmit = () => {
        if (!interestInput.trim()) return;
        setInterests(prev => [...prev, interestInput.trim()]);
        setInterestInput(''); // Clear input after adding
    };

    const handleDynamicSubmit = () => {
        if (!dynamicInput.trim()) return;
        setDynamics(prev => [...prev, dynamicInput.trim()]);
        setDynamicInput(''); // Clear input after adding
    };

    const createGroup = async () => {
        if (!groupName.trim() || !currentUser) return;

        try {
            // Create the group document
            const groupRef = await addDoc(collection(FIREBASE_DB, 'groups'), {
                created: serverTimestamp(),
                members: [currentUser.uid],
                messages: {},
                name: groupName.trim(),
                interests: interests,
                dynamics: dynamics,
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

            {showAdditionalFields ? (
                <>
                    <View>
                        <TextInput
                            style={styles.input}
                            value={interestInput}
                            onChangeText={setInterestInput}
                            onSubmitEditing={handleInterestSubmit}
                            placeholder="Add an interest (press Enter)"
                            returnKeyType="done"
                        />
                        {/* Display current interests */}
                        {interests.map((interest, index) => (
                            <Text key={index} style={styles.listItem}>• {interest}</Text>
                        ))}
                    </View>

                    <View>
                        <TextInput
                            style={styles.input}
                            value={dynamicInput}
                            onChangeText={setDynamicInput}
                            onSubmitEditing={handleDynamicSubmit}
                            placeholder="Add a dynamic (press Enter)"
                            returnKeyType="done"
                        />
                        {/* Display current dynamics */}
                        {dynamics.map((dynamic, index) => (
                            <Text key={index} style={styles.listItem}>• {dynamic}</Text>
                        ))}
                    </View>

                    <Button title="Create Group" onPress={createGroup} />

                </>
            ) : (
                <Button title="Pick Group Interest\Dynamic" onPress={setGroupDetails} />
            )}
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
    listItem: {
        marginLeft: 10,
        marginBottom: 5,
        color: '#666',
    }
});

export default CreateGroup;
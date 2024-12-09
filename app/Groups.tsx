import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from "react-native";
import { FIREBASE_DB, FIREBASE_AUTH } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Chat: {
        groupId: string;
        groupName: string;
        messages: any[];
    };
};

interface GroupItem {
    key: string;
    details: any;
}

const Groups = () => {
    const [groups, setGroups] = useState<GroupItem[]>([]);
    const currentUser = FIREBASE_AUTH.currentUser;
    console.log(`${currentUser?.uid} is logged in`);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const loadGroups = async () => {
            const userGroups = await fetchUserGroups(currentUser?.uid || '');
            const groupsWithDetails = await Promise.all(
                userGroups.map(async (groupId: string) => {
                    const details = await fetchGroupDetails(groupId);
                    return { key: groupId, details };
                })
            );
            setGroups(groupsWithDetails); // This might be fetching too much info about the groups
        };
        loadGroups();
    }, []);

    const handleGroupPress = (group: GroupItem) => {
        navigation.navigate('Chat', {
            groupId: group.key,
            groupName: group.details.name,
            messages: group.details.messages || []
        });
    };

    return (
        <>
            <View style={styles.container}>
                <Button title="Create Group" onPress={() => navigation.navigate('CreateGroup' as never)} />
                <Button title="Logout" onPress={() => FIREBASE_AUTH.signOut()} />
                <FlatList
                    data={groups}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => handleGroupPress(item)}>
                            <Text style={styles.item}>{item.details.name || "Unamed Group"}</Text>
                        </TouchableOpacity>}
                />
            </View>
        </>
    );
}

const fetchUserGroups = async (uuid: string) => {
    try {
        const userRef = doc(FIREBASE_DB, "users", uuid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data().groups; // Array of group IDs
        } else {
            console.log("No such user");
            return [];
        }
    } catch (error) {
        console.error("Error fetching user groups:", error);
    }
};

const fetchGroupDetails = async (groupId: string) => {
    try {
        const groupRef = doc(FIREBASE_DB, "groups", groupId);
        const groupSnap = await getDoc(groupRef);
        console.log(groupSnap.data())
        return groupSnap.data();
    } catch (error) {
        console.error("Error fetching group details:", error);
    }
};

export default Groups;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 22,
        flexDirection: 'column',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    todoText: {
        padding: 10,
        fontSize: 16,
        textAlign: 'center'
    }
});
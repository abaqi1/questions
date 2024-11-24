import { View, Text, FlatList, StyleSheet } from "react-native";
import { FIREBASE_DB, FIREBASE_AUTH } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { User } from "firebase/auth";

interface GroupItem {
    key: string;
}

const Groups = () => {
    const [groups, setGroups] = useState<GroupItem[]>([]);
    const currentUser = FIREBASE_AUTH.currentUser;

    useEffect(() => {
        const loadGroups = async () => {
            const userGroups = await fetchUserGroups();
            setGroups(userGroups.map((group: any) => ({ key: group })) || []);
        };
        loadGroups();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={groups}
                renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
            />
        </View>
    );
}

const fetchUserGroups = async () => {
    try {
        const userRef = doc(FIREBASE_DB, "users", 'ari');
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            console.log(userSnap.data().groups);
            return userSnap.data().groups; // Array of group IDs
        } else {
            console.log("No such user");
            return [];
        }
    } catch (error) {
        console.error("Error fetching user groups:", error);
    }
};


export default Groups;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});
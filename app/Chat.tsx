import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import { doc, getDoc, updateDoc, arrayUnion, getFirestore } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';  // Make sure to install expo/vector-icons if not already
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator();

type ChatRouteParams = {
    groupId: string;  // adjust type as needed
    groupName: string;
    messages: any;    // adjust type as needed
}

type AddUserRouteParams = {
    groupId: string;
}

type User = {
    _id: string | number;
    name?: string;
    avatar?: string;
}

type Message = {
    _id: string | number;
    text: string;
    createdAt: Date;
    user: User;
}

type RootStackParamList = {
    GroupSettings: { groupId: string };
    // ... other screens
};

const Chat = () => {
    const route = useRoute<RouteProp<{ screen: ChatRouteParams }, 'screen'>>();
    const { groupId, groupName } = route.params;
    const currentUser = FIREBASE_AUTH.currentUser;
    const [chatMessages, setChatMessages] = useState<Message[]>([])
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        navigation.setOptions({
            title: groupName,
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => openGroupSettings({ groupId: groupId })}
                    style={styles.groupSettings}
                >
                    <Ionicons
                        name="settings-outline"
                        size={20}
                        color="#FFFFFF"
                        style={{ marginRight: 5 }}
                    />
                    <Text style={styles.groupSettingsText}>GS</Text>
                </TouchableOpacity>
            ),
        });
    }, [groupName, navigation]);

    const openGroupSettings = (userGroup: AddUserRouteParams) => {
        navigation.navigate('GroupSettings', { groupId: userGroup.groupId });
    }

    // Set the title of the chat screen
    useEffect(() => {
        navigation.setOptions({
            title: groupName
        });
    }, [groupName]);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const groupRef = doc(FIREBASE_DB, 'groups', groupId);
                const groupSnap = await getDoc(groupRef);

                if (groupSnap.exists()) {
                    //TODO: Refactor - Either retrieve chat here or pass it in Chat after Group is pressed on the group page
                    const groupData = groupSnap.data();

                    // If chat is empty, set chat messages to empty array
                    if (Object.keys(groupData.messages).length === 0) {
                        setChatMessages([]);
                        return;
                    }

                    // Convert Firestore timestamps to Date objects and reverse to show newest first
                    const messages = groupData.messages?.map((msg: any) => ({
                        ...msg,
                        createdAt: msg.createdAt.toDate()
                    })).reverse() || [];
                    setChatMessages(messages);
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        }
        loadMessages();
    }, [groupId])

    const onSend = useCallback(async (messages: Message[] = []) => {
        try {
            // Update local state
            setChatMessages(previousMessages =>
                GiftedChat.append(previousMessages, messages)
            );

            // Update Firestore
            const groupRef = doc(FIREBASE_DB, 'groups', groupId);
            const newMessage = messages[0]; // GiftedChat sends array with single message

            await updateDoc(groupRef, {
                messages: arrayUnion({
                    _id: newMessage._id,
                    text: newMessage.text,
                    createdAt: newMessage.createdAt,
                    user: newMessage.user,
                })
            });
            console.log(currentUser);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [groupId]);


    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
            <GiftedChat
                messages={chatMessages}
                onSend={(messages: Message[]) => onSend(messages)}
                user={{
                    _id: currentUser?.uid || '',
                }}
                bottomOffset={Platform.OS === 'ios' ? 34 : 0}  // Add padding for iPhone notch
            // isTyping={true} Play with these settings
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    groupSettings: {
        alignSelf: 'flex-end',
        backgroundColor: '#000000',
        padding: 15,
        margin: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 60,
        flexDirection: 'row',      // Add this to align icon and text horizontally
        alignItems: 'center',     // Add this to center items vertically
        justifyContent: 'center',  // Add this to center items horizontally
    },
    groupSettingsText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


export default Chat;
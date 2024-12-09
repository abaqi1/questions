import { View, Text } from 'react-native';
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
    AddUser: { groupId: string };
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
                    onPress={() => handleAddUser({ groupId: groupId })}
                    style={{ marginRight: 10 }}
                >
                    <Ionicons name="person-add" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [groupName, navigation]);

    const handleAddUser = (userGroup: AddUserRouteParams) => {
        navigation.navigate('AddUser', { groupId: userGroup.groupId });
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
            />
        </SafeAreaView>
    );
}

export default Chat;
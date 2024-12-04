import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessageList from './Messagelist';
import { useState } from 'react';

const Stack = createNativeStackNavigator();

type ChatRouteParams = {
    groupId: string;  // adjust type as needed
    groupName: string;
    messages: any;    // adjust type as needed
}

const Chat = () => {
    const route = useRoute<RouteProp<{ screen: ChatRouteParams }, 'screen'>>();
    const { groupId, groupName, messages } = route.params;
    console.log(messages);
    const [chatMessages, setMessages] = useState(messages);
    return (
        <View>
            {/* <Text>Messages: {JSON.stringify(messages, null, 2)}</Text> */}
            <MessageList messages={chatMessages} />
        </View>

    );
}

export default Chat;
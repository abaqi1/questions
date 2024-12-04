import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type ChatRouteParams = {
    groupId: string;  // adjust type as needed
    groupName: string;
    messages: any;    // adjust type as needed
}

const Chat = () => {
    const route = useRoute<RouteProp<{ screen: ChatRouteParams }, 'screen'>>();
    const { groupId, groupName, messages } = route.params;
    console.log(messages);
    return (
        <View>
            <Text>Messages: {JSON.stringify(messages, null, 2)}</Text>
        </View>
    );
}

export default Chat;
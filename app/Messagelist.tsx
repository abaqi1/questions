import { View, Text } from 'react-native';

const MessageList = ({ messages }: { messages: any }) => {
    return (
        <View>
            <Text>Messages: {JSON.stringify(messages, null, 2)}</Text>
        </View>
    );
}

export default MessageList;
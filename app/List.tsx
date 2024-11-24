import { View, Button } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../FirebaseConfig";

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
    return (
        <View>
            <Button title="Go to Groups" onPress={() => navigation.navigate('Groups')} />
            <Button title="Logout" onPress={() => FIREBASE_AUTH.signOut()} />
        </View>
    );
}

export default List;


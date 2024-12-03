import { View, Button } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../FirebaseConfig";

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Main = ({ navigation }: RouterProps) => {
    return (
        <View>
            <Button title="Go to Groups" onPress={() => navigation.navigate('Groups')} />
            <Button title="Create Group" onPress={() => navigation.navigate('CreateGroup')} />
            <Button title="Logout" onPress={() => FIREBASE_AUTH.signOut()} />
        </View>
    );
}

export default Main;


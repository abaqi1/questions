// import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import Groups from "./Groups";
import Chat from "./Chat";
import AddUser from "./AddUser";
import { useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { useEffect } from "react";
import CreateGroup from "./CreateGroup";

const Stack = createNativeStackNavigator();

const insideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <insideStack.Navigator>
      <insideStack.Screen name="Groups" component={Groups} />
      <insideStack.Screen name="CreateGroup" component={CreateGroup} />
      <insideStack.Screen name="Chat" component={Chat} />
      <insideStack.Screen name="AddUser" component={AddUser} />
    </insideStack.Navigator>
  );
}

export default function index() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log(user);
      setUser(user);
    });
  }, []);

  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      {user ? (
        <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
    // </NavigationContainer>
  );
}
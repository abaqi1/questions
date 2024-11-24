// import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import List from "./List";
import Groups from "./Groups";
import { useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { useEffect } from "react";

const Stack = createNativeStackNavigator();

const insideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <insideStack.Navigator>
      <insideStack.Screen name="List" component={List} />
      <insideStack.Screen name="Groups" component={Groups} />
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
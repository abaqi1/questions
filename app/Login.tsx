import { View, Text, TextInput, StyleSheet, Button, ActivityIndicator } from "react-native";
import { useState } from "react";
import { FIREBASE_DB, FIREBASE_AUTH } from "../FirebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error: any) {
            console.log(error);
            alert('Sign in failed ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);

            // Create a user document in Firestore
            const newUserDocRef = doc(FIREBASE_DB, "users", response.user.uid);
            await setDoc(newUserDocRef, {
                uid: response.user.uid,
                email: response.user.email,
                groups: [],
                name: response.user.displayName,
            });

        } catch (error: any) {
            console.log(error);
            alert('Sign up failed ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Email" value={email} autoCapitalize="none" onChangeText={setEmail} />
            <TextInput secureTextEntry={true} style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} />

            {loading ? (
                <ActivityIndicator size="large" color="#000ff" />
            ) : (
                <>
                    <Button title="Login" onPress={signIn} />
                    <Button title="Register" onPress={signUp} />
                </>
            )}



        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 20,
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
    },
});
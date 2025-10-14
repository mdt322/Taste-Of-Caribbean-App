import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('MenuManagement'); 
    } catch (error) {
      console.log(error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text h3 style={{ marginBottom: 20 }}>Register</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title="Register" onPress={handleRegister} containerStyle={{ width: "100%" }} />
      <Button
        title="Already have an account? Login"
        type="clear"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

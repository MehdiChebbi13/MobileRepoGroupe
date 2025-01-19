import React, { useState, useCallback } from "react";
import {
  Text,
  TextInput,
  Button,
  ScrollView,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {

      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(
          "Sign-in not completed:",
          JSON.stringify(signInAttempt, null, 2),
        );
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 16,
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign In</Text>

            {error ? (
              <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            ) : null}

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "gray",
                padding: 10,
                width: "100%",
                marginBottom: 10,
                backgroundColor: "white",
              }}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              onChangeText={setEmailAddress}
            />

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "gray",
                padding: 10,
                width: "100%",
                marginBottom: 10,
                backgroundColor: "white",
              }}
              value={password}
              placeholder="Enter password"
              secureTextEntry={true}
              onChangeText={setPassword}
            />

            <Button title="Sign In" onPress={onSignInPress} />

            <View style={{ marginTop: 20 }}>
              <Text>Don't have an account?</Text>
              <Button title="Sign Up" onPress={() => router.push("/sign-up")} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
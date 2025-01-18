import React, { useState } from "react";
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
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { fetchAPI } from "@/lib/fetch";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name,
            emailAddress,
            clerkId: signUpAttempt.createdUserId,
          }),
        });

        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

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
            {pendingVerification ? (
              <>
                <Text style={{ fontSize: 20, marginBottom: 10 }}>
                  Verify your email
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: 10,
                    width: "100%",
                    marginBottom: 10,
                    backgroundColor: "white",
                  }}
                  value={code}
                  placeholder="Enter verification code"
                  onChangeText={setCode}
                />
                <Button title="Verify" onPress={onVerifyPress} />
              </>
            ) : (
              <>
                <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign Up</Text>

                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: 10,
                    width: "100%",
                    marginBottom: 10,
                    backgroundColor: "white",
                  }}
                  value={name}
                  placeholder="Enter full name"
                  onChangeText={setName}
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

                <Button title="Continue" onPress={onSignUpPress} />
              </>
            )}

            <View style={{ marginTop: 20 }}>
              <Text>Already have an account?</Text>
              <Button title="Sign In" onPress={() => router.push("/sign-in")} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import { useUser } from "@clerk/clerk-expo"; // Corrected Import
import { TouchableOpacity } from "react-native";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { user } = useUser();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  useEffect(() => {
    if (user && verification.state === "completeVerification") {
      registerUserInBackend();
    }
  }, [user, verification.state]);

  const registerUserInBackend = async () => {
    try {
      setVerification({ ...verification, state: "success" });
      setIsLoading(false);
      Alert.alert("Success", "Your account has been verified and registered.");
    } catch (err: any) {
      console.error("Error registering user:", err);
      setVerification({
        ...verification,
        error: err.message || "An unexpected error occurred.",
        state: "failed",
      });
      setIsLoading(false);
      Alert.alert(
        "Registration Error",
        err.message || "An unexpected error occurred."
      );
    }
  };

  const onSignUpPress = async () => {
    if (!isLoaded) {
      Alert.alert("Error", "Authentication is not loaded yet.");
      return;
    }
    setIsLoading(true);
    console.log("Attempting to create sign-up...");
    try {
      await signUp.create({
        username: form.name,
        emailAddress: form.email,
        password: form.password,
      });
      console.log("Sign-up created successfully.");

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      console.log("Email verification prepared.");

      setVerification({
        ...verification,
        state: "pending",
      });
      setIsLoading(false);
      Alert.alert("Success", "Verification code sent to your email.");
    } catch (err: any) {
      console.log("Sign-up error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "Sign-Up Error",
        err.errors[0]?.longMessage || "An unexpected error occurred."
      );
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) {
      Alert.alert("Error", "Authentication is not loaded yet.");
      return;
    }
    setIsLoading(true);
    console.log("Attempting to verify email...");
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      console.log("Email verification attempt:", signUpAttempt);

      if (signUpAttempt.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: signUpAttempt.createdUserId,
          }),
        });
        console.log("Email verified successfully. Setting session active...");
        await setActive({ session: signUpAttempt.createdSessionId });
        console.log("Session set to active.");

        setVerification({
          ...verification,
          state: "completeVerification",
        });
        router.replace("../(tabs)/home");
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
        setIsLoading(false);
        console.error(
          "Verification failed:",
          JSON.stringify(signUpAttempt, null, 2)
        );
        Alert.alert(
          "Verification Failed",
          "Please check the code and try again."
        );
      }
    } catch (err: any) {
      console.error("Error during verification:", err);
      setVerification({
        ...verification,
        error: err.message || "An unexpected error occurred.",
        state: "failed",
      });
      setIsLoading(false);
      Alert.alert(
        "Verification Error",
        err.message || "An unexpected error occurred."
      );
    }
  };

  return (
    <ScrollView>
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        <View className="p-5 ">
          <InputField
            label="Name"
            placeholder="Enter name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
            bgVariant={!isLoading ? "primary" : "secondary"}
          />

          <Link
            href="./sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            Already have an account?{" "}
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        {/* Verification Modal */}
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onBackdropPress={() =>
            setVerification({ ...verification, state: "default" })
          }
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholder={"Enter code"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onVerifyPress}
              className="mt-5 "
              bgVariant={!isLoading ? "primary" : "secondary"}
            />
          </View>
        </ReactNativeModal>

        {/* Success Modal */}
        <ReactNativeModal isVisible={verification.state === "success"}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={require("../../assets/images/check.png")}
              className="w-20 h-20 mx-auto"
            />
            <Text className="text-3xl font-JakartaBold text-center mt-5">
              Verified Successfully
            </Text>
            <Text className="text-lg text-center mt-3 text-gray-400">
              Your account has been verified successfully.
            </Text>
            <CustomButton
              title="Continue"
              onPress={() => router.replace("../(tabs)/home")}
              className="mt-9"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;

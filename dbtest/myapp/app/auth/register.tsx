import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import API from "../../config/apiConfig";

import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const API_URL = "http://192.168.10.17:8000";
  
  const handleRegister = async () => {
    // --- Basic Required Fields ---
  if (!firstName || !email || !password || !confirmPassword) {
    Alert.alert("Error", "Please fill in all fields.");
    return;
  }

  // --- First Name Validation ---
  if (firstName.trim().length < 2) {
    Alert.alert("Error", "First name must be at least 2 characters long.");
    return;
  }

  // --- Email Validation ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Error", "Please enter a valid email address.");
    return;
  }

  // --- Password Validation ---
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(password)) {
    Alert.alert(
      "Error",
      "Password must be at least 8 characters long and include:\n• 1 uppercase letter\n• 1 lowercase letter\n• 1 number\n• 1 special character"
    );
    return;
  }

  // --- Confirm Password Validation ---
  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match.");
    return;
  }
  // if (!firstName || !email || !password || !confirmPassword) {
  //   Alert.alert("Error", "Please fill in all fields.");
  //   return;
  // }
  // if (password !== confirmPassword) {
  //   Alert.alert("Error", "Passwords do not match.");
  //   return;
  // }

  setLoading(true);
  try {
    // const response = await fetch(`${API_URL}/register-request`, {
    const response = await fetch(API.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: firstName,
        email,
        password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      Alert.alert("Error", data.detail || "Failed to send OTP");
      return;
    }

    Alert.alert("OTP Sent", "Check your email for the OTP code.");
    router.push({
      pathname: "/auth/verify-otp",
      params: { email },
    });
  } catch (error) {
    console.error(error);
    Alert.alert("Network Error", "Failed to connect to the server");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={[
          "rgba(128, 0, 255, 0.7)",
          "rgba(255, 0, 128, 0.81)",
          "rgba(0, 128, 255, 0.82)",
        ]}
        style={styles.bg}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <MotiView
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 700 }}
                style={styles.card}
              >
                <MotiView
                  from={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 200 }}
                  style={styles.logo}
                >
                  <Text style={styles.logoText}>🧥</Text>
                </MotiView>

                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join us today!</Text>

                {/* First name, Email (mapped) */}
                {[
                  {
                    placeholder: "First Name",
                    value: firstName,
                    setValue: setFirstName,
                    icon: "person-outline",
                  },
                  {
                    placeholder: "Email",
                    value: email,
                    setValue: setEmail,
                    icon: "mail-outline",
                    
                  },
                ].map((item, index) => (
                  <View key={index} style={styles.inputContainer}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color="#999"
                      style={styles.icon}
                    />
                    <TextInput
                      placeholder={item.placeholder}
                      placeholderTextColor="#999"
                      style={styles.input}
                      value={item.value}
                      onChangeText={item.setValue}                    
                      keyboardType={item.placeholder === "Email" ? "email-address" : "default"}
                      // autoCapitalize="none"
                      autoCapitalize={item.placeholder === "Email" ? "none" : "words"}
                    />
                  </View>
                ))}

                {/* Password field with eye toggle */}
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((s) => !s)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password field with eye toggle */}
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword((s) => !s)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.loginButton, loading && { opacity: 0.6 }]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  <Text style={styles.loginText}>
                    {loading ? "Creating..." : "Create Account"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>
                    Already have an account?{" "}
                    <Text
                      style={styles.signupLink}
                      onPress={() => router.replace("/auth/login")}
                    >
                      Login
                    </Text>
                  </Text>
                </View>
              </MotiView>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  bg: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  },
  logo: {
    alignSelf: "center",
    width: 70,
    height: 70,
    backgroundColor: "#8E2DE2",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  logoText: { fontSize: 32 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  icon: { marginLeft: 10 },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#8E2DE2",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#8E2DE2",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  loginText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  signupContainer: { marginTop: 25, alignItems: "center" },
  signupText: { color: "#777" },
  signupLink: { color: "#8E2DE2", fontWeight: "700" },
});

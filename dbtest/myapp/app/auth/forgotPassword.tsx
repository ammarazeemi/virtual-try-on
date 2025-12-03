import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import API from "../../config/apiConfig";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotResetFlow() {
  const [step, setStep] = useState<"email" | "otp">("email"); 
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  // Send OTP to email
  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Enter your email");
      return;
    }

    try {
      // const res = await fetch("http://192.168.10.17:8000/forgot-password", {
      const res = await fetch(API.SEND_FORGOT_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Failed");

      Alert.alert("Success", "OTP sent to your email");
      setStep("otp");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  // Reset password using OTP
  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      Alert.alert("Error", "Enter OTP and new password");
      return;
    }

    try {
      // const res = await fetch("http://192.168.10.17:8000/reset-password", {
      const res = await fetch(API.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Failed");

      Alert.alert("Success", "Password reset successful ");
      setEmail("");
      setCode("");
      setNewPassword("");
      setStep("email");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      {step === "email" ? (
        <>
          <Text style={styles.title}>Forgot Password </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.button} onPress={handleSendCode}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Enter OTP & Reset </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
          />

          {/* Password Input with Eye Icon */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
              placeholder="New Password"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    paddingRight: 10,
  },
  eyeButton: {
    padding: 8,
  },
  button: {
    backgroundColor: "#8E2DE2",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

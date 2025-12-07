import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import API from "../../config/apiConfig";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ⚡ Use your local IPv4 (from ipconfig)
  // const API_URL = "http://192.168.10.17:8000";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // const response = await fetch(`${API_URL}/login`, {
      const response = await fetch(API.LOGIN, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        Alert.alert("Login Failed", data?.detail || "Invalid credentials");
        return;
      }
      // ✅ Expect backend to return: { user_id, name, first_login }
      const { user_id, name } = data;

      Alert.alert("Success", `Welcome back, ${name}!`);

      // ✅ Save user_id globally (persistent storage)
      await AsyncStorage.setItem("userId", String(user_id));

      if (data.first_login) {
        router.replace("/home");
      } else {
        router.replace("/home");
      }
      // if (first_login) {
      //   // 🚀 Navigate to avatar upload screen
      //   router.replace({
      //     pathname: "/UploadAvatarScreen",
      //     params: { userId: user_id },

      //   });
      // } else {
      //   // 🚀 Normal flow (already has avatar)
      //   // router.replace("/(tabs)/PhotoSourcePage");
      //   // yaha avatar wala page banay k bd mjha path dalna ha 
      // }
    } catch (error) {
      console.error("Network Error:", error);
      Alert.alert("Network Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };
  //     Alert.alert("Success", `Welcome back, ${data.name}!`);
  //     // router.replace("/(tabs)/PhotoSourcePage");
  //   } catch (error) {
  //     console.error("Network Error:", error);
  //     Alert.alert("Network Error", "Could not connect to server");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              <MotiView
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 700 }}
                style={styles.card}
              >
                {/* Logo */}
                <MotiView
                  from={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 200 }}
                  style={styles.logo}
                >
                  <Text style={styles.logoText}>🧥</Text>
                </MotiView>

                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#999"
                    style={styles.icon}
                  />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>

                {/* Password Input with Eye Toggle */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#999"
                    style={styles.icon}
                  />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ padding: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.loginButton, loading && { opacity: 0.6 }]}
                  onPress={handleLogin}
                  disabled={loading}>
                  <Text style={styles.loginText}>
                    {loading ? "Logging in..." : "Login"}
                  </Text>
                </TouchableOpacity>

                {/* Forgot Password */}
                <View style={{ alignItems: "center", marginVertical: 10 }}>
                  <Text
                    style={{ color: "#8E2DE2", fontWeight: "600" }}
                    onPress={() => router.push("/auth/forgotPassword")}
                  >
                    Forgot Password?
                  </Text>
                </View>

                {/* Sign Up */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>
                    Don’t have an account?{" "}
                    <Text
                      style={styles.signupLink}
                      onPress={() => router.push("/auth/register")}
                    >
                      Sign up
                    </Text>
                  </Text>
                </View>
              </MotiView>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
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
  },
  icon: { marginLeft: 10 },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
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

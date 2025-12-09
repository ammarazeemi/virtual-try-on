import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import API from "../../config/apiConfig";

// Define the IP address once to make it easier to change
//const API_URL = "http://192.168.0.136:8000"; 

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    // --- Validation Logic ---
    const validateInputs = () => {
        if (!email.trim() || !code.trim() || !newPassword.trim()) {
            Alert.alert("Input Required", "Please fill in all fields to reset your password.");
            return false;
        }
        if (newPassword.length < 8) {
            Alert.alert("Security Alert", "New password must be at least 8 characters long.");
            return false;
        }
        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return false;
        }
        return true;
    };
    // -----------------------

    const handleReset = async () => {
        if (!validateInputs()) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${API.RESET_PASSWORD}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), code: code.trim(), new_password: newPassword.trim() }),
            });
            
            const data = await res.json();

            if (res.status === 404) {
                 // Handle specific 404 case, e.g., if the user endpoint is missing
                throw new Error("Reset service temporarily unavailable.");
            }
            if (!res.ok) {
                // Use a more descriptive error from the backend if available
                throw new Error(data.detail || data.message || "Password reset failed. Check your code or try again.");
            }
            
            Alert.alert("Success 🎉", data.message || "Your password has been reset successfully!");
            // ⭐ TODO: Navigate user to the login screen upon success
            // router.replace('login'); 

        } catch (err: any) { 
            console.error("Reset Error:", err);
            Alert.alert("Error", err.message); 
        } finally { 
            setIsLoading(false); 
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter the email you registered with and the code you received.</Text>

            {/* Email Input */}
            <TextInput 
                style={styles.input} 
                placeholder="Email Address" 
                placeholderTextColor="#999"
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            {/* Code Input (often sent via email/SMS) */}
            <TextInput 
                style={styles.input} 
                placeholder="Verification Code" 
                placeholderTextColor="#999"
                value={code} 
                onChangeText={setCode}
                keyboardType="numeric"
            />

            {/* New Password Input with Toggle */}
            <View style={styles.passwordInputContainer}>
                <TextInput 
                    style={styles.passwordInput} 
                    placeholder="New Password (min 8 chars)" 
                    placeholderTextColor="#999"
                    secureTextEntry={!passwordVisible} 
                    value={newPassword} 
                    onChangeText={setNewPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity 
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    style={styles.eyeButton}
                >
                    <Ionicons 
                        name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color="#8E2DE2" 
                    />
                </TouchableOpacity>
            </View>

            {/* Reset Button */}
            <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleReset} 
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Reset Password</Text>
                )}
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        paddingHorizontal: 30, // Increased padding
        backgroundColor: "#f5f5f5" // Lighter background 
    },
    title: { 
        fontSize: 28, // Larger title
        fontWeight: "bold", 
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: { 
        width: "100%", 
        borderWidth: 1, 
        borderColor: "#ddd", // Lighter border
        borderRadius: 10, 
        padding: 15, // Increased padding
        marginBottom: 15, // Reduced margin
        backgroundColor: '#fff',
        fontSize: 16,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        borderWidth: 1, 
        borderColor: "#ddd",
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16,
    },
    eyeButton: {
        padding: 10,
    },
    button: { 
        backgroundColor: "#8E2DE2", 
        padding: 18, // Larger touch area
        borderRadius: 10, 
        width: "100%", 
        alignItems: "center",
        elevation: 3, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    buttonDisabled: {
        backgroundColor: '#A98BDC', // Faded color when disabled
    },
    buttonText: { 
        color: "#fff", 
        fontWeight: "700", // Bolder text
        fontSize: 16,
    },
});
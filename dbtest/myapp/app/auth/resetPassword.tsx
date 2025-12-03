    // import React, { useState } from "react";
    // import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

    // export default function ResetPassword() {
    // const [email, setEmail] = useState("");
    // const [code, setCode] = useState("");
    // const [newPassword, setNewPassword] = useState("");

    // const handleReset = async () => {
    //     if (!email || !code || !newPassword) {
    //     Alert.alert("Error", "Fill all fields"); return;
    //     }
    //     try {
    //     const res = await fetch("http://192.168.0.136:8000/reset-password", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ email, code, new_password: newPassword }),
    //     });
    //     const data = await res.json();
    //     if (!res.ok) throw new Error(data.detail || data.message || "Failed");
    //     Alert.alert("Success", data.message);
    //     } catch (err: any) { Alert.alert("Error", err.message); }
    // };

    // return (
    //     <View style={styles.container}>
    //     <Text style={styles.title}>Reset Password 🔒</Text>
    //     <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address"/>
    //     <TextInput style={styles.input} placeholder="Enter code" value={code} onChangeText={setCode}/>
    //     <TextInput style={styles.input} placeholder="New Password" secureTextEntry value={newPassword} onChangeText={setNewPassword}/>
    //     <TouchableOpacity style={styles.button} onPress={handleReset}>
    //         <Text style={styles.buttonText}>Reset Password</Text>
    //     </TouchableOpacity>
    //     </View>
    // );
    // }

    // const styles = StyleSheet.create({
    // container: { flex:1, justifyContent:"center", alignItems:"center", padding:20, backgroundColor:"#fff" },
    // title: { fontSize:22, fontWeight:"bold", marginBottom:20 },
    // input: { width:"100%", borderWidth:1, borderColor:"#ccc", borderRadius:10, padding:12, marginBottom:20 },
    // button: { backgroundColor:"#8E2DE2", padding:15, borderRadius:10, width:"100%", alignItems:"center" },
    // buttonText: { color:"#fff", fontWeight:"bold" },
    // });

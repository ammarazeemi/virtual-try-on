









// import { LinearGradient } from "expo-linear-gradient";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from "react-native";
// import API from "../../config/apiConfig";

// type Params = {
//   userId: string;
//   localImageUri: string;    // preview from device
//   serverImagePath: string;  // path returned by /upload (relative)
// };

// export default function AvatarProcessingScreen() {
//   const router = useRouter();
//   const { userId, localImageUri, serverImagePath } = useLocalSearchParams<Params>();
//   const [loading, setLoading] = useState(true);
//   const [progressText, setProgressText] = useState("Uploading and converting your avatar...");

//   useEffect(() => {
//     const process = async () => {
//       try {
//         // send formdata with user_id and image_path (server path returned from upload)
//         const formData = new FormData();
//         formData.append("user_id", userId);
//         formData.append("image_path", serverImagePath);

//         const res = await fetch(API.GENERATE_AVATAR, { method: "POST", body: formData });
//         if (!res.ok) {
//           const txt = await res.text();
//           throw new Error(txt || "Generate failed");
//         }

//         const data = await res.json();
//         const { avatar_path } = data; // relative path like uploads/avatars/xxx.png

//         // Navigate to result screen; frontend display URL is built from API base + avatar_path
//         router.replace({
//           pathname: "/auth/avatarResultScreen",
//           params: { userId, avatarPath: avatar_path },
//         });
//       } catch (err: any) {
//         console.error("Processing error:", err);
//         Alert.alert("Processing Error", err.message || "Failed to process avatar. Try again.");
//         // send user back to upload screen
//         router.replace({ pathname: "/auth/uploadAvatarScreen", params: { userId } });
//       } finally {
//         setLoading(false);
//       }
//     };

//     // small delay for UX
//     const t = setTimeout(process, 800);
//     return () => clearTimeout(t);
//   }, []);

//   return (
//     <LinearGradient colors={["#2a4786ff", "#192f6a"]} style={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Generating Your Avatar</Text>

//         {localImageUri ? <Image source={{ uri: localImageUri }} style={styles.previewImage} /> : null}

//         {loading ? (
//           <>
//             <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 20 }} />
//             <Text style={styles.progressText}>{progressText}</Text>
//           </>
//         ) : (
//           <Text style={styles.progressText}>Done</Text>
//         )}
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   card: { backgroundColor: "#1e3a8a", borderRadius: 20, padding: 25, alignItems: "center", width: "85%" },
//   title: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 20 },
//   previewImage: { width: 200, height: 280, borderRadius: 12, marginBottom: 20 },
//   progressText: { color: "#fff", fontSize: 16, textAlign: "center" },
// });




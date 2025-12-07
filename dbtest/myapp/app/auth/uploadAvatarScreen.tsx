import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../../config/apiConfig";
import { types } from "util";

type Params = { userId: string };

export default function UploadAvatarScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<Params>();
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const showUploadRules = () => {
    Alert.alert(
      "Image Guidelines",
      "Upload a clear full-body image with a plain background.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: chooseImageOption },
      ]
    );
  };

  const chooseImageOption = () => {
    Alert.alert("Select Image Source", "Choose upload method:", [
      {
        text: "Camera",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({ quality: 1 });
          if (!result.canceled) setImage(result.assets[0].uri);
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
          if (!result.canceled) setImage(result.assets[0].uri);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleUpload = async () => {
    if (!image) return Alert.alert("Error", "Please select an image first.");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", {
        uri: image,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);

      console.log("Uploading to:", API.GENERATE_AVATAR);
      const res = await fetch(API.GENERATE_AVATAR, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Upload response:", data);

      if (!res.ok) {
        const errorMessage = typeof data.detail === 'object'
          ? JSON.stringify(data.detail)
          : (data.detail || "Generate failed");
        throw new Error(errorMessage);
      }

      router.push({
        pathname: "/auth/avatarResultScreen",
        params: {
          userId,
          avatarPath: data.avatar_path,
        },
      });
    } catch (err: any) {
      console.error("Upload Error:", err);
      Alert.alert("Error", err.message || JSON.stringify(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#8000FF", "#FF0080", "#0080FF"]} // fully opaque, no black transparency
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Upload Your Full-Body Photo</Text>

        {image ? (
          <Image source={{ uri: image }} style={styles.fullImage} />
        ) : (
          <Ionicons
            name="image-outline"
            size={120}
            color="#fff"
            style={{ marginBottom: 20 }}
          />
        )}

        <TouchableOpacity style={styles.selectButton} onPress={showUploadRules}>
          <Text style={styles.buttonText}>
            {image ? "Change Image" : "Select Image"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.generateButton, uploading && { opacity: 0.6 }]}
          disabled={uploading}
          onPress={handleUpload}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Avatar</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // remove any black base
  },
  card: {
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.2)", // translucent white overlay for glow
    elevation: 0, // no black shadow
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  fullImage: {
    width: 250,
    height: 350,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 20,
  },
  selectButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: "80%",
    alignItems: "center",
    marginBottom: 12,
  },
  generateButton: {
    backgroundColor: "#22c55e",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});



// // // ########################

// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
// import { LinearGradient } from "expo-linear-gradient";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import API from "../../config/apiConfig";

// type Params = { userId: string };

// export default function UploadAvatarScreen() {
//   const router = useRouter();
//   const { userId } = useLocalSearchParams<Params>();
//   const [image, setImage] = useState<string | null>(null); // local client URI
//   const [uploading, setUploading] = useState(false);

//   const showUploadRules = () => {
//     Alert.alert(
//       "Image Guidelines",
//       "Please upload a clear full-body photo with a plain background.\nAvoid blurry or dark images.",
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Continue", onPress: chooseImageOption },
//       ]
//     );
//   };

//   const chooseImageOption = () => {
//     Alert.alert("Select Image Source", "Choose how you want to upload:", [
//       {
//         text: "Camera",
//         onPress: async () => {
//           const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 1 });
//           if (!result.canceled) setImage(result.assets[0].uri);
//         },
//       },
//       {
//         text: "Gallery",
//         onPress: async () => {
//           const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: false, quality: 1 });
//           if (!result.canceled) setImage(result.assets[0].uri);
//         },
//       },
//       { text: "Cancel", style: "cancel" },
//     ]);
//   };

//   const handleUpload = async () => {
//     if (!image) {
//       Alert.alert("Error", "Please select an image first.");
//       return;
//     }

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("user_id", userId);
//       formData.append("file", {
//         uri: image,
//         name: "upload.jpg",
//         type: "image/jpeg",
//       } as any);

//       const res = await fetch(API.UPLOAD_AVATAR, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "Upload failed");
//       }

//       const data = await res.json();
//       // data.temp_image_path => server relative path e.g. uploads/user_images/xxx.jpg
//       const { temp_image_path } = data;

//       // navigate to processing screen passing:
//       // - userId
//       // - local client image URI (for preview)
//       // - server temp image path (for generate request)
//       router.replace({
//         pathname: "/auth/avatarProcessingScreen",
//         params: {
//           userId,
//           localImageUri: image,
//           serverImagePath: temp_image_path,
//         },
//       });
//     } catch (err: any) {
//       console.error("Upload Error:", err);
//       Alert.alert("Upload Error", err.message || "Failed to upload");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} style={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Upload Your Full-Body Photo</Text>

//         {image ? (
//           <Image source={{ uri: image }} style={styles.fullImage} />
//         ) : (
//           <Ionicons name="image-outline" size={120} color="#9ca3af" style={{ marginBottom: 20 }} />
//         )}

//         <TouchableOpacity style={styles.selectButton} onPress={showUploadRules}>
//           <Text style={styles.buttonText}>{image ? "Change Image" : "Select Image"}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.generateButton, uploading && { opacity: 0.6 }]} onPress={handleUpload} disabled={uploading}>
//           {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Generate Avatar</Text>}
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   card: { backgroundColor: "#fff", borderRadius: 20, padding: 25, alignItems: "center", width: "85%", elevation: 6 },
//   title: { fontSize: 22, fontWeight: "700", marginBottom: 20, color: "#1f2937", textAlign: "center" },
//   fullImage: { width: 250, height: 350, resizeMode: "cover", borderRadius: 12, marginBottom: 20 },
//   selectButton: { backgroundColor: "#3b82f6", borderRadius: 25, paddingVertical: 12, paddingHorizontal: 30, width: "80%", alignItems: "center", marginBottom: 12 },
//   generateButton: { backgroundColor: "#22c55e", borderRadius: 25, paddingVertical: 12, paddingHorizontal: 30, width: "80%", alignItems: "center" },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
// });


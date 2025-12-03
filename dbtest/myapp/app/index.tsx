import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect } from "react";
// react k hook sy side useeffect perform krta hyee or raect component k under
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Easing } from "react-native-reanimated";

export default function WelcomePage() {
  const router = useRouter();

  //Loader ke baad login page par le jane wala effect
  useEffect(() => {
    const timer = setTimeout(() => {
     router.push("/auth/login");
 // navigate to login screen
    }, 4000); // 4 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require("./assets/images/welcome-bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
      blurRadius={1}
    >
      {/* Gradient Overlay */}
      <LinearGradient
        colors={[
          "rgba(128,0,255,0.6)",
          "rgba(255,0,128,0.6)",
          "rgba(0,128,255,0.6)",
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* Center Content */}
      <View style={styles.center}>
        {/* Animated Logo Box */}
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "timing",
            duration: 1000,
            easing: Easing.out(Easing.exp),
          }}
          style={styles.logoContainer}
        >
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>🧥</Text>
          </View>

        </MotiView>
    
        {/* Rotating Loader */}
        <View style={styles.loaderContainer}>
          <MotiView
            from={{ rotate: "0deg" }}
            animate={{ rotate: "360deg" }}
            transition={{
              loop: true,
              type: "timing",
              duration: 1500,
              easing: Easing.linear,
            }}
            style={styles.outerRing}
          />
          <MotiView
            from={{ rotate: "360deg" }}
            animate={{ rotate: "0deg" }}
            transition={{
              loop: true,
              type: "timing",
              duration: 2000,
              easing: Easing.linear,
            }}
            style={styles.innerRing}
          />
          <View style={styles.centerDot} />
        </View>

        <Text style={styles.loadingText}>Loading your virtual wardrobe...</Text>
      </View>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width,
    height,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // --- LOGO BOX STYLING ---
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBox: {
    backgroundColor: "#8d2de2ad", // translucent box
    borderRadius: 30,
    padding: 5,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#fff",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
  logoText: {
    fontSize: 75, // 👕 size
    textAlign: "center",
  },

  // --- LOADER STYLING ---
  loaderContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  outerRing: {
    position: "absolute",
    width: 80,
    height: 80,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: 40,
  },
  innerRing: {
    position: "absolute",
    width: 60,
    height: 60,
    borderWidth: 4,
    borderColor: "transparent",
    borderBottomColor: "#9D7AF2",
    borderLeftColor: "#F29DD3",
    borderRadius: 30,
  },
  centerDot: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  loadingText: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 20,
    fontSize: 16,
  },

});

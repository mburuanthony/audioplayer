import "expo-dev-client";
import { useEffect, useCallback, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { SearchBar } from "./components/SearchBar";
import { AudioList } from "./components/AudioList";
import { BottomPlayer } from "./components/BottomPlayer";
import { AudioProvider, useAudioContext } from "./context/AudioProvider";
import { Feather } from "@expo/vector-icons";
import { colors } from "./assets/style/colors";

function App() {
  const [fontsLoaded] = useFonts({
    "mukta-regular": require("./assets/font/Mukta-Regular.ttf"),
    "mukta-medium": require("./assets/font/Mukta-Medium.ttf"),
    "mukta-bold": require("./assets/font/Mukta-Bold.ttf"),
  });
  const { selectedAudio } = useAudioContext();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();

    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const hideSearchBar = () => setShowSearch(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView onLayout={onLayoutRootView} style={[styles.container]}>
        <StatusBar translucent style="auto" />
        {showSearch && (
          <SearchBar
            showSearch={showSearch}
            hideSearchBarFunc={hideSearchBar}
          />
        )}

        <View style={[styles.topView, { opacity: showSearch ? 0 : 1 }]}>
          <Text style={[styles.text]}>AudioPlayer</Text>
          <Pressable
            style={{ position: "absolute", right: 14 }}
            onPress={() => setShowSearch(true)}
          >
            <Feather name="search" size={20} color={colors.white} />
          </Pressable>
        </View>
        <AudioList />
        {selectedAudio.URI && <BottomPlayer />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function AppProvider() {
  return (
    <AudioProvider>
      <App />
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(15, 14, 14, 0.9)",
  },
  topView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 40,
    paddingBottom: 10,
  },
  text: {
    fontSize: 20,
    fontFamily: "mukta-bold",
    textAlign: "center",
    textTransform: "capitalize",
    color: colors.white,
  },
});

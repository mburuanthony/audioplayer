import "expo-dev-client";
import { useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AudioList } from "./components/AudioList";
import { BottomPlayer } from "./components/BottomPlayer";
import { SearchUi } from "./components/SearchUi";
import { AudioProvider, useAudioContext } from "./context/AudioProvider";
import { SearchUiProvider, usesearchui } from "./context/searchctx";
import { SearchIcon } from "./assets/icons";
import { colors } from "./assets/style/colors";

function App() {
  const [fontsLoaded] = useFonts({
    "ops-regular": require("./assets/font/OpenSans-Regular.ttf"),
    "ops-light": require("./assets/font/OpenSans-Light.ttf"),
  });
  const { selectedAudio } = useAudioContext();
  const { searchUisVisible, showsearchUi } = usesearchui();

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

  return (
    <SafeAreaProvider>
      <SafeAreaView onLayout={onLayoutRootView} style={[styles.container]}>
        <StatusBar translucent style="light" />

        <View style={styles.topView}>
          <Text style={[styles.text]}>AudioPlayer</Text>
          <TouchableOpacity
            style={{
              width: 24,
              height: 24,
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              right: 8,
            }}
            onPress={() => showsearchUi()}
          >
            <SearchIcon />
          </TouchableOpacity>
        </View>
        <AudioList />
        {selectedAudio.URI !== "" && <BottomPlayer />}
        {searchUisVisible && <SearchUi />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function AppProvider() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AudioProvider>
        <SearchUiProvider>
          <App />
        </SearchUiProvider>
      </AudioProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.primary,
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
    fontSize: 18,
    fontFamily: "ops-regular",
    textAlign: "center",
    color: colors.textfaint,
  },
});

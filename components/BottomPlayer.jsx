import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAudioContext } from "../context/AudioProvider";
import { Audio } from "expo-av";
import { colors } from "../assets/style/colors";

export const BottomPlayer = () => {
  const { audioFiles, selectedAudio, setSelecedAudio } = useAudioContext();
  const [Sound, setSound] = useState();
  const [currIndex, setCurrIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playPauseAudio = async () => {
    const { sound } = await Audio.Sound.createAsync({
      uri: selectedAudio.URI,
    });
    setSound(sound);

    await sound.playAsync();
    setIsPlaying(true);
  };

  const playNext = () => {
    setSelecedAudio({
      title: audioFiles[currIndex]?.filename,
      URI: audioFiles[currIndex]?.uri,
    });

    setCurrIndex((prevIndex) => (prevIndex += 1));
    if (currIndex >= audioFiles.length - 1) setCurrIndex(0);
  };

  const playPrevious = () => {
    setSelecedAudio({
      title: audioFiles[currIndex]?.filename,
      URI: audioFiles[currIndex]?.uri,
    });

    if (currIndex <= 0) setCurrIndex(audioFiles.length);
    setCurrIndex((prevIndex) => (prevIndex -= 1));
  };

  useEffect(() => {
    playPauseAudio();
  }, [selectedAudio.URI]);

  useEffect(() => {
    return Sound
      ? () => {
          Sound.unloadAsync();
        }
      : undefined;
  }, [Sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedAudio.title.length >= 26
          ? `${selectedAudio.title.substring(0, 26)}...`
          : selectedAudio.title}
      </Text>

      <View style={styles.actions}>
        <Pressable onPress={playPrevious}>
          <MaterialCommunityIcons
            name="skip-previous-outline"
            size={28}
            color={colors.white}
          />
        </Pressable>

        {isPlaying === true ? (
          <Pressable
            style={styles.playPause}
            onPress={async () => {
              await Sound?.pauseAsync();
              setIsPlaying(false);
            }}
          >
            <AntDesign name="pause" size={30} color={colors.white} />
          </Pressable>
        ) : (
          <Pressable
            style={styles.playPause}
            onPress={async () => {
              await Sound?.playAsync();
              setIsPlaying(true);
            }}
          >
            <Feather name="play" size={30} color={colors.white} />
          </Pressable>
        )}

        <Pressable onPress={playNext}>
          <MaterialCommunityIcons
            name="skip-next-outline"
            size={28}
            color={colors.white}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    padding: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: "rgba(2,2,22,0.35)",
  },
  title: {
    marginLeft: 8,
    color: colors.white,
    fontFamily: "mukta-regular",
    fontSize: 18,
  },
  playPause: {
    marginHorizontal: 10,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    // marginRight: 4,
  },
});

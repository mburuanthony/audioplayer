import { Pressable, StyleSheet, Text } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { useAudioContext } from "../context/AudioProvider";
import { colors } from "../assets/style/colors";

export const Audio = ({ audioTitle, audioURI }) => {
  const { setSelecedAudio } = useAudioContext();

  return (
    <Pressable
      style={styles.container}
      onPress={() => setSelecedAudio({ title: audioTitle, URI: audioURI })}
    >
      <Text style={styles.titleText}>
        {audioTitle.length > 32
          ? `${String(audioTitle).substring(0, 32)}...`
          : audioTitle}
      </Text>

      <EvilIcons name="play" size={30} color={colors.white} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 54,
    padding: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.095)",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  titleText: {
    fontSize: 18,
    fontFamily: "mukta-medium",
    color: colors.white,
  },
});

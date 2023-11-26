import { Pressable, StyleSheet, Text } from "react-native";
import { useAudioContext } from "../context/AudioProvider";
import { PlayIcon } from "../assets/icons";
import { text } from "../assets/style/styles";
import { colors } from "../assets/style/colors";

export const Audio = ({ audioTitle, audioURI }) => {
  const { selectedAudio, updateSelectedAUdio } = useAudioContext();

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        updateSelectedAUdio({ filename: audioTitle, URI: audioURI })
      }
    >
      <Text
        style={[
          text,
          {
            color:
              selectedAudio.title === audioTitle
                ? colors.textdefault
                : colors.textfaint,
          },
        ]}
      >
        {audioTitle.length > 48
          ? `${String(audioTitle).substring(0, 48)}...`
          : audioTitle}
      </Text>

      <PlayIcon
        fillcolor={
          selectedAudio.title === audioTitle
            ? colors.textdefault
            : colors.textfaint
        }
      />
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
    marginBottom: 6,
    paddingHorizontal: 8,
    borderWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.dividerfaint,
    backgroundColor: "transparent",
  },
});

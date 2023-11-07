import { Pressable, StyleSheet, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useAudioContext } from "../context/AudioProvider";
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
          styles.titleText,
          {
            color:
              selectedAudio.title === audioTitle
                ? colors.textfaint
                : colors.textdefault,
          },
        ]}
      >
        {audioTitle.length > 32
          ? `${String(audioTitle).substring(0, 49)}...`
          : audioTitle}
      </Text>

      <Entypo
        name="controller-play"
        size={18}
        color={
          selectedAudio.title === audioTitle
            ? colors.textfaint
            : colors.textdefault
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
    marginBottom: 2,
    paddingHorizontal: 8,
    borderWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.divider,
    backgroundColor: "transparent",
  },
  titleText: {
    fontSize: 12,
    fontFamily: "ops-light",
  },
});

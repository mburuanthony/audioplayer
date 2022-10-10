import { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { colors } from "../assets/style/colors";
import { useAudioContext } from "../context/AudioProvider";

export const SearchBar = ({ showSearch, hideSearchBarFunc }) => {
  const { audioFiles, setAudioFiles, getAudioFiles } = useAudioContext();
  const [text, setTxt] = useState("");

  const filterAudio = () => {
    setAudioFiles(
      audioFiles.filter((audio) =>
        audio.filename.toLowerCase().includes(text.toLocaleLowerCase())
      )
    );
  };

  useEffect(() => {
    if (text !== "") filterAudio();
    else {
      getAudioFiles();
    }
  }, [text, showSearch]);

  return (
    <View style={styles.container}>
      <TextInput
        autoFocus
        placeholder="Search my music.."
        placeholderTextColor={colors.white}
        style={styles.textInput}
        value={text}
        onChangeText={(value) => setTxt(value)}
        onChange={() => filterAudio()}
      />
      <Pressable
        onPress={() => {
          setTxt("");
          hideSearchBarFunc();
          getAudioFiles();
        }}
      >
        <EvilIcons name="close" size={24} color={colors.white} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    width: "100%",
    padding: 8,
    backgroundColor: "transparent",
    zIndex: 2000,
  },
  textInput: {
    width: "90%",
    color: colors.white,
    fontFamily: "mukta-regular",
    fontSize: 16,
  },
});

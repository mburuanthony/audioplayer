import { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
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
    <>
      <View style={styles.container}>
        <TextInput
          autoFocus
          placeholder="Search my music.."
          placeholderTextColor={colors.textfaint}
          style={styles.textInput}
          value={text}
          onChangeText={(value) => setTxt(value)}
          onKeyPress={() => filterAudio()}
        />
        <Pressable
          onPress={() => {
            setTxt("");
            hideSearchBarFunc();
            getAudioFiles();
          }}
        >
          <EvilIcons name="close" size={18} color={colors.textfaint} />
        </Pressable>
      </View>
      <StatusBar backgroundColor={colors.alertbg} style="light" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 8,
    paddingBottom: 10,
    borderWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.divider,
    position: "absolute",
    top: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.alertbg,
    zIndex: 2000,
  },
  textInput: {
    width: "90%",
    color: colors.textdefault,
    fontSize: 12,
    fontFamily: "ops-light",
  },
});

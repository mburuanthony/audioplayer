import { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";

const audioContext = createContext({
  audioFiles: [],
  setAudioFiles: () => {},
  selectedAudio: {
    title: "",
    URI: "",
  },
  setSelecedAudio: () => {},
  getAudioFiles: () => {},
});

export const AudioProvider = ({ children }) => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedAudio, setSelecedAudio] = useState({ title: "", URI: "" });

  const getAudioFiles = async () => {
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
      sortBy: "creationTime",
    });
    setAudioFiles(media.assets);
  };

  const getPermission = async () => {
    const permission = await MediaLibrary.requestPermissionsAsync();

    if (permission.granted) {
      getAudioFiles();
    }

    if (permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();

      if (status === "denied" && canAskAgain)
        Alert.alert("Permission Required", "Media Access Denied", [
          {
            text: "Proceed",
          },
          {
            text: "Cancel",
            onPress: getPermission(),
          },
        ]);

      if (status === "denied" && !canAskAgain)
        Alert.alert("Permission Required", "Media Access Denied");

      if (status === "granted") {
        getAudioFiles();
      }
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  return (
    <audioContext.Provider
      value={{
        audioFiles,
        setAudioFiles,
        selectedAudio,
        setSelecedAudio,
        getAudioFiles: getAudioFiles,
      }}
    >
      {children}
    </audioContext.Provider>
  );
};

export const useAudioContext = () => useContext(audioContext);

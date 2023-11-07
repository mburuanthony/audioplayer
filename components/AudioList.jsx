import { FlatList, StyleSheet } from "react-native";
import { useAudioContext } from "../context/AudioProvider";
import { Audio } from "./Audio";

export const AudioList = () => {
  const { audioFiles, selectedAudio } = useAudioContext();

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical
      data={audioFiles}
      renderItem={(data) => (
        <Audio
          key={data.item.id + data.item.filename}
          audioTitle={data.item.filename}
          audioURI={data.item.uri}
        />
      )}
      style={[styles.container, { marginBottom: selectedAudio.URI ? 80 : 0 }]}
    />
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
});

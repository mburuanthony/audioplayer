import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, Dimensions } from "react-native";
import {
  Ionicons,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useAudioContext } from "../context/AudioProvider";
import { Audio } from "expo-av";
import { colors } from "../assets/style/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const BottomPlayer = () => {
  const { audioFiles, selectedAudio, updateSelectedAUdio } = useAudioContext();
  const [Sound, setSound] = useState();
  const [currpos, setcurrpos] = useState(0);
  const [progress, setprogress] = useState(0);
  const [isplaying, setisplaying] = useState(false);

  const playNext = () => {
    const currsongidx = audioFiles.findIndex(
      (audiofile) => audiofile?.filename === selectedAudio?.title
    );
    if (currsongidx == audioFiles.length - 1) {
      updateSelectedAUdio({
        filename: audioFiles[0]?.filename,
        URI: audioFiles[0]?.uri,
      });
    } else {
      const nextidx = currsongidx + 1;
      updateSelectedAUdio({
        filename: audioFiles[nextidx]?.filename,
        URI: audioFiles[nextidx]?.uri,
      });
    }
  };

  const playPrevious = () => {
    const currsongidx = audioFiles.findIndex(
      (audiofile) => audiofile?.filename === selectedAudio?.title
    );

    if (currsongidx == 0) {
      updateSelectedAUdio({
        filename: audioFiles[audioFiles.length - 1]?.filename,
        URI: audioFiles[audioFiles.length - 1]?.uri,
      });
    } else {
      const previdx = currsongidx - 1;

      updateSelectedAUdio({
        filename: audioFiles[previdx]?.filename,
        URI: audioFiles[previdx]?.uri,
      });
    }
  };

  const rewind30 = () => {
    Sound.setPositionAsync(currpos - 30 * 1000);
  };

  const forward30 = () => {
    Sound.setPositionAsync(currpos + 30 * 1000);
  };

  const AudioPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.isPlaying) {
      setisplaying(true);
      setcurrpos(playbackStatus.positionMillis);

      const progress =
        (playbackStatus?.positionMillis / playbackStatus?.durationMillis) * 100;

      setprogress(progress);
    } else {
      setisplaying(false);
    }

    if (playbackStatus.didJustFinish) {
      setisplaying(false);
      setcurrpos(0);
      playNext();
    }
  };

  const playaudio = async () => {
    if (currpos !== 0 && Sound._loaded) {
      Sound.playFromPositionAsync(currpos);
    } else {
      const { sound } = await Audio.Sound.createAsync(
        { uri: selectedAudio.URI },
        { shouldPlay: true, isLooping: false }
      );

      if (sound._loaded) {
        setSound(sound);
        sound.setOnPlaybackStatusUpdate(AudioPlaybackStatusUpdate);
        await sound.playAsync();
      }
    }
  };

  const pauseaudio = () => Sound.pauseAsync();

  useEffect(() => {
    return Sound
      ? () => {
          Sound.unloadAsync();
        }
      : undefined;
  }, [Sound, selectedAudio.URI]);

  useEffect(() => {
    playaudio();
  }, [selectedAudio.URI]);

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <Pressable onPress={playPrevious}>
          <Ionicons
            name="play-skip-back-outline"
            size={20}
            color={colors.textdefault}
          />
        </Pressable>

        <Pressable style={styles.rewndfrwdicns} onPress={rewind30}>
          <MaterialCommunityIcons
            name="rewind-30"
            size={18}
            color={colors.textdefault}
          />
        </Pressable>

        <Pressable
          style={styles.playPause}
          onPress={isplaying ? pauseaudio : playaudio}
        >
          {isplaying ? (
            <SimpleLineIcons
              name="control-pause"
              size={18}
              color={colors.textdefault}
            />
          ) : (
            <SimpleLineIcons
              name="control-play"
              size={18}
              color={colors.textdefault}
            />
          )}
        </Pressable>

        <Pressable style={styles.rewndfrwdicns} onPress={forward30}>
          <MaterialCommunityIcons
            name="fast-forward-30"
            size={18}
            color={colors.textdefault}
          />
        </Pressable>

        <Pressable onPress={playNext}>
          <Ionicons
            name="play-skip-forward-outline"
            size={20}
            color={colors.textdefault}
          />
        </Pressable>
      </View>

      <View
        style={[
          styles.progressbar,
          {
            width: `${progress}%`,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 64,
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 8,
    borderWidth: 0,
    borderTopWidth: 0.5,
    borderColor: colors.divider,
    backgroundColor: colors.alertbg,
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  playPause: {
    marginHorizontal: 18,
  },
  rewndfrwdicns: {
    marginHorizontal: 24,
  },
  progressbar: {
    height: 2,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: colors.divider,
  },
});

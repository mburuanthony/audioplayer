import { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Audio } from "expo-av";
import { useAudioContext } from "../context/AudioProvider";
import {
  PlayIcon,
  PauseIcon,
  NextIcon,
  PreviousIcon,
  FastForwardIcon,
  RewindIcon,
} from "../assets/icons";
import { colors } from "../assets/style/colors";
import { text } from "../assets/style/styles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const BottomPlayer = () => {
  const { audioFiles, selectedAudio, updateSelectedAUdio } = useAudioContext();
  const [Sound, setSound] = useState();
  const [currpos, setcurrpos] = useState(0);
  const [progress, setprogress] = useState(0);
  const [isplaying, setisplaying] = useState(false);
  const [currplaytime, setcurrplaytime] = useState("");
  const [totalplaytime, settotalplaytime] = useState("");

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

      const currentTime = Math.floor(playbackStatus?.positionMillis);
      const totalTime = Math.floor(playbackStatus?.durationMillis);

      const currTimeminutes = Math.floor(currentTime / 1000 / 60);
      const currentTimehours = Math.floor(currTimeminutes / 60);
      const currTimeseconds = Math.floor((currentTime / 1000) % 60);
      const currTimehoursFormatted =
        currentTimehours == 0
          ? ``
          : currentTimehours > 9
          ? `${currentTimehours}:`
          : `0${currentTimehours}:`;
      const currTimeminutesFormatted =
        currTimeminutes > 9 ? currTimeminutes : `0${currTimeminutes}`;
      const currTimesecondsFormatted =
        currTimeseconds > 9 ? currTimeseconds : `0${currTimeseconds}`;

      const totalTimeminutes = Math.floor(totalTime / 60 / 1000);
      const totalTimehours = Math.floor(totalTimeminutes / 60);
      const totalTimeseconds = Math.floor((totalTime / 1000) % 60);
      const totalTimehoursformatted =
        totalTimehours == 0
          ? ``
          : totalTimehours > 9
          ? `${totalTimehours}:`
          : `0${totalTimehours}:`;
      const totalTimeminutesFormatted =
        totalTimeminutes > 9 ? totalTimeminutes : `0${totalTimeminutes}`;
      const totalTimesecondsFormatted =
        totalTimeseconds > 9 ? totalTimeseconds : `0${totalTimeseconds}`;

      setprogress(progress);
      setcurrplaytime(
        `${currTimehoursFormatted}${currTimeminutesFormatted}:${currTimesecondsFormatted}`
      );
      settotalplaytime(
        `${totalTimehoursformatted}${totalTimeminutesFormatted}:${totalTimesecondsFormatted}`
      );
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
      <View style={{ marginBottom: 6 }}>
        <View style={styles.row}>
          <Text style={text}>
            {selectedAudio.URI.length > 26
              ? `${String(selectedAudio.title).substring(0, 24)}...`
              : selectedAudio.title}
          </Text>

          <Text style={text}>
            {currplaytime} / {totalplaytime}
          </Text>
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

      <View style={styles.actions}>
        <TouchableOpacity onPress={playPrevious}>
          <PreviousIcon />
        </TouchableOpacity>

        <TouchableOpacity style={styles.rewndfrwdicns} onPress={rewind30}>
          <RewindIcon />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPause}
          onPress={isplaying ? pauseaudio : playaudio}
        >
          {isplaying ? (
            <PauseIcon />
          ) : (
            <PlayIcon fillcolor={colors.textdefault} size={26} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.rewndfrwdicns} onPress={forward30}>
          <FastForwardIcon />
        </TouchableOpacity>

        <TouchableOpacity onPress={playNext}>
          <NextIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 80,
    position: "absolute",
    bottom: 0,
    padding: 8,
    borderWidth: 0,
    backgroundColor: colors.secondary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressbar: {
    height: 3,
    borderRadius: 4,
    backgroundColor: colors.dividerfaint,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  playPause: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

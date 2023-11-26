import { useEffect, useCallback, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  FlatList,
  View,
  TextInput,
  BackHandler,
  Keyboard,
} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Audio } from "./Audio";
import { useAudioContext } from "../context/AudioProvider";
import { usesearchui } from "../context/searchctx";
import { SearchIcon, CloseIcon } from "../assets/icons";
import { text } from "../assets/style/styles";
import { colors } from "../assets/style/colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT / 1.75;

export const SearchUi = () => {
  const context = useSharedValue({ y: 0 });
  const translateYSharedValue = useSharedValue(0);
  const { audioFiles } = useAudioContext();
  const { searchUisVisible, hidesearchUi } = usesearchui();

  const [searchvalue, setsearchvalue] = useState("");
  const [keyboradisvisible, setkeyboradisvisible] = useState(false);
  const [audiofromsearch, setaudiofromsearch] = useState([]);

  const filterAudio = () => {
    setaudiofromsearch(
      audioFiles.filter((audio) =>
        audio.filename.toLowerCase().includes(searchvalue.toLocaleLowerCase())
      )
    );
  };

  const scrollTo = useCallback((DESTINATION) => {
    "worklet";
    translateYSharedValue.value = withSpring(DESTINATION, { damping: 50 });
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateYSharedValue.value };
    })
    .onUpdate((event) => {
      translateYSharedValue.value = event.translationY + context.value.y;
      translateYSharedValue.value = Math.max(
        translateYSharedValue.value,
        MAX_TRANSLATE_Y
      );
    })
    .onEnd(() => {
      if (translateYSharedValue.value > -SCREEN_HEIGHT / 2.5) {
        scrollTo(SCREEN_HEIGHT / 1.5);

        runOnJS(hidesearchUi)();
      } else if (translateYSharedValue.value <= -SCREEN_HEIGHT / 3) {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rBtmSheetStye = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateYSharedValue.value }],
    };
  });

  const onPressBack = () => {
    scrollTo(0);
    hidesearchUi();
    return true;
  };

  useEffect(() => {
    if (searchUisVisible) {
      scrollTo(MAX_TRANSLATE_Y);
    } else {
      scrollTo(0);
    }
  }, [searchUisVisible]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", onPressBack);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onPressBack);
    };
  }, []);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => setkeyboradisvisible(true));

    Keyboard.addListener("keyboardDidHide", () => setkeyboradisvisible(false));
  }, []);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.searchctr, rBtmSheetStye]}>
        <View
          style={[
            styles.inputctr,
            {
              borderBottomColor: keyboradisvisible
                ? colors.dividerhighlight
                : colors.dividerfaint,
            },
          ]}
        >
          <TextInput
            placeholder="Search my audio..."
            placeholderTextColor={colors.textfaint}
            style={styles.input}
            value={searchvalue}
            onChangeText={(text) => setsearchvalue(text)}
            onKeyPress={filterAudio}
          />
          <SearchIcon />
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical
          data={audiofromsearch}
          renderItem={(data) => (
            <Audio
              key={data.item?.id + data.item?.filename}
              audioTitle={data.item?.filename}
              audioURI={data.item?.uri}
            />
          )}
          style={{ width: "100%" }}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  searchctr: {
    width: "100%",
    height: SCREEN_HEIGHT,
    position: "absolute",
    top: SCREEN_HEIGHT,
    bottom: 0,
    paddingVertical: 8,
    flex: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: colors.secondary,
    zIndex: 10000,
  },
  inputctr: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
  },
  input: {
    width: "88%",
    ...text,
  },
});

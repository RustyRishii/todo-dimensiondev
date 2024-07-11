import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Pressable,
  RefreshControl,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Animated from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { Colors } from "../utilities/colors";

const Home = ({ navigation }: { navigation: any }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [todoList, setTodoList] = useState<string[]>([]);
  const lastTap = useRef<Date | null>(null);

  const translateX = useSharedValue(200);
  const itemtranslateX = useSharedValue(-1000);
  const dustbinTranlateX = useSharedValue(200);
  //const bgTranslateX = useSharedValue(1000);

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 1000 });
    itemtranslateX.value = withTiming(0, { duration: 1000 });
    dustbinTranlateX.value = withTiming(0, { duration: 1000 });
    //bgTranslateX.value = withTiming(0, { duration: 1000 });
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const listAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: itemtranslateX.value }],
  }));

  const dustbinAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dustbinTranlateX.value }],
  }));

  function onRefresh() {
    translateX.value = 200;
    itemtranslateX.value = -500;
    dustbinTranlateX.value = 1000;
    setTimeout(() => {
      translateX.value = withTiming(0, { duration: 800 });
      itemtranslateX.value = withTiming(0, { duration: 800 });
      dustbinTranlateX.value = withTiming(0, { duration: 800 });
    }, 200);
  }

  const deleteTodo = (index: number) => {
    setTimeout(() => {
      setTodoList((prevTodoList) => prevTodoList.filter((_, i) => i !== index));
      itemtranslateX.value = withTiming(200, { duration: 1000 });
      ToastAndroid.show("Deleted", ToastAndroid.SHORT);
    }, 1000);
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const handleDoubleTap = () => {
      const now = Date.now();
      if (lastTap.current && now - lastTap.current.getTime() < 300) {
        navigation.navigate("AddTodo", {
          addTodo: setTodoList,
          todo: item,
          index,
        });
      } else {
        lastTap.current = new Date();
      }
    };

    return (
      <Animated.View style={[styles.item, listAnimatedStyle]}>
        <Pressable onPress={handleDoubleTap}>
          <Text
            style={{
              color: Colors.iconColor,
              fontSize: 20,
              flexWrap: "wrap",
              width: 325,
            }}
            selectable
          >
            {item}
          </Text>
        </Pressable>
        <Animated.View style={[dustbinAnimatedStyle]}>
          <Pressable onPress={() => deleteTodo(index)}>
            <Icon name="trash-bin" color={"red"} size={32} />
          </Pressable>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.statusbar} />
      <Animated.FlatList
        style={[styles.list]}
        data={todoList}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Animated.View style={[styles.fabContainer, animatedStyle]}>
        <Pressable
          onPress={() =>
            navigation.navigate("AddTodo", { addTodo: setTodoList })
          }
        >
          <Icon name="add-circle" color={Colors.iconColor} size={65} />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.pageBackgroundColor,
    height: "100%",
  },
  list: {
    backgroundColor: Colors.pageBackgroundColor,
    height: "100%",
  },
  item: {
    backgroundColor: Colors.statusbar,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
  },
  fabContainer: {
    position: "absolute",
    bottom: 20,
    right: 50,
    borderRadius: 50,
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },
});

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
import Icon from "react-native-vector-icons/Ionicons";
import Animated, { Easing } from "react-native-reanimated";
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "../utilities/colors";

const Home = ({ navigation }: { navigation: any }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [todoList, setTodoList] = useState<string[]>([]);
  const lastTap = useRef<Date | null>(null);
  const translateX = useSharedValue(200);
  const itemTranslateX = useSharedValue(-1000);
  const dustbinTranslateX = useSharedValue(200);

  useEffect(() => {
    translateX.value = withTiming(0, {
      duration: 600,
      easing: Easing.inOut(Easing.ease),
    });
    itemTranslateX.value = withTiming(0, {
      duration: 600,
      easing: Easing.inOut(Easing.ease),
    });
    dustbinTranslateX.value = withTiming(0, {
      duration: 600,
      easing: Easing.inOut(Easing.ease),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const listAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: itemTranslateX.value }],
  }));

  const dustbinAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dustbinTranslateX.value }],
  }));

  function onRefresh() {
    translateX.value = 200;
    itemTranslateX.value = -500;
    dustbinTranslateX.value = 1000;
    setTimeout(() => {
      translateX.value = withSpring(0, {
        damping: 15,
        stiffness: 90,
      });
      itemTranslateX.value = withSpring(0, {
        damping: 15,
        stiffness: 90,
      });
      dustbinTranslateX.value = withSpring(0, {
        damping: 15,
        stiffness: 90,
      });
    }, 200);
  }


  const deleteTodoLocal = (index: number) => {
    setTimeout(() => {
      setTodoList((prevTodoList) => prevTodoList.filter((_, i) => i !== index));
      itemTranslateX.value = withTiming(0, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      });
      ToastAndroid.show("Deleted", ToastAndroid.SHORT);
    }, 600);
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const updateNote = () => {
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
        <Pressable onPress={updateNote}>
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
          <Pressable onPress={() => deleteTodoLocal(index)}>
            <Icon name="trash-bin" color={"red"} size={32} />
          </Pressable>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.statusbar} />
      {todoList.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: Colors.iconColor }}>
            Please add using the floating action button.
          </Text>
        </View>
      ) : (
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
      )}

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

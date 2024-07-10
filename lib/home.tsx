import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Pressable,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Animated from "react-native-reanimated";
import { Icon } from "@rneui/base";

import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);

  const translateX = useSharedValue(200); // Initial position off-screen to the right

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 1000 }); // Animate to the final position
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="black" />
      <FlatList
        style={{
          backgroundColor: "#243447",
          height: "100%",
        }}
        scrollEnabled={true}
        removeClippedSubviews={false}
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => console.log("Refreshed")}
          />
        }
      />
      <Animated.View style={[styles.fabContainer, animatedStyle]}>
        <Pressable onPress={() => console.log("FAB pressed")}>
          <Icon name="add-circle" color={"#1D9BF0"} size={50} />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  fabContainer: {
    position: "absolute",
    bottom: 1,
    right: 10,
    borderRadius: 50,
    width: 75,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});

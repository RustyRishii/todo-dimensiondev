import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../utilities/colors";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const AddTodo = ({ navigation, route }: { navigation: any; route: any }) => {

  const [add, setAdd] = useState<string>(route.params?.todo || "");
  const index = route.params?.index;

  const addToList = () => {
    if (add.trim().length > 0) {
      const { addTodo } = route.params;
      if (index !== undefined) {
        addTodo((prev: string[]) =>
          prev.map((item, i) => (i === index ? add : item))
        );
      } else {
        addTodo((prev: string[]) => [...prev, add]);
      }
      setAdd("");
      ToastAndroid.show(
        index !== undefined ? "Updated" : "Added",
        ToastAndroid.SHORT
      );
      navigation.goBack();
    } else {
      ToastAndroid.show("Please enter a task", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="close-outline" size={30} color={"white"} />
          </Pressable>
          <Pressable onPress={addToList}>
            <Text style={styles.addButtonText}>
              {index !== undefined ? "Update" : "Add"}
            </Text>
          </Pressable>
        </View>
        <TextInput
          style={styles.input}
          autoFocus={true}
          cursorColor={Colors.cursorColor}
          selectionColor={Colors.selectionColor}
          value={add}
          onSubmitEditing={addToList}
          onChangeText={setAdd}
          placeholderTextColor={"grey"}
          placeholder="Add"
          scrollEnabled={true}
          multiline={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddTodo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageBackgroundColor,
    padding: 5,
  },
  content: {
    backgroundColor: Colors.pageBackgroundColor,
    height: "100%",
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  addButtonText: {
    color: "white",
    backgroundColor: "#5c4628",
    fontSize: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "aliceblue",
    //height: 50,
    borderRadius: 10,
    fontSize: 20,
    marginVertical: 10,
    padding: 10,
    color: "tomato",
    flexWrap: "wrap",
  },
});
function setTodoList(todos: any) {
  throw new Error("Function not implemented.");
}

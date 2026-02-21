import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

const BackButton = ({ onBackPress }) => {
  return (
    <TouchableOpacity onPress={onBackPress}>
      <View style={styles.backButton}>
        <Ionicons name="chevron-back-outline" color={"white"} size={20} />
        <Text style={{ color: "white" }}>Back</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButton: {
    borderWidth: 1,
    borderColor: Colors.dark.secondary,
    position: "absolute",
    bottom: 60,
    marginHorizontal: 15,
    paddingHorizontal: 25,
    paddingVertical: 9,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

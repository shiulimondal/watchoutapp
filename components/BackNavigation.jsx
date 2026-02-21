import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BackNavigation = ({ onBackPress }) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onBackPress}>
      <View style={styles.container}>
        <Ionicons name="chevron-back-outline" color={"white"} size={17} />
        <Text style={{ color: "white", fontSize: 17 }}>Back</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BackNavigation;

const styles = StyleSheet.create({
  container: {
    marginTop: 45,
    marginBottom: 20,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

import React from "react";
import { View } from "react-native";
import Colors from "../constants/Colors";

const Radio = ({ selected }) => {
  return (
    <View
      style={{
        height: 22,
        width: 22,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: selected ? Colors.dark.secondary : "gray",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selected && (
        <View
          style={{
            height: 10,
            width: 10,
            borderRadius: 6,
            backgroundColor: Colors.dark.secondary,
          }}
        />
      )}
    </View>
  );
};

export default Radio;

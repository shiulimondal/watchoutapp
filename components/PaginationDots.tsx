import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import Colors from "@/constants/Colors";

interface PaginationDotsProps {
  data: Array<any>;
  currentIndex: number;
}

const PaginationDots: React.FC<PaginationDotsProps> = ({
  data,
  currentIndex,
}) => {
  return (
    <View style={styles.container}>
      {data?.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              width: index === currentIndex ? 40 : 8,
              backgroundColor:
                index === currentIndex ? Colors.dark.secondary : "white",
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: Colors.dark.secondary,
    marginHorizontal: 5,
  },
});

export default PaginationDots;

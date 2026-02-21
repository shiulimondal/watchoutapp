import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
} from "react-native";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const Header = ({ scrollY, filterType, setCurrentFilterType }) => {
  const router = useRouter();
  const handleNavigate = () => {
    router.push("/Search");
  };

  const [filters, setFilter] = useState([
    { id: 1, title: "All", value: "all" },
    { id: 2, title: "Movies", value: "movie" },
    { id: 3, title: "Shows", value: "webseries" },
    { id: 4, title: "Comedy", value: "comedy" },
  ]);

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, height * 0.1],
    outputRange: [0.7, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.filterContainer,
        {
          backgroundColor: Colors.dark.primary100,
          opacity: headerBackgroundOpacity,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row", gap: 35 }}
      >
        {filters.map((filter) => {
          return (
            <TouchableOpacity
              key={filter.id}
              activeOpacity={1}
              onPress={() => setCurrentFilterType(filter.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      filterType === filter.value
                        ? Colors.dark.secondary
                        : "white",
                    fontWeight: filterType === filter.value ? "900" : "bold",
                  },
                ]}
              >
                {filter.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View>
        <TouchableOpacity onPress={handleNavigate}>
          <Feather name="search" size={25} color={"white"} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Header;

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    zIndex: 9999,
    width: width,
    padding: 15,
    paddingTop: "12%",
    alignItems: "center",
    gap: 20,
  },

  filterText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});

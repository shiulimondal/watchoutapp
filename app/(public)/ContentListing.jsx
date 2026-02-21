import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Colors from "../../constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const ContentListing = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  // const [contentList, setContentList] = useState([
  //   {
  //     id: 1,
  //     name: "Ami Soumitra",
  //     image: require("../../assets/amisoumitra.jpg"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 2,
  //     name: "Subarnabhumi",
  //     image: require("../../assets/series_2.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 3,
  //     name: "Borof",
  //     image: require("../../assets/banner.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 4,
  //     name: "Tritiyo Purush",
  //     image: require("../../assets/popular_3.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },
  //   {
  //     id: 5,
  //     name: "Ami Soumitra",
  //     image: require("../../assets/limited1.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 6,
  //     name: "Subarnabhumi",
  //     image: require("../../assets/limited2.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 7,
  //     name: "Borof",
  //     image: require("../../assets/limited3.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 8,
  //     name: "Tritiyo Purush",
  //     image: require("../../assets/top2.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },
  //   {
  //     id: 9,
  //     name: "Ami Soumitra",
  //     image: require("../../assets/top1.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 10,
  //     name: "Subarnabhumi",
  //     image: require("../../assets/banner.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },
  //   {
  //     id: 11,
  //     name: "Ami Soumitra",
  //     image: require("../../assets/amisoumitra.jpg"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 12,
  //     name: "Subarnabhumi",
  //     image: require("../../assets/series_2.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 13,
  //     name: "Borof",
  //     image: require("../../assets/banner.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 14,
  //     name: "Tritiyo Purush",
  //     image: require("../../assets/popular_3.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },
  //   {
  //     id: 15,
  //     name: "Ami Soumitra",
  //     image: require("../../assets/limited1.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 16,
  //     name: "Subarnabhumi",
  //     image: require("../../assets/limited2.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 17,
  //     name: "Borof",
  //     image: require("../../assets/limited3.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 18,
  //     name: "Tritiyo Purush",
  //     image: require("../../assets/top2.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },
  //   {
  //     id: 19,
  //     name: "Ami Soumitra",
  //     image: require("../../assets/top1.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },

  //   {
  //     id: 20,
  //     name: "Subarnabhumi",
  //     image: require("../../assets/banner.png"),
  //     duration: 5678,
  //     type: "Documantory",
  //     releaseYear: 2020,
  //   },
  // ]);

  const secondsToHoursMinutes = (seconds) => {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}hrs ${minutes}mins`;
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginVertical: 20,
          marginHorizontal: 10,
          paddingTop: 25,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" color={"white"} size={30} />
        </TouchableOpacity>
        <Text style={styles.topHeader}>{params?.type}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            marginHorizontal: 15,
          }}
        >
          {contentList.map((content) => {
            return (
              <TouchableOpacity activeOpacity={1} key={content.id}>
                <View style={styles.contentContainer}>
                  <ImageBackground
                    source={content.image}
                    style={styles.imageBackground}
                  >
                    <>
                      <LinearGradient
                        colors={["rgba(13, 22, 35, 1)", "rgba(13, 22, 35, 0)"]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={{
                          ...StyleSheet.absoluteFillObject,
                          borderRadius: 10,
                        }}
                      />
                      <View style={styles.assetView}>
                        <View>
                          <Text style={styles.assetText}>{content.name}</Text>
                          <Text style={{ color: "gray", fontSize: 10 }}>
                            {secondsToHoursMinutes(content.duration)}
                          </Text>
                        </View>
                      </View>
                    </>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default ContentListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.primary100,
  },

  topHeader: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },

  contentContainer: {
    width: (width * 28.5) / 100,
    aspectRatio: 0.7,
    borderRadius: 10,
    overflow: "hidden",
  },

  contentImage: {
    width: width - 280,
    height: 160,
    borderRadius: 10,
  },

  imageBackground: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },

  assetView: {
    position: "absolute",
    bottom: 0,
    padding: 10,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  assetText: { color: "white", fontSize: 12, fontWeight: "bold" },
});

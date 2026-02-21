import { logout } from "@/redux/features/AuthSlice";
import { writeData } from "@/util/Util";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

const ProfileComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [planInfo, setPlanInfo] = useState([
    { id: 1, title: "Plan", details: "Premium" },
    { id: 2, title: "Price", details: "Rs 499/-" },
    { id: 3, title: "Validity", details: "3 months" },
    { id: 4, title: "Valid till", details: "5th june, 2024" },
  ]);
  const signout = () => {
    dispatch(logout());
    router.push("/gettingstarted");
    writeData("has_user_started", false);
  };
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Image
        source={{
          uri: "https://cc-prod.scene7.com/is/image/CCProdAuthor/portrait-photography_P6b_379x392?$pjpeg$&jpegSize=100&wid=378",
        }}
        style={{ width: 100, height: 100, borderRadius: 100 }}
      />
      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
          John Doe
        </Text>
      </View>

      <View>
        <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
          Email : johndoe@gmail.com
        </Text>
      </View>

      <View style={style.infoBox}>
        <Text style={style.infoHeader}>Subscription details</Text>

        <View style={{ gap: 10, marginVertical: 15 }}>
          {planInfo.map((plan) => {
            return (
              <View key={plan.id} style={style.infoContainer}>
                <View style={style.infoContainerLeft}>
                  <Text style={style.textStyle}>{plan.title}</Text>
                </View>
                <View style={style.infoContainerRight}>
                  <Text style={[style.textStyle, { fontWeight: "bold" }]}>
                    {plan.details}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <TouchableOpacity onPress={signout}>
        <View style={style.logout}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Logout
          </Text>
        </View>
      </TouchableOpacity>
      
    </View>
  );
};

export default ProfileComponent;

const style = StyleSheet.create({
  logout: {
    backgroundColor: "red",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginVertical: 20,
  },

  infoBox: {
    padding: 15,
    borderWidth: 0.6,
    borderColor: "red",
    width: "100%",
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 25,
    // backgroundColor: "#31363F",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    marginVertical: 20,
  },

  infoHeader: {
    color: "white",
    fontWeight: "400",
    fontSize: 25,
    textAlign: "center",
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderBottomWidth: 0.5,
    // borderTopWidth: 0.6,
    borderColor: "white",
    paddingBottom: 15,
    borderStyle: "dashed",
  },

  infoContainerLeft: {
    width: "50%",
    alignItems: "center",
  },

  infoContainerRight: {
    width: "50%",
    alignItems: "center",
  },

  textStyle: {
    color: "white",
    fontSize: 16,
  },
});

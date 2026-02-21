import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getFileData } from "../../util/Util";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Radio from "../../components/Radio";
import { updateUserProfile } from "../../redux/features/UpdateProfileSlice";
import Toast from 'react-native-simple-toast';

const EditProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.login);
  const signupData = useSelector((state) => state.account.data);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);
  const [profileView, setProfileView] = useState(undefined);
  const [imageData, setImagedata] = useState(undefined);
  const [formErrors, setFormErrors] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState("male");
  const { data, loading } = useSelector((state) => state.userDetails);
  const { update_data, update_loading } = useSelector(
    (state) => state.updateProfile
  );
  const [isSUbmitted, setIsSUbmitted] = useState(false);
  const [image, setImage] = useState("");
  const [imageId, setImageId] = useState("");

  const [isCloudLoading, setIsCloudLoading] = useState(false);

  const CLOUDINARY_CLOUD_NAME = "dznwifcko";
  const CLOUDINARY_PRESET_NAME = "ml_default";

  useEffect(() => {
    if (update_data && update_data?.status && isSUbmitted) {
      Toast.show("Profile updated successfully!", Toast.LONG);
      // ToastAndroid.show("Profile updated succesfully!", ToastAndroid.BOTTOM);
      setIsSUbmitted(false);
      setImage("");
      setImageId("");
      router.back();
    } else if (!update_data?.status && isSUbmitted) {
      Toast.show("Server issues, try again!", Toast.LONG);
      // ToastAndroid.show("Server issues, try again!", ToastAndroid.BOTTOM);
      setIsSUbmitted(false);
    }
  }, [update_data]);

  useEffect(() => {
    if (data) {
      setName(data?.first_name);
      setEmail(data?.email);
      setPhone(data?.phone);
      setSelectedGender(data?.gender);
      setDate(data?.date_of_birth ? new Date(data?.date_of_birth) : new Date());
    }
  }, [data]);

  const validateData = () => {
    setFormErrors({});
    const errors = {};

    if (name == "") {
      errors.name = "Name is required";
    }

    if (phone == null) {
      errors.phone = "Phone number is required";
    } else if (phone.length < 10) {
      errors.phone = "Phone number can not be less than 10 digits";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }

    return true;
  };

  const onChangeName = (text) => {
    setName(text);
  };

  const onChangePhone = (value) => {
    setPhone(value);
  };

  const editProfile = () => {
    if (!validateData()) {
      return;
    }

    let payload = {
      data: {
        user_id: userData ? userData?.data?.user_id :  forMobileData ? forMobileData?.data?.user_id : signupData?.data?.user_id,
        name: name,
        phone: phone,
        profile_pic: image,
        profile_pic_id: imageId,
        date_of_birth: date,
        gender: selectedGender,
      },
      token: userData ? userData?.token :  forMobileData ? forMobileData?.token : signupData?.token,
    };

    dispatch(updateUserProfile(payload));

    setIsSUbmitted(true);
  };

  const handleBackPress = () => {
    router.back();
  };

  const browseGallery = async () => {
    setIsCloudLoading(true);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileView(result.assets[0].uri);
      setImagedata(getFileData(result.assets[0]));

      const formData = new FormData();
      formData.append("file", getFileData(result.assets[0]));
      formData.append("upload_preset", CLOUDINARY_PRESET_NAME);

      let apiUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

      try {
        const imageUploadResponse = await fetch(apiUrl, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        });

        let data = await imageUploadResponse.json();
        setImage(data.secure_url);
        setImageId(data.public_id);
      } catch (err) {
        Toast.show("Image upload failed, please try again.", Toast.LONG);
        // ToastAndroid.show(
        //   "Image upload failed, please try again.",
        //   ToastAndroid.BOTTOM
        // );
      } finally {
        setIsCloudLoading(false);
      }
    } else {
      setIsCloudLoading(false);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  return (
    <ScrollView style={style.container}>
      <TouchableOpacity style={style.backHandler} onPress={handleBackPress}>
        <Ionicons name="arrow-back-outline" color={"white"} size={22} />
        {/* <Text style={{ color: "white", fontSize: 17 }}>Back</Text> */}
      </TouchableOpacity>
      <View style={style.profileDetailsContainer}>
        <View style={style.profileImageContainer}>
          <Image
            source={
              profileView
                ? {
                    uri: profileView,
                  }
                : data?.profile_pic
                ? { uri: data?.profile_pic }
                : require("../../assets/user.png")
            }
            style={style.profileImage}
          />
          <TouchableOpacity
            style={style.editIconContainer}
            onPress={browseGallery}
          >
            <MaterialCommunityIcons name="pencil" color={"white"} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <TextInput
          style={[
            style.input,
            {
              borderColor: formErrors?.name ? "red" : Colors.dark.inputBorder,
            },
          ]}
          placeholder="Enter Your Name"
          placeholderTextColor={"gray"}
          onChangeText={onChangeName}
          onFocus={() => setFormErrors({})}
          value={name}
        />

        {formErrors.name && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: "red" }}>{formErrors.name}</Text>
          </View>
        )}

        <TextInput
          editable={false}
          style={[
            style.input,
            { borderColor: email ? "gray" : Colors.dark.secondary },
          ]}
          placeholder="Enter Your Email"
          placeholderTextColor={"gray"}
          onFocus={() => setFormErrors({})}
          value={email}
        />

        {/* {formErrors.email && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: "red" }}>{formErrors.email}</Text>
            </View>
          )} */}

        <TextInput
          keyboardType="number-pad"
          maxLength={10}
          style={[
            style.input,
            {
              borderColor: formErrors?.phone ? "red" : Colors.dark.inputBorder,
            },
          ]}
          placeholder="Enter Your Phone Number"
          placeholderTextColor={"gray"}
          onChangeText={onChangePhone}
          onFocus={() => setFormErrors({})}
          value={phone}
        />

        {formErrors.phone && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: "red" }}>{formErrors.phone}</Text>
          </View>
        )}

        <View
          style={{
            marginTop: 30,
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 5,
          }}
        >
          <Text style={{ color: "white", fontSize: 15 }}>Gender</Text>

          <View style={{ flexDirection: "row", gap: 15 }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
              onPress={() => handleGenderSelect("male")}
            >
              <View style={{ marginRight: 10 }}>
                <Radio selected={selectedGender === "male"} />
              </View>
              <Text
                style={{
                  color: selectedGender === "male" ? "white" : "gray",
                  fontSize: 15,
                }}
              >
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
              onPress={() => handleGenderSelect("female")}
            >
              <View style={{ marginRight: 10 }}>
                <Radio selected={selectedGender === "female"} />
              </View>
              <Text
                style={{
                  color: selectedGender === "female" ? "white" : "gray",
                  fontSize: 15,
                }}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity activeOpacity={1} onPress={showDatepicker}>
          <View style={[style.input, { justifyContent: "center" }]}>
            <Text style={{ color: "gray", fontSize: 15 }}>
            {date ? moment(date).format("DD / MM / YYYY") : "DD / MM / YYYY"}
            </Text>
          </View>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      <TouchableOpacity
        disabled={update_loading || isCloudLoading}
        onPress={editProfile}
      >
        <View
          style={[
            style.editButton,
            {
              backgroundColor:
                update_loading || isCloudLoading
                  ? "gray"
                  : Colors.dark.secondary,
            },
          ]}
        >
          {update_loading || isCloudLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white", fontSize: 17 }}>Update</Text>
          )}
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.dark.primary100,
  },

  backHandler: {
    marginVertical: 30,
    flexDirection: "row",
    alignItems: "center",
  },

  profileDetailsContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  profileImageContainer: {
    position: "relative",
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: Colors.dark.secondary,
  },

  editIconContainer: {
    position: "absolute",
    top: -5,
    right: 5,
    backgroundColor: Colors.dark.secondary,
    borderRadius: 50,
    padding: 6,
    borderWidth: 5,
    borderColor: Colors.dark.primary100,
  },

  editButton: {
    backgroundColor: Colors.dark.secondary,
    paddingVertical: 17,
    borderRadius: 10,
    marginVertical: 30,
    alignItems: "center",
  },

  editText: {
    color: "white",
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
  },

  label: {
    color: "gray",
    marginHorizontal: 25,
    fontSize: 10,
  },

  value: {
    color: "white",
    fontSize: 16,
    marginHorizontal: 25,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    width: "100%",
    marginTop: 25,
    height: 55,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "white",
    fontSize: 14,
  },
});

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedText from "@/components/AnimatedText";
import ShakeableTextInput from "@/components/ShakeableTextInput ";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const validEmail = (email) => {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return reg.test(String(email).toLowerCase());
  };

  const validateData = () => {
    setFormErrors({});
    let errors = {};

    if (email == "") {
      errors.email = "Email is required";
    } else if (!validEmail(email)) {
      errors.email = "Email address is not valid";
    }

    if (password == "") {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }

    return true;
  };

  const handleLogin = () => {
    if (!validateData()) {
      return;
    }

    let data = {
      email: email,
      password: password,
    };
  };

  const onChangeEmail = (text) => {
    setEmail(text);
  };

  const onChangePassword = (text) => {
    setPassword(text);
  };

  return (
    <View style={style.loginBox}>
      <Text style={style.loginHeader}>Let's get inside my world!</Text>
      <View style={{ marginVertical: 10 }}>
        <TextInput
          style={style.input}
          cursorColor={"red"}
          placeholder="Enter Email"
          placeholderTextColor={"gray"}
          onChangeText={onChangeEmail}
          onFocus={() => setFormErrors({})}
          value={email}
        />
        {formErrors.email && (
          <View>
            <AnimatedText style={style.error}>{formErrors.email}</AnimatedText>
          </View>
        )}
        <ShakeableTextInput
          isValid={formErrors.password}
          style={style.input}
          placeholder="Enter Password"
          cursorColor={"red"}
          placeholderTextColor={"gray"}
          secureTextEntry
          onChangeText={onChangePassword}
          onFocus={() => setFormErrors({})}
          value={password}
        />
        {formErrors.password && (
          <View>
            <AnimatedText style={style.error}>
              {formErrors.password}
            </AnimatedText>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={handleLogin}>
        <View style={style.loginButton}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Login
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LoginComponent;

const style = StyleSheet.create({
  loginBox: {
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
  },

  loginHeader: {
    color: "white",
    fontWeight: "400",
    fontSize: 25,
    textAlign: "center",
  },

  input: {
    borderColor: "red",
    borderWidth: 1,
    width: "100%",
    marginVertical: 10,
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 17,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    zIndex: 9999,
  },

  loginButton: {
    backgroundColor: "red",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  error: {
    color: "red",
  },
});

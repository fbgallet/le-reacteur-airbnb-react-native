import { useState } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import axios from "axios";

export default function SignUpScreen({ setToken, navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  console.log("Constants. :>> ", JSON.stringify(Constants, null, 2));

  const handleSignUp = async () => {
    setErrorMsg("");
    console.log({ email, username, description, password, confirmPassword });
    try {
      if (email && username && description && password && confirmPassword) {
        if (password === confirmPassword) {
          const { data } = await axios.post(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
            { email, username, description, password }
          );
          console.log("Signup - data >>>", data);
        } else {
          setErrorMsg("Les mots de passe doivent être identiques");
        }
      } else {
        setErrorMsg("Veuillez remplir tous les champs");
      }
    } catch (error) {
      console.log("Signup - catch >>>", error.response);
      setErrorMsg("Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollView}
    >
      <Image
        source={require("../assets/Airbnb logo.png")}
        style={styles.logo}
      />

      <Text>Sign up</Text>
      <TextInput
        placeholder="email"
        value={email}
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="username"
        value={username}
        style={styles.input}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="description"
        value={description}
        style={[styles.input, styles.textarea]}
        multiline={true}
        textAlignVertical="top"
        onChangeText={(text) => setDescription(text)}
      />
      <TextInput
        placeholder="password"
        value={password}
        style={styles.input}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        placeholder="confirm password"
        value={confirmPassword}
        style={styles.input}
        secureTextEntry={true}
        onChangeText={(text) => setConfirmPassword(text)}
      />

      <TouchableOpacity onPress={handleSignUp}>
        <Text>Sign Up !</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text>Already have an account ? Sign in</Text>
      </TouchableOpacity>

      <Text>{errorMsg}</Text>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: Constants.statusBarHeight,
  },
  scrollView: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    marginTop: Constants.statusBarHeight,
    height: 150,
    width: 150,
    resizeMode: "contain",
  },
  input: {
    borderBottomColor: "coral",
    borderBottomWidth: 1,
    width: "100%",
    height: 40,
    marginBottom: 10,
  },
  textarea: {
    marginTop: 20,
    height: 120,
    borderWidth: 1,
    borderColor: "coral",
    padding: 10,
  },
});

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
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignUp = async () => {
    setErrorMsg("");
    try {
      if (email && password) {
        const { data } = await axios.post(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
          { email, password }
        );
        console.log("Signin - data >>>", data);
        if (data.token) {
          setToken(data.token);
          alert("Connexion réussie !");
        }
      } else {
        setErrorMsg("Veuillez remplir tous les champs");
      }
    } catch (error) {
      console.log("Signin - catch >>>", error.response);
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

      <Text>Sign In</Text>
      <TextInput
        placeholder="email"
        value={email}
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="password"
        value={password}
        style={styles.input}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity onPress={handleSignUp}>
        <Text>Sign In !</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text>Not yet an account ? Sign Up here</Text>
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

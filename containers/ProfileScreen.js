import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({
  location,
  route,
  setToken,
  userToken,
  userId,
}) {
  const [isUpdatedPhoto, setIsUpdatedPhoto] = useState(false);
  const [isUpdatedInfo, setIsUpdatedInfo] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`,
          { headers: { Authorization: "Bearer " + userToken } }
        );
        console.log("User data >>>", JSON.stringify(data, null, 2));
        setEmail(data.email);
        setUsername(data.username);
        setDescription(data.description);
        if (data.photo) setSelectedPicture(data.photo.url);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchData();
    console.log("userId :>> ", userId);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setIsUpdatedInfo(true);
    }
  }, [email, username, description]);

  const getPermissionAndGetPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled === true) {
        alert("No selected picture !");
      } else {
        setSelectedPicture(result.assets[0].uri);
        setIsUpdatedPhoto(true);
      }
    } else {
      alert("Permission denied");
    }
  };

  const getPermissionAndTakePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();

      if (result.canceled === true) {
        alert("No selected picture !");
      } else {
        setSelectedPicture(result.assets[0].uri);
        setIsUpdatedPhoto(true);
      }
    } else {
      alert("Permission denied");
    }
  };

  const sendPicture = async () => {
    const tab = selectedPicture.split(".");
    try {
      const formData = new FormData();
      formData.append("photo", {
        uri: selectedPicture,
        name: `my-pic.${tab.at(-1)}`,
        type: `image/${tab.at(-1)}`,
      });

      const { data } = await axios.put(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          headers: { Authorization: "Bearer " + userToken },
          transformRequest: (formData) => formData,
        }
      );
      if (data) {
        // setIsLoading(false);
        alert("Picture sent !");
        setIsUpdatedPhoto(true);
        console.log("picture data: ", data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateInfos = async () => {
    try {
      const { data } = await axios.put(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update",
        {
          email,
          username,
          description,
        },
        { headers: { Authorization: "Bearer " + userToken } }
      );
      console.log("data :>> ", data);
      alert("User infos updated");
    } catch (error) {
      console.log("update - catch >>>", error.response);
      setErrorMsg("Une erreur est survenue, veuillez réessayer.");
    }
  };

  const handleUpdate = async () => {
    setErrorMsg("");
    if (isUpdatedInfo) {
      await updateInfos();
      setIsUpdatedInfo(false);
    }
    if (isUpdatedPhoto && selectedPicture) {
      await sendPicture();
      setIsUpdatedPhoto(false);
    }
  };

  const handleLogout = () => {
    setToken();
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollView}
    >
      <View style={styles.row}>
        <Image
          source={
            selectedPicture
              ? { uri: selectedPicture }
              : require("../assets/noPhoto.webp")
          }
          style={styles.avatar}
        />
        <View style={styles.avatarBtns}>
          <Ionicons
            name="images"
            size={24}
            color="grey"
            onPress={getPermissionAndGetPicture}
          />
          <Ionicons
            name="camera"
            size={24}
            color="grey"
            onPress={getPermissionAndTakePicture}
          />
        </View>
      </View>
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

      <TouchableOpacity
        style={[
          styles.btn,
          !isUpdatedInfo && !isUpdatedPhoto ? styles.disabledBtn : "",
        ]}
        onPress={() => (isUpdatedInfo || isUpdatedPhoto) && handleUpdate()}
      >
        <Text>Update</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>

      <Text>{errorMsg}</Text>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
  },
  avatar: {
    marginVertical: 10,
    height: 150,
    width: 150,
    borderRadius: 150,
    borderColor: "coral",
    borderWidth: 1,
  },
  avatarBtns: {
    justifyContent: "space-evenly",
  },
  scrollView: {
    alignItems: "center",
    paddingHorizontal: 20,
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
  btn: {
    fontSize: 16,
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "coral",
  },
  disabledBtn: {
    color: "grey",
    borderColor: "grey",
  },
});

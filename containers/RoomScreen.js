import { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Rate from "../components/Rate";
import MapView, { Marker } from "react-native-maps";
import Swiper from "react-native-swiper";

export default function SettingsScreen({ setToken, navigation, route }) {
  const [roomData, setRoomData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEllipsized, setIsEllipsized] = useState(true);
  // const navigation = useNavigation();
  // const route = useRoute();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${route.params.id}`
        );
        console.log("Room data >>>", JSON.stringify(data, null, 2));
        setRoomData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <ScrollView>
      <Swiper style={styles.swiperWrapper} autoplay={true}>
        {roomData.photos.map((photo) => (
          <Image
            source={{ uri: photo.url }}
            resizeMode="cover"
            style={styles.photo}
          />
        ))}
      </Swiper>
      {/* <Image
        source={{ uri: roomData.photos[0].url }}
        resizeMode="cover"
        style={styles.photo}
      /> */}
      <View style={[styles.fdRow, styles.infos]}>
        <View style={styles.leftInfos}>
          <Text style={styles.title}>{roomData.title}</Text>
          <View style={styles.fdRow}>
            <Rate rating={roomData.ratingValue} />
            <Text style={styles.grey}>{roomData.reviews} reviews</Text>
          </View>
        </View>
        <Image
          source={{ uri: roomData.user.account.photo.url }}
          resizeMode="cover"
          style={styles.avatar}
        />
      </View>
      <View style={styles.infos}>
        <Text numberOfLines={isEllipsized ? 3 : 0}>{roomData.description}</Text>
        <TouchableOpacity onPress={() => setIsEllipsized((prev) => !prev)}>
          <Text style={styles.grey}>
            {isEllipsized ? "Show more ▾" : "Show less ▴"}
          </Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: roomData.location[1],
          longitude: roomData.location[0],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker
          coordinate={{
            latitude: roomData.location[1],
            longitude: roomData.location[0],
          }}
          // title={roomData.price}
          // description={roomData.title}
        />
      </MapView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingBottom: 20,
  },
  swiperWrapper: {
    height: 200,
    // width: "100%",
  },
  photo: {
    height: 200,
    width: "100%",
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  price: {
    position: "absolute",
    top: 140,
    left: 0,
    padding: 10,
    fontSize: 18,
    color: "white",
    backgroundColor: "black",
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
  },
  fdRow: {
    // borderWidth: 2,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  leftInfos: {
    flex: 1,
  },
  infos: {
    justifyContent: "space-between",
    padding: 10,
    gap: 10,
  },
  grey: {
    color: "grey",
  },
  border: {
    borderWidth: 2,
  },
  map: {
    marginVertical: 20,
    width: "100%",
    height: 400,
  },
});

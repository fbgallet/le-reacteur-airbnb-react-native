import { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function SettingsScreen({ setToken, navigation, route }) {
  const [isLoading, setIsLoading] = useState(true);
  //   const [error, setError] = useState(false);
  const [userLocation, setUserLocation] = useState({});
  const [roomsCoords, setRoomsCoords] = useState([]);

  // const navigation = useNavigation();
  // const route = useRoute();

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          //  r console.log("location =>", location); // console.log permettant de visualiser l'objet obtenu
          const obj = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(obj);
        } else {
          //   setError(true);
          alert("La géolocalisation est désactivée.");
        }
      } catch (error) {
        console.log(error.response);
      }
      setIsLoading(false);
    };
    // getUserLocation();
    setUserLocation({ latitude: 48.856614, longitude: 2.3522219 });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${
            userLocation.latitude || 48.856614
          }&longitude=${userLocation.longitude || 2.3522219}`
        );
        // console.log("data :>> ", JSON.stringify(data, null, 2));
        setRoomsCoords(data);
      } catch (error) {
        console.log(error.response);
      }
    };
    if (!isLoading) fetchData();
  }, [isLoading]);

  handleClick = (id) => {
    navigation.navigate("room", { id });
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View>
      <MapView
        style={styles.map}
        initialRegion={{
          // default is Paris
          latitude: userLocation.latitude || 48.856614,
          longitude: userLocation.longitude || 2.3522219,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        showsUserLocation={true}
      >
        {roomsCoords &&
          roomsCoords.map((room) => (
            <Marker
              onPress={() => {
                handleClick(room._id);
              }}
              coordinate={{
                latitude: room.location[1],
                longitude: room.location[0],
              }}
              key={room._id}
            />
          ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

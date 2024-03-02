import { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import RoomCard from "../components/RoomCard";

export default function HomeScreen({ navigation, route }) {
  const [roomsData, setRoomsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
        );
        console.log("Rooms data >>>", JSON.stringify(data, null, 2));
        setRoomsData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={styles.list}
          data={roomsData}
          keyExtractor={(item) => String(item._id)}
          renderItem={({ item }) => (
            <RoomCard item={item} navigation={navigation} route={route} />
          )}
        />
      )}

      <Button
        title="Go to Profile"
        onPress={() => {
          navigation.navigate("Profile", { userId: 123 });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    margin: 10,
  },
});

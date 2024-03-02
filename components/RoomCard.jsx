import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Rate from "./Rate";

const RoomCard = ({ item, navigation, route }) => {
  const handlePress = () => {
    // console.log("navigation :>> ", navigation);
    navigation.navigate("room", { id: item._id });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image
        source={{ uri: item.photos[0].url }}
        resizeMode="cover"
        style={styles.photo}
      />
      <View style={[styles.fdRow, styles.infos]}>
        <View style={styles.leftInfos}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <View style={styles.fdRow}>
            <Rate rating={item.ratingValue} />
            <Text style={styles.grey}>{item.reviews} reviews</Text>
          </View>
        </View>
        <Image
          source={{ uri: item.user.account.photo.url }}
          resizeMode="cover"
          style={styles.avatar}
        />
      </View>
      <Text style={styles.price}>{item.price} €</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
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
    marginVertical: 15,
  },
  fdRow: {
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
    paddingVertical: 10,
  },
  grey: {
    color: "grey",
  },
});

export default RoomCard;

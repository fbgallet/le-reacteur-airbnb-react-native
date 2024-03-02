import { Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Rate = ({ rating }) => {
  const getRatingStars = (rating) => {
    let array = [];
    for (let i = 1; i <= 5; i++) {
      array.push(
        i <= rating ? (
          <FontAwesome key={i} name="star" size={24} color="#FFB100" />
        ) : (
          <FontAwesome key={i} name="star" size={24} color="grey" />
        )
      );
    }
    return array;
  };

  return <Text>{getRatingStars(rating)}</Text>;
};

export default Rate;

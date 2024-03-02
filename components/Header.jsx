import { Image } from "react-native";
const Header = () => {
  return (
    <Image
      source={require("../assets/Airbnb logo.png")}
      resizeMode="contain"
      style={{ width: 30, height: 30 }}
    />
  );
};

export default Header;

import React from "react";
import {
  FlatList,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Card, Button } from "react-native-paper";
import { colors } from "../utils/colors";

const screenWidth = Dimensions.get("window").width;

const itemsNearby = [
  {
    image: require("../assets/logo.png"),
    title: "First Title",
    description: "First Description",
  },
  {
    image: require("../assets/main.png"),
    title: "Second Title",
    description: "Second Description",
  },
  {
    image: require("../assets/logo.png"),
    title: "Third Title",
    description: "Third Description",
  },
  {
    image: require("../assets/main.png"),
    title: "Fourth Title",
    description: "Fourth Description",
  },
];

const itemsNew = [
  {
    image: require("../assets/logo.png"),
    title: "Fifth Title",
    description: "Fifth Description",
  },
  {
    image: require("../assets/main.png"),
    title: "Sixth Title",
    description: "Sixth Description",
  },
  {
    image: require("../assets/logo.png"),
    title: "Seventh Title",
    description: "Seventh Description",
  },
  {
    image: require("../assets/main.png"),
    title: "Eighth Title",
    description: "Eighth Description",
  },
];

const AllRestaurants = ({ navigation }) => {
  const handlePress = (item) => {
    console.log("Clicked item:", item);
  };

  const handleSearchRestaurants = () => {
    console.log("Pretraga restorana");
  };

  const renderHorizontalScroll = (data) => (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item)}>
          <Card style={styles.card}>
            <Card.Cover source={item.image} style={styles.image} />
            <Card.Content>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  const goToUserProfile = () => {
    navigation.navigate("PROFILE");
  };

  return (
    <View style={styles.container}>
      {/* <Card style={styles.cardInfo}>
        <Card.Title title={"Zdravo Danijela"} titleStyle={styles.cardTitle} /> */}
      {/* <Card.Content>
          <Button
            mode="contained"
            onPress={goToUserProfile}
            style={styles.detailButton}
          >
            Prikaži profil
          </Button>
        </Card.Content> */}
      {/* </Card> */}

      <Text style={styles.header}>Restorani u blizini</Text>
      {renderHorizontalScroll(itemsNearby)}

      <Text style={styles.header}>Novi restorani</Text>
      {renderHorizontalScroll(itemsNew)}

      {/* <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearchRestaurants}
      >
        <Text style={styles.searchButtonText}>Pretraži restorane</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 0,
  },
  detailButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "15%",
    width: "70%",
    backgroundColor: colors.zelena,
    borderRadius: 100,
  },
  cardTitle: {
    fontSize: 26,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  profileButton: {
    marginBottom: 20,
    backgroundColor: "#6200ea",
  },
  profileButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
  },
  card: {
    width: screenWidth / 3,
    height: 230,
    marginRight: 10,
  },
  image: {
    height: 130,
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
  },
  searchButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: colors.zelena,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default AllRestaurants;

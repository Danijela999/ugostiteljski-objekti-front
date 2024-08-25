import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView, // Dodato za vertikalni skrol
} from "react-native";
import {
  Text,
  Button,
  Card,
  Modal,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

import { colors } from "../utils/colors";
import RestaurantCard from "../components/RestaurantCard";

const profileInfo = {
  image: require("../assets/profile.png"),
  title: "Zdravo Danijela!",
  name: "Danijela Grbović",
  mail: "danijela.grbovic@gmail.com",
};

const restaurantInfo = [
  {
    image: require("../assets/smokvica.jpg"),
    title: "Smokvica",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    title: "Bela Reka",
    time: "15.08.2024. 19:00 - 22:00",
    position: "Terasa",
    category: "Večera",
    guestCount: 2,
  },
  {
    image: require("../assets/smokvica.jpg"),
    title: "Smokvica",
    time: "16.08.2024. 10:00 - 11:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/smokvica.jpg"),
    title: "Smokvica",
    time: "15.08.2024. 09:00 - 10:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
  {
    image: require("../assets/bela_reka.jpg"),
    title: "Bela Reka",
    time: "15.08.2024. 19:00 - 22:00",
    position: "Terasa",
    category: "Večera",
    guestCount: 2,
  },
  {
    image: require("../assets/smokvica.jpg"),
    title: "Smokvica",
    time: "16.08.2024. 10:00 - 11:00",
    position: "Bašta",
    category: "Doručak",
    guestCount: 6,
  },
];

const ProfileScreen = () => {
  const [visible, setVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(profileInfo.image);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const selectImage = async () => {
    Alert.alert(
      "Odaberite opciju",
      "Izaberite fotografiju iz galerije ili uslikajte novu",
      [
        {
          text: "Galerija",
          onPress: pickImageFromGallery,
        },
        {
          text: "Kamera",
          onPress: takePhoto,
        },
        {
          text: "Otkaži",
          style: "cancel",
        },
      ]
    );
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
      saveImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
      saveImage(result.assets[0].uri);
    }
  };

  const saveImage = (uri) => {
    // Implementirajte logiku za čuvanje putanje slike na željeno mesto.
    // Možete sačuvati u AsyncStorage ili na backend server, ako je potrebno.
    console.log("Sačuvana putanja slike:", uri);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card style={styles.card}>
          <TouchableOpacity onPress={selectImage} style={styles.imageContainer}>
            <Image source={profileImage} style={styles.image} />
          </TouchableOpacity>
          <Card.Title title={profileInfo.title} titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text style={styles.name}>{profileInfo.name}</Text>
            <Button
              mode="contained"
              onPress={showModal}
              style={styles.detailButton}
            >
              Prikaži detalje
            </Button>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Aktivne rezervacije"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <ScrollView style={styles.scrollContainer}>
              {restaurantInfo.map((restaurant, index) => (
                <RestaurantCard
                  key={index} // ili još bolje, koristite jedinstveni ID ako postoji: key={restaurant.id}
                  imageUrl={restaurant.image}
                  restaurantName={restaurant.title}
                  time={restaurant.time}
                  position={restaurant.position}
                  category={restaurant.category}
                  guestCount={restaurant.guestCount}
                />
              ))}
            </ScrollView>
          </Card.Content>
        </Card>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <Image source={profileImage} style={styles.image} />
            <Text style={styles.modalTitle}>{profileInfo.name}</Text>
            <Text style={styles.modalDescription}>{profileInfo.mail}</Text>
            <Button mode="contained" style={styles.closeButton}>
              Promeni lozinku
            </Button>
            <Button
              mode="contained"
              onPress={hideModal}
              style={styles.closeButton}
            >
              Zatvori
            </Button>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 50,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 26,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  name: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginBottom: 10,
  },
  detailButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "15%",
    width: "70%",
    backgroundColor: colors.zelena,
    borderRadius: 100,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center", // Centriranje slike
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  scrollContainer: {
    maxHeight: 400, // Postavite maksimalnu visinu za skrol
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginTop: 10,
  },
});

export default ProfileScreen;

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  Text,
  Button,
  Card,
  Modal,
  Portal,
  Provider as PaperProvider,
  TextInput,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";

import { colors } from "../utils/colors";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay/lib";

const restaurantInfo = {
  image: require("../assets/bela_reka.jpg"),
};

const generateTimeSlots = () => {
  const slots = [];
  const start = new Date();
  start.setHours(9, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 0, 0, 0);

  while (start <= end) {
    slots.push(new Date(start));
    start.setMinutes(start.getMinutes() + 30);
  }

  return slots;
};

const CreateReservationScreen = ({ route }) => {
  const { item } = route.params;
  const { address, description, name, startTime, endTime, imageUrl } = item;
  const [visible, setVisible] = useState(false);
  const [visibleReservation, setVisibleReservation] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const hideModalReservation = () => {
    console.log();
    Alert.alert("Info", "Uspešno je uneta nova rezervacija u sistem.");
    setVisibleReservation(false);
  };
  const [guestCount, setGuestCount] = useState("");
  const [categories, setCategories] = useState([]);
  const [positions, setPositions] = useState([]);
  const [category, setCategory] = useState(null);
  const [position, setPosition] = useState(null);
  const [isAvailability, setAvailability] = useState(false);
  const timeSlots = generateTimeSlots();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isPickerFocused, setIsPickerFocused] = useState(false);
  const [isPositionPickerFocused, setIsPositionPickerFocused] = useState(false);
  const { getCategories, getPositions, isLoading } = useContext(AuthContext);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const showPicker = () => {
    setShowDatePicker(true);
  };

  const showAvailability = () => {
    if (date && guestCount && category && position) {
      setAvailability(true);
    } else {
      Alert.alert("Greška", "Molimo vas da popunite sva polja.");
    }
  };

  const openTimeSlotModal = (slot) => {
    setSelectedTimeSlot(slot);
    setVisibleReservation(true);
  };

  useEffect(() => {
    const getCategoriesAndPositions = async () => {
      const categories = await getCategories();
      const positions = await getPositions();
      setCategories(categories.data);
      setPositions(positions.data);
    };

    getCategoriesAndPositions();
  }, []);

  const handleCategoryChange = (itemValue, itemIndex) => {
    const selected = categories.find((category) => category.id === itemValue);
    setCategory(selected);
  };

  const handlePositionChange = (itemValue, itemIndex) => {
    const selected = positions.find((position) => position.id === itemValue);
    setPosition(selected);
  };

  return (
    <PaperProvider>
      <Spinner visible={isLoading} />
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title={name} titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text style={styles.location}>{address}</Text>
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
            title="Kreiraj rezervaciju"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <View style={styles.dateGuestContainer}>
              <View style={styles.dateInputContainer}>
                <TextInput
                  label="Datum"
                  value={date.toLocaleDateString()}
                  style={styles.input}
                  editable={false}
                  theme={{
                    colors: {
                      text: colors.zelena,
                      placeholder: colors.zelena,
                      primary: colors.zelena,
                      underlineColor: "transparent",
                      background: "transparent",
                    },
                  }}
                />
                <TouchableOpacity
                  onPress={showPicker}
                  style={styles.calendarButton}
                >
                  <Icon name="calendar-today" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChange}
                  style={{ backgroundColor: colors.mint }}
                  backgroundColor={colors.mint}
                />
              )}

              <TextInput
                label="Broj Gostiju"
                value={guestCount}
                onChangeText={setGuestCount}
                keyboardType="numeric"
                style={[styles.guestInput]}
                theme={{
                  colors: {
                    text: colors.zelena,
                    placeholder: colors.zelena,
                    primary: colors.zelena,
                    underlineColor: "transparent",
                    background: "transparent",
                  },
                }}
              />
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category ? category.id : null}
                style={styles.picker}
                onValueChange={handleCategoryChange}
                onFocus={() => setIsPickerFocused(true)}
                onBlur={() => setIsPickerFocused(false)}
              >
                {!isPickerFocused && (
                  <Picker.Item label="Kategorija" value="" />
                )}
                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={position ? position.id : null}
                style={styles.picker}
                onValueChange={handlePositionChange}
                onFocus={() => setIsPositionPickerFocused(true)}
                onBlur={() => setIsPositionPickerFocused(false)}
              >
                {!isPositionPickerFocused && (
                  <Picker.Item label="Pozicija" value="" />
                )}
                {positions.map((position) => (
                  <Picker.Item
                    key={position.id}
                    label={position.name}
                    value={position.id}
                  />
                ))}
              </Picker>
            </View>
            <Button
              mode="contained"
              onPress={showAvailability}
              style={styles.reservationButton}
            >
              Prikaži Raspoloživost
            </Button>
          </Card.Content>
        </Card>
        {isAvailability && (
          <Card style={styles.card}>
            <Card.Title title="Raspoloživost" titleStyle={styles.cardTitle} />
            <Card.Content>
              <ScrollView horizontal style={styles.timeSlotContainer}>
                {timeSlots.map((slot, index) => {
                  const isAvailable = Math.random() > 0.2;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeSlot,
                        {
                          backgroundColor: isAvailable ? "green" : "#d3d3d3",
                        },
                      ]}
                      onPress={() => isAvailable && openTimeSlotModal(slot)}
                      disabled={!isAvailable}
                    >
                      <Text style={styles.timeSlotText}>
                        {slot.getHours()}:
                        {slot.getMinutes() === 0 ? "00" : slot.getMinutes()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Card.Content>
          </Card>
        )}
        <Portal>
          <Modal
            visible={visibleReservation}
            onDismiss={hideModalReservation}
            contentContainerStyle={styles.modalContainer}
          >
            {visibleReservation && (
              <>
                <Text style={styles.modalTitle}>Detalji rezervacije</Text>
                <Text style={styles.modalText}>Ime restorana: {name}</Text>
                <Text style={styles.modalText}>
                  Datum: {date.toLocaleDateString()}
                </Text>
                <Text style={styles.modalText}>
                  Vreme: {selectedTimeSlot.getHours()}:
                  {selectedTimeSlot.getMinutes() === 0
                    ? "00"
                    : selectedTimeSlot.getMinutes()}
                </Text>
                <Text style={styles.modalText}>Broj gostiju: {guestCount}</Text>
                <Text style={styles.modalText}>
                  Kategorija: {category.name}
                </Text>
                <Text style={styles.modalText}>Pozicija: {position.name}</Text>
                <Button
                  mode="contained"
                  onPress={hideModalReservation}
                  style={styles.closeButton}
                >
                  Potvrdi
                </Button>
              </>
            )}
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <Image source={{uri: imageUrl}} style={styles.image} />
            <Text style={styles.modalTitle}>{name}</Text>
            <Text style={styles.modalDescription}>{address}</Text>
            <Text style={styles.modalDescription}>{description}</Text>
            <Text style={styles.modalHours}>
              Radno vreme: {startTime}:00 - {endTime}:00{" "}
            </Text>
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
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 26,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  dateGuestContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    maxWidth: 120,
    marginRight: 10,
    fontSize: 14,
    backgroundColor: colors.mint,
  },
  calendarButton: {
    backgroundColor: colors.zelena,
    padding: 10,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  guestInput: {
    flex: 1,
    maxWidth: 110,
    marginLeft: 5,
    fontSize: 14,
    backgroundColor: colors.mint,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.zelena,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  reservationButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginLeft: "15%",
    width: "70%",
  },
  location: {
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
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  modalHours: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.zelena,
    borderRadius: 100,
    marginTop: 10,
  },
  timeSlotContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  timeSlot: {
    width: 95,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeSlotText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateReservationScreen;

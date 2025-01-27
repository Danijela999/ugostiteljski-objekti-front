import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text } from "react-native";
import ProfileScreen from "./ProfileScreen";
import AllRestaurants from "./AllRestaurants";
import { colors } from "../utils/colors";
import SearchScreen from "./SearchScreen";

const Tab = createBottomTabNavigator();

export default function Dashboard() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Ugostiteljski objekti") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Pretraži") {
            iconName = focused ? "search" : "search-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.zelena,
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Ugostiteljski objekti" component={AllRestaurants} />
      <Tab.Screen name="Pretraži" component={SearchScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

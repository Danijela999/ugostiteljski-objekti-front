import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../config";
import { Alert } from "react-native";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Load tokens from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTokens = async () => {
      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");

      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
      }
    };

    loadTokens();
  }, []);

  // Create axios instance
  const instance = axios.create({
    baseURL: `${BASE_URL}`,
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
  });

  const refreshAccessToken = async () => {
    try {
      const response = await instance.post(`/users/refresh`, {
        token: refreshToken,
      });
      const tokenData = response.data.data;
      const newAccessToken = tokenData.accessToken;

      // Update the state and AsyncStorage
      setAccessToken(newAccessToken);
      await AsyncStorage.setItem("accessToken", newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token", error);
      logout();
    }
  };

  const makeAuthenticatedRequest = async (apiFunction) => {
    try {
      const response = await apiFunction(accessToken);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          return apiFunction(newAccessToken);
        }
      }

      throw error; // If refresh fails or other errors occur, propagate them
    }
  };

  const register = async (firstName, lastName, email, password) => {
    setIsLoading(true);
    try {
      const res = await instance.post(`/users/create`, {
        firstName,
        lastName,
        email,
        password,
      });
      let userInfo = res.data;
      setUserInfo(userInfo);
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      setIsLoading(false);
      navigation.navigate("LOGIN");
    } catch (error) {
      console.log(`register error ${error}`);
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await instance.post(`/users/login`, {
        email,
        password,
      });
      let userInfo = res.data;

      const userJson = userInfo.data;
      setAccessToken(userJson.accessToken);
      setRefreshToken(userJson.refreshToken);
      await AsyncStorage.setItem("accessToken", userJson.accessToken);
      await AsyncStorage.setItem("refreshToken", userJson.refreshToken);

      setUserInfo(userInfo);
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      setIsLoading(false);
      navigation.navigate("DASHBOARD");
    } catch (error) {
      console.log(`login error ${error}`);
      Alert.alert("Greska", "Doslo je do greske!");
      setIsLoading(false);
    }
  };

  const addRestaurant = async (
    name,
    description,
    address,
    latitude,
    longitude,
    startTime,
    endTime
  ) => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.post(
          `/restaurants`,
          {
            name,
            description,
            address,
            latitude,
            longitude,
            startTime,
            endTime,
          },
          {
            headers: { Authorization: `${token}` },
          }
        )
      );

      let restaurantInfo = res.data;
      console.log(restaurantInfo);
      setIsLoading(false);
    } catch (error) {
      console.log(`addRestaurant error ${error}`);
      setIsLoading(false);
    }
  };

  const getAllRestaurants = async () => {
    setIsLoading(true);

    try {
      const res = await makeAuthenticatedRequest((token) =>
        instance.get(`/restaurants`, {
          headers: { Authorization: `${token}` },
        })
      );

      let restaurantInfo = res.data;
      console.log(restaurantInfo);
      setIsLoading(false);
    } catch (error) {
      console.log(`getRestaurant error ${error}`);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await makeAuthenticatedRequest((token) =>
        instance.post(
          `/logout`,
          {},
          {
            headers: { Authorization: `${token}` },
          }
        )
      );

      await AsyncStorage.removeItem("userInfo");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      setUserInfo({});
      setAccessToken(null);
      setRefreshToken(null);
      setIsLoading(false);
    } catch (error) {
      console.log(`logout error ${error}`);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        register,
        login,
        logout,
        addRestaurant,
        getAllRestaurants,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

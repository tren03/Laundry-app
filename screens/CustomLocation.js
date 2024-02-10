import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Touchable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const CustomLocation = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const fetchLocationSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&limit=10&apiKey=ea2dfad30b024b469e1d24bd220520b6`
      );
      const data = await response.json();
      setLocationSuggestions(data.features);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    fetchLocationSuggestions(text);
  };

  const handleLocationSelect = (place) => {
    // You can implement logic to handle location selection here
    console.log("Selected location:", place);
    const lat = place.geometry.coordinates[0];
    const long = place.geometry.coordinates[1];

    // Extracting address lines and pincode
    const addressLine1 = place.properties.address_line1;
    const addressLine2 = place.properties.address_line2;
    const customloc = true

    // Logging the extracted information
    // console.log("lat: ", lat);
    // console.log("lat: ", long);
    // console.log("Address Line 1:", addressLine1);
    // console.log("Address Line 2:", addressLine2);
    navigation.navigate("Home", {
      lat,
      long,
      addressLine1,
      addressLine2,

    });

    
  };
  const defLoc = () => {
    const lat=null
    const long= null
    const addressLine1 = null
    const addressLine2 = null
    navigation.navigate("Home", {
      lat,
      long,
      addressLine1,
      addressLine2,

    });
    
  }

  return (
    <SafeAreaView>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#000",
          padding: 10,
          marginBottom: 20,
          marginLeft: 20,
          marginRight: 20,
        }}
        placeholder="Search for a location"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <TouchableOpacity onPress={()=>defLoc()}
  style={{
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#ccc",
    marginLeft: 20,
    marginRight: 20,
    height: 50, // Adjust the height as needed
  }}
>
  <Text style={{ fontSize: 15, textAlign: "center" }}>
    Set current location
  </Text>
</TouchableOpacity>



      <FlatList
        data={locationSuggestions}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLocationSelect(item)}>
            <Text
              style={{
                padding: 15,
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                marginBottom: 10,
                marginLeft: 20,
                marginRight: 20,
              }}
            >
              {item.properties.formatted}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default CustomLocation;

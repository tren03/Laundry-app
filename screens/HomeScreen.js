import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Pressable,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import Carousel from "../components/Carousel";
import Services from "../components/Services";
import DressItem from "../components/DressItem";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../ProductReducer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { setAddress } from "../AddressReducer";

const HomeScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  const add = useSelector((state)=>state.address.address)
  
  const [fetchedItems, setItems] = useState([]);
  const [customloc, setCustomLoc] = useState(false);
  const total = cart
    .map((item) => item.quantity * item.price)
    .reduce((curr, prev) => curr + prev, 0);
  const navigation = useNavigation();
  const route = useRoute();
  // console.log(cart);
  const [displayCurrentAddress, setdisplayCurrentAddress] = useState(
    "we are loading your location"
  );
  const [distance, setDistance] = useState(null);
  const [locationServicesEnabled, setlocationServicesEnabled] = useState(false);
  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);



  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert(
        "Location services not enabled",
        "Please enable the location services",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    } else {
      setlocationServicesEnabled(enabled);
    }
  };
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "allow the app to use the location services",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }
    
      
    {
      const { coords} = await Location.getCurrentPositionAsync();
      console.log(coords);
      const lat = coords.latitude;
      const long = coords.longitude;

      const R = 6371; // Radius of the Earth in kilometers
      const lat1 = lat * (Math.PI / 180); // User's latitude in radians
      const lon1 =long * (Math.PI / 180); // User's longitude in radians
      const lat2 = 12.973801 * (Math.PI / 180); // Shop's latitude in radians
      const lon2 = 77.611885 * (Math.PI / 180); // Shop's longitude in radians

      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in kilometers
      console.log("this is the distance");
      console.log(distance);
      //console.log("custom loc: ",customloc)
      setDistance(distance);
      

      if (coords) {
        const { latitude, longitude } = coords;
        console.log("this is original lat long")
        console.log(latitude,longitude)
      

        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        for (let item of response) {
          let address = `${item.name} ${item.city} ${item.postalCode}`;
          dispatch(setAddress(address))
          setdisplayCurrentAddress(address);
        }
      }
    }
  };

  const product = useSelector((state) => state.product.product);
  const dispatch = useDispatch();
  useEffect(() => {
    if (product.length > 0) return;
  
    const fetchProducts = async () => {
      const colRef = collection(db, "types");
      const docsSnap = await getDocs(colRef);
      const fetchedobj = [];
      docsSnap.forEach((doc) => {
        fetchedobj.push(doc.data());
      });
      setItems(fetchedobj); // Update the state with fetchedItems
      console.log("this is fetched ",fetchedobj)
      fetchedobj?.map((service) => dispatch(getProducts(service)));
    };
    fetchProducts();
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      const { addressLine1, addressLine2, lat, long } = route.params || {};
      if (addressLine1 && addressLine2 && lat && long) {
        console.log("Address Line 1:", addressLine1);
        console.log("Address Line 2:", addressLine2);
        console.log("Latitude:", lat);
        console.log("Longitude:", long);
  
        const address = `${addressLine1} ${addressLine2}`;
        setdisplayCurrentAddress(address);
  
        const R = 6371; // Radius of the Earth in kilometers
        const lat1 = route.params.lat * (Math.PI / 180); // User's latitude in radians
        const lon1 = route.params.long * (Math.PI / 180); // User's longitude in radians
        const lat2 = 77.611885  * (Math.PI / 180); // Shop's latitude in radians
        const lon2 =   12.973801* (Math.PI / 180); // Shop's longitude in 
        console.log("this is new lat long")
        console.log(lat,long)
  
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;
        const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        console.log("this is the distance");
        console.log(distance);
        //console.log("custom loc: ",customloc)
        dispatch(setAddress(address))
        setDistance(distance);
      } else {
        const { coords } = await Location.getCurrentPositionAsync();
        console.log(coords);
        const lat = coords.latitude;
        const long = coords.longitude;
  
        const R = 6371; // Radius of the Earth in kilometers
        const lat1 = lat * (Math.PI / 180); // User's latitude in radians
        const lon1 = long * (Math.PI / 180); // User's longitude in radians
        const lat2 = 77.611885 * (Math.PI / 180); // Shop's latitude in radians
        const lon2 = 12.973801 * (Math.PI / 180); // Shop's longitude in radians
  
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        // console.log("this is the distance");
        // console.log(distance);
        //console.log("custom loc: ",customloc)
        setDistance(distance);
  
        if (coords) {
          const { latitude, longitude } = coords;
          console.log("this is original lat long");
          console.log(latitude, longitude);
  
          let response = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
  
          for (let item of response) {
            let address = `${item.name} ${item.city} ${item.postalCode}`;
            dispatch(setAddress(address))
            setdisplayCurrentAddress(address);
          }
        }
      }
    };
  
    fetchData();
  }, [route.params]);

  

  return (
    <>
      <ScrollView
        style={{ backgroundColor: "#F0F0F0", flex: 1, marginTop: 50 }}
      >
        {/* Location and Profile */}
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <MaterialIcons name="location-on" size={30} color="#fd5c63" />
          <View style={{marginRight:80}}>
            <Pressable onPress={() => {navigation.navigate("Custom"),{customloc}}}>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                Delivering to:
              </Text>
              <Text>{displayCurrentAddress}</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => navigation.navigate("Profile")}
            style={{ marginLeft: "auto", marginRight: 7 }}
          >
            <Image
              style={{ width: 40, height: 40, borderRadius: 20 }}
              source={{
                uri: "https://img.freepik.com/premium-vector/people-profile-graphic_24911-21373.jpg"
              }}
            />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View
          style={{
            padding: 10,
            margin: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 0.8,
            borderColor: "#C0C0C0",
            borderRadius: 7,
          }}
        >
          <TextInput placeholder="Search for items or More" />
          <Feather name="search" size={24} color="#fd5c63" />
        </View>

        {/* Image Carousel */}
        <Carousel />

        {/* Services Component */}
        <Services />

        {/* Render all the Products */}
        {product.map((item, index) => (
          <DressItem item={item} key={index} />
        ))}
      </ScrollView>

      {total === 0 ? null : (
        <Pressable
          style={{
            backgroundColor: "#088F8F",
            padding: 10,
            marginBottom: 40,
            margin: 15,
            borderRadius: 7,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize: 17, fontWeight: "600", color: "white" }}>
              {cart.length} items | ₹{total}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "400",
                color: "white",
                marginVertical: 6,
              }}
            >
              extra charges might apply
            </Text>
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate("PickUp", {
                currentAddress: displayCurrentAddress,
                distance: distance,
              })
            }
          >
            <Text style={{ fontSize: 17, fontWeight: "600", color: "white" }}>
              Proceed to pickup
            </Text>
          </Pressable>
        </Pressable>
      )}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

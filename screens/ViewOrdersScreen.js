import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const ViewOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [delivery, setDelivery] = useState([]);
  const [pickup, setPickup] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser) {
        const userId = currentUser.uid;
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData && userData.orders && Array.isArray(userData.orders)) {
            const allFetchedOrders = userData.orders.map((order, index) => ({
              id: index + 1,
              orders_placed: order.orders_placed,
              delivery: order.delivery,
              pickUpDetails: order.pickUpDetails,
              status: order.status // Ensure that status is included in each order object
            }));

            const ordersPlaced = allFetchedOrders.map((order) => order.orders_placed);
            const deliveryInfo = allFetchedOrders.map((order) => order.delivery);
            const pickupDetails = allFetchedOrders.map((order) => order.pickUpDetails);

            setOrders(allFetchedOrders);
            setDelivery(deliveryInfo);
            setPickup(pickupDetails);

            setIsLoading(false);
          } else {
            console.log("No orders found for the current user.");
          }
        } else {
          console.log("No user document found for the current user.");
        }
      } else {
        console.log("No user is currently signed in.");
      }
    };

    fetchOrders();
  }, [currentUser]);

  const renderItem = ({ item, index }) => {
    let pickupDetail = null;
    const distance = pickup[index].distance
    if (distance) {
      const dateObject = new Date(pickup[index].Date.seconds * 1000); // Convert Firebase Timestamp to JavaScript Date
      const day = dateObject.getDate(); // Get day of the month
      const month = dateObject.toLocaleString('default', { month: 'long' }); // Get full month name

      pickupDetail = (
        <View style={styles.pickupItem}>
          <Text style={styles.pickupDetail}>Date: {day} {month}</Text>
          <Text style={styles.pickupDetail}>Distance: {pickup[index].distance.toFixed(2)} km</Text>
          <Text style={styles.pickupDetail}>No of Days: {pickup[index].no_Of_days}</Text>
          <Text style={styles.pickupDetail}>Selected Time: {pickup[index].selectedTime}</Text>
        </View>
      );
    }

    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderTitle}>Order {index + 1}</Text>
        <View style={styles.itemList}>
          {item.orders_placed.map((itemDetail, itemIndex) => (
            <View key={itemIndex} style={styles.item}>
              <Text style={styles.itemName}>{itemDetail.name}</Text>
              <Text style={styles.itemPrice}>₹{itemDetail.price.toFixed(2)}</Text>
              <Text style={styles.itemQuantity}>Quantity: {itemDetail.quantity}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.statusText}>Status: {item.status}</Text>
        <Text style={styles.deliveryText}>Delivery: {delivery[index]}</Text>
        <Text style={styles.pickupText}>Pickup Details:</Text>
        {pickupDetail}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  orderItem: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    margin: 13,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemList: {
    marginLeft: 10,
  },
  item: {
    marginBottom: 5,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  itemPrice: {
    color: "#888",
    fontSize: 14,
  },
  itemQuantity: {
    color: "#888",
    fontSize: 14,
  },
  deliveryText: {
    marginTop: 10,
    fontSize: 14,
  },
  pickupText: {
    marginTop: 5,
    fontStyle: "italic",
    fontSize: 14,
  },
  pickupItem: {
    marginTop: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  pickupDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  statusText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default ViewOrdersScreen;

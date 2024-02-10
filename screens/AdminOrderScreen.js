import { FlatList, SafeAreaView, StyleSheet, Text, View, Button, Modal, TouchableOpacity } from 'react-native'
import React, { useState,useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import { arrayRemove,arrayUnion,doc, getDoc,updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AdminOrderScreen = () => {
    const route = useRoute()
    const [orders, setOrders] = useState([]);
    const [delivery, setDelivery] = useState([]);
    const [pickup, setPickup] = useState([]);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(false);
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null); // Stores the index of the selected order


    const { userId } = route.params; // Get userId from route params

    useEffect(() => {
        const fetchOrders = async () => {
            try {
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
                            status: order.status // Make sure status is included in each order object
                        }));

                        const ordersPlaced = allFetchedOrders.map((order) => order.orders_placed);
                        const deliveryInfo = allFetchedOrders.map((order) => order.delivery);
                        const pickupDetails = allFetchedOrders.map((order) => order.pickUpDetails);
                        setOrders(allFetchedOrders);
                        setDelivery(deliveryInfo);
                        setPickup(pickupDetails);

                        setIsLoading(false);
                    } else {
                        console.log("No orders found for the user.");
                    }
                } else {
                    console.log("No user document found for the user.");
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [selectedStatus]);

    const renderItem = ({ item }) => {
        let pickupDetail = null;
        if (item.pickUpDetails) {
            const dateObject = new Date(item.pickUpDetails.Date.seconds * 1000); // Convert Firebase Timestamp to JavaScript Date
            const day = dateObject.getDate(); // Get day of the month
            const month = dateObject.toLocaleString('default', { month: 'long' }); // Get full month name

            pickupDetail = (
                <View style={styles.pickupItem}>
                    <Text style={styles.pickupDetail}>Date: {day} {month}</Text>
                    <Text style={styles.pickupDetail}>Distance: {item.pickUpDetails.distance.toFixed(2)} km</Text>
                    <Text style={styles.pickupDetail}>No of Days: {item.pickUpDetails.no_Of_days}</Text>
                    <Text style={styles.pickupDetail}>Selected Time: {item.pickUpDetails.selectedTime}</Text>
                </View>
            );
        }

        return (
            <View style={styles.orderItem}>
                <Text style={styles.orderTitle}>Order {item.id}</Text>
                <View style={styles.itemList}>
                    {item.orders_placed.map((itemDetail, index) => (
                        <View key={index} style={styles.item}>
                            <Text style={styles.itemName}>{itemDetail.name}</Text>
                            <Text style={styles.itemPrice}>₹{itemDetail.price.toFixed(2)}</Text>
                            <Text style={styles.itemQuantity}>Quantity: {itemDetail.quantity}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.statusText}>Status: {item.status}</Text>
                <Text style={styles.deliveryText}>Delivery: {delivery[item.id - 1]}</Text>
                <Text style={styles.pickupText}>Pickup Details:</Text>
                {pickupDetail}
                <Button
                    title="Change Status"
                    onPress={() => {
                        setSelectedOrderIndex(item.id-1);
                        setModalVisible(true);
                        //console.log(item.id-1)
                    }}
                />
            </View>
        );
    };

    const handleStatusSelection = async (selectedValue) => {
      try {
          setSelectedStatus(false)

          // console.log(selectedOrderIndex)
          const userDocRef = doc(db, "users", userId);
          
          const userDocSnapshot = await getDoc(userDocRef);
          const userData = userDocSnapshot.data();
      
          // Create a copy of the orders array
          const updatedOrders = [...userData.orders];
      
          // Update the status of the order at the selected index
          updatedOrders[selectedOrderIndex].status = selectedValue;
      
          // Update the user document with the updated orders array
          await updateDoc(userDocRef, { orders: updatedOrders });
          console.log("updated")
          setSelectedStatus(true)
          
          
          setModalVisible(false); // Close the modal after updating the status
      } catch (error) {
          console.error('Error updating status:', error);
      }
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
                keyExtractor={(item) => item.id.toString()}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Select Status</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleStatusSelection('Accepted')}
                        >
                            <Text style={styles.buttonText}>Accepted</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleStatusSelection('In Progress')}
                        >
                            <Text style={styles.buttonText}>In Progress</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleStatusSelection('In Transit')}
                        >
                            <Text style={styles.buttonText}>In Transit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleStatusSelection('Delivered')}
                        >
                            <Text style={styles.buttonText}>Delivered</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    statusText: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: "bold",
    },
    pickupDetail: {
        fontSize: 14,
        marginBottom: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical: 5,
        width: '80%',
        backgroundColor: "#367588"
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default AdminOrderScreen;

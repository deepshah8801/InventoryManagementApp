import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const EmployeeStockUpdateScreen = ({ navigation }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetchUserRole();
    fetchInventoryItems();
    // Subscribe to Firestore listener for real-time updates
    const unsubscribe = firebase.firestore().collection('inventory').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'modified') {
          // Update local inventoryItems state when stock is modified
          const updatedItem = change.doc.data();
          setInventoryItems(prevItems =>
            prevItems.map(item =>
              item.id === change.doc.id ? { ...item, stock: updatedItem.stock } : item
            )
          );
        }
      });
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  const fetchUserRole = async () => {
    try {
      const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
      const doc = await userRef.get();
      if (doc.exists) {
        setUserRole(doc.data().role); // Assuming 'role' is a field in your user document
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const inventoryCollection = await firebase.firestore().collection('inventory').get();
      const items = inventoryCollection.docs.map(doc => ({
        id: doc.id,
        itemName: doc.data().itemName,
        stock: doc.data().stock,
        inputValue: '', // Initialize input value for each item
      }));
      setInventoryItems(items);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      Alert.alert('Error', 'Error fetching inventory items. Please try again later.');
    }
  };

  const updateStock = async (itemId, value) => {
    try {
      const itemRef = firebase.firestore().collection('inventory').doc(itemId);
      const itemDoc = await itemRef.get();

      if (!itemDoc.exists) {
        Alert.alert('Error', 'Item not found');
        return;
      }

      const currentStock = itemDoc.data().stock;
      const updatedStock = currentStock + value;

      if (updatedStock < 0) {
        Alert.alert('Error', 'Stock cannot be negative');
        return;
      }

      // Update the stock count in Firestore
      await itemRef.update({ stock: updatedStock });

      // Fetch updated inventory after updating stock
      fetchInventoryItems();
    } catch (error) {
      console.error('Error updating stock:', error);
      Alert.alert('Error', 'Error updating stock. Please try again later.');
    }
  };

  const handleInputChange = (text, itemId) => {
    // Update inputValue for the specific item
    setInventoryItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, inputValue: text } : item
      )
    );
  };

  const handleUpdateStock = (itemId, isAddition) => {
    const item = inventoryItems.find(item => item.id === itemId);
    const inputValue = item.inputValue.trim(); // Trim to remove any leading/trailing spaces

    let value;
    if (inputValue === '') {
      // If input is empty, set value to 1 for addition and -1 for subtraction
      value = isAddition ? 1 : -1;
    } else if (isNaN(inputValue)) {
      // Handle case where input is not a valid number
      Alert.alert('Invalid Input', 'Please enter a valid number');
      return;
    } else {
      // Parse the input value as an integer
      value = parseInt(inputValue, 10);
      if (value <= 0) {
        Alert.alert('Invalid Input', 'Please enter a valid number greater than 0');
        return;
      }
      // For subtraction, negate the value
      if (!isAddition) {
        value = -value;
      }
    }

    // Check if the user has permission to update stock
    if (userRole === 'employee' || (userRole && userRole.permissions && userRole.permissions.includes('edit'))) {
      updateStock(itemId, value);
    } else {
      Alert.alert('Permission Denied', 'You do not have permission to update stock');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Update</Text>
      <FlatList
        data={inventoryItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.inventoryItem}>
            <Text style={styles.itemName}>{item.itemName}</Text>
            <Text style={styles.currentStock}>Stock: {item.stock}</Text>
            {userRole === 'employee' || (userRole && userRole.permissions && userRole.permissions.includes('edit')) ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleUpdateStock(item.id, true)} // Example where true indicates addition
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={(text) => handleInputChange(text, item.id)}
                  value={item.inputValue}
                  placeholder="Enter quantity"
                  placeholderTextColor="white"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleUpdateStock(item.id, false)} // Example where false indicates subtraction
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ color: 'white' }}>You do not have permission to edit</Text>
            )}
          </View>
        )}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Employee')}>
        <Text style={styles.backButtonText}>Back to Employee Page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  itemName: {
    fontSize: 20,
    marginBottom: 10,
    color: 'white',
  },
  currentStock: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 120,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginHorizontal: 5,
    color: 'white',
  },
  button: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  backButton: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
  },
  inventoryItem: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default EmployeeStockUpdateScreen;
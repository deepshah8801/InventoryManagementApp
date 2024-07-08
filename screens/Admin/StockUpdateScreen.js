import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const StockUpdateScreen = ({ navigation }) => {
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    // Fetch initial inventory items and start Firestore listener
    fetchInventoryItems();
    startFirestoreListener();
  }, []);

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

  const startFirestoreListener = () => {
    firebase.firestore().collection('inventory').onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        itemName: doc.data().itemName,
        stock: doc.data().stock,
        inputValue: '', // Initialize input value for each item
      }));
  
      setInventoryItems(items);
    });
  };  

  const updateStock = async (itemId, value) => {
    if (isNaN(value)) {
      Alert.alert('Invalid Input', 'Please enter a valid number');
      return;
    }
  
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
        Alert.alert('Invalid Operation', 'Stock cannot be negative');
        return;
      }
  
      // Update the stock count in Firestore
      await itemRef.update({ stock: updatedStock });
  
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
    const value = item.inputValue ? parseInt(item.inputValue, 10) : 1;
    if (isNaN(value) || value < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid number');
      return;
    }

    const updateValue = isAddition ? value : -value;
    updateStock(itemId, updateValue);
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleUpdateStock(item.id, false)}
              >
                <Text style={styles.buttonText}>-</Text>
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
                onPress={() => handleUpdateStock(item.id, true)}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Admin')}>
        <Text style={styles.backButtonText}>Go Back</Text>
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

export default StockUpdateScreen;
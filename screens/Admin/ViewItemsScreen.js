import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { addNewItem, fetchInventoryItems, removeItem } from '../../utils/database'; // Ensure these functions interact with Firestore
import { firebase } from '../../utils/firebaseconfig';
import { useNavigation } from '@react-navigation/native';

const AddRemoveItemsScreen = () => {
  const [itemName, setItemName] = useState('');
  const [initialStock, setInitialStock] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchInventory();
    checkUserRole();
  }, []);

  const fetchInventory = () => {
    fetchInventoryItems().then(items => {
      setInventoryItems(items);
    });
  };

  const checkUserRole = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          console.log('User role:', userDoc.data().role);
        } else {
          console.error('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching user document:', error);
      }
    } else {
      console.error('User not authenticated');
    }
  };

  const handleAddItem = () => {
    if (itemName && initialStock) {
      addNewItem(itemName, parseInt(initialStock))
        .then(() => {
          console.log('Item added successfully');
          fetchInventory(); // Fetch updated inventory after adding item
        })
        .catch(error => {
          console.error('Error adding item:', error);
        });
    } else {
      Alert.alert('Error', 'Please enter item name and initial stock');
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId)
      .then(() => {
        console.log('Item removed successfully');
        fetchInventory(); // Fetch updated inventory after removing item
      })
      .catch(error => {
        console.error('Error removing item:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Items List in Osmow's</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={itemName}
          onChangeText={setItemName}
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          placeholder="Initial Stock"
          keyboardType="numeric"
          value={initialStock}
          onChangeText={setInitialStock}
          placeholderTextColor="white"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddItem}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={inventoryItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.inventoryItem}>
            <Text style={styles.itemName}>{item.itemName}</Text>
            <Text style={styles.currentStock}>Stock: {item.stock}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveItem(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>Back to Home Page</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'white',
  },
  button: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  inventoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  itemName: {
    color: 'white',
    fontSize: 18,
  },
  currentStock: {
    color: 'white',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  backButton: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AddRemoveItemsScreen;

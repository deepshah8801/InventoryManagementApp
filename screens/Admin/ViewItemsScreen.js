import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { addNewItem, fetchInventoryItems, removeItem } from '../../utils/database'; // Ensure these functions interact with Firestore
import { firebase } from '../../utils/firebaseconfig';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const AddRemoveItemsScreen = () => {
  const [itemName, setItemName] = useState('');
  const [initialStock, setInitialStock] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchInventory();
    startFirestoreListener(); // Start the Firestore listener
    checkUserRole();
  }, []);

  const startFirestoreListener = () => {
    firebase.firestore().collection('inventory').onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        itemName: doc.data().itemName,
        stock: doc.data().stock,
        inputValue: '', // Initialize input value for each item
      }));
      // Update existing items or add new ones based on ID
      setInventoryItems(prevItems => {
        const updatedItems = [...prevItems];
        items.forEach(newItem => {
          const index = updatedItems.findIndex(item => item.id === newItem.id);
          if (index !== -1) {
            updatedItems[index] = newItem; // Update existing item
          } else {
            updatedItems.push(newItem); // Add new item
          }
        });
        return updatedItems;
      });
      setFilteredItems(items); // Update filtered items
    });
  };

  const fetchInventory = () => {
    fetchInventoryItems().then(items => {
      setInventoryItems(items);
      setFilteredItems(items);
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
          setItemName(''); // Clear input fields after adding item
          setInitialStock('');
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

  const handleSearch = () => {
    const filtered = inventoryItems.filter(item =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const toggleSearchBox = () => {
    setShowSearchBox(!showSearchBox);
    setSearchQuery('');
    setFilteredItems(inventoryItems);
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
      <TouchableOpacity style={styles.searchToggleButton} onPress={toggleSearchBox}>
        <Icon name={showSearchBox ? 'close' : 'search'} size={24} color="white" />
      </TouchableOpacity>
      {showSearchBox && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Items"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="white"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.contentContainer}>
        {filteredItems.length === 0 ? (
          <Text style={styles.noItemsText}>No items found</Text>
        ) : (
          <FlatList
            data={filteredItems}
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
        )}
      </View>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '90%',
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
    width: '90%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  searchToggleButton: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '10%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  searchInput: {
    height: 40,
    flex: 1,
    color: 'white',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inventoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
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
  noItemsText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AddRemoveItemsScreen;
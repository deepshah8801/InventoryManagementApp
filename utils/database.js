import { firebase } from './firebaseconfig';

// Function to add new item to inventory (only accessible to admin)
const addNewItem = (itemName, initialStock) => {
  const inventoryRef = firebase.firestore().collection('inventory');
  return inventoryRef.add({
    itemName: itemName,
    stock: initialStock
  });
};

// Function to update stock (accessible to both admin and employee)
const updateStock = (itemId, newStock) => {
  const inventoryRef = firebase.firestore().collection('inventory').doc(itemId);
  return inventoryRef.update({
    stock: newStock
  });
};

// Function to fetch inventory items (for display or further operations)
const fetchInventoryItems = () => {
  const inventoryRef = firebase.firestore().collection('inventory');
  return inventoryRef.get()
    .then(querySnapshot => {
      let items = [];
      querySnapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
      });
      return items;
    })
    .catch(error => {
      console.error('Error fetching inventory:', error);
      return [];
    });
};

// Function to remove item from inventory (only accessible to admin)
const removeItem = (itemId) => {
  const inventoryRef = firebase.firestore().collection('inventory').doc(itemId);
  return inventoryRef.delete();
};

export { addNewItem, updateStock, fetchInventoryItems, removeItem };

import { firebase } from './firebaseconfig'; // Ensure firebaseconfig.js is correctly set up

// Function to add new item to inventory (only accessible to admin)
const addNewItem = async (itemName, initialStock) => {
  try {
    const inventoryRef = firebase.firestore().collection('inventory');

    // Check if item with same name already exists
    const querySnapshot = await inventoryRef.where('itemName', '==', itemName).get();

    if (!querySnapshot.empty) {
      // Item already exists, update its stock
      const docId = querySnapshot.docs[0].id;
      const itemRef = inventoryRef.doc(docId);
      await itemRef.update({
        stock: firebase.firestore.FieldValue.increment(initialStock)
      });
    } else {
      // Item does not exist, add new item
      await inventoryRef.add({
        itemName: itemName,
        stock: initialStock
      });
    }
  } catch (error) {
    console.error('Error adding or updating item:', error);
    throw error; // Propagate error back to the calling function
  }
};

// Function to update stock (accessible to both admin and employee)
const updateStock = async (itemId, newStock) => {
  try {
    const inventoryRef = firebase.firestore().collection('inventory').doc(itemId);
    await inventoryRef.update({
      stock: newStock
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error; // Propagate error back to the calling function
  }
};

// Function to fetch inventory items (for display or further operations)
const fetchInventoryItems = async () => {
  try {
    const inventoryRef = firebase.firestore().collection('inventory');
    const querySnapshot = await inventoryRef.get();

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      itemName: doc.data().itemName,
      stock: doc.data().stock
    }));
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error; // Propagate error back to the calling function
  }
};

// Function to remove item from inventory (only accessible to admin)
const removeItem = async (itemId) => {
  try {
    const inventoryRef = firebase.firestore().collection('inventory').doc(itemId);
    await inventoryRef.delete();
  } catch (error) {
    console.error('Error removing item:', error);
    throw error; // Propagate error back to the calling function
  }
};

export { addNewItem, updateStock, fetchInventoryItems, removeItem };
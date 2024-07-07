import { firebase } from './firebaseconfig';

// Function to add new item to inventory (only accessible to admin)
const addNewItem = async (itemName, initialStock) => {
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
};

// Function to update stock (accessible to both admin and employee)
const updateStock = async (itemId, newStock) => {
  const inventoryRef = firebase.firestore().collection('inventory').doc(itemId);
  await inventoryRef.update({
    stock: newStock
  });
};

// Function to fetch inventory items (for display or further operations)
const fetchInventoryItems = async () => {
  const inventoryRef = firebase.firestore().collection('inventory');
  const querySnapshot = await inventoryRef.get();

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    itemName: doc.data().itemName,
    stock: doc.data().stock
  }));
};

// Function to remove item from inventory (only accessible to admin)
const removeItem = async (itemId) => {
  const inventoryRef = firebase.firestore().collection('inventory').doc(itemId);
  await inventoryRef.delete();
};

export { addNewItem, updateStock, fetchInventoryItems, removeItem };
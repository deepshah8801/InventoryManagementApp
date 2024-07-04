import { firebase } from './firebaseconfig';

const registerUser = async (email, password, role) => {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    
    // Save user role in Firestore
    await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
      email: email,
      role: role,
      permissions: role === 'admin' ? ['add', 'edit', 'delete'] : []
    });

    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};

const logoutUser = async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error('Error logging out:', error.message);
    throw error;
  }
};

const deleteUser = async (email) => {
  try {
    // Find the user by email in Firestore
    const querySnapshot = await firebase.firestore().collection('users').where('email', '==', email).get();
    if (!querySnapshot.empty) {
      // Assuming there is only one user with this email (or handle accordingly if more)
      const user = querySnapshot.docs[0].data();
      
      // Get the user's UID from Firestore data
      const userUid = user.uid;

      // Delete the user from Firebase Authentication using their UID
      await firebase.auth().deleteUser(userUid);

      // Delete the user document from Firestore
      await firebase.firestore().collection('users').doc(userUid).delete();
      
      return true;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
};

export { registerUser, loginUser, logoutUser, deleteUser };
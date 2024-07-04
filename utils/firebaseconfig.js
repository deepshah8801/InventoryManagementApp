// firebase config key setup
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';


// Web app's Firebase Configuration

const firebaseConfig = {
    apiKey: "AIzaSyC8KSNq0eF9t8ywOMuoPljTr089yTReOsM",
  authDomain: "osmow-s-inventory.firebaseapp.com",
  projectId: "osmow-s-inventory",
  storageBucket: "osmow-s-inventory.appspot.com",
  messagingSenderId: "605434901380",
  appId: "1:605434901380:web:95a7962f2adba9d7b3a3d1",
  measurementId: "G-NTDRRSSDS1"
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Function to add employee
const addEmployee = (adminId, email, permissions) => {
  const employeeRef = firebase.firestore().collection('employees').doc(adminId).collection('employees');
  employeeRef.add({
    email: email,
    permissions: permissions
  });
};

// Function to edit permissions
const editPermissions = (adminId, employeeId, permissions) => {
  const employeeRef = firebase.firestore().collection('employees').doc(adminId).collection('employees').doc(employeeId);
  employeeRef.update({
    permissions: permissions
  });
};

// Function to remove employee
const removeEmployee = (adminId, employeeId) => {
  const employeeRef = firebase.firestore().collection('employees').doc(adminId).collection('employees').doc(employeeId);
  employeeRef.delete();
};

export { firebase, addEmployee, editPermissions, removeEmployee };
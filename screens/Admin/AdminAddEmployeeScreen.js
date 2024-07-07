import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { registerUser, deleteUser } from '../../utils/auth';
import { firebase } from '../../utils/firebaseconfig';

const AdminAddEmployeeScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // Default role is employee
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    const employeesRef = firebase.firestore().collection('users').where('role', '==', 'employee');

    employeesRef.get()
      .then((querySnapshot) => {
        const employeesList = [];
        querySnapshot.forEach((doc) => {
          employeesList.push(doc.data().email); // Assuming email is stored under 'email' field
        });
        setEmployees(employeesList);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        setEmployees([]); // Handle error gracefully, set empty array or show error message
      });
  };

  const handleAddEmployee = () => {
    registerUser(email, password, role)
      .then(() => {
        Alert.alert('Success', 'Employee added successfully');
        fetchEmployees(); // Refresh employees list after adding
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        Alert.alert('Error', 'Error adding employee:', error.message);
      });
  };

  const handleRemoveEmployee = async (email) => {
    try {
      await deleteUser(email);
      Alert.alert('Success', 'Employee removed successfully');
      fetchEmployees(); // Refresh employees list after removing
    } catch (error) {
      Alert.alert('Error', 'Error removing employee:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add or Remove Employee</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddEmployee}>
        <Text style={styles.buttonText}>Add Employee</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Remove Employee</Text>
      {employees.map((employee, index) => (
        <View key={index} style={styles.employeeContainer}>
          <Text style={styles.employeeText}>{employee}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveEmployee(employee)}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  addButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f80000',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  removeButton: {
    backgroundColor: '#f80000',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  employeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  employeeText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminAddEmployeeScreen;

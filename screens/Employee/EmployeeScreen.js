import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { firebase } from '../../utils/firebaseconfig';

const EmployeeScreen = ({ navigation }) => {
  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      navigation.navigate('Home');
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Page</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EmployeeStockUpdate')}>
        <Text style={styles.buttonText}>Update Stock</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f80000',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmployeeScreen;

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ExpiryDatesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expiry Dates</Text>
      <Button title="Back to Admin Page" onPress={() => navigation.navigate('Admin')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ExpiryDatesScreen;
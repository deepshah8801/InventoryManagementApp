import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPersonShelter, faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { firebase } from './utils/firebaseconfig';
import { loginUser, logoutUser } from './utils/auth';
import AdminScreen from './screens/Admin/AdminScreen';
import AdminLoginScreen from './screens/Admin/AdminLoginScreen';
import AdminSignupScreen from './screens/Admin/AdminSignupScreen';
import AdminAddEmployeeScreen from './screens/Admin/AdminAddEmployeeScreen';
import EmployeeScreen from './screens/Employee/EmployeeScreen';
import EmployeeLoginScreen from './screens/Employee/EmployeeLoginScreen';
import StockUpdateScreen from './screens/Admin/StockUpdateScreen';
import EmployeeStockUpdateScreen from './screens/Employee/EmployeeStockUpdateScreen'; // Import new screen
import ViewItemsScreen from './screens/Admin/ViewItemsScreen';
import ExpiryDatesScreen from './screens/Admin/ExpiryDatesScreen';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('./assets/start-texture.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('./assets/icon.png')} style={styles.logo} />
        </View>
        <Text style={styles.title}>
          Welcome to Osmow's Inventory: Simplifying Stock Management for a Smarter Business!
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AdminLogin')}
          >
            <FontAwesomeIcon icon={faPersonShelter} style={styles.icon} size={wp('5%')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EmployeeLogin')}
          >
            <FontAwesomeIcon icon={faUsersLine} style={styles.icon} size={wp('5%')} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const Stack = createStackNavigator();

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        console.log('Logged out successfully');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminSignup"
          component={AdminSignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminAddEmployee"
          component={AdminAddEmployeeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmployeeLogin"
          component={EmployeeLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            headerShown: false,
            headerRight: () => (
              <TouchableOpacity style={{ marginRight: 10 }} onPress={handleLogout}>
                <Text style={{ color: 'white', fontSize: 16 }}>Logout</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Employee"
          component={EmployeeScreen}
          options={{
            headerShown: false,
            headerRight: () => (
              <TouchableOpacity style={{ marginRight: 10 }} onPress={handleLogout}>
                <Text style={{ color: 'white', fontSize: 16 }}>Logout</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="StockUpdate"
          component={StockUpdateScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmployeeStockUpdate"
          component={EmployeeStockUpdateScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewItems"
          component={ViewItemsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExpiryDates"
          component={ExpiryDatesScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    backgroundColor: '#fff',
    padding: wp('2.5%'),
    borderRadius: wp('15%'),
    marginBottom: hp('7.5%'),
  },
  logo: {
    width: wp('25%'),
    height: wp('25%'),
  },
  title: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp('5%'),
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2.5%'),
  },
  button: {
    backgroundColor: '#f80000',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('7.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#fff',
  },
});

export default App;

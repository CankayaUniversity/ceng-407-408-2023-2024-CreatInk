// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React
import React from 'react';

// Import Navigators from React Navigation
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

// Import Screens
import TestScreen from './TestScreen';
import SettingsScreen from './DrawerScreens/SettingsScreen';
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';
import PersonalInfo from './DrawerScreens/PersonalInfo';
import Customers from './DrawerScreens/Customers';
import Collections from './DrawerScreens/Collections';
import Calendar from './DrawerScreens/Calendar';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="TestScreen">
      <Stack.Screen
        name="TestScreen"
        component={TestScreen}
        options={{
          title: 'Menu', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#333333', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const SettingScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#333333', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};
const PersonalInfoStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="PersonalInfo"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#333333', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={{
          title: 'Personal Info', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};
const Collectionsstack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="Collections"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#333333', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="Collections"
        component={Collections}
        options={{
          title: 'Collections', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};
const CustomersStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="Customers"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#333333', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="Customers"
        component={Customers}
        options={{
          title: 'Customers', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};
const CalendarStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="Calendar"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#333333', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="Calendar"
        component={Calendar}
        options={{
          title: 'Calendar', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: '#cee1f2',
        color: '#cee1f2',
        itemStyle: {marginVertical: 5, color: 'white'},
        labelStyle: {
          color: '#d8d8d8',
        },
      }}
      screenOptions={{headerShown: false}}
      drawerContent={CustomSidebarMenu}>
      <Drawer.Screen
        name="homeScreenStack"
        options={{drawerLabel: 'Home Screen'}}
        component={HomeScreenStack}
      />
      <Drawer.Screen
        name="personalInfoStack"
        options={{drawerLabel: 'Personal Info'}}
        component={PersonalInfoStack}
      />
      <Drawer.Screen
        name="collectionsStack"
        options={{drawerLabel: 'Collections'}}
        component={Collectionsstack}
      />
      <Drawer.Screen
        name="customersStack"
        options={{drawerLabel: 'Customers'}}
        component={CustomersStack}
      />
      <Drawer.Screen
        name="calendarStack"
        options={{drawerLabel: 'Calendar'}}
        component={CalendarStack}
      />
      <Drawer.Screen
        name="settingScreenStack"
        options={{drawerLabel: 'Settings'}}
        component={SettingScreenStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
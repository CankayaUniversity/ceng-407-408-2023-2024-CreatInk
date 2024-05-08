// // Example of Splash, Login and Sign Up in React Native
// // https://aboutreact.com/react-native-login-and-signup/
// import 'react-native-gesture-handler';

// // Import React and Component
// import React from 'react';

// // Import Navigators from React Navigation
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// // Import Screens
// import LoginScreen from './Screen/LoginScreen';
// import RegisterScreen from './Screen/RegisterScreen';
// import TestScreen from './Screen/TestScreen';
// import DrawingScreen from './Screen/DrawingScreen';
// import SelectFileScreen from './Screen/SelectFileScreen';
// import DrawerNavigationRoutes from './Screen/DrawerNavigationRoutes';

// const Stack = createStackNavigator();

// // const Auth = () => {
// //   // Stack Navigator for Login and Sign up Screen
// //   return (
// //     <Stack.Navigator initialRouteName="LoginScreen">
// //       <Stack.Screen
// //         name="LoginScreen"
// //         component={LoginScreen}
// //         options={{ headerShown: false }}
// //       />
// //       <Stack.Screen
// //         name="RegisterScreen"
// //         component={RegisterScreen}
// //         options={{
// //           title: 'Register', //Set Header Title
// //           headerStyle: {
// //             backgroundColor: '#cc30a0', //Set Header color
// //           },
// //           headerTintColor: '#fff', //Set Header text color
// //           headerTitleStyle: {
// //             fontWeight: 'bold', //Set Header text style
// //           },
// //         }}
// //       />
// //     </Stack.Navigator>
// //   );
// // };

// const App = () => {
//   return (
//     <NavigationContainer>

//       {/* <Drawer.Navigator initialRouteName="Home">
//         <Drawer.Screen name="Home" component={HomeScreen} />
//         <Drawer.Screen name="Notifications" component={NotificationsScreen} />
//       </Drawer.Navigator> */}

//       <Stack.Navigator>
//       <Stack.Screen
//           name="DrawerNavigationRoutes"
//           component={DrawerNavigationRoutes}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="TestScreen"
//           component={TestScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="RegisterScreen"
//           component={RegisterScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="LoginScreen"
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="DrawingScreen"
//           component={DrawingScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="SelectFileScreen"
//           component={SelectFileScreen}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

// //  {/* SplashScreen which will come once for 5 Seconds */}
// //  <Stack.Screen
// //  name="SplashScreen"
// //  component={SplashScreen}
// //  // Hiding header for Splash Screen
// //  options={{ headerShown: false }}
// // />
// // {/* Auth Navigator: Include Login and Signup */}
// // <Stack.Screen
// //  name="Auth"
// //  component={Auth}
// //  options={{ headerShown: false }}
// // />
// // {/* Navigation Drawer as a landing page */}
// // <Stack.Screen
// //  name="DrawerNavigationRoutes"
// //  component={DrawerNavigationRoutes}
// //  // Hiding header for Navigation Drawer
// //  options={{ headerShown: false }}
// // /> */}

// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/
import 'react-native-gesture-handler';

// Import React and Component
import React from 'react';

// Import Navigators from React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import RegisterScreen from './Screen/RegisterScreen';
import DrawerNavigationRoutes from './Screen/DrawerNavigationRoutes';
import SelectFileScreen from './Screen/SelectFileScreen';
import DrawingApp from './Screen/DrawingScreen';
import TestScreen from './Screen/TestScreen';

const Stack = createStackNavigator();

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerShown: false }}
        // options={{
        //   title: 'Register', //Set Header Title
        //   headerStyle: {
        //     backgroundColor: '#307ecc', //Set Header color
        //   },
        //   headerTintColor: '#fff', //Set Header text color
        //   headerTitleStyle: {
        //     fontWeight: 'bold', //Set Header text style
        //   },
        // }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen which will come once for 5 Seconds */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{ headerShown: false }}
        />
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        {/* Navigation Drawer as a landing page */}
        <Stack.Screen
          name="DrawerNavigationRoutes"
          component={DrawerNavigationRoutes}
          // Hiding header for Navigation Drawer
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrawingScreen"
          component={DrawingApp}
          // Hiding header for Splash Screen
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectFileScreen"
          component={SelectFileScreen}
          // Hiding header for Splash Screen
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TestScreen"
          component={TestScreen}
          // Hiding header for Navigation Drawer
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
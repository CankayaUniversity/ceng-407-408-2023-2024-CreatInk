// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    View,
    StyleSheet,
    Image
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const SplashScreen = ({ navigation }) => {
    //State for ActivityIndicator animation
    const [animating, setAnimating] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAnimating(false);
            //Check if user_id is set or not
            //If not then send for Authentication
            //else send to Home Screen
            AsyncStorage.getItem('user_id').then((value) =>
                navigation.replace(
                    value === null ? 'Auth' : 'DrawerNavigationRoutes'
                ),
            );
        }, 5000);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../Image/creatink-high-resolution-logo-transparent.png')}
                style={{ width: '40%', resizeMode: 'contain', margin: 30 }}
            />
            <ActivityIndicator
                animating={animating}
                color="#FFFFFF"
                size="large"
                style={styles.activityIndicator}
            />
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#778899',
        justifyContent: 'center',
        paddingBottom: 500,
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
});
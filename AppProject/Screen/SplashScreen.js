// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    View,
    StyleSheet,
    Image,
    ImageBackground
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const SplashScreen = ({ navigation }) => {
    const [animating, setAnimating] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAnimating(false);
            AsyncStorage.getItem('user_id').then((value) =>
                navigation.replace(
                    value === null ? 'Auth' : 'DrawerNavigationRoutes'
                ),
            );
        }, 2000);
    }, []);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../Image/login1.jpg')}
                resizeMode='cover'
                style={styles.image}>
                <Image
                    source={require('../Image/logo-no-background.png')}
                    style={{ width: '40%', resizeMode: 'contain', margin: 30, alignItems: 'center', alignSelf: 'center' }}
                />
                <ActivityIndicator
                    animating={animating}
                    color="#FFFFFF"
                    size="large"
                    style={styles.activityIndicator}
                />
            </ImageBackground>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#778899',
        justifyContent: 'center',
        //paddingBottom: 500,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
});
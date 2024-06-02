import React, { useState, useEffect } from 'react';

import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Button,
    Image,
    ImageBackground,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const TestScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../Image/login1.jpg')}
                resizeMode='cover'
                style={styles.image}>
                <Image
                    source={require('../Image/logo-no-background.png')}
                    style={styles.imageStyle}
                />

                {/* <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.buttonTextStyle}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.buttonTextStyle}>Login</Text>
            </TouchableOpacity> */}

                {/* <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate('DrawingScreen')}>
                    <Text style={styles.buttonTextStyle}>Draw</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate('SelectFileScreen')}>
                    <Text style={styles.buttonTextStyle}>Get Started</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
};

export default TestScreen;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#cc30a0',
        alignContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#778899',
        justifyContent: 'center',
        //paddingBottom: 500,
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 5,
        marginLeft: 35,
        marginRight: 35,
        margin: 5,
    },
    buttonStyle: {
        backgroundColor: '#333333',
        borderWidth: 0,
        color: '#000000',
        borderColor: 'black',
        borderWidth: 3,
        //height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: "35%",
        marginRight: "35%",
        marginTop: 2,
        marginBottom: 2,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: 'black',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
    },
    registerTextStyle: {
        color: 'white',
        backgroundColor: '#333333',
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'flex-start',
        padding: 10,
        marginTop: 10,
        marginBottom: 20,
        alignSelf: 'center',
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    imageStyle: {
        width: 400,
        height: 400,
        resizeMode: 'contain',
        marginBottom: 0,
        //marginTop: 450,
        alignSelf: 'center',
    },
});
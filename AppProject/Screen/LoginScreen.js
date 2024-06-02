// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, createRef } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    ScrollView,
    Image,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
    ImageBackground,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Loader from './Components/Loader';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';

const LoginScreen = ({ navigation }) => {
    const [email, setUserEmail] = useState('');
    const [password, setUserPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');

    const passwordInputRef = createRef();

    const handleSubmitPress = () => {
        setErrortext('');
        if (!email) {
            alert('Please fill Email');
            return;
        }
        if (!password) {
            alert('Please fill Password');
            return;
        }
        navigation.replace('DrawerNavigationRoutes');
        setLoading(true);
        let dataToSend = { email: email, password: password };
        let formBody = [];
        for (let key in dataToSend) {
            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        fetch('http://10.0.2.2:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message === 'successful') {
                    // Başarılı giriş durumunda anasayfaya yönlendirme
                    navigation.replace('DrawerNavigationRoutes');
                    AsyncStorage.setItem('user_id', data.client_id);
                } else {
                    navigation.navigate('LoginScreen')
                }
            })
            .catch(error => console.error('Hata:', error));

    };

    return (
        <View style={{ flex: 1, backgroundColor: '#778899' }}>
            {/* <Loader loading={loading} /> */}
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <ImageBackground source={require('../Image/login1.jpg')}
                    resizeMode='cover'
                    style={styles.image}>

                    <View>
                        <KeyboardAvoidingView enabled>
                            <View style={{ alignItems: 'center' }}>

                                <Image
                                    source={require('../Image/logo-no-background.png')}
                                    style={{
                                        width: '60%',
                                        height: 240,
                                        resizeMode: 'contain',
                                        margin: 30,
                                    }}
                                />
                            </View>
                            <View style={styles.SectionStyle}>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(email) =>
                                        setUserEmail(email)
                                    }
                                    placeholder="Email"
                                    placeholderTextColor="white"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    onSubmitEditing={() =>
                                        passwordInputRef.current &&
                                        passwordInputRef.current.focus()
                                    }
                                    underlineColorAndroid="#f000"
                                    blurOnSubmit={false}
                                />
                            </View>
                            <View style={styles.SectionStyle}>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(password) =>
                                        setUserPassword(password)
                                    }
                                    placeholder="Password"
                                    placeholderTextColor="white"
                                    ref={passwordInputRef}
                                    onSubmitEditing={Keyboard.dismiss}
                                    autoCapitalize="none"
                                    blurOnSubmit={false}
                                    secureTextEntry={true}
                                    underlineColorAndroid="#f000"
                                    returnKeyType="next"
                                />
                            </View>
                            {errortext != '' ? (
                                <Text style={styles.errorTextStyle}>
                                    {errortext}
                                </Text>
                            ) : null}
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                activeOpacity={0.5}
                                onPress={handleSubmitPress}>
                                <Text style={styles.buttonTextStyle}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                activeOpacity={0.5}
                                onPress={() => navigation.navigate('RegisterScreen')}>
                                <Text style={styles.buttonTextStyle}>New here? Register</Text>
                            </TouchableOpacity>

                        </KeyboardAvoidingView>
                    </View>
                </ImageBackground>
            </ScrollView>
        </View>
    );
};
export default LoginScreen;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        //backgroundColor: '#cc30a0',
        alignContent: 'center',
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 5,
        marginLeft: "35%",
        marginRight: "35%",
        margin: 5,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
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
        color: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
    },
    registerTextStyle: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
});
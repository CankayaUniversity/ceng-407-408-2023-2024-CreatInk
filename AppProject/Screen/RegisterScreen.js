import React, { useState, createRef } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from './Components/Loader';

const RegisterScreen = ({ navigation }, props) => {
    const [name, setUserName] = useState('');
    const [email, setUserEmail] = useState('');
    const [password, setUserPassword] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');
    const [
        isRegistraionSuccess,
        setIsRegistraionSuccess
    ] = useState(false);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const emailInputRef = createRef();
    const addressInputRef = createRef();
    const passwordInputRef = createRef();

    const handleSubmitButton = () => {
        setErrortext('');
        if (!name) {
            alert('Please fill Name');
            return;
        }
        if (!email) {
            alert('Please fill Email');
            return;
        }
        if (!password) {
            alert('Please fill Password');
            return;
        }
        // if (!userAddress) {
        //     alert('Please fill Address');
        //     return;
        // }

        //Show Loader
        setLoading(true);
        var dataToSend = {
            name: name,
            password: password,
            email: email,
        };
        var formBody = [];
        for (var key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        fetch('http://10.0.2.2:5000/addClient', {
            method: 'POST',
            body: JSON.stringify({ name: name, password: password, email: email }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.text())  // Changed to .text()
            .then((responseText) => {
                console.log('Response Text:', responseText);
                try {
                    const responseJson = JSON.parse(responseText);
                    console.log('Parsed JSON:', responseJson);
                    // Process the response as JSON
                } catch (error) {
                    console.error('JSON Parse Error:', error);
                    setErrortext('Invalid server response');
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };

    if (isRegistraionSuccess) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#cc30a0',
                    justifyContent: 'center',
                }}>
                <Image
                    source={require('../Image/success.png')}
                    style={{
                        height: 150,
                        resizeMode: 'contain',
                        alignSelf: 'center'
                    }}
                />
                <Text style={styles.successTextStyle}>
                    Registration Successful
                </Text>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={() => props.navigation.navigate('LoginScreen')}>
                    <Text style={styles.buttonTextStyle}>Login Now</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#778899' }}>
            <ImageBackground source={require('../Image/login1.jpg')}
                resizeMode='cover'
                style={styles.image}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignContent: 'center',
                    }}>
                    <Loader loading={loading} />
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
                    <KeyboardAvoidingView enabled>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(UserName) => setUserName(UserName)}
                                underlineColorAndroid="#f000"
                                placeholder="Name"
                                placeholderTextColor="white"
                                returnKeyType="next"
                                autoCapitalize="none"
                                onSubmitEditing={() =>
                                    nameInputRef.current &&
                                    nameInputRef.current.focus()
                                }
                                blurOnSubmit={false}
                            />
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(email) => setUserEmail(email)}
                                underlineColorAndroid="#f000"
                                placeholder="Email"
                                placeholderTextColor="white"
                                keyboardType="email-address"
                                ref={emailInputRef}
                                returnKeyType="next"
                                autoCapitalize="none"
                                onSubmitEditing={() =>
                                    passwordInputRef.current &&
                                    passwordInputRef.current.focus()
                                }
                                blurOnSubmit={false}
                            />
                        </View>

                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                                underlineColorAndroid="#f000"
                                placeholder="Password"
                                placeholderTextColor="white"
                                ref={passwordInputRef}
                                returnKeyType="next"
                                autoCapitalize="none"
                                onSubmitEditing={() =>
                                    addressInputRef.current && addressInputRef.current.focus()
                                }
                                blurOnSubmit={false}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            >
                                <Icon
                                    name={isPasswordVisible ? 'eye' : 'eye-slash'}
                                    size={20}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>

                        {errortext != '' ? (
                            <Text style={styles.errorTextStyle}>
                                {errortext}
                            </Text>
                        ) : null}
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={handleSubmitButton}>
                            <Text style={styles.buttonTextStyle}>Register</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={() => navigation.navigate('TestScreen')}>
                            <Text style={styles.buttonTextStyle}>Main Menu</Text>
                        </TouchableOpacity>

                    </KeyboardAvoidingView>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 5,
        marginLeft: "35%",
        marginRight: "35%",
        margin: 5,
        alignItems: 'center',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    eyeButton: {
        padding: 10,
        position: 'absolute',
        right: 10,
    },
    buttonStyle: {
        backgroundColor: '#333333',
        borderWidth: 0,
        color: '#000000',
        borderColor: 'black',
        borderWidth: 3,
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
        paddingRight: 45,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    successTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
    },
});

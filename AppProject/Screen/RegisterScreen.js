import React, { useState, createRef } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import Loader from './Components/Loader';

const RegisterScreen = ({ navigation }, props) => {
    const [name, setUserName] = useState('');
    const [email, setUserEmail] = useState('');
    const [password, setUserAge] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');
    const [
        isRegistraionSuccess,
        setIsRegistraionSuccess
    ] = useState(false);

    const emailInputRef = createRef();
    const ageInputRef = createRef();
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
        if (!userAddress) {
            alert('Please fill Address');
            return;
        }
       
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

        fetch('http://192.168.1.36:5000/addClient', {
            method: 'POST',
            body: JSON.stringify({ name: name, password: password, email: email }),
            headers: {
                //Header Defination
                'Content-Type':
                    'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(
                    'Registration Successful. Please Login to proceed'
                );
                //Hide Loader
                setLoading(false);
                console.log(responseJson);
                // If server response message same as Data Matched
                if (responseJson.status === 'success') {
                    setIsRegistraionSuccess(true);
                    console.log(
                        'Registration Successful. Please Login to proceed'
                    );
                } else {
                    setErrortext(responseJson.msg);
                }
            })
            .catch((error) => {
                //Hide Loader
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
            <Loader loading={loading} />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('../Image/creatink-high-resolution-logo-transparent.png')}
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
                            placeholder="Enter Name"
                            placeholderTextColor="#8b9cb5"
                            autoCapitalize="sentences"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                emailInputRef.current && emailInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(email) => setUserEmail(email)}
                            underlineColorAndroid="#f000"
                            placeholder="Enter Email"
                            placeholderTextColor="#8b9cb5"
                            keyboardType="email-address"
                            ref={emailInputRef}
                            returnKeyType="next"
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
                            onChangeText={(UserAge) => setUserAge(UserAge)}
                            underlineColorAndroid="#f000"
                            placeholder="Enter Password"
                            placeholderTextColor="#8b9cb5"
                            keyboardType="sentences"
                            ref={ageInputRef}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                addressInputRef.current &&
                                addressInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.inputStyle}
                            onChangeText={(UserAddress) =>
                                setUserAddress(UserAddress)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Enter Address"
                            placeholderTextColor="#8b9cb5"
                            autoCapitalize="sentences"
                            ref={addressInputRef}
                            returnKeyType="next"
                            onSubmitEditing={Keyboard.dismiss}
                            blurOnSubmit={false}
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
                        onPress={handleSubmitButton}>
                        <Text style={styles.buttonTextStyle}>REGISTER</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('TestScreen')}>
                        <Text style={styles.buttonTextStyle}>MAIN MENU</Text>
                    </TouchableOpacity>

                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};
export default RegisterScreen;

const styles = StyleSheet.create({
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
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
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
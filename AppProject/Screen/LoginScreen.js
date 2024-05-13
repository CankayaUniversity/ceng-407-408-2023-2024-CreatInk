// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, createRef,useContext } from 'react';
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
} from 'react-native';
import { UserContext } from './UserContext';



import Loader from './Components/Loader';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';

const LoginScreen =  ({ navigation }) => {
    const [email, setUserEmail] = useState('');
    const [password, setUserPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');
    const { setUserId } = useContext(UserContext);

    const passwordInputRef = createRef();
    const url = 'http://10.0.2.2:5000/login';

    const requestBody = {
        email,
        password
      };
    const handleSubmitPress = async() => {
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
        try {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            })
            if (response.ok) {
                const data = await response.json();
                const userId = data.client_id; // Adjust the key according to your API response
                setUserId(userId.toString());
                navigation.replace('DrawerNavigationRoutes');
                alert('Successful login.');
              } else {
                
                alert('Wrong email or password.');
              }
            } catch (error) {
              console.error('Login error:', error);
              setError('Something went wrong. Please try again.');
            }
           
        
                
               
            
           
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
                <View>
                    <KeyboardAvoidingView enabled>
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
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(email) =>
                                    setUserEmail(email)
                                }
                                placeholder="Enter Email" //dummy@abc.com
                                placeholderTextColor="#8b9cb5"
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
                                placeholder="Enter Password" //12345
                                placeholderTextColor="#8b9cb5"
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
            </ScrollView>
        </View>
    );
};
export default LoginScreen;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#cc30a0',
        alignContent: 'center',
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
        borderColor: '#000000',
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
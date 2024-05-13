// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useContext } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { UserContext } from '../UserContext';

const PersonalInfo = () => {

    const { userId } = useContext(UserContext);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 16 }}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>

<Text >User ID: {userId}</Text>
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: 'center',
                            marginBottom: 16,
                        }}>
                        Personal Info {'\n\n\n\n'}
                        Name: {'\n\n'}
                        Email: {'\n\n'}
                        Password: {'\n\n'}
                        Address: {'\n\n'}
                        {'\n\n'}
                        You can change your informations
                        
                    </Text>
                </View>
                <Text
                    style={{
                        fontSize: 18,
                        textAlign: 'center',
                        color: '#d8d8d8',
                    }}>
                    
                </Text>
                <Text
                    style={{
                        fontSize: 16,
                        textAlign: 'center',
                        color: '#d8d8d8',
                    }}>
                    CreatINK
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default PersonalInfo;
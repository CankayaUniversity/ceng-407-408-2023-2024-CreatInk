// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

const Customers = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 16 }}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: 'center',
                            marginBottom: 16,
                        }}>
                        These are your Customers:
                        {'\n\n'}
                        
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

export default Customers;
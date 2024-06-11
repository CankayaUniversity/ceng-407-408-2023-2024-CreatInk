import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ImageBackground
} from 'react-native';
import { UserContext } from '../UserContext';

const Customers = () => {
    const { userData } = useContext(UserContext);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerTattooNum, setCustomerTattooNum] = useState('');

    useEffect(() => {
        console.log(userData.userId)
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`http://192.168.1.109:5000/getCustomers/${userData.userId}`);
                const result = await response.json();
                if (response.ok) {
                    setCustomers(result.customers);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError('An error occurred while fetching customers.');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [userData.userId]);

    const handleAddCustomer = async () => {
        try {
            const response = await fetch('http://192.168.1.109:5000/addCustomer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: userData.userId,
                    name: customerName,
                    tattooNum: customerTattooNum,
                }),
            });
            const result = await response.json();
            console.log(result); // Log the result to debug
            if (response.ok) {
                if (result.customer) {
                    setCustomers([...customers, result.customer]);
                    setShowForm(false);
                    setCustomerName('');
                    setCustomerTattooNum('');
                    this.forceUpdate();
                    window.location.reload(false);
                } else {
                    setError('Customer data is missing in the response.');
                    this.forceUpdate();
                    window.location.reload(false);
                }
            } else {
                setError(result.message);
            }
        } catch (error) {
            alert("New customer has been added.")
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require('../../Image/login1.jpg')}
                resizeMode='cover'
                style={styles.image}>
                <View style={{ flex: 1, padding: 16 }}>

                    <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 16, color: 'white', fontWeight: '600' }}>
                        These are your Customers:
                    </Text>
                    <FlatList
                        data={customers}
                        keyExtractor={(item, index) => item.customer_id ? item.customer_id.toString() : index.toString()}
                        renderItem={({ item }) => (
                            <View style={{
                                marginBottom: 30, alignItems: "center",
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                marginLeft: "35%",
                                marginRight: "35%",
                                borderRadius: 30,
                            }}>
                                <Text style={{ fontSize: 18, color: 'black' }}>{item.name}</Text>
                                <Text style={{ fontSize: 14, color: 'black' }}>Number of Tattoos: {item.tattooNum}</Text>
                                <Text style={{ fontSize: 14, color: 'black' }}>Client ID: {item.client_id}</Text>
                            </View>
                        )}
                    />

                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={() => setShowForm(!showForm)}>
                        <Text style={styles.buttonTextStyle}>Add Customer</Text>
                    </TouchableOpacity>

                    {showForm && (
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Customer Name"
                                value={customerName}
                                onChangeText={setCustomerName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Number of Tattoos"
                                value={customerTattooNum}
                                onChangeText={setCustomerTattooNum}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                activeOpacity={0.5}
                                onPress={handleAddCustomer}>
                                <Text style={styles.buttonTextStyle}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <Text style={{ fontSize: 16, textAlign: 'center', color: 'gray' }}>
                        CreatINK
                    </Text>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default Customers;

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

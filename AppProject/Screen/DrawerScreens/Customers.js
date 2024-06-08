import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
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
                const response = await fetch(`http://10.0.2.2:5000/getCustomers/${userData.userId}`);
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
            const response = await fetch('http://10.0.2.2:5000/addCustomer', {
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
            setError('An error occurred while adding the customer.');
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
            <View style={{ flex: 1, padding: 16 }}>
                <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 16 }}>
                    These are your Customers:
                </Text>
                <FlatList
                    data={customers}
                    keyExtractor={(item, index) => item.customer_id ? item.customer_id.toString() : index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 20, alignItems: "center" }}>
                            <Text style={{ fontSize: 18 }}>{item.name}</Text>
                            <Text style={{ fontSize: 14 }}>Number of Tattoos: {item.tattooNum}</Text>
                            <Text style={{ fontSize: 14 }}>Client ID: {item.client_id}</Text>
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
        </SafeAreaView>
    );
};

export default Customers;

const styles = StyleSheet.create({
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
    formContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
});

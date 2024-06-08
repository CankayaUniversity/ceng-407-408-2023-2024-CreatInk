import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import { UserContext } from '../UserContext';

const Customers = () => {
    const { userData } = useContext(UserContext);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    keyExtractor={(item) => item.customer_id.toString()}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 18 }}>{item.name}</Text>
                            <Text style={{ fontSize: 14 }}>Tattoo Number: {item.tattooNum}</Text>
                            <Text style={{ fontSize: 14 }}>Client ID: {item.client_id}</Text>
                        </View>
                    )}
                />
                <Text style={{ fontSize: 16, textAlign: 'center', color: '#d8d8d8' }}>
                    CreatINK
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default Customers;

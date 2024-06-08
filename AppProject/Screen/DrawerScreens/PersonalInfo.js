import React, { useContext, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { UserContext } from '../UserContext';
import axios from 'axios';

const PersonalInfo = () => {
    const { userData } = useContext(UserContext);
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:5000/getClient/${userData.userId}`);
                setClient(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [userData.userId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Error: {error.message}</Text>
            </View>
        );
    }

    if (!client) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>No client data available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home Screen</Text>
            <Text style={styles.text}>User ID: {client.id}</Text>
            <Text style={styles.text}>Email: {client.email}</Text>
            <Text style={styles.text}>Name: {client.name}</Text>
            <Text style={styles.text}>Password: {client.password}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default PersonalInfo;
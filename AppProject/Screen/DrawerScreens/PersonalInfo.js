import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, SafeAreaView } from 'react-native';
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
                const response = await axios.get(`http://192.168.1.109:5000/getClient/${userData.userId}`);
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
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require('../../Image/login1.jpg')}
                resizeMode='cover'
                style={styles.image}>
                <View style={styles.container}>
                    <Text style={styles.nametext}>Welcome, {client.name}!</Text>
                    {/* <Text style={styles.text}>User ID: {client.id}</Text> */}
                    <Text style={styles.text}>Email: {client.email}</Text>
                    <Text style={styles.text}>Password: {client.password}</Text>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginLeft: "35%",
        marginRight: "35%",
        marginTop: "20%",
        marginBottom: "20%",
        borderRadius: 30,
    },
    nametext: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default PersonalInfo;
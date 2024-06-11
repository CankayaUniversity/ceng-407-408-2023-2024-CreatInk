import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import axios from 'axios';
import { UserContext } from '../UserContext';

const Collections = () => {
    const { userData } = useContext(UserContext);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                console.log('Fetching photos for user:', userData.userId);
                const response = await axios.get(`http://192.168.1.109:5000/getClientPhotos/${userData.userId}`);
                console.log('Response data:', response.data);

                if (Array.isArray(response.data)) {
                    setPhotos(response.data);
                } else {
                    setError('Unexpected response format');
                    console.error('Unexpected response format:', response.data);
                }
            } catch (err) {
                console.error('Error fetching photos:', err);
                setError('Error fetching photos: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [userData.userId]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../../Image/login1.jpg')}
                resizeMode='cover'
                style={styles.image}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    These Are Your Collections
                </Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {photos.length === 0 ? (
                    <Text style={styles.noPhotosText}>No photos found.</Text>
                ) : (
                    photos.map((photo) => (
                        <View key={photo.photo_id} style={styles.photoContainer}>
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${photo.tattoos}` }}
                                style={styles.photo}
                            />
                        </View>
                    ))
                )}
            </ScrollView>
            <View style={styles.footer}>
                <Text style={styles.footerText}>CreatINK</Text>
            </View>
            </ImageBackground>
        </SafeAreaView>
    );

};

export default Collections;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#778899',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    headerText: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
    },
    scrollView: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginLeft: "20%",
        marginRight: "20%",
        borderRadius: 30,
    },
    photoContainer: {
        marginBottom: 20,
    },
    photo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    noPhotosText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#d8d8d8',
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    footerText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#d8d8d8',
    },
    errorText: {
        fontSize: 18,
        textAlign: 'center',
        color: 'red',
    },
});

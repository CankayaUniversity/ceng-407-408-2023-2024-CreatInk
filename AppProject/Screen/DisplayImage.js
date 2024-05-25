import React, { useState, useEffect } from 'react';
import RNPhotoManipulator from 'react-native-photo-manipulator';
import axios from 'axios';

import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';

const DisplayImage = ({ navigation, route }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        setSelectedImage(route.params.selectedImage);
    }, [route.params.selectedImage]);

    const imageText = async () => {
        const formData = new FormData();
        formData.append('image', {
            uri: selectedImage,
            type: 'image/jpeg', // Adjust according to the image type
            name: 'photo.jpg'
        });

        try {
            console.log("Sending image to server...");
            const response = await axios.post('http://10.0.2.2:5000/processImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const base64Image = `data:image/jpeg;base64,${response.data.image}`;
            setSelectedImage(base64Image);
            // Assuming the processed image URL is in response.data.image
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const makeVertical = () => {
        const cropRegion = { x: 10, y: 40, height: 400, width: 250 };
        const targetSize = { height: 200, width: 150 };

        RNPhotoManipulator.crop(selectedImage, cropRegion, targetSize)
            .then(path => {
                console.log(`Result image path: ${path}`);
                setSelectedImage(path);
            })
            .catch(error => {
                console.error('Error cropping image:', error);
            });
    };

    return (
        <View style={styles.container}>
            {selectedImage && (
                <Image
                    source={{ uri: selectedImage }}
                    style={styles.imageStyle}
                />
            )}
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={imageText}>
                <Text style={styles.buttonTextStyle}>Get Model</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={makeVertical}>
                <Text style={styles.buttonTextStyle}>Crop</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DisplayImage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#778899',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: 400,
        height: 400,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    buttonStyle: {
        backgroundColor: '#1E90FF',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        fontSize: 18,
    },
});

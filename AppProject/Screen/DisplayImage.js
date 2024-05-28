import React, { useState, useEffect } from 'react';
import RNPhotoManipulator from 'react-native-photo-manipulator';
import axios from 'axios';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';

const DisplayImage = ({ navigation, route }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (route.params && route.params.selectedImage) {
            setSelectedImage(route.params.selectedImage);
        }
    }, [route.params]);

    const handleImageProcessing = async (url) => {
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append('image', {
            uri: selectedImage,
            type: 'image/jpeg', // Adjust according to the image type
            name: 'photo.jpg'
        });

        try {
            console.log("Sending image to server at URL:", url);
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.image) {
                const base64Image = `data:image/jpeg;base64,${response.data.image}`;
                setSelectedImage(base64Image);
            } else {
                console.error('Invalid response data:', response.data);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                // Request was made but no response was received
                console.error('Request data:', error.request);
            } else {
                // Something else happened
                console.error('Error message:', error.message);
            }
        }
    };

    const imageText = () => handleImageProcessing('http://10.0.2.2:5000/processImage');
    const sharpenImage = () => handleImageProcessing('http://10.0.2.2:5000/sharpenImage');

    const cropImage = async () => {
        if (!selectedImage) return;

        const cropRegion = { x: 10, y: 40, height: 400, width: 250 };
        const targetSize = { height: 200, width: 150 };

        try {
            const path = await RNPhotoManipulator.crop(selectedImage, cropRegion, targetSize);
            console.log(`Result image path: ${path}`);
            setSelectedImage(path);
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    };

    const func1 = async () => {
        if (!selectedImage) return;

        const texts = [
            { position: { x: 50, y: 30 }, text: "Text 1", textSize: 30, color: "#000000" },
            { position: { x: 50, y: 30 }, text: "Text 1", textSize: 30, color: "#FFFFFF", thickness: 3 }
        ];

        try {
            const path = await RNPhotoManipulator.printText(selectedImage, texts);
            console.log(`Result image path: ${path}`);
            setSelectedImage(path);
        } catch (error) {
            console.error('Error adding text to image:', error);
        }
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
                onPress={sharpenImage}>
                <Text style={styles.buttonTextStyle}>Sharpen Model</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={cropImage}>
                <Text style={styles.buttonTextStyle}>Crop</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={() => navigation.navigate("ImageToTextScreen", { selectedImage })}>
                <Text style={styles.buttonTextStyle}>Image to text</Text>
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

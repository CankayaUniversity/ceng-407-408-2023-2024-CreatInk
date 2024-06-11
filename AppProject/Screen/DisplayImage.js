import React, { useState, useEffect, useContext } from 'react';
import RNPhotoManipulator from 'react-native-photo-manipulator';
import axios from 'axios';
import { UserContext } from './UserContext';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
    Alert,
} from 'react-native';

const DisplayImage = ({ navigation, route }) => {
    const { userData } = useContext(UserContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [message, setMessage] = useState('');
    const [base4image, setbase4Image] = useState('');

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
            type: 'image/jpeg',
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
                setbase4Image(response.data.image);
                const base64Image = `data:image/jpeg;base64,${response.data.image}`;
                setSelectedImage(base64Image);
            } else {
                console.error('Invalid response data:', response.data);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const imageText = () => handleImageProcessing('http://192.168.1.109:5000/processImage');
    const sharpenImage = () => handleImageProcessing('http://192.168.1.109:5000/sharpenImage');
    const extractEdges = () => handleImageProcessing('http://192.168.1.109:5000/extractEdges');

    const addPhoto = async () => {
        console.log("addPhoto function called");

        try {
            console.log("Sending image data...");
            const response = await axios.post('http://192.168.1.109:5000/addPhotos', {
                client_id: userData.userId,
                tattoos: base4image
            });

            setMessage(response.data.message);
            console.log("Response received: ", response.data.message);
        } catch (error) {
            Alert.alert("You must edit the image first.");
        }
    };

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
            <ImageBackground source={require('../Image/login1.jpg')}
                resizeMode='cover'
                style={styles.imageBackground}>

                <View style={styles.imageContainer}>
                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.imageStyle}
                        />
                    )}
                </View>

                <View style={styles.buttonsContainer}>
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
                        onPress={() => navigation.navigate("DrawScreen", { selectedImage })}>
                        <Text style={styles.buttonTextStyle}>Draw</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={extractEdges}>
                        <Text style={styles.buttonTextStyle}>Extract Edges</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate("ImageToTextScreen", { selectedImage })}>
                        <Text style={styles.buttonTextStyle}>Image to text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={addPhoto}>
                        <Text style={styles.buttonTextStyle}>Add to Collection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('TestScreen')}>
                        <Text style={styles.buttonTextStyle}>Main Menu</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default DisplayImage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#778899',
    },
    imageBackground: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        marginRight: 20,
    },
    buttonStyle: {
        backgroundColor: '#333333',
        borderWidth: 3,
        color: '#000000',
        borderColor: 'black',
        // borderWidth: 3,
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        marginLeft: "35%",
        marginRight: "35%",
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    imageStyle: {
        width: 400,
        height: 400,
        resizeMode: 'contain',
        borderWidth: 3,
        borderColor: 'black',
    },
});

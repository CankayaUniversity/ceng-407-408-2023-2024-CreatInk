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
                setbase4Image(response.data.image)
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
    const extractEdges = () => handleImageProcessing('http://10.0.2.2:5000/extractEdges');

    const addPhoto = async () => {
        console.log("addPhoto function called");

        try {
            console.log("Sending image data...");
            const response = await axios.post('http://10.0.2.2:5000/addPhotos', {
                client_id: userData.userId,
                tattoos: base4image // using uri directly, but you may need to convert it if your server requires base64 or binary
            });

            setMessage(response.data.message);
            console.log("Response received: ", response.data.message);
        } catch (error) {
            console.error("Error during axios post:", error);
            setMessage('Error uploading photo: ' + error.message);
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
                style={styles.image}>
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
            </ImageBackground>
        </View>
    );
};

export default DisplayImage;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        //justifyContent: 'center',
        backgroundColor: '#cc30a0',
        //alignContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#778899',
        //justifyContent: 'center',
        //paddingBottom: 500,
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 5,
        marginLeft: 35,
        marginRight: 35,
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
        color: 'black',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
    },
    registerTextStyle: {
        color: 'white',
        backgroundColor: '#333333',
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'flex-start',
        padding: 10,
        marginTop: 10,
        marginBottom: 20,
        alignSelf: 'center',
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    imageStyle: {
        width: 400,
        height: 400,
        resizeMode: 'contain',
        marginBottom: 20,
        alignSelf: 'center',
        borderWidth: 3,
        borderColor: 'black'
    },
});

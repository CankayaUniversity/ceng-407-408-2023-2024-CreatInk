import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const SelectFileScreen = ({ navigation }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
            }
        });
    };

    const handleCameraLaunch = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 1200,
            maxWidth: 1200,
        };

        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                let imageUri = response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                console.log(imageUri);
            }
        });
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
                        onPress={openImagePicker}>
                        <Text style={styles.buttonTextStyle}>Select File</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate("DisplayImage", { selectedImage })}>
                        <Text style={styles.buttonTextStyle}>Edit Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate("DrawingScreen", { selectedImage })}>
                        <Text style={styles.buttonTextStyle}>Draw Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate("CropScreen", { selectedImage })}>
                        <Text style={styles.buttonTextStyle}>Crop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={handleCameraLaunch}>
                        <Text style={styles.buttonTextStyle}>Take Photo</Text>
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

export default SelectFileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#778899',
        flexDirection: 'row',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
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
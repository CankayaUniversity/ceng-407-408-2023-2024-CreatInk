import React, { useState, useEffect, useRef } from 'react';
import { PanResponder, Button, StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import RNPhotoManipulator from 'react-native-photo-manipulator';

const CropScreen = ({ navigation, route }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [cropRegion, setCropRegion] = useState(null);
    const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
    const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const viewLayout = useRef(null);

    useEffect(() => {
        if (route.params && route.params.selectedImage) {
            setSelectedImage(route.params.selectedImage);
            Image.getSize(route.params.selectedImage, (width, height) => {
                setImageDimensions({ width, height });
            });
        }
    }, [route.params]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            const { locationX, locationY } = evt.nativeEvent;
            setStartCoords({ x: locationX, y: locationY });
            setCropRegion({ x: locationX, y: locationY, width: 0, height: 0 });
        },
        onPanResponderMove: (evt) => {
            const { locationX, locationY } = evt.nativeEvent;
            const width = locationX - startCoords.x;
            const height = locationY - startCoords.y;
            setEndCoords({ x: locationX, y: locationY });
            setCropRegion({ x: startCoords.x, y: startCoords.y, width, height });
        },
        onPanResponderRelease: () => {
            const width = endCoords.x - startCoords.x;
            const height = endCoords.y - startCoords.y;
            setCropRegion({ x: startCoords.x, y: startCoords.y, width, height });
        },
    });

    const cropImage = async () => {
        if (!selectedImage || !cropRegion || !viewLayout.current) return;

        const { width: viewWidth, height: viewHeight } = viewLayout.current;
        const { width: imageWidth, height: imageHeight } = imageDimensions;

        const imageAspectRatio = imageWidth / imageHeight;
        const viewAspectRatio = viewWidth / viewHeight;

        let scale = 1;
        let offsetX = 0;
        let offsetY = 0;

        if (viewAspectRatio > imageAspectRatio) {
            scale = viewHeight / imageHeight;
            offsetX = (viewWidth - imageWidth * scale) / 2;
        } else {
            scale = viewWidth / imageWidth;
            offsetY = (viewHeight - imageHeight * scale) / 2;
        }

        const adjustedCropRegion = {
            x: (cropRegion.x - offsetX) / scale,
            y: (cropRegion.y - offsetY) / scale,
            width: cropRegion.width / scale,
            height: cropRegion.height / scale,
        };

        try {
            const path = await RNPhotoManipulator.crop(selectedImage, adjustedCropRegion);
            console.log(`Result image path: ${path}`);
            setSelectedImage(path);
            setCropRegion(null); // Clear the crop region to hide the red overlay
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    };

    return (
        <View style={{ flex: 1 }} onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            viewLayout.current = { width, height };
        }}>
            <View style={{ flex: 1 }}>
                <Image
                    source={{ uri: selectedImage }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                    {...panResponder.panHandlers}
                />
                {cropRegion && (
                    <View
                        style={[
                            styles.cropOverlay,
                            {
                                left: cropRegion.x,
                                top: cropRegion.y,
                                width: cropRegion.width,
                                height: cropRegion.height,
                            },
                        ]}
                    />
                )}
            </View>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={cropImage}>
                <Text style={styles.buttonTextStyle}>Crop</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={() => navigation.navigate("DisplayImage", { selectedImage })}>
                <Text style={styles.buttonTextStyle}>Edit</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CropScreen;

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
    cropOverlay: {
        position: 'absolute',
        borderColor: 'red',
        borderWidth: 2,
        backgroundColor: 'rgba(255, 0, 0, 0.3)', // Optional: semi-transparent background for better visibility
    },
    buttonStyle: {
        backgroundColor: '#333333',
        borderWidth: 0,
        borderColor: 'black',
        borderWidth: 3,
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
});



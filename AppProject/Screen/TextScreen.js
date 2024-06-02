import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, ImageBackground, PanResponder, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ImageToTextScreen({ route }) {
    const [selectedImage, setSelectedImage] = useState(route.params.selectedImage);
    const [inputText, setInputText] = useState('');
    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        pan.setValue({ x: 100, y: 100 });  // Initial position
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value,
                });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                pan.flattenOffset();
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder="Type here..."
                value={inputText}
                onChangeText={setInputText}
            />
            <View style={styles.imageContainer}>
                <ImageBackground source={{ uri: selectedImage }} style={styles.image}>
                    <Animated.View
                        style={{
                            transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: scale }],
                            ...styles.textView
                        }}
                        {...panResponder.panHandlers}
                    >
                        <Text style={styles.text}>{inputText}</Text>
                    </Animated.View>
                </ImageBackground>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    textInput: {
        height: 40,
        width: '80%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    imageContainer: {
        width: width,
        height: height * 0.7,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'black',
    },
    image: {
        width: '95%',
        height: '80%',
    },
    textView: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 10,
    },
    text: {
        fontSize: 20,
        color: 'black',
    },
});

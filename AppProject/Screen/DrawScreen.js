import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    PanResponder,
    Animated,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function DrawingScreen({ route }) {
    const [selectedImage, setSelectedImage] = useState(route.params.selectedImage);
    const [inputText, setInputText] = useState('');
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [currentColor, setCurrentColor] = useState('transparent');
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [isTextTouched, setIsTextTouched] = useState(false);
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [strokeMenuVisible, setStrokeMenuVisible] = useState(false);


    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;

    const handleTextTouch = () => {
        setIsTextTouched(true);
    };

    const handleTextRelease = () => {
        setIsTextTouched(false);
    };
    const toggleStrokeMenu = () => {
        setStrokeMenuVisible(!strokeMenuVisible);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                if (isTextTouched) {
                    return false;
                }
                return true;
            },
            onPanResponderGrant: (evt, gestureState) => {
                if (isTextTouched) {
                    return;
                }
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
                if (isTextTouched) {
                    return;
                }
                pan.flattenOffset();
            },
        })
    ).current;

    useEffect(() => {
        setSelectedImage(route.params.selectedImage);
        pan.setValue({ x: 100, y: 100 });
    }, [route.params.selectedImage]);

    const onTouchMove = (event) => {
        if (!isTextTouched) {
            const locationX = event.nativeEvent.locationX;
            const locationY = event.nativeEvent.locationY;
            const newPoint = `${currentPath.length === 0 ? 'M' : 'L'} ${locationX.toFixed(0)},${locationY.toFixed(0)} `;
            setCurrentPath(currentPath => [...currentPath, newPoint]);
        }
    };

    const onTouchEnd = () => {
        if (currentPath.length > 0) {
            setPaths(paths => [...paths, { path: currentPath, color: currentColor, strokeWidth }]);
            setCurrentPath([]);
        }
    };

    const handleClearButtonClick = () => {
        setPaths([]);
    };

    const handleUndoButtonClick = () => {
        setPaths(paths => paths.slice(0, -1));
    };

    const changeColor = (color) => {
        setCurrentColor(color);
        setColorPickerVisible(false);
    };

    const changeStrokeWidth = (width) => {
        setStrokeWidth(width);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder="Type here..."
                value={inputText}
                onChangeText={setInputText}
                onTouchStart={handleTextTouch}
                onTouchEnd={handleTextRelease}
            />
            <View
                style={styles.imageContainer}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <ImageBackground source={{ uri: selectedImage }} style={styles.image}>
                    <Svg height={height * 0.65} width={width}>
                        {paths.map(({ path, color, strokeWidth }, index) => (
                            <Path
                                key={`path-${index}`}
                                d={path.join(' ')}
                                stroke={color}
                                fill="transparent"
                                strokeWidth={strokeWidth}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                        ))}
                    </Svg>
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
            <View style={styles.strokeWidthContainer}>
                <TouchableOpacity
                    style={[
                        styles.strokeButton,
                        { borderWidth: 1, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
                    ]}
                    onPress={() => setColorPickerVisible(!colorPickerVisible)}
                >
                    <Text style={styles.strokeButtonText}>Colors</Text>
                </TouchableOpacity>

                {colorPickerVisible && (
                    <View style={styles.colorPickerContainer}>
                        {['black', 'red', 'blue', 'green', 'yellow', 'purple', 'orange'].map(color => (
                            <TouchableOpacity
                                key={color}
                                style={[styles.colorButton, { backgroundColor: color }]}
                                onPress={() => {
                                    changeColor(color);
                                    setColorPickerVisible(false);
                                }}
                            />

                        ))}
                    </View>
                )}
                <TouchableOpacity
                    style={[
                        styles.strokeButton,
                        { borderWidth: 1, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
                    ]}
                    onPress={toggleStrokeMenu}
                >
                    <Text style={styles.strokeButtonText}>Needles</Text>
                </TouchableOpacity>

                {strokeMenuVisible && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {[1, 3, 5, 7, 10].map((width, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.strokeButton,
                                    { borderWidth: width === strokeWidth ? 2 : 1, width: 40, height: 40, borderRadius: 20, marginBottom: 10 /*marginHorizontal: 5*/ },
                                ]}
                                onPress={() => {
                                    changeStrokeWidth(width);
                                    setStrokeMenuVisible(false);
                                }}
                            >
                                <Text style={styles.strokeButtonText}>{width}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>


            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.clearButton} onPress={handleClearButtonClick}>
                    <Text style={styles.buttonText}>Clear 🗑️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.undoButton} onPress={handleUndoButtonClick}>
                    <Text style={styles.buttonText}>Undo ↶</Text>
                </TouchableOpacity>
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
        borderWidth: 2,
        borderColor: 'gray',
        //padding: 10,
        //marginTop: 20,
        marginBottom: 20,
    },
    imageContainer: {
        width: width * 0.95,
        height: height * 0.6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'black',
    },
    image: {
        width: '100%',
        height: '100%',
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
    colorPickerButton: {
        backgroundColor: '#4CAF50',
        //paddingVertical: 10,
        //paddingHorizontal: 20,
        //borderRadius: 5,
        //marginTop: 10,
    },
    colorPickerContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    colorButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 5,
        borderWidth: 1,
    },
    strokeWidthContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    strokeButton: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 20,
    },
    strokeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '80%',
        marginTop: 10,
        columnGap: 5,
    },
    clearButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    undoButton: {
        backgroundColor: 'orange',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


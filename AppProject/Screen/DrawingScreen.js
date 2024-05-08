import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

export default function DrawingApp() {
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [currentColor, setCurrentColor] = useState('black'); // Başlangıç rengi

    const onTouchMove = (event) => {
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        const newPoint = `${currentPath.length === 0 ? 'M' : 'L'} ${locationX.toFixed(0)},${locationY.toFixed(0)} `;
        setCurrentPath(currentPath => [...currentPath, newPoint]);
    };

    const onTouchEnd = () => {
        if (currentPath.length > 0) {
            setPaths(paths => [...paths, { path: currentPath, color: currentColor }]);
            setCurrentPath([]);
        }
    };

    const handleClearButtonClick = () => {
        setPaths([]);
    };

    const changeColor = (color) => {
        setCurrentColor(color);
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.textHeader}>Drawing Page</Text> */}
            <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                <Svg height={height * 0.7} width={width}>
                    {paths.map(({ path, color }, index) => (
                        <Path
                            key={`path-${index}`}
                            d={path.join(' ')}
                            stroke={color}
                            fill="transparent"
                            strokeWidth={3}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    ))}
                </Svg>
            </View>
            <View style={styles.colorPickerContainer}>
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'black' }]} onPress={() => changeColor('black')} />
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'red' }]} onPress={() => changeColor('red')} />
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'blue' }]} onPress={() => changeColor('blue')} />
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'green' }]} onPress={() => changeColor('green')} />
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'yellow' }]} onPress={() => changeColor('yellow')} />
            </View>
            <TouchableOpacity style={styles.buttonStyle} onPress={handleClearButtonClick}>
                <Text style={styles.buttonTextStyle}>  Clear All  </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#333333',
        borderWidth: 0,
        color: '#000000',
        borderColor: '#000000',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: "35%",
        marginRight: "35%",
        marginTop: 10,
        marginBottom: 2,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', 
    },
    textHeader: {
        color: 'black',
        fontSize: 24,
        margin: 10,
        fontWeight: 'bold'
    },
    svgContainer: {
        height: height * 0.7,
        width: width,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
    },
    colorPickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    colorButton: {
        width: 40,
        height: 40,
        marginHorizontal: 10,
        borderRadius: 20,
    },
    clearButton: {
        marginTop: 20,
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

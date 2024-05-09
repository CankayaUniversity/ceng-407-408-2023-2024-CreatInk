import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

export default function DrawingApp() {
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [currentColor, setCurrentColor] = useState('black'); // Başlangıç rengi

    const onTouchStart = (event) => {
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        const newPoint = `M ${locationX.toFixed(0)},${locationY.toFixed(0)} `;
        setCurrentPath([newPoint]);
    };

    const onTouchMove = (event) => {
        if (currentPath.length === 0) return;

        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        const newPoint = `L ${locationX.toFixed(0)},${locationY.toFixed(0)} `;
        setCurrentPath(prevPath => [...prevPath, newPoint]);
    };

    const onTouchEnd = () => {
        if (currentPath.length > 0) {
            setPaths(prevPaths => [...prevPaths, { path: currentPath, color: currentColor }]);
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
            <Text style={styles.textHeader}>Drawing Page</Text>
            <View
                style={styles.svgContainer}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
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
                    <Path
                        key="currentPath"
                        d={currentPath.join('')}
                        stroke={currentColor}
                        fill="transparent"
                        strokeWidth={3}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                </Svg>
            </View>
            <View style={styles.colorPickerContainer}>
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'black' }]} onPress={() => changeColor('black')} />
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'red' }]} onPress={() => changeColor('red')} />
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'blue' }]} onPress={() => changeColor('blue')} />
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'green' }]} onPress={() => changeColor('green')} />
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'yellow' }]} onPress={() => changeColor('yellow')} />
            </View>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearButtonClick}>
                <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
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
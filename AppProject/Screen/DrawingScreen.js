import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

export default () => {
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [isClearButtonClicked, setClearButtonClicked] = useState(false);
    const [currentColor, setCurrentColor] = useState('black'); // Başlangıç rengi

    const onTouchEnd = () => {
        paths.push({ path: currentPath, color: currentColor });
        setCurrentPath([]);
        setClearButtonClicked(false);
    };
    

    const onTouchMove = (event) => {
        const newPath = [...currentPath];
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(0)},${locationY.toFixed(0)} `;
        newPath.push(newPoint);
        setCurrentPath(newPath);
    };

    const handleClearButtonClick = () => {
        setPaths([]);
        setCurrentPath([]);
        setClearButtonClicked(true);
    };

    const changeColor = (color) => {
        setCurrentColor(color);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.Text2}>Drawing Page</Text>
            <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                <Svg height={height * 0.7} width={width}>
                    <Path
                        d={paths.map(({ path }) => path).join('')}
                        stroke={isClearButtonClicked ? 'transparent' : currentColor}
                        fill={'transparent'}
                        strokeWidth={3}
                        strokeLinejoin={'round'}
                        strokeLinecap={'round'}
                    />
                    {paths.map(({ path, color }, index) => (
                        <Path
                            key={`path-${index}`}
                            d={path.join('')}
                            stroke={isClearButtonClicked ? 'transparent' : color}
                            fill={'transparent'}
                            strokeWidth={2}
                            strokeLinejoin={'round'}
                            strokeLinecap={'round'}
                        />
                    ))}
                </Svg>
            </View>
            <View style={styles.container}>
                <Text style={styles.Text2}> Colors</Text>
            </View>
            
            <View style={styles.colorPickerContainer}>
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'red' }]} onPress={() => changeColor('red')} />
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'blue' }]} onPress={() => changeColor('blue')} />
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'green' }]} onPress={() => changeColor('green')} />
                <TouchableOpacity style={[styles.colorButton, { backgroundColor: 'yellow' }]} onPress={() => changeColor('yellow')} />
                {}
            </View>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearButtonClick}>
                <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Text: {
        color: 'white',
        borderColor: 'white',
        backgroundColor: 'pink',
        fontSize: 50,
    },
    Text2: {
        color:'white',
        bordercolor:'white',
        backgroundColor: 'black',
        fontSize: 50,
    },
    svgContainer: {
        height: height * 0.7,
        width,
        borderColor: 'black',
        backgroundColor: 'white',
        borderWidth: 1,
    },
    clearButton: {
        marginTop: 10,
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    colorPickerContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    colorButton: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
        borderRadius: 20,
    },
    
});

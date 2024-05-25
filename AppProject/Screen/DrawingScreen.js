import React, { useState,useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

export default function DrawingScreen({ route }) {
    const [selectedImage, setSelectedImage] = useState(null);
    useEffect(() => {
        setSelectedImage(route.params.selectedImage);
    }, [route.params.selectedImage]);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentColor, setCurrentColor] = useState('black');
  const [strokeWidth, setStrokeWidth] = useState(3);

  const onTouchMove = (event) => {
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${currentPath.length === 0 ? 'M' : 'L'} ${locationX.toFixed(0)},${locationY.toFixed(0)} `;
    setCurrentPath(currentPath => [...currentPath, newPoint]);
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
  };

  const changeStrokeWidth = (width) => {
    setStrokeWidth(width);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Drawing App</Text>
      <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <ImageBackground source={{ uri: selectedImage }} style={{ width: '100%', height: '100%' }}>
          <Svg height={height * 0.7} width={width}>
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
        </ImageBackground>
      </View>
      <View style={styles.colorPickerContainer}>
        {['black', 'red', 'blue', 'green', 'yellow', 'purple', 'orange'].map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => changeColor(color)}
          />
        ))}
      </View>
      <View style={styles.strokeWidthContainer}>
        {[1, 3, 5, 7, 10].map(width => (
          <TouchableOpacity
            key={width}
            style={[styles.strokeButton, { borderWidth: width === strokeWidth ? 2 : 1 }]}
            onPress={() => changeStrokeWidth(width)}
          >
            <Text style={styles.strokeButtonText}>{width}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearButtonClick}>
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.undoButton} onPress={handleUndoButtonClick}>
          <Text style={styles.buttonText}>Undo</Text>
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
  textHeader: {
    color: 'black',
    fontSize: 24,
    margin: 10,
    fontWeight: 'bold',
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
    marginTop: 10,
  },
  colorButton: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  strokeWidthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
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

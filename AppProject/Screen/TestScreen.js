import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Button,
    Image
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';

const TestScreen = ({navigation}) => {
    const [data, setData] = useState([])

    useEffect(() => {
        fetch('http://192.168.1.9:5000/getAllClients', {
            method: 'GET'
        })
            .then(resp => resp.json())
            .then(client => {
                setData(client)
            })
    }, [])

    const renderData = (item) => {
        return (
            <Card>
                <Text>{item.name}</Text>
                <Text>{item.phone}</Text>
                <Text>{item.email}</Text>
            </Card>
        )
    }
    const handleClearButtonClick = () => {
        setPaths([]);
        setCurrentPath([]);
        setClearButtonClicked(true);
    };

    return (
        <View style={styles.container}>
                <Image
                    source={require('../Image/logo-creatink.png')}
                    style={styles.imageStyle}
                    />
            
                <FlatList
                    data={data}
                    renderItem={({ item }) => {
                        return renderData(item)
                    }}
                    keyExtractor={item => `${item.id}`}
                />

                <Text
                    style={styles.registerTextStyle}
                    onPress={() => navigation.navigate('RegisterScreen')}>
                    Register Page
                </Text>
                <View style={styles.space} />
                <Text
                    style={styles.registerTextStyle2} 
                    onPress={() => navigation.navigate('DrawingScreen')}>
                    Drawing Page
                </Text>

            </View>
    )
};

export default TestScreen;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#cc30a0',
        alignContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor:'#4682b4',
        justifyContent:'center',
        alignItems: 'center',
        paddingBottom: 500,
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    buttonStyle: {
        backgroundColor: '#7DE24E',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 25,
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
        backgroundColor:'#3cb371',
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'flex-start',
        padding: 10,
        marginTop:10,
        marginBottom:20,
    },
    registerTextStyle2: {
        color: 'white',
        backgroundColor:'#3cb371',
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'flex-start',
        padding: 10,
        marginTop:10,
        marginBottom: 20,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    imageStyle: {
        width: 500,
        height: 500,
        resizeMode: 'contain',
        marginBottom:0,
        marginTop:0,
        alignSelf: 'center',
    },
});
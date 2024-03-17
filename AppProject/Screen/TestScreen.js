import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Button
} from 'react-native';
import { Card } from 'react-native-paper';

const TestScreen = ({navigation}) => {
    const [data, setData] = useState([])

    useEffect(() => {
        fetch('http://192.168.1.36:5000/getAllClients', {
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

    return (
        <View>
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
                TEST
            </Text>

            <Text
                style={styles.registerTextStyle}
                onPress={() => navigation.navigate('DrawingScreen')}>
                DRAW
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
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
});
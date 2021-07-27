import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
} from 'react-native';
class Room extends Component {
    render() {
        return (
        <View style={{ flex: 1, backgroundColor: 'red' }}>
            <Text>房间</Text>
            <Button title="返回" onPress={ () => { this.props.onaction(); } } />
        </View>
        );
    };
}

export default Room;
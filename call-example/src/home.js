import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
} from 'react-native';
class Home extends Component {
    render() {
        return (
        <View>
            <Text>首页</Text>
            <Button
            title="进入房间"
            onPress={() =>navigate('Room', { name: 'Jane' })}
            />
        </View>
        );
    };
}

export default Home;
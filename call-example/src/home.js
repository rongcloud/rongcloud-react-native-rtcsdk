import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import { RCReactNativeIm } from 'rc-react-native-im';
import sha1 from 'crypto-js/sha1';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            isRegisterAppKey: false,
            isConnecting: false
        }
    }

    componentDidMount() {
        // 注册 AppKey
        const AppKey = this.props.route.params.AppKey;
        RCReactNativeIm
            .init(AppKey)
            .then(()=>{
                this.setState({
                    isRegisterAppKey: true
                }); 
                console.log("AppKey注册成功!!!");
            });
    }

    setLoading = (loading) => this.setState({isConnecting: loading});

    dismissKeyboard = () => Keyboard.dismiss();

    gotoJoinRoom = (userId) => this.props.navigation.navigate('JoinRoom', {userId});
    
    async onClickConnect() {
        this.dismissKeyboard();
        this.setLoading(true);
        try {
            const token = await this.requestToken();
            const userId = await this.connectIM(token);
            this.gotoJoinRoom(userId);
        } catch (e) {
            alert(e.toString());
        } finally {
            this.setLoading(false);
        }
    }

    async requestToken() {
        const response = await fetch('http://api-cn.ronghub.com/user/getToken.json', {
            method: "POST",
            headers: this.getRequestHeaders(),
            body: new Blob([`userId=${this.state.userId}&name=${this.state.userId}&portraitUri=(null)`])
        });
        if (!response.ok) {
            throw Error(response.status);
        }
        const json = await response.json();
        return json.token;
    }

    getRequestHeaders() {
        const nonce = Math.floor(Math.random() * 1000000000) + "";
        const timestamp = new Date().getTime() + "";
        const signature = sha1(this.props.route.params.AppSecret + nonce + timestamp).toString();
        return {
            'App-Key': this.props.route.params.AppKey,
            'RC-Nonce': nonce,
            'RC-Timestamp': timestamp,
            'Signature': signature,
            'Content-Type': "application/x-www-form-urlencoded",
        }
    }

    async connectIM(token) {
        await RCReactNativeIm.disconnect();
        const result = await RCReactNativeIm.connect(token);
        if (result.error !== 0) {
            throw Error(`连接 IM Server 失败!!!\nerror=${result.error}`);
        }
        return result.userId;
    }

    render() {
        const userId = this.state.userId;
        const isRegisterAppKey = this.state.userId;
        return (
            <TouchableWithoutFeedback
                onPress={this.dismissKeyboard}>
                <View style={styles.container}>
                    <Text style={styles.title}>RongCallLib RN</Text>
                    <Text style={styles.subTitle}>请输入用户ID:</Text>
                    <Text style={styles.description}>应用内唯一标识，重复的用户 Id 将被当作为同一用户，支持大小写英文字母、数字、部分特殊符号 + = - _ 的组合方式，最大长度 64 字节。</Text>
                    <TextInput
                        style={styles.input}
                        value={this.state.userId}
                        onChangeText={(txt) => {this.setState({userId: txt})}}
                        keyboardType="default"/>
                    <TouchableOpacity
                        style={[styles.btn, {opacity: userId.length > 0 && isRegisterAppKey ? 1 : 0.5}]}
                        onPress={ this.onClickConnect.bind(this) }
                        disabled={userId.length == 0 && isRegisterAppKey}>
                        <ActivityIndicator 
                            style={styles.btnIndicator}
                            animating={this.state.isConnecting}
                            hidesWhenStopped={true}
                            color="white"/>
                        <Text style={styles.btnText}>连接 IM 服务</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
            );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        paddingTop: 0,
        backgroundColor: '#F3F8F9'
    },
    title: {
        textAlign: 'center',
        fontSize: 26,
        fontWeight: "bold",
        marginVertical: 50
    },
    subTitle: {
        fontSize: 17,
    },
    description: {
        fontSize: 13,
        color: 'gray',
        marginVertical: 15
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 5
    },
    btn: {
        marginTop: 40,
        height: 44,
        backgroundColor: "red",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1DB7FF',
        borderRadius: 5,
        letterSpacing: 10
    },
    btnText: {
        position: 'absolute',
        color: "white", 
        textAlign: "center", 
        fontSize: 16,
        width: 100
    },
    btnIndicator: {
        position:'relative',
        right: 60
    }
});

export default Home;
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableWithoutFeedback,
    TextInput,
    TouchableOpacity,
    Image,
    Keyboard,
    FlatList
} from 'react-native';

import { RCReactNativeIm } from 'rc-react-native-im';
import { RCReactNativeCall } from 'rc-react-native-call';

class UserCard extends Component {

    constructor(props) {
        super(props);
        this.state = {  
            value: props.value
        };
    }

    render() {
        return (
            <View style={styles.cardContainer}>
                <TextInput
                    style={styles.cardInput}
                    defaultValue={this.state.value}
                    onChangeText={txt => this.props.onChangeText(txt, this.props.index)}
                    keyboardType="number-pad"
                    placeholder={`请输入对方ID`}/>
                <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={ () => this.props.onDelete(this.props.index) }>
                    <Image style={styles.headerImg} source={require('./images/delete.png')} />
                </TouchableOpacity>
            </View>
        );
    }

}

class JoinRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userIds: [{key: 0, userId: "990099"}]
        }
        this.keyCount = 1;
    }

    dismissKeyboard = () => Keyboard.dismiss();

    async onClickUser() {
        RCReactNativeIm
            .disconnect()
            .then(()=>{
                this.props.navigation.goBack();
            });
    }

    onClickAdd() {
        const userIds = this.state.userIds;
        userIds.push({key: this.keyCount, userId: ""});
        this.setState({
            userIds
        });
        this.keyCount++;
    }    

    onClickJoinRoom() {
        const userIds = this.state.userIds;
        if (!userIds.every(({userId})=>userId.length > 0)) {
            alert("请输入对方ID");
            return;
        }

        this.onGotoCallRoom(true, userIds.map(({userId})=>userId));
    }

    onGotoCallRoom(isCallOut, args) {
        const options = { isCallOut };
        if (isCallOut) {
            options.userIds = args;
        } else {
            options.callSession = args;
        }
        this.props.navigation.navigate('Room', { options });
    }

    onCardChangeText(txt, idx) {
        this.state.userIds[idx].userId = txt;
    }

    onCardDelete(idx) {

        this.dismissKeyboard();

        var userIds = this.state.userIds;
        userIds.splice(idx, 1);
        this.setState({
            userIds
        });
    }

    componentDidMount() {
        RCReactNativeCall.init();
    }

    componentWillUnmount() {
        RCReactNativeCall.unInit();
    }

    render() {

        const userIds = this.state.userIds;
        const userCount = userIds.length;

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <TouchableWithoutFeedback
                    onPress={this.dismissKeyboard}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={styles.headerBtn}
                                onPress={ this.onClickUser.bind(this) }>
                                <Image style={styles.headerImg} source={require('./images/user.png')} />
                            </TouchableOpacity>
                            <Text style={styles.title}>UserID: {this.props.route.params.userId}</Text>
                            <TouchableOpacity
                                style={styles.headerBtn}
                                onPress={ this.onClickAdd.bind(this) }>
                                <Image style={styles.headerImg} source={require('./images/add.png')} />
                            </TouchableOpacity>
                        </View>
                        <FlatList 
                            style={styles.flatList} 
                            showsVerticalScrollIndicator={false}
                            data={userIds}
                            renderItem={({item, index})=> {
                                return (
                                    <UserCard 
                                        key={item.key}
                                        index={index}
                                        value={item.userId}
                                        onChangeText={this.onCardChangeText.bind(this)} 
                                        onDelete={this.onCardDelete.bind(this)}/>
                                );
                            }
                        }/>
                        <TouchableOpacity
                            style={[styles.btn, {opacity: userCount > 0 ? 1 : 0.5}]}
                            onPress={ this.onClickJoinRoom.bind(this) }
                            disabled={userCount == 0}>
                            <Text style={styles.btnText}>{userCount > 1 ? "开始群聊" : "开始单聊"}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row',
        padding: 30,
        paddingBottom: 20,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerImg: {
        width: 24,
        height: 24,
    },
    headerBtn: {
        width: 24,
        height: 24
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "bold"
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },  
    cardInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        marginRight: 10
    },
    flatList: {
        backgroundColor: '#F3F8F9',
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    btn: {
        margin: 30,
        height: 44,
        backgroundColor: "red",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1DB7FF',
        borderRadius: 5,
        letterSpacing: 10,
    },
    btnText: {
        position: 'absolute',
        color: "white", 
        textAlign: "center", 
        fontSize: 16,
        width: 100
    }
});

export default JoinRoom;
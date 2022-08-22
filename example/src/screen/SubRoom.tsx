import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, DeviceEventEmitter, FlatList, ListRenderItemInfo, StyleSheet, Text, TextInput, View } from "react-native";
import React from 'react';
import { rtcEngine } from "./Connect";
import {
    RRCToast,
} from 'react-native-overlayer';


// requestJoinSubRoom          邀请对方加入子房间        自己 OnJoinSubRoomRequested        对方 OnJoinSubRoomRequestReceived
// cancelJoinSubRoomRequest    取消邀请                自己 OnJoinSubRoomRequestCanceled  对方 OnCancelJoinSubRoomRequestReceived
// responseJoinSubRoomRequest  响应邀请                自己 OnJoinSubRoomRequestResponded 对方 OnJoinSubRoomRequestResponseReceived
// joinSubRoom                 加入子房间        
// leaveSubRoom                离开子房间


const styles = StyleSheet.create({
    input: {
        color: 'black',
        borderRadius: 2,
        fontSize: 25,
        borderColor: 'black',
        paddingLeft: 10,
        padding: 0,
        borderWidth: 1,
    }
})

interface SubRoomScreenProps extends NativeStackScreenProps<any> {

}

interface SubRoomScreenStates {
    roomId: string,
    userId: string,
    requested: boolean,//已经发出邀请。用来控制取消邀请按钮
    bandedSubRooms: string[],//已经加入的子房间
    joinedSubRooms: string[]//已经连麦的子房间
}

class SubRoomScreen extends React.Component<SubRoomScreenProps, SubRoomScreenStates> {
    static roomId: string = ''
    static userId: string = ''
    _extraUniqueKey = (item: any, index: number) => {
        return item + index
    }
    constructor(props: SubRoomScreenProps) {
        super(props)
        this.state = {
            roomId: SubRoomScreen.roomId,
            userId: SubRoomScreen.userId,
            requested: false,
            bandedSubRooms: this.props.route.params!.bandedSubRooms,
            joinedSubRooms: this.props.route.params!.joinedSubRooms
        }

        rtcEngine?.setOnJoinSubRoomRequestedListener((roomId: string, userId: string, code: number, message: string) => {
            if (code === 0)
                this.setState({ requested: true })//已发出邀请
        })

        rtcEngine?.setOnJoinSubRoomRequestCanceledListener((roomId: string, userId: string, code: number, message: string) => {
            if (code === 0)
                this.setState({ requested: false })//已取消邀请
        })

        rtcEngine?.setOnJoinSubRoomRequestResponseReceivedListener((roomId: string, userId: string, agree: boolean, extra: string) => {
            if (agree)//对方同意
            {
                RRCToast.show(`${userId}同意了加入房间${roomId}`)
                rtcEngine?.joinSubRoom(roomId)//对方同意，我加入房间
            }
            else {//对方没同意加入
                RRCToast.show(`${userId}拒绝了加入房间${roomId}`)
                this.setState({ requested: false })////对方没同意加入,可以禁用取消按钮了
            }
        })
    }

    setOptions() {
        this.props.navigation.setOptions({
            headerTitle: '跨房间连麦'
        });
    }

    componentDidMount() {
        this.setOptions();
        DeviceEventEmitter.addListener('OnUpdateJoinableSubRooms', (data: { bandedSubRooms: string[], joinedSubRooms: string[] }) => {
            this.setState({ bandedSubRooms: data.bandedSubRooms, joinedSubRooms: data.joinedSubRooms })
        })
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('OnUpdateJoinableSubRooms')
    }

    render() {
        //交集
        let joinableSubRooms = this.state.bandedSubRooms.filter((value) =>
            !this.state.joinedSubRooms.includes(value))
        return (
            <View style={{ padding: 10 }}>
                <Text>申请加入子房间</Text>
                <TextInput
                    placeholderTextColor='grey'
                    style={{ ...styles.input, marginTop: 10 }}
                    autoCapitalize='none'
                    placeholder='请输入子房间ID'
                    defaultValue={this.state.roomId}
                    onChangeText={(roomId) => {
                        roomId = roomId.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
                        this.setState({ roomId: roomId });
                        SubRoomScreen.roomId = roomId
                    }} />

                <TextInput
                    placeholderTextColor='grey'
                    style={{ ...styles.input, marginTop: 10 }}
                    autoCapitalize='none'
                    placeholder='请输入子房间中的用户ID'
                    defaultValue={this.state.userId}
                    onChangeText={(userId) => {
                        userId = userId.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
                        this.setState({ userId: userId });
                        SubRoomScreen.userId = userId
                    }} />

                <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button title='邀请' onPress={() => {
                        rtcEngine?.requestJoinSubRoom(this.state.roomId, this.state.userId, true, '');
                    }} />

                    <Button title='取消邀请' disabled={!this.state.requested || this.state.roomId == '' || this.state.userId == ''} onPress={() => {
                        rtcEngine?.cancelJoinSubRoomRequest(this.state.roomId, this.state.userId, '');
                    }} />
                </View>

                <View style={{ height: 1, borderBottomWidth: 1, borderColor: 'lightblue', marginTop: 10 }} />
                <Text>已加入的子房间</Text>
                {
                    this.state.joinedSubRooms.length === 0 ?
                        <Text>暂未加入任何子房间</Text> :
                        (
                            <FlatList
                                keyExtractor={this._extraUniqueKey}
                                style={{ marginTop: 5 }}
                                data={this.state.joinedSubRooms}
                                ItemSeparatorComponent={() => (
                                    <View style={{ height: 5 }} />
                                )}
                                renderItem={(itemInfo: ListRenderItemInfo<string>) => {
                                    const item = itemInfo.item
                                    return (
                                        <View
                                            style={{ marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text>{item}</Text>

                                            <Button title="离开" onPress={() => {
                                                rtcEngine?.leaveSubRoom(item, false)
                                            }} />
                                            <Button title="离开并解散" onPress={() => {
                                                rtcEngine?.leaveSubRoom(item, true)
                                                let jbandedSubRoomsIndex = this.state.bandedSubRooms.indexOf(item);
                                                if (jbandedSubRoomsIndex != -1) {
                                                    this.state.bandedSubRooms.splice(jbandedSubRoomsIndex, 1);
                                                }
                                            }} />
                                        </View>)
                                }}
                            />
                        )
                }

                <View style={{ height: 1, borderBottomWidth: 1, borderColor: 'lightblue', marginTop: 10 }} />

                <Text>加入已连麦的子房间</Text>
                {
                    joinableSubRooms.length === 0 ?
                        <Text>暂时没有可以直接加入的子房间</Text> :
                        <FlatList
                            keyExtractor={this._extraUniqueKey}
                            style={{ marginTop: 5 }}
                            data={joinableSubRooms}
                            ItemSeparatorComponent={() => (
                                <View style={{ height: 5 }} />
                            )}
                            renderItem={(itemInfo: ListRenderItemInfo<string>) => {
                                const item = itemInfo.item
                                return (
                                    <View
                                        style={{ marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>{item}</Text>

                                        <Button title="加入" onPress={() => {
                                            rtcEngine?.joinSubRoom(item)
                                        }} />
                                    </View>)
                            }}
                        />
                }

            </View>)
    }
}
export default SubRoomScreen;
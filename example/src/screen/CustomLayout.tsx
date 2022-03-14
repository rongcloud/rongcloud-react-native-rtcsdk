import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, Button, DeviceEventEmitter, FlatList, Image, ListRenderItemInfo, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import React, { RefObject } from 'react';
import Pop from "../component/Pop";
import Picker from "../component/Picker";
import { RCRTCCustomLayout, RCRTCEngine, RCRTCStreamType } from '@rongcloud/react-native-rtc';




interface CustomLayoutScreenProps extends NativeStackScreenProps<any> {

}



interface CustomLayoutScreenStates {
    userIndex: number,
    videoX: string,
    videoY: string,
    videoWidth: string,
    videoHeight: string,

}


class CustomLayoutScreen extends React.Component<CustomLayoutScreenProps, CustomLayoutScreenStates> {
    static customLayouts: Map<string, RCRTCCustomLayout>=new Map()
    _extraUniqueKey = (item: any, index: number) => {
        return item + index
    }
    users: { id: string, tag: string | null }[];
    pop: RefObject<Pop>;
    constructor(props: CustomLayoutScreenProps) {
        super(props);
        this.pop = React.createRef<Pop>();
        this.users = this.props.route.params!.users
        this.state = {
            userIndex: 0,
            videoX: '0',
            videoY: '0',
            videoWidth: '180',
            videoHeight: '320',
        }
    }

    setOptions() {
        this.props.navigation.setOptions({
            headerTitle: '自定义视频布局',
        });
    }

    componentDidMount() {
        this.setOptions();
    }

    renderItem(itemInfo: ListRenderItemInfo<RCRTCCustomLayout>) {
        let item = itemInfo.item
        return (
            <View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15 }}>
                <Text style={{ flex: 1 }}>{JSON.stringify(item)}</Text>
                <TouchableOpacity onPress={() => {
                    CustomLayoutScreen.customLayouts.delete(item.id)
                    this.setState({})
                }}>
                    <Image source={{ uri: 'delete' }} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
            </View>)
    }

    addLayout() {
        let items = this.users.map((value, index) => {
            return { value: index, label: value.tag ? value.tag : value.id }//存在tag就显示tag，说明是自定义视频。不存在tag就显示id
        })

        this.pop.current?.setView(
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20 }}>视频配置</Text>
                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                    <Text >请选择一个用户:</Text>
                    <Picker
                        items={items}
                        value={this.state.userIndex}
                        onValueChange={(value) => this.setState({ userIndex: value })}
                    />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center' }}>
                    <Text >视频位置X:</Text>
                    <TextInput
                        placeholderTextColor='grey'
                        style={[styles.input, { fontSize: 15, flex: 1 }]}
                        underlineColorAndroid={'transparent'}
                        defaultValue={this.state.videoX}
                        keyboardType='number-pad'
                        onChangeText={(x) => this.setState({ videoX: x })} />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center' }}>
                    <Text >视频位置Y:</Text>
                    <TextInput
                        placeholderTextColor='grey'
                        style={[styles.input, { fontSize: 15, flex: 1 }]}
                        underlineColorAndroid={'transparent'}
                        defaultValue={this.state.videoY}
                        keyboardType='number-pad'
                        onChangeText={(y) => this.setState({ videoY: y })} />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center' }}>
                    <Text >视频宽度:</Text>
                    <TextInput
                        placeholderTextColor='grey'
                        style={[styles.input, { fontSize: 15, flex: 1 }]}
                        underlineColorAndroid={'transparent'}
                        defaultValue={this.state.videoWidth}
                        keyboardType='number-pad'
                        onChangeText={(width) => this.setState({ videoWidth: width })} />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center' }}>
                    <Text >视频高度:</Text>
                    <TextInput
                        placeholderTextColor='grey'
                        style={[styles.input, { fontSize: 15, flex: 1 }]}
                        autoCapitalize='none'
                        underlineColorAndroid={'transparent'}
                        keyboardType='number-pad'
                        defaultValue={this.state.videoHeight}
                        onChangeText={(height) => this.setState({ videoHeight: height })} />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'flex-end' }}>
                    <Button title="OK" onPress={() => {
                        this.pop.current?.close()

                        let layout: RCRTCCustomLayout = {
                            id: this.users[this.state.userIndex].id,
                            x: Number(this.state.videoX),
                            y: Number(this.state.videoY),
                            width: Number(this.state.videoWidth),
                            height: Number(this.state.videoHeight)
                        }
                        if (this.users[this.state.userIndex].tag) {
                            layout.tag = this.users[this.state.userIndex].tag!
                            layout.type = RCRTCStreamType.FILE
                        }
                        else
                            layout.type = RCRTCStreamType.LIVE
                        CustomLayoutScreen.customLayouts.set(layout.id,layout)
                        this.setState({})
                    }} />
                    <View style={{ width: 30 }} />
                    <Button title="Cancel" onPress={() => this.pop.current?.close()} />
                </View>
            </View>)
    }


    render() {
        let customLayouts = Array.from(CustomLayoutScreen.customLayouts.values())
        return (<View style={{ flex: 1 }}>
            <FlatList
                keyExtractor={this._extraUniqueKey}
                style={{ flex: 1, marginTop: 10 }}
                data={customLayouts}
                ItemSeparatorComponent={() => {
                    return (<View style={{ height: 1, backgroundColor: 'grey', marginTop: 5, marginBottom: 5 }} />)
                }}
                renderItem={(itemInfo: ListRenderItemInfo<RCRTCCustomLayout>) => {
                    return this.renderItem(itemInfo)
                }}
            />

            <View style={{ flexDirection: 'row', marginBottom: 15, justifyContent: 'center' }}>
                <Button title="新增" onPress={() => this.addLayout()} />
                <View style={{ width: 30 }}></View>
                <Button title="提交" onPress={() => {
                    if (customLayouts.length > 0) {
                        RCRTCEngine.setLiveMixCustomLayouts(customLayouts);
                        DeviceEventEmitter.emit('OnMixLayoutModeChange')
                        this.props.navigation.goBack()
                    }
                    else
                        Alert.alert('', '至少需要一个自定义布局', [{
                            text: '确定',
                            onPress: () => {
                            },
                        }], { cancelable: true });
                }} />
                <View style={{ width: 30 }} />
                <Button title="取消" onPress={() => { this.props.navigation.goBack() }} />
            </View>

            <Pop ref={this.pop} />

        </View>)
    }
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 2,
        fontSize: 25,
        borderColor: 'black',
        paddingLeft: 10,
        padding: 0,
        borderWidth: 1,
    }
})


export default CustomLayoutScreen;
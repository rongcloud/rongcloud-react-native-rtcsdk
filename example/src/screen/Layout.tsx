import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, DeviceEventEmitter, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import React, { RefObject } from 'react';
import Radio from "../component/Radio";
import Pop from "../component/Pop";
import Picker from "../component/Picker";
import * as Constants from '../constants'
import { RCRTCEngine, RCRTCLiveMixLayoutMode, RCRTCLiveMixRenderMode } from '@rongcloud/react-native-rtc';
import CheckBox from "../component/CheckBox";


interface Color {
    color: string,
    selected: boolean
    value: number
}

interface LayoutScreenProps extends NativeStackScreenProps<any> {

}

interface LayoutScreenStates {
    colors: Color[],
    videoBitrate: number,
    tinyVideoBitrate: number,
    videoFps: number
    tinyVideoFps: number,
    resolution: number,
    tinyResolution: number,
    audioBitrate: number,
    mixLayoutMode: RCRTCLiveMixLayoutMode,
    renderMode: RCRTCLiveMixRenderMode
}

class LayoutScreen extends React.Component<LayoutScreenProps, LayoutScreenStates> {
    pop: RefObject<Pop>;
    constructor(props: LayoutScreenProps) {
        super(props)
        this.pop = React.createRef<Pop>();
        this.state = {
            colors: [{
                color: 'red',
                selected: false,
                value: 0xff0000
            },
            {
                color: 'orange',
                selected: false,
                value: 0xFFA500
            },
            {
                color: 'yellow',
                selected: false,
                value: 0xFFFF00
            },
            {
                color: 'green',
                selected: false,
                value: 0x00FF00
            }, {
                color: 'blue',
                selected: false,
                value: 0x0000FF
            }],
            videoBitrate: 2200,
            tinyVideoBitrate: 500,
            videoFps: 2,
            tinyVideoFps: 1,
            resolution: 15,
            tinyResolution: 11,
            audioBitrate: 48,
            mixLayoutMode: RCRTCLiveMixLayoutMode.Suspension,
            renderMode: RCRTCLiveMixRenderMode.Crop
        }

        RCRTCEngine.setOnLiveMixBackgroundColorSetListener((code: number, message: string) => {
            console.log(`OnLiveMixBackgroundColorSetListener code=${code} message=${message}`)
        })



        DeviceEventEmitter.addListener('OnMixLayoutModeChange', () => {
            this.setState({ mixLayoutMode: RCRTCLiveMixLayoutMode.Custom })
        })
    }

    setOptions() {
        this.props.navigation.setOptions({
            headerTitle: '合流布局面板'
        });
    }

    componentDidMount() {
        this.setOptions();
    }

    setBackground() {
        let ColorRadio = (props: { colors: Color[], onSelect: (value: number) => void }) => {
            const radius = 30
            let [state, setState] = React.useState(props.colors)

            let render_content = props.colors.
                map((value: Color, index: number) => {
                    let radio: ViewStyle = {
                        borderColor: value.color,
                        borderWidth: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: radius + 10,
                        height: radius + 10,
                        borderRadius: (radius + 10) / 2,
                    }

                    let radioActive: ViewStyle = {
                        width: radius,
                        height: radius,
                        borderRadius: radius / 2,
                        backgroundColor: value.color,
                    }
                    let marginLeft = index == 0 ? 0 : 10
                    return (
                        <TouchableOpacity key={index} style={{ marginLeft: marginLeft }}
                            onPress={() => {
                                let colors = [...state]
                                colors.forEach(v => v.selected = false)
                                colors[index].selected = true
                                setState(colors)
                                props.onSelect!(index)
                            }}>
                            <View style={radio}>{value.selected && <View style={radioActive} />}</View>
                        </TouchableOpacity>
                    )
                })

            return (
                <View
                    style={{ flexDirection: 'row' }} >
                    {
                        render_content
                    }
                </View>
            )
        }

        this.pop.current?.setView(
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 20 }}>选择背景颜色</Text>
                <View
                    style={{ alignItems: 'center', marginBottom: 20, marginTop: 20 }} >
                    <ColorRadio colors={this.state.colors}
                        onSelect={index => {
                            RCRTCEngine.setLiveMixBackgroundColor(this.state.colors[index].value)
                            this.pop.current?.close()
                        }} />
                </View>
            </View>
        )
    }

    setVideo(tiny: boolean) {
        this.pop.current?.setView(
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20 }}>视频配置</Text>
                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                    <Text >码率:</Text>
                    <Picker
                        items={tiny ? Constants.minVideoKbps : Constants.maxVideoKbps}
                        value={tiny ? this.state.tinyVideoBitrate : this.state.videoBitrate}
                        onValueChange={(value) => {
                            RCRTCEngine.setLiveMixVideoBitrate(value, tiny)
                            if (tiny)
                                this.setState({ tinyVideoBitrate: value })
                            else
                                this.setState({ videoBitrate: value })
                        }}
                    />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <Text >帧率:</Text>
                    <Picker
                        items={Constants.fps}
                        value={tiny ? this.state.tinyVideoFps : this.state.videoFps}
                        onValueChange={(value) => {
                            RCRTCEngine.setLiveMixVideoFps(value, tiny)
                            if (tiny)
                                this.setState({ tinyVideoFps: value })
                            else
                                this.setState({ videoFps: value })
                        }}

                    />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <Text >视频分辨率:</Text>
                    <Picker
                        items={Constants.resolution}
                        value={tiny ? this.state.tinyResolution : this.state.resolution}
                        onValueChange={(value) => {
                            const width = Constants.resolution[value].width;
                            const height = Constants.resolution[value].height
                            RCRTCEngine.setLiveMixVideoResolution(width, height, tiny)
                            if (tiny)
                                this.setState({ tinyResolution: value })
                            else
                                this.setState({ resolution: value })
                        }}
                    />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'flex-end' }}>
                    <Button title="OK" onPress={() => { this.pop.current?.close() }} />
                </View>
            </View>
        )
    }

    setCustomVideo() {
        let users = [{ id: this.props.route.params!.userId, tag: null }, ...this.props.route.params!.users]
        if (this.props.route.params!.customTag) {
            users.push({ id: this.props.route.params!.userId, tag: this.props.route.params!.customTag })
        }

        this.props.navigation.navigate('CustomLayout', { users: users })
    }

    setAudio() {
        this.pop.current?.setView(
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20 }}>音频配置</Text>
                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                    <Text >码率:</Text>
                    <Picker
                        items={Constants.liveMixAudioKbps}
                        value={this.state.audioBitrate}
                        onValueChange={(value) => {
                            RCRTCEngine.setLiveMixAudioBitrate(value)
                            this.setState({ audioBitrate: value })
                        }}
                    />
                </View>


                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'flex-end' }}>
                    <Button title="OK" onPress={() => { this.pop.current?.close() }} />
                </View>
            </View>)
    }

    setAudioMix() {
        let users: { id: string, tag: string | null }[] = this.props.route.params!.users
        let userSelected: boolean[] = users.map(() => false)

        let Content = () => {
            let [userState, setState] = React.useState(userSelected)
            let render_content = users.map((value, index) => {
                return (
                    <View key={index} style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                        <CheckBox
                            text={value.id}
                            onValueChange={() => {
                                let state = [...userState]
                                state[index] = !state[index]
                                setState(state)
                                userSelected = state
                            }}
                            value={userState[index]} />
                    </View>
                )
            })

            return (
                <View>
                    {render_content}
                </View>
            )
        }

        this.pop.current?.setView(
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20 }}>请选择参与音频合流的用户</Text>
                <Content />
                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'flex-end' }}>
                    <Button
                        title="OK"
                        onPress={() => {
                            this.pop.current?.close()
                            const userIds = users.filter((value, index) => userSelected[index]).map(value => value.id)
                            if (userIds.length > 0)
                                RCRTCEngine.setLiveMixCustomAudios(userIds)
                        }} />

                </View>
            </View>)
    }

    render() {
        return (
            <View style={{ padding: 10 }}>
                <Text>合流布局模式</Text>

                <Radio
                    style={{ marginTop: 5 }}
                    alignItems='flex-start'
                    items={[
                        { label: '自定义', value: RCRTCLiveMixLayoutMode.Custom },
                        { label: '悬浮', value: RCRTCLiveMixLayoutMode.Suspension },
                        { label: '自适应', value: RCRTCLiveMixLayoutMode.Adaptive },
                    ]}
                    value={this.state.mixLayoutMode}
                    onSelect={(value) => {
                        this.setState({ mixLayoutMode: value })
                        RCRTCEngine.setLiveMixLayoutMode(value);
                        if (value == RCRTCLiveMixLayoutMode.Custom)
                            this.setCustomVideo()
                    }}
                />
                <Text style={{ marginTop: 10 }}>合流裁剪模式</Text>
                <Radio
                    style={{ marginTop: 5 }}
                    alignItems='flex-start'
                    items={[
                        { label: '裁剪', value: RCRTCLiveMixRenderMode.Crop },
                        { label: '填充', value: RCRTCLiveMixRenderMode.Whole },
                    ]}
                    value={this.state.renderMode}
                    onSelect={(value) => {
                        this.setState({ renderMode: value })
                        RCRTCEngine.setLiveMixRenderMode(value)
                    }}
                />

                <View style={{ marginTop: 10 }} />
                <Button title="背景颜色设置" onPress={() => this.setBackground()} />
                <View style={{ marginTop: 10 }} />
                <Button title="视频设置" onPress={() => this.setVideo(false)} />
                <View style={{ marginTop: 10 }} />
                <Button title="小流视频设置" onPress={() => this.setVideo(true)} />
                <View style={{ marginTop: 10 }} />
                <Button title="视频自定义布局" onPress={() => this.setCustomVideo()} />
                <View style={{ marginTop: 10 }} />
                <Button title="音频设置" onPress={() => this.setAudio()} />
                <View style={{ marginTop: 10 }} />
                <Button title="音频自定义合流" onPress={() => this.setAudioMix()} />
                <Pop ref={this.pop} />

            </View>)
    }
}
export default LayoutScreen;
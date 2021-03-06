import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Platform, Text, View } from "react-native";

import React from 'react';
import Radio from "../component/Radio";
import CheckBox from "../component/CheckBox";
import Slider from "@react-native-community/slider";
import { RCRTCAudioMixingMode, RCRTCEngine } from '@rongcloud/react-native-rtc';
import * as FS from 'react-native-fs'

interface SoundMixingScreenProps extends NativeStackScreenProps<any> {

}

enum PlayState {
    IDLE,
    Playing,
    Pause,
}


interface SoundMixingScreenStates {
    mixMode: RCRTCAudioMixingMode,
    playback: boolean,
    inputVolume: number
    localVolume: number,
    publishVolume: number,
    loop: number,
    playState: PlayState
}


class SoundMixingScreen extends React.Component<SoundMixingScreenProps, SoundMixingScreenStates> {
    audioPath: string = ''

    constructor(props: SoundMixingScreenProps) {
        super(props);

        let path = ''
        if (Platform.OS === 'android')
            path = 'file:///android_asset'
        else
            path = FS.MainBundlePath


        this.audioPath = path + '/music_0.mp3'

        this.state = {
            mixMode: RCRTCAudioMixingMode.Mixing,
            playback: true,
            inputVolume: 100,
            localVolume: 100,
            publishVolume: 100,
            loop: 1,
            playState: PlayState.IDLE
        }

        RCRTCEngine.setOnAudioMixingStartedListener(() => {
            console.log("OnAudioMixingStartedListener ")
        })

        RCRTCEngine.setOnAudioMixingPausedListener(() => {
            console.log("OnAudioMixingPausedListener")

        })

        RCRTCEngine.setOnAudioMixingStoppedListener(() => {
            console.log("OnAudioMixingStoppedListener")

        })

        RCRTCEngine.setOnAudioMixingFinishedListener(() => {
            console.log("OnAudioMixingFinishedListener")
        })
    }

    setOptions() {
        this.props.navigation.setOptions({
            headerTitle: '????????????'
        })
    }

    componentDidMount() {
        this.setOptions();
    }

    componentWillUnmount() {
        RCRTCEngine.stopAudioMixing()
    }

    render() {
        return (<View style={{ padding: 10 }}>
            <Text>???????????????????????????</Text>
            <Text style={{ marginTop: 10 }}>????????????</Text>
            <Radio
                style={{ marginTop: 10 }}
                alignItems='flex-start'
                items={[
                    { label: '?????????', value: RCRTCAudioMixingMode.None },
                    { label: '??????', value: RCRTCAudioMixingMode.Mixing },
                    { label: '??????', value: RCRTCAudioMixingMode.Replace },
                ]}
                value={this.state.mixMode}
                onSelect={(value) => {
                    this.setState({ mixMode: value })
                }}
            />

            <CheckBox
                style={{ marginTop: 10 }}
                text={'????????????'}
                onValueChange={() => { this.setState({ playback: !this.state.playback }) }}
                value={this.state.playback} />


            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, alignSelf: 'center' }}>
                <Text>????????????</Text>
                <View style={{ flex: 1 }}>
                    <Slider
                        onValueChange={(value) => {
                            this.setState({ inputVolume: Math.floor(value) })
                            RCRTCEngine.adjustAudioMixingVolume(value);
                        }}
                        value={this.state.inputVolume}
                        style={{ width: "100%", height: 10 }}
                        minimumValue={1}
                        maximumValue={100}
                        minimumTrackTintColor="#00FFFF"
                        maximumTrackTintColor="#00ff00"
                    />
                </View>
                <Text>{this.state.inputVolume}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, alignSelf: 'center' }}>
                <Text >????????????</Text>
                <View style={{ flex: 1 }}>
                    <Slider
                        onValueChange={(value) => {
                            this.setState({ localVolume: Math.floor(value) })
                            RCRTCEngine.adjustAudioMixingPlaybackVolume(value);
                        }}
                        value={this.state.localVolume}
                        style={{ width: "100%", height: 10 }}
                        minimumValue={1}
                        maximumValue={100}
                        minimumTrackTintColor="#00FFFF"
                        maximumTrackTintColor="#00ff00"
                    />
                </View>
                <Text>{this.state.localVolume}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, alignSelf: 'center' }}>
                <Text >????????????</Text>
                <View style={{ flex: 1 }}>
                    <Slider
                        onValueChange={(value) => {
                            this.setState({ publishVolume: Math.floor(value) })
                            RCRTCEngine.adjustAudioMixingPublishVolume(value);
                        }}
                        value={this.state.publishVolume}
                        style={{ width: "100%", height: 10 }}
                        minimumValue={1}
                        maximumValue={100}
                        minimumTrackTintColor="#00FFFF"
                        maximumTrackTintColor="#00ff00"
                    />
                </View>
                <Text>{this.state.publishVolume}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, alignSelf: 'center' }}>
                <Text >????????????</Text>
                <View style={{ flex: 1 }}>
                    <Slider
                        onValueChange={(value) => {
                            this.setState({ loop: Math.floor(value) })
                        }}
                        value={this.state.loop}
                        style={{ width: "100%", height: 10 }}
                        minimumValue={1}
                        maximumValue={100}
                        minimumTrackTintColor="#00FFFF"
                        maximumTrackTintColor="#00ff00"
                    />
                </View>
                <Text>{this.state.loop}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-around' }}>
                <Button
                    disabled={!(this.state.playState === PlayState.IDLE)} title="??????"
                    onPress={() => {
                        RCRTCEngine.startAudioMixing(this.audioPath, this.state.mixMode, this.state.playback, this.state.loop).then((code)=>{
                            console.log("startAudioMixing code="+code)
                        })
                        this.setState({ playState: PlayState.Playing })
                    }} />
                <Button
                    disabled={!(this.state.playState === PlayState.Playing)}
                    title="??????"
                    onPress={() => {
                        RCRTCEngine.pauseAudioMixing()
                        this.setState({ playState: PlayState.Pause })
                    }} />
                <Button
                    disabled={!(this.state.playState === PlayState.Pause)}
                    title="??????"
                    onPress={() => {
                        RCRTCEngine.resumeAudioMixing()
                        this.setState({ playState: PlayState.Playing })
                    }} />
                <Button
                    disabled={!(this.state.playState === PlayState.Playing)}
                    title="??????"
                    onPress={() => {
                        RCRTCEngine.stopAudioMixing()
                        this.setState({ playState: PlayState.IDLE })
                    }} />
            </View>
        </View >)

    }
}

export default SoundMixingScreen;
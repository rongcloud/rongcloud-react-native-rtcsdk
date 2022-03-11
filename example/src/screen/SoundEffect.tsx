import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Platform, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import React from 'react';
import { RCRTCEngine } from '@rongcloud/react-native-rtc';
import * as FS from 'react-native-fs'



interface SoundEffectScreenProps extends NativeStackScreenProps<any> {

}

interface SoundEffectScreenStates {
    effects: Effect[],
    id: number
}

interface Effect {
    name: string,
    id: number,
    path: string,
    volume: number,
    loop: number
}

class SoundEffectScreen extends React.Component<SoundEffectScreenProps, SoundEffectScreenStates> {
    constructor(props: SoundEffectScreenProps) {
        super(props);

        let path = ''
        if (Platform.OS === 'android')
            path = 'file:///android_asset'
        else
            path = FS.MainBundlePath

        this.state = {
            id: 1,
            effects: [{
                name: '反派大笑',
                id: 1,
                path: path + '/effect_0.mp3',
                volume: 50,
                loop: 1
            },
            {
                name: '狗子叫声',
                id: 2,
                path: path + '/effect_1.mp3',
                volume: 50,
                loop: 1
            }, {
                name: '胜利号角',
                id: 3,
                path: path + '/effect_2.mp3',
                volume: 50,
                loop: 1
            }
            ]
        }

        this.state.effects.forEach(effect => {
            RCRTCEngine.createAudioEffect(effect.path, effect.id).then(value => {
                console.log(`createAudioEffect ${effect.path} ${value}`)
            })
        })
    }

    setOptions() {
        this.props.navigation.setOptions({
            headerTitle: '音效面板'
        })
    }

    componentDidMount() {
        this.setOptions();
    }

    componentWillUnmount() {
        RCRTCEngine.stopAllAudioEffects()
    }

    renderEffect() {
        return this.state.effects.map((effect, index) => {
            return (
                <View key={index} style={{ borderColor: 'lightblue', borderWidth: 1, padding: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 20 }}>{effect.name}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5, alignItems: 'center'}}>
                        <Text style={{ fontSize: 10 }}>音量</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Slider
                                onValueChange={(value) => {
                                    let effects = [...this.state.effects]
                                    effects[index].volume = Math.floor(value);
                                    this.setState({ effects: effects })
                                }}
                                value={effect.volume}
                                style={{ width: "100%", height: 10 }}
                                minimumValue={0}
                                maximumValue={100}
                                minimumTrackTintColor="#00FFFF"
                                maximumTrackTintColor="#00ff00"
                            />
                        </View>
                        <Text>{effect.volume}</Text>
                        <Text style={{ fontSize: 10, marginLeft: 5 }}>循环次数</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Slider
                                onValueChange={(value) => {
                                    let effects = [...this.state.effects]
                                    effects[index].loop = Math.floor(value);
                                    this.setState({ effects: effects })
                                }}
                                value={effect.loop}
                                style={{ width: "100%", height: 10 }}
                                minimumValue={1}
                                maximumValue={9}
                                minimumTrackTintColor="#00FFFF"
                                maximumTrackTintColor="#00ff00"
                            />

                        </View>
                        <Text>{effect.loop}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-around' }}>
                        <Button title="播放" onPress={() =>
                            RCRTCEngine.playAudioEffect(effect.id, effect.volume, effect.loop)
                        } />
                        <Button title="暂停" onPress={() => RCRTCEngine.pauseAudioEffect(effect.id)}/>
                        <Button title="恢复" onPress={() => RCRTCEngine.resumeAudioEffect(effect.id)}/>
                        <Button title="停止" onPress={() => RCRTCEngine.stopAudioEffect(effect.id)}/>
                    </View>
                </View>
            )
        })
    }


    render() {
        return (
            <View style={{ padding: 10 }}>
                <View style={{ borderColor: 'lightblue', borderWidth: 1, padding: 10 }}>
                    <Text style={{ fontSize: 20, alignSelf: 'center' }}>所有音效总开关</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-around' }}>
                        <Button title="暂停" onPress={() => RCRTCEngine.pauseAllAudioEffects()} />
                        <Button title="恢复" onPress={() => RCRTCEngine.resumeAllAudioEffects()} />
                        <Button title="停止" onPress={() => RCRTCEngine.stopAllAudioEffects()} />
                    </View>
                </View>
                {
                    this.renderEffect()
                }

            </View>)

    }
}

export default SoundEffectScreen;
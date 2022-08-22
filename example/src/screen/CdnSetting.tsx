import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, FlatList, ListRenderItemInfo, Text, View } from "react-native";

import React, { RefObject } from 'react';
import Pop from "../component/Pop";
import * as Util from '../util';
import * as Config from '../config';
import { rtcEngine } from "./Connect";
import { RRCLoading } from 'react-native-overlayer';
import Clipboard from '@react-native-clipboard/clipboard'

interface CdnSettingScreenProps extends NativeStackScreenProps<any> {

}

interface CdnSettingScreenStates {
    cdns: Cdn[]
}

interface Cdn {
    id?: string,
    name?: string,
    flv: string,
    hls: string,
    push: string
    rtmp: string
}


class CdnSettingScreen extends React.Component<CdnSettingScreenProps, CdnSettingScreenStates> {
    _extraUniqueKey = (item: any, index: number) => {
        return item + index
    }
    pop: RefObject<Pop>;
    constructor(props: CdnSettingScreenProps) {
        super(props);
        this.pop = React.createRef<Pop>();
        this.state = {
            cdns: []
        }
    }

    setOptions() {
        this.props.navigation.setOptions({
            headerTitle: '配置CDN'
        });
    }

    componentDidMount() {
        this.setOptions();
    }

    loadCDNs() {
        RRCLoading.show();
        let url = Config.host + 'cdns'

        Util.get(url, (obj) => {
            let cdns: { id: string, name: string }[] = []
            for (let key in obj) {
                cdns.push({ id: key, name: obj[key] })
            }
            RRCLoading.hide();
            this.showCdn(cdns)
        }, (err) => {
            RRCLoading.hide();
            console.log(err)
        })
    }

    loadCDN(id: string, name: string) {
        RRCLoading.show();
        rtcEngine?.getSessionId().then((value) => {
            let session = value
            let url = `${Config.host}cdn/${id}/sealLive/${session}`;

            Util.get(url, (cdn: Cdn) => {
                rtcEngine?.addLiveCdn(cdn.push)
                cdn.name = name;
                cdn.id = id;
                let cdns = [...this.state.cdns, cdn]
                this.setState({ cdns: cdns })
                RRCLoading.hide();
            }, (err) => {
                console.log(err)
                RRCLoading.hide();
            })
        })
    }


    showCdn(cdns: { id: string, name: string }[]) {
        let render_content = cdns.map((value, index) => {
            return (
                <View key={index} style={{ marginTop: 10 }}>
                    <Button title={value.name} onPress={() => {
                        this.pop.current?.close()
                        this.loadCDN(value.id, value.name);
                    }}/>
                </View>
            )
        })


        this.pop.current?.setView(
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20 }}>音频配置</Text>
                {
                    render_content
                }

                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'flex-end' }}>
                    <Button title="OK" onPress={() => { this.pop.current?.close() }} />
                </View>
            </View>)
    }

    renderItem(itemInfo: ListRenderItemInfo<Cdn>) {
        let item = itemInfo.item
        return (<View>
            <Text>{item.name}</Text>
            <Text>{`flv地址:${item.flv}`}</Text>
            <Text>{`hls地址:${item.hls}`}</Text>
            <Text>{`push地址:${item.push}`}</Text>
            <Text>{`rtmp地址:${item.rtmp}`}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
                <Button title="复制" onPress={() => {
                    const str = `{item.name}\nflv地址:${item.flv}\nhls地址:${item.hls}\npush地址:${item.push}\nrtmp地址:${item.rtmp}`
                    Clipboard.setString(str);
                }}/>
                <View style={{ width: 100 }}/>
                <Button title="删除" onPress={() => {
                    let cdns = this.state.cdns.filter((value: Cdn, index: number) => index != itemInfo.index)
                    this.setState({ cdns: cdns })
                }}/>
            </View>
        </View>)
    }

    render() {
        return (<View style={{ flex: 1 }}>
            <FlatList
                keyExtractor={this._extraUniqueKey}
                style={{ flex: 1, marginTop: 10 }}
                data={this.state.cdns}
                ItemSeparatorComponent={() => {
                    return (<View style={{ height: 1, backgroundColor: 'grey', marginTop: 5, marginBottom: 5 }} />)
                }}

                renderItem={(itemInfo: ListRenderItemInfo<Cdn>) => {
                    return this.renderItem(itemInfo)
                }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 15 }}>
                <Button title="加载CDN" onPress={() => this.loadCDNs()} />
                <View style={{ width: 30 }}></View>
                <Button title="取消" onPress={() => { this.props.navigation.goBack() }} />
            </View>
            <Pop ref={this.pop}/>
          
        </View>)
    }
}

export default CdnSettingScreen;
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, FlatList, ListRenderItemInfo, Text, View } from "react-native";

import React from 'react';
import { RCRTCRole } from '@rongcloud/react-native-rtc';
import { imEngine } from './Connect';
import {
    RCIMIWConversationType,
    RCIMIWMessage,
    RCIMIWMessageType,
    RCIMIWTextMessage,
  } from '@rongcloud/react-native-im-wrapper';




interface MessageProps extends NativeStackScreenProps<any> {

}

interface Message {
    userId: string,
    msg: string
}

interface MessageStates {
    joinRoom: boolean,
    messages: Message[]
}


class MessageScreen extends React.Component<MessageProps, MessageStates> {
    _extraUniqueKey = (item: any, index: number) => {
        return item + index
    }
    unMount = false
    constructor(props: MessageProps) {
        super(props)
        this.state = {
            joinRoom: false,
            messages: []
        }
    }

    setOptions() {
        this.props.navigation.setOptions({
            headerTitle: '消息面板'
        });
    }

    componentDidMount() {
        this.setOptions();
        this.addListener();
    }

    addListener() {
        // 设置离开聊天室的回调
        imEngine?.setOnChatRoomLeftListener((code: number, targetId: string) => {
            if (code === 0) {
                this.setState({ joinRoom: false })
            }
        })

        // 设置加入聊天室的回调
        imEngine?.setOnChatRoomJoinedListener(
            (
                code: number,
                targetId: string
            ) => {
                if (code === 0) {
                    console.log('加入聊天室成功');
                    this.setState({ joinRoom: true });

                    // 设置接收到消息的监听
                    imEngine?.setOnMessageReceivedListener(
                        (
                            message: RCIMIWMessage,
                            left: number,
                            offline: boolean,
                            hasPackage: boolean
                        ) => {
                            if (this.unMount) return;
                            let timestamp = Math.floor(new Date().getTime() / 1000);
                            imEngine?.sendPrivateReadReceiptMessage(message.targetId || '', '', timestamp);
                            if (message.messageType !== RCIMIWMessageType.TEXT) return;
                            const textMessage: RCIMIWTextMessage = message as RCIMIWTextMessage;
                            this.addMessage({
                                userId: message.senderUserId || '',
                                msg: textMessage.text || '',
                            });
                        }
                    );
                } else {
                    console.log('加入聊天室失败,code: ', code);
                }
            }
        );

        // 设置消息发送回调
        imEngine?.setOnMessageSentListener(
            (code: number, message: RCIMIWMessage) => {
                if (code === 0) {
                    console.log('消息发送成功');
                    if (message.messageType !== RCIMIWMessageType.TEXT) return;
                    const textMessage: RCIMIWTextMessage = message as RCIMIWTextMessage;
                    const userId = this.props.route.params!.userId
                    this.addMessage({
                        userId: userId,
                        msg: textMessage.text || '',
                    });
                } else {
                    console.log('消息发送失败');
                }
            }
        );

    }

    componentWillUnmount() {
        this.unMount = true
    }

    addMessage(message: Message) {
        let messages = this.state.messages;
        messages.push(message)
        this.setState({ messages: messages })
    }

    render() {
        return (<View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <Button
                    title={this.state.joinRoom ? "离开聊天室" : "加入聊天室"}
                    onPress={() => {
                        const roomId = this.props.route.params!.roomId

                        if (this.state.joinRoom) {
                            imEngine?.leaveChatRoom(roomId)
                            .then((code: number) => {
                                if (code === 0) {
                                    console.log('leaveChatRoom 接口调用成功');
                                } else {
                                    console.log('leaveChatRoom 接口调用失败', code);
                                }
                            });
                        } else {
                            imEngine?.joinChatRoom(roomId, 50, true);
                        }
                    }}
                />
            </View>

            <FlatList
                keyExtractor={this._extraUniqueKey}
                style={{ flex: 1, marginTop: 10 }}
                data={this.state.messages}
                ItemSeparatorComponent={() => {
                    return (<View style={{ height: 1, backgroundColor: 'grey', marginTop: 5, marginBottom: 5 }} />)
                }}
                renderItem={(itemInfo: ListRenderItemInfo<Message>) => {
                    const item = itemInfo.item

                    const userId = this.props.route.params!.userId
                    let justifyContent: 'flex-end' | 'flex-start' = userId === item.userId ? 'flex-end' : 'flex-start'
                    return (
                        <View style={{ flexDirection: 'row', justifyContent: justifyContent, paddingLeft: 10, paddingRight: 10 }}>
                            <Text>{`${item.userId}:${item.msg}`}</Text>
                        </View>)
                }}
            />

            <View style={{ flexDirection: 'row', marginBottom: 15, justifyContent: 'center' }}>
                <Button
                    disabled={!this.state.joinRoom}
                    title="发送消息"
                    onPress={() => {
                        const roomId = this.props.route.params!.roomId
                        const role: RCRTCRole = this.props.route.params!.role
                        const msg = (role === RCRTCRole.LiveBroadcaster) ? '我是主播' : '我是观众'
                        // 创建文本消息
                        imEngine?.createTextMessage(
                            RCIMIWConversationType.CHATROOM,
                            roomId,
                            '',
                            msg
                        )
                        .then((message: RCIMIWTextMessage) => {
                            if (message) {
                                // 发送文本消息
                                imEngine?.sendMessage(message);
                            } 
                        });
                    }} />
            </View>
        </View>)
    }
}

export default MessageScreen;
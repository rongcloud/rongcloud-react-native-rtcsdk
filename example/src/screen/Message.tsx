import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, FlatList, ListRenderItemInfo, Text, View } from "react-native";

import React from 'react';
import * as IMLib from '@rongcloud/react-native-imlib'
import { RCRTCRole } from '@rongcloud/react-native-rtc';
import { ErrorCode, ObjectName, ReceiveMessage, SentMessage, TextMessage } from "@rongcloud/react-native-imlib";




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
                            IMLib.quitChatRoom(roomId).then(() => {
                                this.setState({ joinRoom: false })
                            })
                        }
                        else {
                            IMLib.joinChatRoom(roomId).then(() => {
                                this.setState({ joinRoom: true })
                                IMLib.addReceiveMessageListener(((msg: ReceiveMessage) => {
                                    if (this.unMount)
                                        return;

                                    const message = msg.message
                                    let timestamp = Math.floor(new Date().getTime() / 1000)
                                    IMLib.sendReadReceiptMessage(message.conversationType, message.targetId, timestamp)//发送已读回执
                                    const textMessage: TextMessage = message.content as TextMessage
                                    this.addMessage({ userId: message.senderUserId, msg: textMessage.content })
                                }))
                            })
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
                        const userId = this.props.route.params!.userId
                        const textMessage: TextMessage = {
                            objectName: ObjectName.Text,
                            content: msg
                        }

                        let imMsg: SentMessage = {
                            conversationType: IMLib.ConversationType.CHATROOM,
                            targetId: roomId,
                            content: textMessage,
                            pushContent: "",
                            pushData: ""
                        };

                        const callback: IMLib.SentMessageCallback = {
                            success: (messageId: number) => {
                                this.addMessage({
                                    userId: userId,
                                    msg: msg
                                })
                            },
                            progress: (progress: number, messageId: number) => {

                            },
                            cancel: () => {

                            },
                            error: (errorCode: ErrorCode, messageId: number, errorMessage?: string) => {

                            }
                        }

                        IMLib.sendMessage(imMsg, callback)
                    }} />
            </View>
        </View>)
    }
}

export default MessageScreen;
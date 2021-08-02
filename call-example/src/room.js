import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    findNodeHandle,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';

import { 
    RCReactNativeCall,
    RCReactNativeCallVideoView
} from 'rc-react-native-call';

import { 
    CallState,
    CallType
} from './defines';

class ItemButton extends Component {

    constructor(props) {
        super(props);
        this.style = props.style === undefined ? {} : props.style;
        this.state = {
            isSelected: props.selected === undefined ? false :  props.selected
        }
    }

    onClick() {
        const isSelected = !this.state.isSelected;
        this.setState({
            isSelected
        });
        this.props.onclick(isSelected);
    }

    render() {
        var imageSource = null;
        if (this.props.selectedImage !== undefined) {
            imageSource = this.state.isSelected ? this.props.selectedImage : this.props.image;
        } else {
            imageSource = this.props.image;
        }
        return (
            <View style={this.style}>
                <TouchableOpacity
                    style={styles.itemButton}
                    onPress={ this.onClick.bind(this) }>
                    <Image 
                        style={styles.btnButton} 
                        source={imageSource} />
                    <Text 
                        style={styles.itemTitle}>
                        {this.props.title}
                    </Text> 
                </TouchableOpacity>                   
            </View>
        );
    }
}

class Room extends Component {

    constructor(props) {
        super(props);
        this.viewHandles = {
            bigView: {
                userId: 0,
                view: null
            },
            smallViews: []
        };

        var callState = null;
        var callType = null;
        if (props.route.params.options.callSession === undefined) {
            callState = CallState.callout;
            callType = props.route.params.options.callType;
        } else {
            callState = CallState.callin;
            callType = props.route.params.options.callSession.mediaType;
        }

        this.state = {
            showMenus: true,
            callType,
            callState,
            config: {
                mute: false,
                handFree: true,
                disableCamera: false
            },
            smallUserIds: [],
            bigUserId: null
        };
    }

    componentDidMount(){

        this.addListener();

        if (this.state.callState === CallState.callout) {
            try {
                this.startCall(this.props.route.params.options);
            } catch (e) {
                alert(e.message);
            }
        }
    }

    componentWillUnmount() {
        this.removeListener();
    }

    async startCall(options) {
        const userIds = options.userIds;
        if (userIds.length == 0) {
            return;
        }
        if (userIds.length > 1) {
            await RCReactNativeCall.startGroupCall(userIds[0],userIds,null,this.state.callType,null);
        } else {
            await RCReactNativeCall.startSingleCall(userIds[0], this.state.callType, null);
        }
        const callSession = await RCReactNativeCall.getCurrentCallSession();
        this.viewHandles.bigView.userId = callSession.mine.userId;
        await this.onSetVideoViews();
        await RCReactNativeCall.enableSpeaker(this.state.config.handFree);
    }

    async onSetVideoViews() {
        if (this.viewHandles.bigView !== null) {
            await this.onSetBigVideoView(this.viewHandles.bigView);
        }
        this.viewHandles.smallViews.forEach((value)=>{
            this.onSetVideoView(value.userId, value.view);
        });
    }

    async onSetBigVideoView(options) {
        await this.onSetVideoView(options.userId, options.view);
        this.setState({
            bigUserId: options.userId
        });
    }

    async onSetVideoView(userId,ref) {
        if (userId == null || userId == undefined || ref == null || ref == undefined) {
            return;
        }
        await RCReactNativeCall.setVideoView(userId, ref, 0);
    }

    onGoBack() {
        this.props.navigation.goBack();
    }

    async onMute(isSelected) {
        this.state.config.mute = isSelected;
        await RCReactNativeCall.enableMicrophone(!isSelected);
    }

    async onHangup() {
        await RCReactNativeCall.hangup();
    }

    async onHandFree(isSelected) {
        this.state.config.handFree = isSelected;
        await RCReactNativeCall.enableSpeaker(isSelected);
    }

    async onAccept() {

        await RCReactNativeCall.accept();

    }

    async onChangeAudio() {
        await RCReactNativeCall.changeMediaType(CallType.audio);
        this.setState({
            callType: CallType.audio
        });
    }
    
    async onSwitchCamera() {
        await RCReactNativeCall.switchCamera();
    }

    async onDisableCamera(isSelected) {
        this.state.config.disableCamera = isSelected;
        const currentCamera = await RCReactNativeCall.currentCamera();
        await RCReactNativeCall.enableCamera(!isSelected,currentCamera);
    }

    bottomView() {            
        if (this.state.callState === CallState.callin) {
            return (
                <View style={[styles.bottomView, {justifyContent: 'space-around'}]}>
                    <ItemButton 
                        title="挂断" 
                        image={require('./images/hang_up.png')}
                        onclick={this.onHangup.bind(this)}/>
                    <ItemButton 
                        title="接听" 
                        image={ this.state.callType === CallType.video ? require('./images/answervideo.png') : require('./images/answer.png')}
                        onclick={this.onAccept.bind(this)}/>
                </View>
            );
        } else {
            return (
                <View style={styles.bottomView}>
                    <ItemButton 
                        title="静音"
                        selected={this.state.config.mute} 
                        image={require('./images/mute.png')}
                        selectedImage={require("./images/mute_hover.png")} 
                        onclick={this.onMute.bind(this)}/>  
                    <ItemButton 
                        title="挂断" 
                        image={require('./images/hang_up.png')}
                        onclick={this.onHangup.bind(this)}/>
                    <View>
                        {this.state.callType === CallType.video && (
                            <View>
                                <ItemButton
                                    style={{marginBottom: 25}}
                                    title="音频通话" 
                                    image={require('./images/audio.png')}
                                    onclick={this.onChangeAudio.bind(this)}/>
                                <ItemButton 
                                    style={{marginBottom: 25}}
                                    title="切换像机" 
                                    image={require('./images/camera.png')}
                                    onclick={this.onSwitchCamera.bind(this)}/>
                                <ItemButton 
                                    style={{marginBottom: 25}}
                                    title="摄像头" 
                                    selected={this.state.config.disableCamera}
                                    image={require('./images/video.png')}
                                    selectedImage={require("./images/video_hover.png")}
                                    onclick={this.onDisableCamera.bind(this)}/>
                            </View>
                        )}
                        <ItemButton 
                            title="免提" 
                            selected={this.state.config.handFree}
                            image={require('./images/handfree.png')}
                            selectedImage={require("./images/handfree_hover.png")}
                            onclick={this.onHandFree.bind(this)}/>
                    </View>
                </View>
            );
        }
    }

    smallVideoViews() {
        const smallUserIds = this.state.smallUserIds;
        return (
            <View>
                {
                    smallUserIds.map((userId)=>{
                        return (<RCReactNativeCallVideoView
                            key={userId}
                            style={styles.smallVideo} 
                            ref={ ref => { 
                                this.viewHandles.smallViews.push({
                                    view: findNodeHandle(ref),
                                    userId
                                });
                            }}/>
                        );
                    })
                }            
            </View>
        );
    }

    render() {
        const smallUserIds = this.state.smallUserIds;
        return (
            <View style={styles.container}>
                <RCReactNativeCallVideoView 
                    style={styles.bigVideo}
                    ref={ref => { this.viewHandles.bigView.view = findNodeHandle(ref); }}>
                </RCReactNativeCallVideoView>
                <View style={styles.content}>
                    <SafeAreaView style={{flex: 1}}>
                        <View style={{flex: 1}}>
                            <TouchableWithoutFeedback
                                onPress={()=>{this.setState({showMenus: !this.state.showMenus})}}>
                                <View style={styles.topView}>
                                    {this.state.showMenus ? this.bottomView() : null}
                                </View>
                            </TouchableWithoutFeedback>
                            <View pointerEvents="box-none" style={styles.videosView}>
                                <View  pointerEvents="box-none" style={{alignItems:'center'}}>
                                    <Text style={{color: 'white', fontSize: 18}}> {this.state.bigUserId === null ? "" : "UserID: " + this.state.bigUserId }</Text>
                                </View>
                                <ScrollView
                                    bounces={smallUserIds.length > 3}
                                    showsVerticalScrollIndicator={false}
                                    style={styles.videoScrollview}>
                                    {this.smallVideoViews()}
                                </ScrollView>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        );
    };

    //////////////////////////////////// Listener ////////////////////////////////////
    addListener() {
        RCReactNativeCall.ManagerEmitter.addListener("Engine:OnCallConnect", ()=>this.onCallConnect());
        RCReactNativeCall.ManagerEmitter.addListener("Engine:OnCallDisconnect", (r)=>this.onCallDisconnect(r));
    }

    removeListener() {
        RCReactNativeCall.ManagerEmitter.removeAllListeners("Engine:OnCallConnect");
        RCReactNativeCall.ManagerEmitter.removeAllListeners("Engine:OnCallDisconnect");
    }

    async onCallConnect() {
        try {
            const callSession = await RCReactNativeCall.getCurrentCallSession();
            const mineId = callSession.mine.userId;
            var smallUserIds = [mineId];
            var isHasBigView = false;
            callSession.users.forEach((user)=> {
                if (user.userId !== mineId) {
                    if (!isHasBigView) {
                        this.viewHandles.bigView.userId = user.userId;
                        isHasBigView = true;
                    } else {
                        smallUserIds.push(user.userId);
                    }
                }
            });

            this.setState({
                smallUserIds,
                callState: CallState.call
            });

            setTimeout(()=>{
                this.onSetVideoViews();
            },200);

        } catch (e) {
            alert(e);
        }
    }

    async onCallDisconnect(reason) {
        this.onGoBack();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bigVideo: {
        backgroundColor: '#000',
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    content: {
        height: '100%',
        width: '100%'
    },
    videosView:{
        position: 'absolute', 
        width: "100%", 
        height: "100%",
        zIndex: 10
    },
    videoScrollview: {
        width: 110,
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 170
    },  
    topView: {
        flex: 1,
        flexDirection: 'column-reverse',
        alignItems: 'center',
        zIndex: 1
    },
    bottomView: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 60,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
    },
    itemButton: {
        alignItems: 'center'
    },
    btnButton: {
        width: 65,
        height: 65
    },
    itemTitle: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
        includeFontPadding: false,
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    smallVideo: {
        backgroundColor: 'black', 
        width: 110, 
        aspectRatio:0.7, 
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#aaaaaa'
    }
});

export default Room;
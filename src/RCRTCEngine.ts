

import {
    DeviceEventEmitter,
    NativeEventEmitter,
    NativeModules,
    Platform,
} from 'react-native';

import {logger} from './Logger';
import {
    RCRTCAudioConfig,
    RCRTCAudioMixingMode,
    RCRTCCamera,
    RCRTCCameraCaptureOrientation,
    RCRTCCustomLayout,
    RCRTCEngineSetup,
    RCRTCErrorCode,
    RCRTCIWNetworkProbeStats,
    RCRTCIWPoint,
    RCRTCLiveMixLayoutMode,
    RCRTCLiveMixRenderMode,
    RCRTCLocalAudioStats,
    RCRTCLocalVideoStats,
    RCRTCMediaType,
    RCRTCNetworkStats,
    RCRTCRemoteAudioStats,
    RCRTCRemoteVideoStats,
    RCRTCRole,
    RCRTCRoomSetup,
    RCRTCVideoConfig,
    RCRTCVideoFps
} from './RCRTCDefines';

const { RCReactNativeRtc } = NativeModules;

const RCReactNativeEventEmitter = Platform.OS === 'ios' ? new NativeEventEmitter(RCReactNativeRtc) : DeviceEventEmitter;

export default class RCRTCEngine {
    static _instance: RCRTCEngine|null;

    /**
     * 创建 RTC 接口引擎
     *
     * @param setup  引擎初始化配置
     * @return 引擎实例
     */
    static create(setup?: RCRTCEngineSetup|undefined): RCRTCEngine
    {
        if (setup) {
            logger.log(`create setup=${logger.toString(setup)}`);
        }
        if (!RCRTCEngine._instance) {
            RCReactNativeRtc.create(setup);
            RCRTCEngine._instance = new RCRTCEngine();
        }
        return RCRTCEngine._instance;
    }

    /**
     * 销毁引擎
     *
     * @memberof RCRTCEngineInterface
     */
    destroy(): void
    {
        logger.log(`destroy`);
        RCReactNativeRtc.destroy();
        if (RCRTCEngine._instance) {
            RCRTCEngine._instance = null;
        }
    }

    /**
     * 加入房间
     *
     * @param {string} roomId 房间id
     * @param {RCRTCRoomSetup} setup 房间配置
     * @return {*}  {void}
     * @memberof RCRTCEngineInterface 错误码
     */
    joinRoom(roomId: string, setup: RCRTCRoomSetup): Promise<null>
    {
        logger.log(`joinRoom roomId=${roomId}, setup=${logger.toString(setup)}`);
        return RCReactNativeRtc.joinRoom(roomId, setup);
    }

    /**
     * 离开房间
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    leaveRoom(): Promise<RCRTCErrorCode>
    {
        logger.log(`leaveRoom`);
        return RCReactNativeRtc.leaveRoom();
    }

    /**
     * 加入房间后, 发布本地资源
     *
     * @param {RCRTCMediaType} type 媒体资源类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    publish(type: RCRTCMediaType): Promise<RCRTCErrorCode>
    {
        logger.log(`publish type=${type}`);
        return RCReactNativeRtc.publish(type);
    }

    /**
     * 加入房间后, 取消发布已经发布的本地资源
     *
     * @param {RCRTCMediaType} type 媒体资源类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    unpublish(type: RCRTCMediaType): Promise<RCRTCErrorCode>
    {
        logger.log(`unpublish type=${type}`);
        return RCReactNativeRtc.unpublish(type);
    }

    /**
     *
     * @param userId 远端用户 userId
     * @param type 媒体资源类型
     * @param tiny 视频小流, true:订阅视频小流 false:订阅视频大流
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    subscribe(userId: string, type: RCRTCMediaType, tiny: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`subscribe userId=${userId}, type=${type}, tiny=${tiny}`);
        return RCReactNativeRtc.subscribe(userId, type, tiny);
    }

    /**
     * 加入房间后, 订阅远端多个用户发布的资源
     *
     * @param {string[]} userIds 远端用户 userId 数组
     * @param {RCRTCMediaType} type 媒体资源类型
     * @param {boolean} tiny 是否视频小流 true:订阅视频小流 false:订阅视频大流
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    subscribes(userIds: string[], type: RCRTCMediaType, tiny: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`subscribes userIds=${userIds}, type=${type}, tiny=${tiny}`);
        return RCReactNativeRtc.subscribes(userIds, type, tiny);
    }

    /**
     * 加入房间后, 取消订阅远端单个用户发布的资源
     *
     * @param {string} userId 远端用户 userId
     * @param {RCRTCMediaType} type 媒体资源类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    unsubscribe(userId: string, type: RCRTCMediaType): Promise<RCRTCErrorCode>
    {
        logger.log(`unsubscribe userId=${userId}, type=${type}`);
        return RCReactNativeRtc.unsubscribe(userId, type);
    }

    /**
     * 加入房间后, 取消订阅远端多个用户发布的资源
     *
     * @param {string[]} userIds 远端用户 userId 数组
     * @param {RCRTCMediaType} type 媒体资源类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    unsubscribes(userIds: string[], type: RCRTCMediaType): Promise<RCRTCErrorCode>
    {
        logger.log(`unsubscribes userIds=${userIds}, type=${type}`);
        return RCReactNativeRtc.unsubscribes(userIds, type);
    }

    /**
     * 订阅主播合流资源, 仅供直播观众用户使用
     *
     * @param {RCRTCMediaType} type 媒体资源类型
     * @param {boolean} tiny 是否视频小流 true:订阅视频小流 false:订阅视频大流
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    subscribeLiveMix(type: RCRTCMediaType, tiny: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`subscribeLiveMix type=${type}, tiny=${tiny}`);
        return RCReactNativeRtc.subscribeLiveMix(type, tiny);
    }

    /**
     * 取消订阅主播合流资源, 仅供直播观众用户使用
     *
     * @param {RCRTCMediaType} type 媒体资源类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    unsubscribeLiveMix(type: RCRTCMediaType): Promise<RCRTCErrorCode>
    {
        logger.log(`unsubscribeLiveMix type=${type}`);
        return RCReactNativeRtc.unsubscribeLiveMix(type);
    }

    /**
     * 设置默认音频参数, 仅供会议用户或直播主播用户使用
     *
     * @param {RCRTCAudioConfig} config 音频配置
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setAudioConfig(config: RCRTCAudioConfig): Promise<RCRTCErrorCode>
    {
        logger.log(`setAudioConfig config=${logger.toString(config)}`);
        return RCReactNativeRtc.setAudioConfig(config);
    }

    /**
     * 设置默认视频参数, 仅供会议用户或直播主播用户使用
     *
     * @param {RCRTCVideoConfig} config 视频配置
     * @param {false} [tiny] 是否小流 true:视频小流 false:视频大流
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setVideoConfig(config: RCRTCVideoConfig, tiny: boolean = false): Promise<RCRTCErrorCode>
    {
        logger.log(`setVideoConfig config=${logger.toString(config)}, tiny=${tiny}`);
        return RCReactNativeRtc.setVideoConfig(config, tiny);
    }

    /**
     * 打开/关闭麦克风
     *
     * @param {boolean} enable true 打开, false 关闭
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    enableMicrophone(enable: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`enableMicrophone enable=${enable}`);
        return RCReactNativeRtc.enableMicrophone(enable);
    }

    /**
     * 打开/关闭外放
     *
     * @param {boolean} enable true 打开, false 关闭
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    enableSpeaker(enable: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`enableSpeaker enable=${enable}`);
        return RCReactNativeRtc.enableSpeaker(enable);
    }

    /**
     * 设置麦克风的音量
     *
     * @param {number} volume 0 ~ 100, 默认值: 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    adjustLocalVolume(volume: number): Promise<RCRTCErrorCode>
    {
        logger.log(`adjustLocalVolume volume=${volume}`);
        return RCReactNativeRtc.adjustLocalVolume(volume);
    }

    /**
     * 打开/关闭摄像头
     *
     * @param {boolean} enable true：打开， false：关闭
     * @param {RCRTCCamera} camera 摄像头类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    enableCamera(enable: boolean, camera: RCRTCCamera): Promise<RCRTCErrorCode>
    {
        logger.log(`enableCamera enable=${enable}, camera=${camera}`);
        return RCReactNativeRtc.enableCamera(enable, camera);
    }

    /**
     * 切换前后摄像头
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    switchCamera(): Promise<RCRTCErrorCode>
    {
        logger.log(`switchCamera`);
        return RCReactNativeRtc.switchCamera();
    }

    /**
     * 切换到指定摄像头
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    switchToCamera(camera: RCRTCCamera): Promise<RCRTCErrorCode>
    {
        logger.log(`switchToCamera camera=${camera}`);
        return RCReactNativeRtc.switchToCamera(camera);
    }

    /**
     * 获取当前使用摄像头位置
     *
     * @return {*}  {Promise<RCRTCCamera>} 摄像头类型
     * @memberof RCRTCEngineInterface
     */
    whichCamera(): Promise<RCRTCCamera>
    {
        logger.log(`whichCamera`);
        return RCReactNativeRtc.whichCamera();
    }

    /**
     * 获取摄像头是否支持区域对焦
     *
     * @return {*}  {boolean} true: 支持  false: 不支持
     * @memberof RCRTCEngineInterface
     */
    isCameraFocusSupported(): Promise<boolean>
    {
        logger.log(`isCameraFocusSupported`);
        return RCReactNativeRtc.isCameraFocusSupported();
    }

    /**
     * 获取摄像头是否支持区域测光
     *
     * @return {*}  {boolean} true: 支持  false: 不支持
     * @memberof RCRTCEngineInterface
     */
    isCameraExposurePositionSupported(): Promise<boolean>
    {
        logger.log(`isCameraExposurePositionSupported`);
        return RCReactNativeRtc.isCameraExposurePositionSupported();
    }

    /**
     * 设置在指定点区域对焦
     *
     * @param {number} x 对焦点，视图上的 x 轴坐标
     * @param {number} y 对焦点，视图上的 y 轴坐标
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setCameraFocusPositionInPreview(x: number, y: number): Promise<RCRTCErrorCode>
    {
        logger.log(`setCameraFocusPositionInPreview x=${x}, y=${y}`);
        return RCReactNativeRtc.setCameraFocusPositionInPreview(x, y);
    }

    /**
     * 设置在指定点区域测光
     *
     * @param {number} x 曝光点，视图上的 x 轴坐标
     * @param {number} y 曝光点，视图上的 y 轴坐标
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setCameraExposurePositionInPreview(x: number, y: number): Promise<RCRTCErrorCode>
    {
        logger.log(`setCameraExposurePositionInPreview x=${x}, y=${y}`);
        return RCReactNativeRtc.setCameraExposurePositionInPreview(x, y);
    }

    /**
     * 设置摄像头采集方向
     *
     * @param {RCRTCCameraCaptureOrientation} orientation 默认以 Portrait 角度进行采集
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setCameraCaptureOrientation(orientation: RCRTCCameraCaptureOrientation): Promise<RCRTCErrorCode>
    {
        logger.log(`setCameraCaptureOrientation orientation=${orientation}`);
        return RCReactNativeRtc.setCameraCaptureOrientation(orientation);
    }

    /**
     * 设置本地视频渲染窗口
     *
     * @param {number} tag 窗口的 tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLocalView(tag: number): Promise<RCRTCErrorCode>
    {
        logger.log(`setLocalView tag=${tag}`);
        return RCReactNativeRtc.setLocalView(tag);
    }

    /**
     * 移除本地视频渲染窗口
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeLocalView(): Promise<RCRTCErrorCode>
    {
        logger.log(`removeLocalView`);
        return RCReactNativeRtc.removeLocalView();
    }

    /**
     * 设置远端视频窗口
     *
     * @param {string} userId 远端用户Id
     * @param {string} ref 窗口的 ref
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setRemoteView(userId: string, tag: number): Promise<RCRTCErrorCode>
    {
        logger.log(`setRemoteView userId=${userId}, tag=${tag}`);
        return RCReactNativeRtc.setRemoteView(userId, tag);
    }

    /**
     * 移除远端视频窗口
     *
     * @param {string} userId 远端用户Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeRemoteView(userId: string): Promise<RCRTCErrorCode>
    {
        logger.log(`removeRemoteView userId=${userId}`);
        return RCReactNativeRtc.removeRemoteView(userId);
    }

    /**
     * 设置合流视频窗口
     *
     * @param {number} tag 窗口 tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixView(tag: number): Promise<RCRTCErrorCode>
    {
        logger.log(`setLiveMixView tag=${tag}`);
        return RCReactNativeRtc.setLiveMixView(tag);
    }

    /**
     * 移除合流视频窗口
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeLiveMixView(): Promise<RCRTCErrorCode>
    {
        logger.log(`removeLiveMixView`);
        return RCReactNativeRtc.removeLiveMixView();
    }

    /**
     * 停止本地音视频数据发送
     *
     * @param {RCRTCMediaType} type 媒体类型
     * @param {boolean} mute true: 不发送 false: 发送
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    muteLocalStream(type: RCRTCMediaType, mute: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`muteLocalStream type=${type}, mute=${mute}`);
        return RCReactNativeRtc.muteLocalStream(type, mute);
    }

    /**
     * 停止远端用户音视频数据的接收
     *
     * @param {string} userId 远端用户Id
     * @param {RCRTCMediaType} type 媒体类型
     * @param {boolean} mute true: 不发送 false: 发送
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    muteRemoteStream(userId: string, type: RCRTCMediaType, mute: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`muteRemoteStream userId=${userId}, type=${type}, mute=${mute}`);
        return RCReactNativeRtc.muteRemoteStream(userId, type, mute);
    }

    /**
     * 停止合流数据渲染
     *
     * @param {RCRTCMediaType} type 媒体类型
     * @param {boolean} mute true: 不发送 false: 发送
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    muteLiveMixStream(type: RCRTCMediaType, mute: boolean): Promise<number>
    {
        logger.log(`muteLiveMixStream type=${type}, mute=${mute}`);
        return RCReactNativeRtc.muteLiveMixStream(type, mute);
    }

    /**
     * 设置 CDN 直播推流地址, 仅供直播主播用户使用
     *
     * @param {string} url 推流地址
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    addLiveCdn(url: string): Promise<RCRTCErrorCode>
    {
        logger.log(`addLiveCdn url=${url}`);
        return RCReactNativeRtc.addLiveCdn(url);
    }

    /**
     * 移除 CDN 直播推流地址, 仅供直播主播用户使用
     *
     * @param {string} url 推流地址
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeLiveCdn(url: string): Promise<RCRTCErrorCode>
    {
        logger.log(`removeLiveCdn url=${url}`);
        return RCReactNativeRtc.removeLiveCdn(url);
    }

    /**
     * 设置直播合流布局类型, 仅供直播主播用户使用
     *
     * @param {RCRTCLiveMixLayoutMode} mode 布局类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixLayoutMode(mode: RCRTCLiveMixLayoutMode): Promise<RCRTCErrorCode>
    {
        logger.log(`setLiveMixLayoutMode mode=${mode}`);
        return RCReactNativeRtc.setLiveMixLayoutMode(mode);
    }

    /**
     * 设置直播合流布局填充类型, 仅供直播主播用户使用
     *
     * @param {RCRTCLiveMixRenderMode} mode 填充类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixRenderMode(mode: RCRTCLiveMixRenderMode): Promise<RCRTCErrorCode>
    {
        logger.log(`setLiveMixRenderMode mode=${mode}`);
        return RCReactNativeRtc.setLiveMixRenderMode(mode);
    }

    /**
     * 设置直播合流布局背景颜色, 仅供直播主播用户使用
     *
     * @param color 用于旁路直播的输出视频的背景色，格式为 RGB 定义下的 Hex 值，不要带 # 号，如 0xFFB6C1 表示浅粉色。默认0x000000，黑色。取值范围 [0x000000, 0xFFFFFF]
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixBackgroundColor(color: number): Promise<number>
    {
        logger.log(`setLiveMixBackgroundColor color=${color}`);
        return RCReactNativeRtc.setLiveMixBackgroundColor(color);
    }

    /**
     * 设置直播合流布局背景颜色, 仅供直播主播用户使用
     *
     * @param red   红色 取值范围: 0 ~ 255
     * @param green 绿色 取值范围: 0 ~ 255
     * @param blue  蓝色 取值范围: 0 ~ 255
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixBackgroundColorRgb(red: number, green: number, blue: number): Promise<number>
    {
        logger.log(`setLiveMixBackgroundColorRgb red=${red}, green=${green}, blue=${blue}`);
        return RCReactNativeRtc.setLiveMixBackgroundColorRgb(red, green, blue);
    }

    /**
     * 设置直播混流布局配置, 仅供直播主播用户使用
     *
     * @param {RCRTCCustomLayout[]} layouts 混流布局列表
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixCustomLayouts(layouts: RCRTCCustomLayout[]): Promise<RCRTCErrorCode>
    {
        logger.log(`setLiveMixCustomLayouts layouts=${logger.toString(layouts)}`);
        return RCReactNativeRtc.setLiveMixCustomLayouts(layouts);
    }

    /**
     * 设置直播自定义音频流列表, 仅供直播主播用户使用
     *
     * @param {string[]} userIds 音频流列表
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixCustomAudios(userIds: string[]): Promise<RCRTCErrorCode>
    {
        logger.log(`setLiveMixCustomAudios userIds=${userIds}`);
        return RCReactNativeRtc.setLiveMixCustomAudios(userIds);
    }

    /**
     * 设置直播合流音频码率, 仅供直播主播用户使用
     *
     * @param {number} bitrate 音频码率 单位：kbps
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixAudioBitrate(bitrate: number): Promise<RCRTCErrorCode>
    {
        logger.log(`setLiveMixAudioBitrate bitrate=${bitrate}`);
        return RCReactNativeRtc.setLiveMixAudioBitrate(bitrate);
    }

    /**
     * 设置直播合流视频码率, 仅供直播主播用户使用
     *
     * @param {number} bitrate 音频码率 单位：kbps
     * @param {false} [tiny] 是否小流 true:视频小流 false:视频大流，默认值 false
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixVideoBitrate(bitrate: number, tiny: boolean = false): Promise<RCRTCErrorCode>
    {
        logger.log(`setLiveMixVideoBitrate bitrate=${bitrate}, tiny=${tiny}`);
        return RCReactNativeRtc.setLiveMixVideoBitrate(bitrate, tiny);
    }

    /**
     * 设置直播合流视频分辨率, 仅供直播主播用户使用
     *
     * @param width  视频宽度
     * @param height 视频高度
     * @param {false} tiny 是否小流 true:视频小流 false:视频大流，默认值 false
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixVideoResolution(width: number, height: number, tiny: boolean = false): Promise<RCRTCErrorCode>
    {
        logger.log(`setLiveMixVideoResolution width=${width},height=${height}, tiny=${tiny}`);
        return RCReactNativeRtc.setLiveMixVideoResolution(width, height, tiny);
    }

    /**
     * 设置直播合流视频帧率, 仅供直播主播用户使用
     *
     * @param {RCRTCVideoFps} fps 帧率
     * @param {false} tiny 是否小流 true:视频小流 false:视频大流，默认值 false
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixVideoFps(fps: RCRTCVideoFps, tiny: boolean = false): Promise<RCRTCErrorCode>
    {
        logger.log(`setLiveMixVideoFps fps=${fps}, tiny=${tiny}`);
        return RCReactNativeRtc.setLiveMixVideoFps(fps, tiny);
    }

    /**
     * 创建音效文件缓存, 仅供会议用户或直播主播用户使用
     *
     * @param {string} path 本地文件地址
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    createAudioEffect(path: string, effectId: number): Promise<RCRTCErrorCode>
    {
        logger.log(`createAudioEffect path=${path}, effectId=${effectId}`);
        return RCReactNativeRtc.createAudioEffect(path, effectId);
    }

    /**
     * 释放音效文件缓存, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    releaseAudioEffect(effectId: number): Promise<RCRTCErrorCode>
    {
        logger.log(`releaseAudioEffect effectId=${effectId}`);
        return RCReactNativeRtc.releaseAudioEffect(effectId);
    }

    /**
     * 播放音效文件, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @param {number} volume 音效文件播放音量
     * @param {boolean} loop 循环播放次数 默认：1次
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    playAudioEffect(effectId: number, volume: number, loop: number = 1): Promise<RCRTCErrorCode>
    {
        logger.log(`playAudioEffect effectId=${effectId}, volume=${volume}, loop=${loop}`);
        return RCReactNativeRtc.playAudioEffect(effectId, volume, loop);
    }

    /**
     * 暂停音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    pauseAudioEffect(effectId: number): Promise<RCRTCErrorCode>
    {
        logger.log(`pauseAudioEffect effectId=${effectId}`);
        return RCReactNativeRtc.pauseAudioEffect(effectId);
    }

    /**
     * 暂停全部音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    pauseAllAudioEffects(): Promise<RCRTCErrorCode>
    {
        logger.log(`pauseAllAudioEffects`);
        return RCReactNativeRtc.pauseAllAudioEffects();
    }

    /**
     * 恢复音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    resumeAudioEffect(effectId: number): Promise<RCRTCErrorCode>
    {
        logger.log(`resumeAudioEffect effectId=${effectId}`);
        return RCReactNativeRtc.resumeAudioEffect(effectId);
    }

    /**
     * 恢复全部音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    resumeAllAudioEffects(): Promise<RCRTCErrorCode>
    {
        logger.log(`resumeAllAudioEffects`);
        return RCReactNativeRtc.resumeAllAudioEffects();
    }

    /**
     * 停止音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    stopAudioEffect(effectId: number): Promise<RCRTCErrorCode>
    {
        logger.log(`stopAudioEffect effectId=${effectId}`);
        return RCReactNativeRtc.stopAudioEffect(effectId);
    }

    /**
     * 停止全部音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    stopAllAudioEffects(): Promise<RCRTCErrorCode>
    {
        logger.log(`stopAllAudioEffects`);
        return RCReactNativeRtc.stopAllAudioEffects();
    }

    /**
     * 设置音效文件播放音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @param {number} volume 音量 0~100, 默认 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    adjustAudioEffectVolume(effectId: number, volume: number): Promise<RCRTCErrorCode>
    {
        logger.log(`adjustAudioEffectVolume effectId=${effectId}, volume=${volume}`);
        return RCReactNativeRtc.adjustAudioEffectVolume(effectId, volume);
    }

    /**
     * 获取音效文件播放音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 大于或等于0: 调用成功, 小于0: 调用失败
     * @memberof RCRTCEngineInterface
     */
    getAudioEffectVolume(effectId: number): Promise<RCRTCErrorCode>
    {
        logger.log(`getAudioEffectVolume effectId=${effectId}`);
        return RCReactNativeRtc.getAudioEffectVolume(effectId);
    }

    /**
     * 设置全局音效文件播放音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} volume 音量 0~100, 默认 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    adjustAllAudioEffectsVolume(volume: number): Promise<RCRTCErrorCode>
    {
        logger.log(`adjustAllAudioEffectsVolume volume=${volume}`);
        return RCReactNativeRtc.adjustAllAudioEffectsVolume(volume);
    }

    /**
     * 开始混音, 仅支持混合本地音频文件数据, 仅供会议用户或直播主播用户使用
     *
     * @param {string} path 仅支持本地音频文件
     * @param {RCRTCAudioMixingMode} mode  混音行为模式
     * @param {boolean} playback 是否本地播放， 默认 true
     * @param {number} loop 循环混音或者播放次数，默认播放 1 次
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     * @category 混音
     */
    startAudioMixing(path: string, mode: RCRTCAudioMixingMode, playback: boolean = true, loop: number = 1): Promise<RCRTCErrorCode>
    {
        logger.log(`startAudioMixing path=${path}, mode=${mode}, playback=${playback}, loop=${loop}`);
        return RCReactNativeRtc.startAudioMixing(path, mode, playback, loop);
    }

    /**
     * 停止混音, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     * @category 混音
     */
    stopAudioMixing(): Promise<RCRTCErrorCode>
    {
        logger.log(`stopAudioMixing`);
        return RCReactNativeRtc.stopAudioMixing();
    }

    /**
     * 暂停混音, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     * @category 混音
     */
    pauseAudioMixing(): Promise<RCRTCErrorCode>
    {
        logger.log(`pauseAudioMixing`);
        return RCReactNativeRtc.pauseAudioMixing();
    }

    /**
     * 恢复混音, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    resumeAudioMixing(): Promise<RCRTCErrorCode>
    {
        logger.log(`resumeAudioMixing`);
        return RCReactNativeRtc.resumeAudioMixing();
    }

    /**
     * 设置混音输入音量, 包含本地播放和发送音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} volume 音量 0~100, 默认 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    adjustAudioMixingVolume(volume: number): Promise<RCRTCErrorCode>
    {
        logger.log(`adjustAudioMixingVolume volume=${volume}`);
        return RCReactNativeRtc.adjustAudioMixingVolume(volume);
    }

    /**
     * 设置混音本地播放音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} volume  音量 0~100, 默认 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    adjustAudioMixingPlaybackVolume(volume: number): Promise<RCRTCErrorCode>
    {
        logger.log(`adjustAudioMixingPlaybackVolume volume=${volume}`);
        return RCReactNativeRtc.adjustAudioMixingPlaybackVolume(volume);
    }

    /**
     * 获取混音本地播放音量, 仅供会议用户或直播主播用户使用
     *
     * @return 大于或等于0: 调用成功, 小于0: 调用失败
     * @memberof RCRTCEngineInterface
     */
    getAudioMixingPlaybackVolume(): Promise<number>
    {
        logger.log(`getAudioMixingPlaybackVolume`);
        return RCReactNativeRtc.getAudioMixingPlaybackVolume();
    }

    /**
     * 设置混音发送音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} volume 音量 0~100, 默认 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    adjustAudioMixingPublishVolume(volume: number): Promise<RCRTCErrorCode>
    {
        logger.log(`adjustAudioMixingPublishVolume volume=${volume}`);
        return RCReactNativeRtc.adjustAudioMixingPublishVolume(volume);
    }

    /**
     * 获取混音发送音量, 仅供会议用户或直播主播用户使用
     *
     * @return  大于或等于0: 调用成功, 小于0: 调用失败
     * @memberof RCRTCEngineInterface
     */
    getAudioMixingPublishVolume(): Promise<number>
    {
        logger.log(`getAudioMixingPublishVolume`);
        return RCReactNativeRtc.getAudioMixingPublishVolume();
    }

    /**
     * 设置混音文件合流进度, 仅供会议用户或直播主播用户使用
     *
     * @param {number} position 进度 0~1
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setAudioMixingPosition(position: number): Promise<RCRTCErrorCode>
    {
        logger.log(`setAudioMixingPosition position=${position}`);
        return RCReactNativeRtc.setAudioMixingPosition(position);
    }

    /**
     * 获取音频文件合流进度, 仅供会议用户或直播主播用户使用
     *
     * @return 合流进度 0~1
     * @memberof RCRTCEngineInterface
     */
    getAudioMixingPosition(): Promise<number>
    {
        logger.log(`getAudioMixingPosition`);
        return RCReactNativeRtc.getAudioMixingPosition();
    }

    /**
     * 获取音频文件时长, 单位:秒, 仅供会议用户或直播主播用户使用
     *
     * @return 大于或等于0: 调用成功, 小于0: 调用失败
     * @memberof RCRTCEngineInterface
     */
    getAudioMixingDuration(): Promise<number>
    {
        logger.log(`getAudioMixingDuration`);
        return RCReactNativeRtc.getAudioMixingDuration();
    }

    /**
     * 获取当前房间的 SessionId, 仅在加入房间成功后可获取
     * 每次加入房间所得到的 SessionId 均不同
     *
     * @return {*}  {string} 获取到的 sessionId
     * @memberof RCRTCEngineInterface
     */
    getSessionId(): Promise<string>
    {
        logger.log(`getSessionId`);
        return RCReactNativeRtc.getSessionId();
    }

    /**
     * 创建基于文件的自定义流
     *
     @param path 本地文件地址
     @param tag 自定义流全局唯一标签
     @param replace 是否替换音频流
     @param playback 是否本地回放音频流
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    createCustomStreamFromFile(path: string, tag: string, replace: boolean, playback: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`createCustomStreamFromFile path=${path}, tag=${tag}, replace=${replace}, playback=${playback}`);
        return RCReactNativeRtc.createCustomStreamFromFile(path, tag, replace, playback);
    }

    /**
     * 设置自定义流的视频配置
     *
     * @param tag
     * @param config
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setCustomStreamVideoConfig(tag: string, config: RCRTCVideoConfig): Promise<RCRTCErrorCode>
    {
        logger.log(`setCustomStreamVideoConfig tag=${tag}, config=${logger.toString(config)}`);
        return RCReactNativeRtc.setCustomStreamVideoConfig(tag, config);
    }

    /**
     * 停止本地数据渲染
     *
     * @param tag
     * @param mute
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    muteLocalCustomStream(tag: string, mute: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`muteLocalCustomStream tag=${tag}, mute=${mute}`);
        return RCReactNativeRtc.muteLocalCustomStream(tag, mute);
    }

    /**
     * 设置本地自定义视频预览窗口
     *
     * @param tag
     * @param view
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLocalCustomStreamView(tag: string, view: number): Promise<RCRTCErrorCode>
    {
        logger.log(`setLocalCustomStreamView tag=${tag}, view=${view}`);
        return RCReactNativeRtc.setLocalCustomStreamView(tag, view);
    }

    /**
     * 移除本地自定义视频预览窗口
     *
     * @param tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeLocalCustomStreamView(tag: string): Promise<RCRTCErrorCode>
    {
        logger.log(`removeLocalCustomStreamView tag=${tag}`);
        return RCReactNativeRtc.removeLocalCustomStreamView(tag);
    }

    /**
     * 发布自定义视频
     *
     * @param tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    publishCustomStream(tag: string): Promise<RCRTCErrorCode>
    {
        logger.log(`publishCustomStream tag=${tag}`);
        return RCReactNativeRtc.publishCustomStream(tag);
    }

    /**
     * 取消发布自定义视频
     *
     * @param tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    unpublishCustomStream(tag: string): Promise<RCRTCErrorCode>
    {
        logger.log(`unpublishCustomStream tag=${tag}`);
        return RCReactNativeRtc.unpublishCustomStream(tag);
    }

    /**
     * 停止远端数据渲染
     *
     * @param userId
     * @param tag
     * @param type
     * @param mute
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    muteRemoteCustomStream(userId: string, tag: string, type: number, mute: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`muteRemoteCustomStream userId=${userId}, tag=${tag}, type=${type}, mute=${mute}`);
        return RCReactNativeRtc.muteRemoteCustomStream(userId, tag, type, mute);
    }

    /**
     * 设置远端自定义视频预览窗口
     *
     * @param userId
     * @param tag
     * @param view
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setRemoteCustomStreamView(userId: string, tag: string, view: number): Promise<RCRTCErrorCode>
    {
        logger.log(`setRemoteCustomStreamView userId=${userId}, tag=${tag}, view=${view}`);
        return RCReactNativeRtc.setRemoteCustomStreamView(userId, tag, view);
    }

    /**
     * 移除远端自定义视频预览窗口
     *
     * @param userId
     * @param tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeRemoteCustomStreamView(userId: string, tag: string): Promise<RCRTCErrorCode>
    {
        logger.log(`removeRemoteCustomStreamView userId=${userId}, tag=${tag}`);
        return RCReactNativeRtc.removeRemoteCustomStreamView(userId, tag);
    }

    /**
     * 订阅自定义流
     *
     * @param userId
     * @param type
     * @param tag
     * @param tiny
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    subscribeCustomStream(userId: string, tag: string, type: number, tiny: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`subscribeCustomStream userId=${userId}, tag=${tag}, type=${type}, tiny=${tiny}`);
        return RCReactNativeRtc.subscribeCustomStream(userId, tag, type, tiny);
    }

    /**
     * 取消订阅自定义流
     *
     * @param userId
     * @param type
     * @param tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    unsubscribeCustomStream(userId: string, tag: string, type: number): Promise<RCRTCErrorCode>
    {
        logger.log(`unsubscribeCustomStream userId=${userId}, tag=${tag}, type=${type}`);
        return RCReactNativeRtc.unsubscribeCustomStream(userId, tag, type);
    }

    /**
     * 请求加入子房间（跨房间连麦）
     *
     * @param roomId     目标房间id
     * @param userId     目标主播id
     * @param autoLayout 是否自动布局
     *
     *                   开启自动布局
     *                   如果被邀请方在加入邀请方房间之前发布了资源，当被邀请方加入邀请者房间成功后，服务器会把被邀请方流资源合并到邀请方视图（默认仅悬浮布局合流）上。
     *                   如果被邀请方在加入邀请方房间之前没有发布过资源，将会在被邀请方发布资源成功后，服务器会把被邀请方流资源合并到邀请方视图（默认仅悬浮布局合流）上。
     *                   双方可以主动设置合流布局。一旦主动设置过合流布局，后续音视频直播过程中设置的自动合流参数将失效。
     *
     * @param extra      附加信息，默认为空
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    requestJoinSubRoom(roomId: string, userId: string, autoLayout: boolean, extra: string): Promise<RCRTCErrorCode>
    {
        logger.log(`requestJoinSubRoom roomId=${roomId}, userId=${userId}, autoLayout=${autoLayout}, extra=${extra}`);
        return RCReactNativeRtc.requestJoinSubRoom(roomId, userId, autoLayout, extra);
    }

    /**
     * 取消正在进行中的加入子房间（跨房间连麦）请求
     *
     * @param roomId 正在请求的目标房间id
     * @param userId 正在请求的目标主播id
     * @param extra  附加信息，默认为空
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    cancelJoinSubRoomRequest(roomId: string, userId: string, extra: string): Promise<RCRTCErrorCode>
    {
        logger.log(`cancelJoinSubRoomRequest roomId=${roomId}, userId=${userId}, extra=${extra}`);
        return RCReactNativeRtc.cancelJoinSubRoomRequest(roomId, userId, extra);
    }

    /**
     * 响应加入子房间（跨房间连麦）请求
     *
     * @param roomId     发起请求的目标房间id
     * @param userId     发起请求的主播id
     * @param agree      是否同意（跨房间连麦）
     * @param autoLayout 是否自动布局
     *
     *                   开启自动布局
     *                   如果被邀请方在加入邀请方房间之前发布了资源，当被邀请方加入邀请者房间成功后，服务器会把被邀请方流资源合并到邀请方视图（默认仅悬浮布局合流）上。
     *                   如果被邀请方在加入邀请方房间之前没有发布过资源，将会在被邀请方发布资源成功后，服务器会把被邀请方流资源合并到邀请方视图（默认仅悬浮布局合流）上。
     *                   双方可以主动设置合流布局。一旦主动设置过合流布局，后续音视频直播过程中设置的自动合流参数将失效。
     *
     * @param extra      附加信息，默认为空
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    responseJoinSubRoomRequest(roomId: string, userId: string, agree: boolean, autoLayout: boolean, extra: string): Promise<RCRTCErrorCode>
    {
        logger.log(`responseJoinSubRoomRequest roomId=${roomId}, userId=${userId}, agree=${agree}, autoLayout=${autoLayout}, extra=${extra}`);
        return RCReactNativeRtc.responseJoinSubRoomRequest(roomId, userId, agree, autoLayout, extra);
    }

    /**
     * 加入子房间
     * 前提必须已经 通过 joinRoom 加入了主房间
     * 未建立连麦时，需先调用 requestJoinSubRoom 发起加入请求
     *
     * @param roomId 目标房间id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    joinSubRoom(roomId: string): Promise<RCRTCErrorCode>
    {
        logger.log(`joinSubRoom roomId=${roomId}`);
        return RCReactNativeRtc.joinSubRoom(roomId);
    }

    /**
     * 离开子房间
     *
     * @param roomId  子房间id
     * @param disband 是否解散，解散后再次加入需先调用 requestJoinSubRoom 发起加入请求
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    leaveSubRoom(roomId: string, disband: boolean): Promise<RCRTCErrorCode>
    {
        logger.log(`leaveSubRoom roomId=${roomId}, disband=${disband}`);
        return RCReactNativeRtc.leaveSubRoom(roomId, disband);
    }

    /**
     * 设置 CDN 合流视图
     *
     * @param {number} tag 窗口的 tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixInnerCdnStreamView(tag: number): Promise<RCRTCErrorCode>
    {
        logger.log(`setLiveMixInnerCdnStreamView tag=${tag}`);
        return RCReactNativeRtc.setLiveMixInnerCdnStreamView(tag);
    }

    /**
     * 设置水印
     *
     * @param {number} imagePath 水印图片的 tag
     * @param {RCRTCIWPoint} position 水印的位置和尺寸参数，参数取值范围 0 ~ 1，SDK 内部会根据视频分辨率计算水印实际的像素位置和尺寸。
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setWatermark(imagePath: string, position: RCRTCIWPoint, zoom: number): Promise<RCRTCErrorCode>
    {
        logger.log(`setWatermark imagePath=${imagePath} position=${position} zoom=${zoom}`);
        return RCReactNativeRtc.setWatermark(imagePath, position, zoom);
    }

    /**
     * 开启网络探测
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    startNetworkProbe(): Promise<RCRTCErrorCode>{
        return RCReactNativeRtc.startNetworkProbe()
    }

    /*  以下是事件回调  */

    /**
     * 本地用户操作错误回调
     *
     * @param {CodeWithMessagelistener} [listener] 回调函数，不传值表示移除当前事件的所有监听
     *
     * 回调参数
     * @param code 错误码
     * @param message 错误信息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnErrorListener(listener?: (code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onError'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
                logger.log(`${eventName} code=${data.code}, message=${data.message}`);
                listener(data.code, data.message);
            });
        }
    }

    /**
     * 本地用户被踢出房间回调
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param id 被踢出的房间id
     * @param message 返回的消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnKickedListener(listener?: (id: string, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onKicked';
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { id: string, message: string }) => {
                logger.log(`${eventName} id=${data.id}, message=${data.message}`);
                listener(data.id, data.message);
            });
        }
    }

    /**
     * 本地用户加入房间回调
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRoomJoinedListener(listener?: (code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRoomJoined'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
                logger.log(`${eventName} code=${data.code}, message=${data.message}`);
                listener(data.code, data.message);
            });
        }
    }

    /**
     * 本地用户离开房间回调
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRoomLeftListener(listener?: (code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRoomLeft'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
                logger.log(`${eventName} code=${data.code}, message=${data.message}`);
                listener(data.code, data.message);
            });
        }
    }

    /**
     * 本地用户发布资源回调
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param type  媒体类型
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnPublishedListener(listener?: (type: RCRTCMediaType, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onPublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { type: RCRTCMediaType, code: number, message: string }) => {
                logger.log(`${eventName} type=${data.type}, code=${data.code}, message=${data.message}`);
                listener(data.type, data.code, data.message);
            });
        }
    }

    /**
     * 本地用户取消发布资源回调
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param type  媒体类型
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnUnpublishedListener(listener?: (type: RCRTCMediaType, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onUnpublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { type: RCRTCMediaType, code: number, message: string }) => {
                logger.log(`${eventName} type=${data.type}, code=${data.code}, message=${data.message}`);
                listener(data.type, data.code, data.message);
            });
        }
    }

    /**
     * 订阅远端用户发布的资源操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param id  远端用户 UserId
     * @param type  媒体类型
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnSubscribedListener(listener?: (userId: string, type: RCRTCMediaType, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onSubscribed'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, type: RCRTCMediaType, code: number, message: string }) => {
                logger.log(`${eventName} id=${data.userId}, type=${data.type}, code=${data.code}, message=${data.message}`);
                listener(data.userId, data.type, data.code, data.message);
            });
        }
    }

    /**
     * 取消订阅远端用户发布的资源, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param id  远端用户 UserId
     * @param type  媒体类型
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnUnsubscribedListener(listener?: (userId: string, type: RCRTCMediaType, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onUnsubscribed'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, type: RCRTCMediaType, code: number, message: string }) => {
                logger.log(`${eventName} id=${data.userId}, type=${data.type}, code=${data.code}, message=${data.message}`);
                listener(data.userId, data.type, data.code, data.message);
            });
        }
    }

    /**
     * 订阅合流资源操作回调, 仅供直播观众用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param type  媒体类型
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveMixSubscribedListener(listener?: (type: RCRTCMediaType, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixSubscribed'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { type: RCRTCMediaType, code: number, message: string }) => {
                logger.log(`${eventName} type=${data.type}, code=${data.code}, message=${data.message}`);
                listener(data.type, data.code, data.message);
            });
        }
    }

    /**
     * 取消订阅合流资源操作回调, 仅供直播观众用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param type  媒体类型
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveMixUnsubscribedListener(listener?: (type: RCRTCMediaType, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixUnsubscribed'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { type: RCRTCMediaType, code: number, message: string }) => {
                logger.log(`${eventName} type=${data.type}, code=${data.code}, message=${data.message}`);
                listener(data.type, data.code, data.message);
            });
        }
    }

    /**
     * 本地用户开关摄像头操作回调
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param enable  true:打开摄像头 false:关闭摄像头
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnEnableCameraListener(listener?: (enable: boolean, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onCameraEnabled'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { enable: boolean, code: number, message: string }) => {
                logger.log(`${eventName} enable=${data.enable}, code=${data.code}, message=${data.message}`);
                listener(data.enable, data.code, data.message);
            });
        }
    }

    /**
     * 本地用户切换前后置摄像头操作回调
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param camera  操作摄像头的类型
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnSwitchCameraListener(listener?: (camera: RCRTCCamera, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onCameraSwitched'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { camera: RCRTCCamera, code: number, message: string }) => {
                logger.log(`${eventName} camera=${data.camera}, code=${data.code}, message=${data.message}`);
                listener(data.camera, data.code, data.message);
            });
        }
    }

    /**
     * 添加旁路推流URL操作回调, 仅供直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param url CDN URL
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveCdnAddedListener(listener?: (url: string, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveCdnAdded'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { url: string, code: number, message: string }) => {
                logger.log(`${eventName} url=${data.url}, code=${data.code}, message=${data.message}`);
                listener(data.url, data.code, data.message);
            });
        }
    }

    /**
     * 移除旁路推流URL操作回调, 仅供直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param url CDN URL
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveCdnRemovedListener(listener?: (url: string, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveCdnRemoved'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { url: string, code: number, message: string }) => {
                logger.log(`${eventName} url=${data.url}, code=${data.code}, message=${data.message}`);
                listener(data.url, data.code, data.message);
            });
        }
    }

    /**
     * 设置合流布局类型操作回调, 仅供直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveMixLayoutModeSetListener(listener?: (code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixLayoutModeSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
                logger.log(`${eventName} code=${data.code}, message=${data.message}`);
                listener(data.code, data.message);
            });
        }
    }

    /**
     * 设置合流布局填充类型操作回调, 仅供直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveMixRenderModeSetListener(listener?: (code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixRenderModeSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
                logger.log(`${eventName} code=${data.code}, message=${data.message}`);
                listener(data.code, data.message);
            });
        }
    }

    /**
     * 设置合流布局背景颜色操作回调
     *
     * 回调参数
     * @param code   0: 调用成功, 非0: 失败
     * @param message 失败原因
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveMixBackgroundColorSetListener(listener?: (code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixBackgroundColorSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
                logger.log(`${eventName} code=${data.code}, message=${data.message}`);
                listener(data.code, data.message);
            });
        }
    }

    /**
     * 设置合流自定义布局操作回调, 仅供直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveMixCustomLayoutsSetListener(listener?: (code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixCustomLayoutsSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
                logger.log(`${eventName} code=${data.code}, message=${data.message}`);
                listener(data.code, data.message);
            });
        }
    }

    /**
     * 设置需要合流音频操作回调, 仅供直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveMixCustomAudiosSetListener(listener?: (code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixCustomAudiosSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
                logger.log(`${eventName} code=${data.code}, message=${data.message}`);
                listener(data.code, data.message);
            });
        }
    }

    /**
     * 设置合流音频码率操作回调, 仅供直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveMixAudioBitrateSetListener(listener?: (code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixAudioBitrateSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
                logger.log(`${eventName} code=${data.code}, message=${data.message}`);
                listener(data.code, data.message);
            });
        }
    }

    /**
     * 设置默认视频合流码率操作回调, 仅供直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param tiny 是否小流
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveMixVideoBitrateSetListener(listener?: (tiny: boolean, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixVideoBitrateSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { tiny: boolean, code: number, message: string }) => {
                logger.log(`${eventName} tiny=${data.tiny}, code=${data.code}, message=${data.message}`);
                listener(data.tiny, data.code, data.message);
            });
        }
    }

    /**
     * 设置默认视频分辨率操作回调, 仅供直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param tiny 是否小流
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveMixVideoResolutionSetListener(listener?: (tiny: boolean, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixVideoResolutionSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { tiny: boolean, code: number, message: string }) => {
                logger.log(`${eventName} tiny=${data.tiny}, code=${data.code}, message=${data.message}`);
                listener(data.tiny, data.code, data.message);
            });
        }
    }

    /**
     * 设置默认视频帧率操作回调, 仅供直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param tiny 是否小流
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLiveMixVideoFpsSetListener(listener?: (tiny: boolean, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixVideoFpsSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { tiny: boolean, code: number, message: string }) => {
                logger.log(`${eventName} tiny=${data.tiny}, code=${data.code}, message=${data.message}`);
                listener(data.tiny, data.code, data.message);
            });
        }
    }

    /**
     * 创建音效操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param id 音效文件ID
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnAudioEffectCreatedListener(listener?: (id: string, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onAudioEffectCreated'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { id: string, code: number, message: string }) => {
                logger.log(`${eventName} id=${data.id}, code=${data.code}, message=${data.message}`);
                listener(data.id, data.code, data.message);
            });
        }
    }

    /**
     * 播放音效结束, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param id 音效文件ID
     * @memberof RCRTCEngineEventsInterface
     */
    setOnAudioEffectFinishedListener(listener?: (id: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onAudioEffectFinished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (id: string) => {
                logger.log(`${eventName} id=${id}`);
                listener(id);
            });
        }
    }

    /**
     * 开始本地音频数据合流操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnAudioMixingStartedListener(listener?: () => void): void
    {
        const eventName = 'IRCRTCIWListener:onAudioMixingStarted'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, () => {
                logger.log(`${eventName}`);
                listener();
            });
        }
    }

    /**
     * 暂停本地音频数据合流操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnAudioMixingPausedListener(listener?: () => void): void
    {
        const eventName = 'IRCRTCIWListener:onAudioMixingPaused'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, () => {
                logger.log(`${eventName}`);
                listener();
            });
        }
    }

    /**
     * 停止本地音频文件数据合流操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnAudioMixingStoppedListener(listener?: () => void): void
    {
        const eventName = 'IRCRTCIWListener:onAudioMixingStopped'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, () => {
                logger.log(`${eventName}`);
                listener();
            });
        }
    }

    /**
     * 结束本地音频文件数据合流操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnAudioMixingFinishedListener(listener?: () => void): void
    {
        const eventName = 'IRCRTCIWListener:onAudioMixingFinished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, () => {
                logger.log(`${eventName}`);
                listener();
            });
        }
    }

    /**
     * 远端用户加入房间操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param roomId 远端房间Id
     * @param userId 远端用户UserId
     * @memberof RCRTCEngineEventsInterface
     */
    setOnUserJoinedListener(listener?: (roomId: string, userId: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onUserJoined'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}`);
                listener(data.roomId, data.userId);
            });
        }
    }

    /**
     * 远端用户因离线离开房间操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param roomId 远端房间Id
     * @param userId 远端用户UserId
     * @memberof RCRTCEngineEventsInterface
     */
    setOnUserOfflineListener(listener?: (roomId: string, userId: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onUserOffline'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}`);
                listener(data.roomId, data.userId);
            });
        }
    }

    /**
     * 远端用户离开房间操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param roomId 远端房间Id
     * @param userId 远端用户UserId
     * @memberof RCRTCEngineEventsInterface
     */
    setOnUserLeftListener(listener?: (roomId: string, userId: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onUserLeft'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}`);
                listener(data.roomId, data.userId);
            });
        }
    }

    /**
     * 远端用户发布资源操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param roomId 远端房间Id
     * @param userId 远端用户UserId
     * @param type 媒体类型
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemotePublishedListener(listener?: (roomId: string, userId: string, type: RCRTCMediaType) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemotePublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, type: RCRTCMediaType }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, type=${data.type}`);
                listener(data.roomId, data.userId, data.type);
            });
        }
    }

    /**
     * 远端用户取消发布资源操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param roomId 远端房间Id
     * @param userId 远端用户UserId
     * @param type 媒体类型
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteUnpublishedListener(listener?: (roomId: string, userId: string, type: RCRTCMediaType) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteUnpublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, type: RCRTCMediaType }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, type=${data.type}`);
                listener(data.roomId, data.userId, data.type);
            });
        }
    }

    /**
     * 远端用户发布直播资源操作回调, 仅供直播观众用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param type 媒体类型
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteLiveMixPublishedListener(listener?: (type: RCRTCMediaType) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteLiveMixPublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (type: RCRTCMediaType) => {
                logger.log(`${eventName} type=${type}`);
                listener(type);
            });
        }
    }

    /**
     * 远端用户取消发布直播资源操作回调, 仅供直播观众用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param type 媒体类型
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteLiveMixUnpublishedListener(listener?: (type: RCRTCMediaType) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteLiveMixUnpublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (type: RCRTCMediaType) => {
                logger.log(`${eventName} type=${type}`);
                listener(type);
            });
        }
    }

    /**
     * 远端用户开关麦克风或摄像头操作回调
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param roomId 远端房间Id
     * @param userId 远端用户UserId
     * @param type 媒体类型
     * @param disabled 是否关闭, YES: 关闭, NO: 打开
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteStateChangedListener(listener?: (roomId: string, userId: string, type: RCRTCMediaType, disabled: boolean) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteStateChanged'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, type: RCRTCMediaType, disabled: boolean }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, type=${data.type}, disabled=${data.disabled}`);
                listener(data.roomId, data.userId, data.type, data.disabled);
            });
        }
    }

    /**
     * 收到远端用户第一个音频或视频关键帧回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param roomId 远端房间Id
     * @param userId 远端用户UserId
     * @param type 媒体类型
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteFirstFrameListener(listener?: (roomId: string, userId: string, type: RCRTCMediaType) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteFirstFrame'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, type: RCRTCMediaType }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, type=${data.type}`);
                listener(data.roomId, data.userId, data.type);
            });
        }
    }

    /**
     * 收到远端用户第一个音频或视频关键帧回调, 仅供直播观众用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     *
     * 回调参数
     * @param type 媒体类型
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteLiveMixFirstFrameListener(listener?: (type: RCRTCMediaType) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteLiveMixFirstFrame'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (type: RCRTCMediaType) => {
                logger.log(`${eventName} type=${type}`);
                listener(type);
            });
        }
    }

    /**
     * 本地用户发布本地自定义流操作回调
     *
     * 回调参数
     * @param tag    自定义流标签
     * @param code   错误码
     * @param message 错误信息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnCustomStreamPublishedListener(listener?: (tag: string, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onCustomStreamPublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { tag: string, code: number, message: string }) => {
                logger.log(`${eventName} tag=${data.tag}, code=${data.code}, message=${data.message}`);
                listener(data.tag, data.code, data.message);
            });
        }
    }

    /**
     * 本地自定义流发布结束回调
     *
     * 回调参数
     * @param tag 自定义流标签
     * @memberof RCRTCStatsEventsInterface
     */
    setOnCustomStreamPublishFinishedListener(listener?: (tag: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onCustomStreamPublishFinished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (tag: string) => {
                logger.log(`${eventName} tag=${tag}`);
                listener(tag);
            });
        }
    }

    /**
     * 本地用户取消发布本地自定义流操作回调
     *
     * 回调参数
     * @param tag    自定义流标签
     * @param code   错误码
     * @param message 错误信息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnCustomStreamUnpublishedListener(listener?: (tag: string, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onCustomStreamUnpublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { tag: string, code: number, message: string }) => {
                logger.log(`${eventName} tag=${data.tag}, code=${data.code}, message=${data.message}`);
                listener(data.tag, data.code, data.message);
            });
        }
    }

    /**
     * 远端用户发布自定义流操作回调, 仅供会议用户或直播主播用户使用
     *
     * 回调参数
     * @param roomId 房间id
     * @param userId 用户id
     * @param type   音视频类型
     * @param tag    自定义流标签
     * @memberof RCRTCStatsEventsInterface
     */
    setOnRemoteCustomStreamPublishedListener(listener?: (roomId: string, userId: string, tag: string, type: RCRTCMediaType) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteCustomStreamPublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, type: RCRTCMediaType }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, type=${data.type}`);
                listener(data.roomId, data.userId, data.tag, data.type);
            });
        }
    }

    /**
     * 远端用户取消发布自定义流操作回调, 仅供会议用户或直播主播用户使用
     *
     * 回调参数
     * @param roomId 房间id
     * @param userId 用户id
     * @param type   音视频类型
     * @param tag    自定义流标签
     * @memberof RCRTCStatsEventsInterface
     */
    setOnRemoteCustomStreamUnpublishedListener(listener?: (roomId: string, userId: string, tag: string, type: RCRTCMediaType) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteCustomStreamUnpublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, type: RCRTCMediaType }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, type=${data.type}`);
                listener(data.roomId, data.userId, data.tag, data.type);
            });
        }
    }

    /**
     * 远端用户开关自定义流操作回调
     *
     * 回调参数
     * @param roomId   房间id
     * @param userId   用户id
     * @param tag      自定义流标签
     * @param type   音视频类型
     * @param disabled 是否禁用
     * @memberof RCRTCStatsEventsInterface
     */
    setOnRemoteCustomStreamStateChangedListener(listener?: (roomId: string, userId: string, tag: string, type: RCRTCMediaType, disabled: boolean) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteCustomStreamStateChanged'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, type: RCRTCMediaType, disabled: boolean }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, type=${data.type}, disabled=${data.disabled}`);
                listener(data.roomId, data.userId, data.tag, data.type, data.disabled);
            });
        }
    }

    /**
     * 收到远端用户自定义流第一个关键帧回调, 仅供会议用户或直播主播用户使用
     *
     * 回调参数
     * @param roomId 房间id
     * @param userId 用户id
     * @param type   音视频类型
     * @param tag    自定义流标签
     * @memberof RCRTCStatsEventsInterface
     */
    setOnRemoteCustomStreamFirstFrameListener(listener?: (roomId: string, userId: string, tag: string, type: RCRTCMediaType) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteCustomStreamFirstFrame'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, type: RCRTCMediaType }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, type=${data.type}`);
                listener(data.roomId, data.userId, data.tag, data.type);
            });
        }
    }

    /**
     * 订阅远端用户发布的自定义流操作回调, 仅供会议用户或直播主播用户使用
     *
     * 回调参数
     * @param userId 用户id
     * @param tag    自定义流标签
     * @param code   错误码
     * @param type   音视频类型
     * @param message 错误信息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnCustomStreamSubscribedListener(listener?: (userId: string, tag: string, type: RCRTCMediaType, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onCustomStreamSubscribed'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, tag: string, type: RCRTCMediaType, code: number, message: string }) => {
                logger.log(`${eventName} userId=${data.userId}, tag=${data.tag}, type=${data.type}, code=${data.code}, message=${data.message}`);
                listener(data.userId, data.tag, data.type, data.code, data.message);
            });
        }
    }

    /**
     * 取消订阅远端用户发布的自定义流操作回调, 仅供会议用户或直播主播用户使用
     *
     * 回调参数
     * @param userId 用户id
     * @param tag    自定义流标签
     * @param code   错误码
     * @param type   音视频类型
     * @param message 错误信息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnCustomStreamUnsubscribedListener(listener?: (userId: string, tag: string, type: RCRTCMediaType, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onCustomStreamUnsubscribed'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, tag: string, type: RCRTCMediaType, code: number, message: string }) => {
                logger.log(`${eventName} userId=${data.userId}, tag=${data.tag}, type=${data.type}, code=${data.code}, message=${data.message}`);
                listener(data.userId, data.tag, data.type, data.code, data.message);
            });
        }
    }

    /**
     * 请求加入子房间回调, 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId 目标房间id
     * @param userId 目标主播id
     * @param code   错误码
     * @param message 错误信息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnJoinSubRoomRequestedListener(listener?: (roomId: string, userId: string, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onJoinSubRoomRequested'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, code: number, message: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, code=${data.code}, message=${data.message}`);
                listener(data.roomId, data.userId, data.code, data.message);
            });
        }
    }

    /**
     * 响应请求加入子房间回调, 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId 目标房间id
     * @param userId 目标主播id
     * @param code   错误码
     * @param message 错误信息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnJoinSubRoomRequestCanceledListener(listener?: (roomId: string, userId: string, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onJoinSubRoomRequestCanceled'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, code: number, message: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, code=${data.code}, message=${data.message}`);
                listener(data.roomId, data.userId, data.code, data.message);
            });
        }
    }

    /**
     * 响应请求加入子房间回调, 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId 目标房间id
     * @param userId 目标主播id
     * @param agree  是否同意
     * @param code   错误码
     * @param message 错误信息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnJoinSubRoomRequestRespondedListener(listener?: (roomId: string, userId: string, agree: boolean, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onJoinSubRoomRequestResponded'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, agree: boolean, code: number, message: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, code=${data.code}, message=${data.message}`);
                listener(data.roomId, data.userId, data.agree, data.code, data.message);
            });
        }
    }

    /**
     * 收到加入请求回调, 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId 请求来源房间id
     * @param userId 请求来源主播id
     * @param extra  扩展信息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnJoinSubRoomRequestReceivedListener(listener?: (roomId: string, userId: string, extra: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onJoinSubRoomRequestReceived'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, extra: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, extra=${data.extra}`);
                listener(data.roomId, data.userId, data.extra);
            });
        }
    }

    /**
     * 收到取消加入请求回调, 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId
     * @param userId
     * @param extra
     * @memberof RCRTCStatsEventsInterface
     */
    setOnCancelJoinSubRoomRequestReceivedListener(listener?: (roomId: string, userId: string, extra: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onCancelJoinSubRoomRequestReceived'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, extra: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, extra=${data.extra}`);
                listener(data.roomId, data.userId, data.extra);
            });
        }
    }

    /**
     * 收到加入请求响应回调 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId 响应来源房间id
     * @param userId 响应来源主播id
     * @param agree  是否同意
     * @param extra  扩展信息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnJoinSubRoomRequestResponseReceivedListener(listener?: (roomId: string, userId: string, agree: boolean, extra: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onJoinSubRoomRequestResponseReceived'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, agree: boolean, extra: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, agree=${data.agree}, extra=${data.extra}`);
                listener(data.roomId, data.userId, data.agree, data.extra);
            });
        }
    }

    /**
     * 加入子房间回调, 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId 子房间id
     * @param code   错误码
     * @param message 错误信息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnSubRoomJoinedListener(listener?: (roomId: string, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onSubRoomJoined'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, code: number, message: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, code=${data.code}, message=${data.message}`);
                listener(data.roomId, data.code, data.message);
            });
        }
    }

    /**
     * 离开子房间回调, 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId 子房间id
     * @param code   错误码
     * @param message 错误信息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnSubRoomLeftListener(listener?: (roomId: string, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onSubRoomLeft'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, code: number, message: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, code=${data.code}, message=${data.message}`);
                listener(data.roomId, data.code, data.message);
            });
        }
    }

    /**
     * 连麦中的子房间回调, 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId 子房间id
     * @memberof RCRTCStatsEventsInterface
     */
    setOnSubRoomBandedListener(listener?: (roomId: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onSubRoomBanded'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (roomId: string) => {
                logger.log(`${eventName} roomId=${roomId}`);
                listener(roomId);
            });
        }
    }

    /**
     * 子房间结束连麦回调, 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId 子房间id
     * @param userId 结束连麦的用户id
     * @memberof RCRTCStatsEventsInterface
     */
    setOnSubRoomDisbandListener(listener?: (roomId: string, userId: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onSubRoomDisband'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}`);
                listener(data.roomId, data.userId);
            });
        }
    }

    /**
     * 切换直播角色回调
     *
     * 回调参数
     * @param current   当前角色
     * @param code      错误码
     * @param message    错误消息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveRoleSwitchedListener(listener?: (current: RCRTCRole, code: number, message: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveRoleSwitched'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { current: RCRTCRole, code: number, message: string }) => {
                logger.log(`${eventName} current=${data.current}, code=${data.code}, message=${data.message}`);
                listener(data.current, data.code, data.message);
            });
        }
    }

    /* 以下是 状态回调 */

    /**
     * 上报网络状态统计信息
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnNetworkStatsListener(listener?: (stats: RCRTCNetworkStats) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnNetworkStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCNetworkStats) => {
                logger.log(`${eventName} stats=${logger.toString(stats)}`);
                listener(stats);
            });
        }
    }

    /**
     * 上报本地音频统计信息
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLocalAudioStatsListener(listener?: (stats: RCRTCLocalAudioStats) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnLocalAudioStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCLocalAudioStats) => {
                logger.log(`${eventName} stats=${logger.toString(stats)}`);
                listener(stats);
            });
        }
    }

    /**
     * 上报本地视频统计信息
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLocalVideoStatsListener(listener?: (stats: RCRTCLocalVideoStats) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnLocalVideoStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCLocalVideoStats) => {
                logger.log(`${eventName} stats=${logger.toString(stats)}`);
                listener(stats);
            });
        }
    }

    /**
     * 上报远端音频统计信息
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteAudioStatsListener(listener?: (roomId: string, userId: string, stats: RCRTCRemoteAudioStats) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnRemoteAudioStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, stats: RCRTCRemoteAudioStats }) => {
                logger.log(`${eventName} roomId=${data.roomId},stats=${logger.toString(data.stats)}`);
                listener(data.roomId, data.userId, data.stats);
            });
        }
    }

    /**
     * 上报远端视频统计信息
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteVideoStatsListener(listener?: (roomId: string, userId: string, stats: RCRTCRemoteVideoStats) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnRemoteVideoStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, stats: RCRTCRemoteVideoStats }) => {
                logger.log(`${eventName} roomId=${data.roomId},stats=${logger.toString(data.stats)}`);
                listener(data.roomId, data.userId, data.stats);
            });
        }
    }

    /**
     * 上报远端合流音频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveMixAudioStatsListener(listener?: (stats: RCRTCRemoteAudioStats) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnLiveMixAudioStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCRemoteAudioStats) => {
                logger.log(`${eventName} stats=${logger.toString(stats)}`);
                listener(stats);
            });
        }
    }

    /**
     * 上报远端合流视频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveMixVideoStatsListener(listener?: (stats: RCRTCRemoteVideoStats) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnLiveMixVideoStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCRemoteVideoStats) => {
                logger.log(`${eventName} stats=${logger.toString(stats)}`);
                listener(stats);
            });
        }
    }

    /**
     * 上报远端分流音频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveMixMemberAudioStatsListener(listener?: (userId: string, volume: number) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnLiveMixMemberAudioStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, volume: number }) => {
                logger.log(`${eventName} userId=${data.userId}, volume=${data.volume}`);
                listener(data.userId, data.volume);
            });
        }
    }

    /**
     * 上报远端分流自定义音频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveMixMemberCustomAudioStatsListener(listener?: (userId: string, tag: string, volume: number) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnLiveMixMemberCustomAudioStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, tag: string, volume: number }) => {
                logger.log(`${eventName} userId=${data.userId}, tag=${data.tag}, volume=${data.volume}`);
                listener(data.userId, data.tag, data.volume);
            });
        }
    }

    /**
     * 上报本地自定义音频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLocalCustomAudioStatsListener(listener?: (tag: string, stats: RCRTCLocalAudioStats) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnLocalCustomAudioStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { tag: string, stats: RCRTCLocalAudioStats }) => {
                logger.log(`${eventName} tag=${data.tag}, stats=${logger.toString(data.stats)}`);
                listener(data.tag, data.stats);
            });
        }
    }

    /**
     * 上报本地自定义视频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLocalCustomVideoStatsListener(listener?: (tag: string, stats: RCRTCLocalVideoStats) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnLocalCustomVideoStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { tag: string, stats: RCRTCLocalVideoStats }) => {
                logger.log(`${eventName} tag=${data.tag}, stats=${logger.toString(data.stats)}`);
                listener(data.tag, data.stats);
            });
        }
    }

    /**
     * 上报远端自定义音频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnRemoteCustomAudioStatsListener(listener?: (roomId: string, userId: string, tag: string, stats: RCRTCRemoteAudioStats) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnRemoteCustomAudioStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, stats: RCRTCRemoteAudioStats }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, stats=${logger.toString(data.stats)}`);
                listener(data.roomId, data.userId, data.tag, data.stats);
            });
        }
    }

    /**
     * 上报远端自定义视频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnRemoteCustomVideoStatsListener(listener?: (roomId: string, userId: string, tag: string, stats: RCRTCRemoteVideoStats) => void): void
    {
        const eventName = 'IRCRTCIWStatsListener:OnRemoteCustomVideoStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, stats: RCRTCRemoteVideoStats }) => {
                logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, stats=${logger.toString(data.stats)}`);
                listener(data.roomId, data.userId, data.tag, data.stats);
            });
        }
    }

    /**
     * 汇报网络探测上行数据
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnNetworkProbeUpLinkStatsListener(listener?: (stats: RCRTCIWNetworkProbeStats) => void): void
    {
        const eventName = 'IRCRTCIWListener:onNetworkProbeUpLinkStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCIWNetworkProbeStats) => {
                logger.log(`${eventName} stats=${stats}`);
                listener(stats);
            });
        }
    }

    /**
     * 汇报网络探测下行数据
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnNetworkProbeDownLinkStatsListener(listener?: (stats: RCRTCIWNetworkProbeStats) => void): void
    {
        const eventName = 'IRCRTCIWListener:onNetworkProbeDownLinkStats'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCIWNetworkProbeStats) => {
                logger.log(`${eventName} stats=${stats}`);
                listener(stats);
            });
        }
    }

    /**
     * 网络探测完成
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnNetworkProbeFinishedListener(listener?: (code: number, errMsg: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onNetworkProbeFinished'
        RCReactNativeEventEmitter.removeAllListeners(eventName);
        if (listener) {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
                logger.log(`${eventName} code=${data?.code}, message=${data?.message}`);
                listener(data?.code, data?.message);
            });
        }
    }

    /**
     *停止所有远端音频数据渲染
     *@param mute   true: 不渲染 false: 渲染
     *@return 0: 成功, 非0: 失败
     */
    muteAllRemoteAudioStreams(mute: boolean): Promise<number>
    {
        logger.logObject('muteAllRemoteAudioStreams', { mute })
        return RCReactNativeRtc.muteAllRemoteAudioStreams(mute);
    }

    /**
     *切换直播角色
     *@return 0: 成功, 非0: 失败
     */
    switchLiveRole(role: RCRTCRole): Promise<number>
    {
        logger.logObject('switchLiveRole', { role })
        return RCReactNativeRtc.switchLiveRole(role);
    }

    /**
     *开启直播内置 cdn 功能
     *@param enable
     *@return 0: 成功, 非0: 失败
     */
    enableLiveMixInnerCdnStream(enable: boolean): Promise<number>
    {
        logger.logObject('enableLiveMixInnerCdnStream', { enable })
        return RCReactNativeRtc.enableLiveMixInnerCdnStream(enable);
    }

    /**
     *订阅直播内置 cdn 流
     *@return 0: 成功, 非0: 失败
     */
    subscribeLiveMixInnerCdnStream(): Promise<number>
    {
        logger.logObject('subscribeLiveMixInnerCdnStream', {})
        return RCReactNativeRtc.subscribeLiveMixInnerCdnStream();
    }

    /**
     *取消订阅直播内置 cdn 流
     *@return 0: 成功, 非0: 失败
     */
    unsubscribeLiveMixInnerCdnStream(): Promise<number>
    {
        logger.logObject('unsubscribeLiveMixInnerCdnStream', {})
        return RCReactNativeRtc.unsubscribeLiveMixInnerCdnStream();
    }

    /**
     *移除直播内置 cdn 流预览窗口
     *@return 0: 成功, 非0: 失败
     */
    removeLiveMixInnerCdnStreamView(): Promise<number>
    {
        logger.logObject('removeLiveMixInnerCdnStreamView', {})
        return RCReactNativeRtc.removeLiveMixInnerCdnStreamView();
    }

    /**
     *观众端 设置订阅 cdn 流的分辨率
     *@param width    分辨率宽
     *@param height   高
     *@return 接口调用状态码 0: 成功, 非0: 失败
     */
    setLocalLiveMixInnerCdnVideoResolution(width: number, height: number): Promise<number>
    {
        logger.logObject('setLocalLiveMixInnerCdnVideoResolution', { width, height })
        return RCReactNativeRtc.setLocalLiveMixInnerCdnVideoResolution(width, height);
    }

    /**
     *观众端设置订阅 cdn 流的帧率
     *@param fps   帧率
     *@return 接口调用状态码 0: 成功, 非0: 失败
     */
    setLocalLiveMixInnerCdnVideoFps(fps: RCRTCVideoFps): Promise<number>
    {
        logger.logObject('setLocalLiveMixInnerCdnVideoFps', { fps })
        return RCReactNativeRtc.setLocalLiveMixInnerCdnVideoFps(fps);
    }

    /**
     *观众端禁用或启用融云内置 CDN 流
     *@param mute  true: 停止资源渲染，false: 恢复资源渲染
     *@return 接口调用状态码 0: 成功, 非0: 失败
     */
    muteLiveMixInnerCdnStream(mute: boolean): Promise<number>
    {
        logger.logObject('muteLiveMixInnerCdnStream', { mute })
        return RCReactNativeRtc.muteLiveMixInnerCdnStream(mute);
    }

    /**
     *移除水印
     *@return 接口调用状态码 0: 成功, 非0: 失败
     */
    removeWatermark(): Promise<number>
    {
        logger.logObject('removeWatermark', {})
        return RCReactNativeRtc.removeWatermark();
    }

    /**
     *停止网络探测
     *@return 接口调用状态码 0: 成功, 非0: 失败
     */
    stopNetworkProbe(): Promise<number>
    {
        logger.logObject('stopNetworkProbe', {})
        return RCReactNativeRtc.stopNetworkProbe();
    }

    /**
     *开始麦克风&扬声器检测
     *@param timeInterval 麦克风录制时间
     *@return 接口调用状态码 0: 成功, 非0: 失败
     */
    startEchoTest(timeInterval: number): Promise<number>
    {
        logger.logObject('startEchoTest', { timeInterval })
        return RCReactNativeRtc.startEchoTest(timeInterval);
    }

    /**
     *停止麦克风&扬声器检测，结束检测后必须手动调用停止方法
     *@return 接口调用状态码 0: 成功, 非0: 失败
     */
    stopEchoTest(): Promise<number>
    {
        logger.logObject('stopEchoTest', {})
        return RCReactNativeRtc.stopEchoTest();
    }

    /**
     *开启 SEI 功能，观众身份调用无效
     *@param enable 是否开启
     *@return 接口调用状态码 0: 成功, 非0: 失败
     */
    enableSei(enable: boolean): Promise<number>
    {
        logger.logObject('enableSei', { enable })
        return RCReactNativeRtc.enableSei(enable);
    }

    /**
     *发送 SEI 信息，需开启 SEI 功能之后调用
     *@param sei SEI 信息
     *@return 接口调用状态码 0: 成功, 非0: 失败
     */
    sendSei(sei: string): Promise<number>
    {
        logger.logObject('sendSei', { sei })
        return RCReactNativeRtc.sendSei(sei);
    }

    /**
     *预链接到媒体服务器
     *@return 接口调用状态码 0: 成功, 非0: 失败
     */
    preconnectToMediaServer(): Promise<number>
    {
        logger.logObject('preconnectToMediaServer', {})
        return RCReactNativeRtc.preconnectToMediaServer();
    }

    /**
     *远端用户身份切换回调
     *@param roomId    房间号
     *@param userId    用户id
     *@param role      用户角色
     */
    setOnRemoteLiveRoleSwitchedListener(listener?: (roomId: string, userId: string, role: RCRTCRole) => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteLiveRoleSwitched'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, role: RCRTCRole }) => {
                logger.logObject('onRemoteLiveRoleSwitched', data);
                listener(data.roomId, data.userId, data.role)
            })
        }
    }

    /**
     *开启直播内置 cdn 结果回调
     *@param enable    是否开启
     *@param code      错误码
     *@param errMsg    错误消息
     */
    setOnLiveMixInnerCdnStreamEnabledListener(listener?: (enable: boolean, code: number, errMsg: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixInnerCdnStreamEnabled'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { enable: boolean, code: number, errMsg: string }) => {
                logger.logObject('onLiveMixInnerCdnStreamEnabled', data);
                listener(data.enable, data.code, data.errMsg)
            })
        }
    }

    /**
     *直播内置 cdn 资源发布回调
     */
    setOnRemoteLiveMixInnerCdnStreamPublishedListener(listener?: () => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteLiveMixInnerCdnStreamPublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, () => {
                logger.logObject('onRemoteLiveMixInnerCdnStreamPublished', {});
                listener()
            })
        }
    }

    /**
     *直播内置 cdn 资源取消发布回调
     */
    setOnRemoteLiveMixInnerCdnStreamUnpublishedListener(listener?: () => void): void
    {
        const eventName = 'IRCRTCIWListener:onRemoteLiveMixInnerCdnStreamUnpublished'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, () => {
                logger.logObject('onRemoteLiveMixInnerCdnStreamUnpublished', {});
                listener()
            })
        }
    }

    /**
     *订阅直播内置 cdn 资源回调
     *@param code      错误码
     *@param errMsg    错误消息
     */
    setOnLiveMixInnerCdnStreamSubscribedListener(listener?: (code: number, errMsg: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixInnerCdnStreamSubscribed'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, errMsg: string }) => {
                logger.logObject('onLiveMixInnerCdnStreamSubscribed', data);
                listener(data.code, data.errMsg)
            })
        }
    }

    /**
     *取消订阅直播内置 cdn 资源回调
     *@param code      错误码
     *@param errMsg    错误消息
     */
    setOnLiveMixInnerCdnStreamUnsubscribedListener(listener?: (code: number, errMsg: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixInnerCdnStreamUnsubscribed'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, errMsg: string }) => {
                logger.logObject('onLiveMixInnerCdnStreamUnsubscribed', data);
                listener(data.code, data.errMsg)
            })
        }
    }

    /**
     *观众端设置订阅 cdn 流的分辨率的回调
     *@param code      错误码
     *@param errMsg    错误消息
     */
    setOnLocalLiveMixInnerCdnVideoResolutionSetListener(listener?: (code: number, errMsg: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLocalLiveMixInnerCdnVideoResolutionSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, errMsg: string }) => {
                logger.logObject('onLocalLiveMixInnerCdnVideoResolutionSet', data);
                listener(data.code, data.errMsg)
            })
        }
    }

    /**
     *观众端 设置订阅 cdn 流的帧率的回调
     *@param code      错误码
     *@param errMsg    错误消息
     */
    setOnLocalLiveMixInnerCdnVideoFpsSetListener(listener?: (code: number, errMsg: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLocalLiveMixInnerCdnVideoFpsSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, errMsg: string }) => {
                logger.logObject('onLocalLiveMixInnerCdnVideoFpsSet', data);
                listener(data.code, data.errMsg)
            })
        }
    }

    /**
     *设置水印的回调
     *@param code      错误码
     *@param errMsg    错误消息
     */
    setOnWatermarkSetListener(listener?: (code: number, errMsg: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onWatermarkSet'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, errMsg: string }) => {
                logger.logObject('onWatermarkSet', data);
                listener(data.code, data.errMsg)
            })
        }
    }

    /**
     *移除水印的回调
     *@param code      错误码
     *@param errMsg    错误消息
     */
    setOnWatermarkRemovedListener(listener?: (code: number, errMsg: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onWatermarkRemoved'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, errMsg: string }) => {
                logger.logObject('onWatermarkRemoved', data);
                listener(data.code, data.errMsg)
            })
        }
    }

    /**
     *开启网络探测结果回调
     *@param code      错误码
     *@param errMsg    错误消息
     */
    setOnNetworkProbeStartedListener(listener?: (code: number, errMsg: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onNetworkProbeStarted'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, errMsg: string }) => {
                logger.logObject('onNetworkProbeStarted', data);
                listener(data.code, data.errMsg)
            })
        }
    }

    /**
     *关闭网络探测结果回调
     *@param code      错误码
     *@param errMsg    错误消息
     */
    setOnNetworkProbeStoppedListener(listener?: (code: number, errMsg: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onNetworkProbeStopped'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, errMsg: string }) => {
                logger.logObject('onNetworkProbeStopped', data);
                listener(data.code, data.errMsg)
            })
        }
    }

    /**
     *开启 SEI 功能结果回调
     *@param enable 是否开启
     *@param code      错误码
     *@param errMsg    错误消息
     */
    setOnSeiEnabledListener(listener?: (enable: boolean, code: number, errMsg: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onSeiEnabled'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { enable: boolean, code: number, errMsg: string }) => {
                logger.logObject('onSeiEnabled', data);
                listener(data.enable, data.code, data.errMsg)
            })
        }
    }

    /**
     *收到 SEI 信息回调
     *@param roomId 房间 id
     *@param userId 远端用户 id
     *@param sei SEI 信息
     */
    setOnSeiReceivedListener(listener?: (roomId: string, userId: string, sei: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onSeiReceived'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, sei: string }) => {
                logger.logObject('onSeiReceived', data);
                listener(data.roomId, data.userId, data.sei)
            })
        }
    }

    /**
     *观众收到合流 SEI 信息回调
     *@param sei SEI 信息
     */
    setOnLiveMixSeiReceivedListener(listener?: (sei: string) => void): void
    {
        const eventName = 'IRCRTCIWListener:onLiveMixSeiReceived'
        RCReactNativeEventEmitter.removeAllListeners(eventName)
        if (listener)
        {
            RCReactNativeEventEmitter.addListener(eventName, (data: { sei: string }) => {
                logger.logObject('onLiveMixSeiReceived', data);
                listener(data.sei)
            })
        }
    }
}
export {RCRTCEngine}
import type {
    RCRTCAudioConfig,
    RCRTCAudioMixingMode,
    RCRTCCamera,
    RCRTCCameraCaptureOrientation,
    RCRTCCustomLayout,
    RCRTCEngineSetup,
    RCRTCErrorCode,
    RCRTCLiveMixLayoutMode,
    RCRTCLiveMixRenderMode,
    RCRTCMediaType,
    RCRTCRoomSetup,
    RCRTCVideoConfig,
    RCRTCVideoFps,
} from "./RCRTCDefines";

export default interface RCRTCEngineInterface {

    /**
     * 初始化
     * 
     * @param setup 配置项
     * @memberof RCRTCEngineInterface
     */
    init(setup: RCRTCEngineSetup): Promise<null>;

    /**
     * 反初始化
     *
     * @memberof RCRTCEngineInterface
     */
    unInit(): Promise<null>;

    /**
     * 加入房间
     * 
     * @param {string} roomId 房间id
     * @param {RCRTCRoomSetup} setup 房间配置
     * @return {*}  {void}
     * @memberof RCRTCEngineInterface 错误码
     */
    joinRoom(roomId: string, setup: RCRTCRoomSetup): Promise<null>;

    /**
     * 离开房间
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    leaveRoom(): Promise<RCRTCErrorCode>;

    /**
     * 加入房间后, 发布本地资源
     *
     * @param {RCRTCMediaType} type 媒体资源类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    publish(type: RCRTCMediaType): Promise<RCRTCErrorCode>;

    /**
     * 加入房间后, 取消发布已经发布的本地资源
     *
     * @param {RCRTCMediaType} type 媒体资源类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    unpublish(type: RCRTCMediaType): Promise<RCRTCErrorCode>;

    /**
     *
     * @param userId 远端用户 userId
     * @param type 媒体资源类型
     * @param tiny 视频小流, true:订阅视频小流 false:订阅视频大流
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    subscribe(userId: string, type: RCRTCMediaType, tiny: boolean): Promise<RCRTCErrorCode>;

    /**
     * 加入房间后, 订阅远端多个用户发布的资源
     * 
     * @param {string[]} userIds 远端用户 userId 数组
     * @param {RCRTCMediaType} type 媒体资源类型
     * @param {boolean} tiny 是否视频小流 true:订阅视频小流 false:订阅视频大流
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    subscribes(userIds: string[], type: RCRTCMediaType, tiny: boolean): Promise<RCRTCErrorCode>;

    /**
     * 加入房间后, 取消订阅远端单个用户发布的资源
     *
     * @param {string} userId 远端用户 userId
     * @param {RCRTCMediaType} type 媒体资源类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    unsubscribe(userId: string, type: RCRTCMediaType): Promise<RCRTCErrorCode>;

    /**
     * 加入房间后, 取消订阅远端多个用户发布的资源
     *
     * @param {string[]} userIds 远端用户 userId 数组
     * @param {RCRTCMediaType} type 媒体资源类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    unsubscribes(userIds: string[], type: RCRTCMediaType): Promise<RCRTCErrorCode>;

    /**
     * 订阅主播合流资源, 仅供直播观众用户使用
     *
     * @param {RCRTCMediaType} type 媒体资源类型
     * @param {boolean} tiny 是否视频小流 true:订阅视频小流 false:订阅视频大流
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    subscribeLiveMix(type: RCRTCMediaType, tiny: boolean): Promise<RCRTCErrorCode>;

    /**
     * 取消订阅主播合流资源, 仅供直播观众用户使用
     *
     * @param {RCRTCMediaType} type 媒体资源类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 错误码
     */
    unsubscribeLiveMix(type: RCRTCMediaType): Promise<RCRTCErrorCode>;

    /**
     * 设置默认音频参数, 仅供会议用户或直播主播用户使用
     *
     * @param {RCRTCAudioConfig} config 音频配置
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setAudioConfig(config: RCRTCAudioConfig): Promise<RCRTCErrorCode>;

    /**
     * 设置默认视频参数, 仅供会议用户或直播主播用户使用
     *
     * @param {RCRTCVideoConfig} config 视频配置
     * @param {false} [tiny] 是否小流 true:视频小流 false:视频大流
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setVideoConfig(config: RCRTCVideoConfig, tiny: false): Promise<RCRTCErrorCode>;

    /**
     * 打开/关闭麦克风
     *
     * @param {boolean} enable true 打开, false 关闭
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    enableMicrophone(enable: boolean): Promise<RCRTCErrorCode>;

    /**
     * 打开/关闭外放
     *
     * @param {boolean} enable true 打开, false 关闭 
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 
     */
    enableSpeaker(enable: boolean): Promise<RCRTCErrorCode>;

    /**
     * 设置麦克风的音量 
     *
     * @param {number} volume 0 ~ 100, 默认值: 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 
     */
    adjustLocalVolume(volume: number): Promise<RCRTCErrorCode>;

    /**
     * 打开/关闭摄像头
     *
     * @param {boolean} enable true：打开， false：关闭
     * @param {RCRTCCamera} camera 摄像头类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    enableCamera(enable: boolean, camera: RCRTCCamera): Promise<RCRTCErrorCode>;

    /**
     * 切换前后摄像头
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    switchCamera(): Promise<RCRTCErrorCode>;


    /**
     * 切换到指定摄像头
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    switchToCamera(camera: RCRTCCamera): Promise<RCRTCErrorCode>;


    /**
     * 获取当前使用摄像头位置
     *
     * @return {*}  {Promise<RCRTCCamera>} 摄像头类型
     * @memberof RCRTCEngineInterface
     */
    whichCamera(): Promise<RCRTCCamera>;

    /**
     * 获取摄像头是否支持区域对焦
     *
     * @return {*}  {boolean} true: 支持  false: 不支持
     * @memberof RCRTCEngineInterface
     */
    isCameraFocusSupported(): Promise<boolean>;

    /**
     * 获取摄像头是否支持区域测光
     *
     * @return {*}  {boolean} true: 支持  false: 不支持
     * @memberof RCRTCEngineInterface
     */
    isCameraExposurePositionSupported(): Promise<boolean>;

    /**
     * 设置在指定点区域对焦
     *
     * @param {number} x 对焦点，视图上的 x 轴坐标
     * @param {number} y 对焦点，视图上的 y 轴坐标
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setCameraFocusPositionInPreview(x: number, y: number): Promise<RCRTCErrorCode>;

    /**
     * 设置在指定点区域测光
     *
     * @param {number} x 曝光点，视图上的 x 轴坐标
     * @param {number} y 曝光点，视图上的 y 轴坐标
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setCameraExposurePositionInPreview(x: number, y: number): Promise<RCRTCErrorCode>;

    /**
     * 设置摄像头采集方向
     *
     * @param {RCRTCCameraCaptureOrientation} orientation 默认以 Portrait 角度进行采集
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setCameraCaptureOrientation(orientation: RCRTCCameraCaptureOrientation): Promise<RCRTCErrorCode>;

    /**
     * 设置本地视频渲染窗口
     *
     * @param {number} tag 窗口的 tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLocalView(tag: number): Promise<RCRTCErrorCode>;//----------------------------

    /**
     * 移除本地视频渲染窗口
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeLocalView(): Promise<RCRTCErrorCode>;

    /**
     * 设置远端视频窗口
     *
     * @param {string} userId 远端用户Id
     * @param {string} ref 窗口的 ref
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setRemoteView(userId: string, tag: number): Promise<RCRTCErrorCode>;

    /**
     * 移除远端视频窗口
     *
     * @param {string} userId 远端用户Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeRemoteView(userId: string): Promise<RCRTCErrorCode>;

    /**
     * 设置合流视频窗口
     *
     * @param {number} tag 窗口 tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixView(tag: number): Promise<RCRTCErrorCode>;

    /**
     * 移除合流视频窗口
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeLiveMixView(): Promise<RCRTCErrorCode>;

    /**
     * 停止本地音视频数据发送
     *
     * @param {RCRTCMediaType} type 媒体类型
     * @param {boolean} mute true: 不发送 false: 发送
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    muteLocalStream(type: RCRTCMediaType, mute: boolean): Promise<RCRTCErrorCode>;

    /**
     * 停止远端用户音视频数据的接收
     *
     * @param {string} userId 远端用户Id
     * @param {RCRTCMediaType} type 媒体类型
     * @param {boolean} mute true: 不发送 false: 发送
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    muteRemoteStream(userId: string, type: RCRTCMediaType, mute: boolean): Promise<RCRTCErrorCode>;

    /**
     * 停止合流数据渲染
     *
     * @param {RCRTCMediaType} type 媒体类型
     * @param {boolean} mute true: 不发送 false: 发送
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    muteLiveMixStream(type: RCRTCMediaType, mute: boolean): Promise<RCRTCErrorCode>;


    /**
     * 设置 CDN 直播推流地址, 仅供直播主播用户使用
     *
     * @param {string} url 推流地址
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    addLiveCdn(url: string): Promise<RCRTCErrorCode>;

    /**
     * 移除 CDN 直播推流地址, 仅供直播主播用户使用
     *
     * @param {string} url 推流地址
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeLiveCdn(url: string): Promise<RCRTCErrorCode>;

    /**
     * 设置直播合流布局类型, 仅供直播主播用户使用
     *
     * @param {RCRTCLiveMixLayoutMode} mode 布局类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixLayoutMode(mode: RCRTCLiveMixLayoutMode): Promise<RCRTCErrorCode>;

    /**
     * 设置直播合流布局填充类型, 仅供直播主播用户使用
     *
     * @param {RCRTCLiveMixRenderMode} mode 填充类型
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 
     */
    setLiveMixRenderMode(mode: RCRTCLiveMixRenderMode): Promise<RCRTCErrorCode>;

    /**
     * 设置直播合流布局背景颜色, 仅供直播主播用户使用
     *
     * @param color 用于旁路直播的输出视频的背景色，格式为 RGB 定义下的 Hex 值，不要带 # 号，如 0xFFB6C1 表示浅粉色。默认0x000000，黑色。取值范围 [0x000000, 0xFFFFFF]
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 
     */
    setLiveMixBackgroundColor(color: number): Promise<RCRTCErrorCode>;

    /**
     * 设置直播合流布局背景颜色, 仅供直播主播用户使用
     *
     * @param red   红色 取值范围: 0 ~ 255
     * @param green 绿色 取值范围: 0 ~ 255
     * @param blue  蓝色 取值范围: 0 ~ 255
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface 
     */
    setLiveMixBackgroundColorRgb(red: number, green: number, blue: number): Promise<RCRTCErrorCode>;

    /**
     * 设置直播混流布局配置, 仅供直播主播用户使用
     *
     * @param {RCRTCCustomLayout[]} layouts 混流布局列表
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixCustomLayouts(layouts: RCRTCCustomLayout[]): Promise<RCRTCErrorCode>;

    /**
     * 设置直播自定义音频流列表, 仅供直播主播用户使用
     *
     * @param {string[]} userIds 音频流列表
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixCustomAudios(userIds: string[]): Promise<RCRTCErrorCode>;

    /**
     * 设置直播合流音频码率, 仅供直播主播用户使用
     *
     * @param {number} bitrate 音频码率 单位：kbps
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixAudioBitrate(bitrate: number): Promise<RCRTCErrorCode>;

    /**
     * 设置直播合流视频码率, 仅供直播主播用户使用
     *
     * @param {number} bitrate 音频码率 单位：kbps
     * @param {false} [tiny] 是否小流 true:视频小流 false:视频大流，默认值 false
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixVideoBitrate(bitrate: number, tiny: false): Promise<RCRTCErrorCode>;

    /**
     * 设置直播合流视频分辨率, 仅供直播主播用户使用
     *
     * @param width  视频宽度
     * @param height 视频高度
     * @param {false} tiny 是否小流 true:视频小流 false:视频大流，默认值 false
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixVideoResolution(width: number, height: number, tiny: false): Promise<RCRTCErrorCode>;

    /**
     * 设置直播合流视频帧率, 仅供直播主播用户使用
     *
     * @param {RCRTCVideoFps} fps 帧率
     * @param {false} tiny 是否小流 true:视频小流 false:视频大流，默认值 false
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setLiveMixVideoFps(fps: RCRTCVideoFps, tiny: false): Promise<RCRTCErrorCode>;

    /**
     * 创建音效文件缓存, 仅供会议用户或直播主播用户使用
     *
     * @param {string} path 本地文件地址
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    createAudioEffect(path: string, effectId: number): Promise<RCRTCErrorCode>;

    /**
     * 释放音效文件缓存, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    releaseAudioEffect(effectId: number): Promise<RCRTCErrorCode>;

    /**
     * 播放音效文件, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @param {number} volume 音效文件播放音量
     * @param {boolean} loop 循环播放次数 默认：1次
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    playAudioEffect(effectId: number, volume: number, loop: 1): Promise<RCRTCErrorCode>;

    /**
     * 暂停音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    pauseAudioEffect(effectId: number): Promise<RCRTCErrorCode>;

    /**
     * 暂停全部音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    pauseAllAudioEffects(): Promise<RCRTCErrorCode>;

    /**
     * 恢复音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    resumeAudioEffect(effectId: number): Promise<RCRTCErrorCode>;

    /**
     * 恢复全部音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    resumeAllAudioEffects(): Promise<RCRTCErrorCode>;

    /**
     * 停止音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    stopAudioEffect(effectId: number): Promise<RCRTCErrorCode>;

    /**
     * 停止全部音效文件播放, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    stopAllAudioEffects(): Promise<RCRTCErrorCode>;

    /**
     * 设置音效文件播放音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @param {number} volume 音量 0~100, 默认 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    adjustAudioEffectVolume(effectId: number, volume: number): Promise<RCRTCErrorCode>;

    /**
     * 获取音效文件播放音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} effectId 自定义全局唯一音效Id
     * @return 大于或等于0: 调用成功, 小于0: 调用失败
     * @memberof RCRTCEngineInterface
     */
    getAudioEffectVolume(effectId: number): Promise<number>;

    /**
     * 设置全局音效文件播放音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} volume 音量 0~100, 默认 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    adjustAllAudioEffectsVolume(volume: number): Promise<RCRTCErrorCode>;

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
    startAudioMixing(path: string, mode: RCRTCAudioMixingMode, playback: true, loop: 1): Promise<RCRTCErrorCode>;

    /**
     * 停止混音, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     * @category 混音
     */
    stopAudioMixing(): Promise<RCRTCErrorCode>;

    /**
     * 暂停混音, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     * @category 混音
     */
    pauseAudioMixing(): Promise<RCRTCErrorCode>;

    /**
     * 恢复混音, 仅供会议用户或直播主播用户使用
     *
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    resumeAudioMixing(): Promise<RCRTCErrorCode>;

    /**
     * 设置混音输入音量, 包含本地播放和发送音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} volume 音量 0~100, 默认 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    adjustAudioMixingVolume(volume: number): Promise<RCRTCErrorCode>;

    /**
     * 设置混音本地播放音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} volume  音量 0~100, 默认 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    adjustAudioMixingPlaybackVolume(volume: number): Promise<RCRTCErrorCode>;

    /**
     * 获取混音本地播放音量, 仅供会议用户或直播主播用户使用
     *
     * @return 大于或等于0: 调用成功, 小于0: 调用失败
     * @memberof RCRTCEngineInterface
     */
    getAudioMixingPlaybackVolume(): Promise<number>;

    /**
     * 设置混音发送音量, 仅供会议用户或直播主播用户使用
     *
     * @param {number} volume 音量 0~100, 默认 100
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    adjustAudioMixingPublishVolume(volume: number): Promise<RCRTCErrorCode>;

    /**
     * 获取混音发送音量, 仅供会议用户或直播主播用户使用
     *
     * @return  大于或等于0: 调用成功, 小于0: 调用失败
     * @memberof RCRTCEngineInterface
     */
    getAudioMixingPublishVolume(): Promise<number>;

    /**
     * 设置混音文件合流进度, 仅供会议用户或直播主播用户使用
     *
     * @param {number} position 进度 0~1
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setAudioMixingPosition(position: number): Promise<RCRTCErrorCode>;

    /**
     * 获取音频文件合流进度, 仅供会议用户或直播主播用户使用
     *
     * @return 合流进度 0~1
     * @memberof RCRTCEngineInterface
     */
    getAudioMixingPosition(): Promise<number>;

    /**
     * 获取音频文件时长, 单位:秒, 仅供会议用户或直播主播用户使用
     *
     * @return 大于或等于0: 调用成功, 小于0: 调用失败
     * @memberof RCRTCEngineInterface
     */
    getAudioMixingDuration(): Promise<number>;

    /**
     * 获取当前房间的 SessionId, 仅在加入房间成功后可获取
     * 每次加入房间所得到的 SessionId 均不同
     *
     * @return {*}  {string} 获取到的 sessionId
     * @memberof RCRTCEngineInterface
     */
    getSessionId(): Promise<string>;



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
    createCustomStreamFromFile(path: string, tag: string, replace: boolean, playback: boolean): Promise<RCRTCErrorCode>;

    /**
     * 设置自定义流的视频配置
     *
     * @param tag
     * @param config
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setCustomStreamVideoConfig(tag: string, config: RCRTCVideoConfig): Promise<RCRTCErrorCode>;

    /**
     * 停止本地数据渲染
     *
     * @param tag
     * @param mute
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    muteLocalCustomStream(tag: string, mute: boolean): Promise<RCRTCErrorCode>;

    /**
     * 设置本地自定义视频预览窗口
     *
     * @param tag
     * @param view
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface     
     */
    setLocalCustomStreamView(tag: string, view: number): Promise<RCRTCErrorCode>;

    /**
     * 移除本地自定义视频预览窗口
     *
     * @param tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeLocalCustomStreamView(tag: string): Promise<RCRTCErrorCode>;

    /**
     * 发布自定义视频
     *
     * @param tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface     
     */
    publishCustomStream(tag: string): Promise<RCRTCErrorCode>;

    /**
     * 取消发布自定义视频
     *
     * @param tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    unpublishCustomStream(tag: string): Promise<RCRTCErrorCode>;

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
    muteRemoteCustomStream(userId: string, tag: string, type: number, mute: boolean): Promise<RCRTCErrorCode>;

    /**
     * 设置远端自定义视频预览窗口
     *
     * @param userId
     * @param tag
     * @param view
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    setRemoteCustomStreamView(userId: string, tag: string, view: number): Promise<RCRTCErrorCode>;

    /**
     * 移除远端自定义视频预览窗口
     *
     * @param userId
     * @param tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    removeRemoteCustomStreamView(userId: string, tag: string): Promise<RCRTCErrorCode>;

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
    subscribeCustomStream(userId: string, tag: string, type: number, tiny: boolean): Promise<RCRTCErrorCode>;

   /**
     * 取消订阅自定义流
     *
     * @param userId
     * @param type
     * @param tag
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    unsubscribeCustomStream(userId: string, tag: string, type: number): Promise<RCRTCErrorCode>;

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
    requestJoinSubRoom(roomId: string, userId: string, autoLayout: boolean, extra: string): Promise<RCRTCErrorCode>;

    /**
     * 取消正在进行中的加入子房间（跨房间连麦）请求
     *
     * @param roomId 正在请求的目标房间id
     * @param userId 正在请求的目标主播id
     * @param extra  附加信息，默认为空
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    cancelJoinSubRoomRequest(roomId: string, userId: string, extra: string): Promise<RCRTCErrorCode>;

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
    responseJoinSubRoomRequest(roomId: string, userId: string, agree: boolean, autoLayout: boolean, extra: string): Promise<RCRTCErrorCode>;

    /**
     * 加入子房间
     * 前提必须已经 通过 joinRoom 加入了主房间
     * 未建立连麦时，需先调用 requestJoinSubRoom 发起加入请求
     *
     * @param roomId 目标房间id
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    joinSubRoom(roomId: string): Promise<RCRTCErrorCode>;

    /**
     * 离开子房间
     *
     * @param roomId  子房间id
     * @param disband 是否解散，解散后再次加入需先调用 requestJoinSubRoom 发起加入请求
     * @return 0: 成功, 非0: 失败
     * @memberof RCRTCEngineInterface
     */
    leaveSubRoom(roomId: string, disband: boolean): Promise<RCRTCErrorCode>;
}
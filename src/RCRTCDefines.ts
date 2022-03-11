/**
 * 引擎初始配置
 */
export interface RCRTCEngineSetup {

    /**
     * 连接断开后是否 SDK 内部重连
     * 默认: NO 不重连
     */
    reconnectable?: boolean;

    /**
     * 设置房间统计信息的回调间隔, 单位: 毫秒, 默认: 1000ms(1s)
     * 注意: interval 值太小会影响 SDK 性能，如果小于 100 配置无法生效
     */
    statsReportInterval?: number;

    /**
     * 设置媒体服务器地址
     * 特别注意: 如果设置了，会覆盖导航下载下来的 media server url
     */
    mediaUrl?: string;

    /**
     * 音频配置
     */
    audioSetup?: RCRTCAudioSetup;

    /**
     * 视频配置
     */
    videoSetup?: RCRTCVideoSetup;
}

/**
 * 音频配置
 */
export interface RCRTCAudioSetup {

    /**
     * 音频编译类型
     * 默认: RCRTCIWAudioCodecTypeOPUS
     * iOS Android
     */
    codec?: RCRTCAudioCodecType;

    /**
     * 是否可以和其它后台 App 进行混音
     * 默认 YES
     * 特别注意：如果该属性设置为 NO，切换到其它 App 操作麦克风或者扬声器时，会导致自己 App 麦克风采集和播放被打断。
     * 仅 iOS 平台生效
     */
    mixOtherAppsAudio?: boolean;

    /**
     * 音源设置
     * 默认值：VOICE_COMMUNICATION
     */
    audioSource?: RCRTCAudioSource;

    /**
     * 音频采样率
     * 默认值 Type16000
     * 仅 Android 平台生效
     */
    audioSampleRate?: RCRTCAudioSampleRate;

    /**
     * 是否禁用麦克风
     * 默认值 true
     * 仅 Android 平台生效
     */
    enableMicrophone?: boolean;

    /**
     * 音频是否支持立体声
     * 默认值 true
     * 仅 Android 平台生效
     */
    enableStereo?: boolean;
}

/**
 *  视频配置
 */
export interface RCRTCVideoSetup {
    enableHardwareDecoder?: boolean;
    enableHardwareEncoder?: boolean;
    enableHardwareEncoderHighProfile?: boolean;
    hardwareEncoderFrameRate?: number;
    enableEncoderTexture?: boolean;
    /**
     * 是否开启视频小流, 默认: YES 开启
     */
    enableTinyStream?: boolean;
}

/**
 * 房间配置
 */
export interface RCRTCRoomSetup {

    /**
     * 音视频类型
     * 默认 AudioVideo
     */
    type?: RCRTCMediaType;

    /**
     * 角色类型
     * 默认 MeetingMember
     */
    role?: RCRTCRole;
}

/**
 * 音频配置
 */
export interface RCRTCAudioConfig {

    /**
     * 音频通话质量类型
     * 默认值：Speech
     */
    quality?: RCRTCAudioQuality;

    /**
     * 音频通话模式
     * 默认值：Normal
     */
    scenario?: RCRTCAudioScenario;
}

/**
 * 视频配置
 */
export interface RCRTCVideoConfig {

    /**
     * 视频最小码率, 默认值: 0
     */
    minBitrate?: number;

    /**
     * 视频最大码率, 默认值: 0
     */
    maxBitrate?: number;

    /**
     * 视频帧率, 默认值: FPS15
     */
    fps?: number;

    /**
     * 视频分辨率, 默认值: RCRTCIWVideoResolution640x480
     */
    resolution?: number;

    /**
     * 流镜像, 默认值: NO
     */
    mirror?: number;
}

export interface RCRTCCustomLayout {

    /**
     * 用户 id
     */
    id: string;

    /**
     * 混流图层坐标的 x 值
     * 默认值：0
     */
    x?: number;

    /**
     * 混流图层坐标的 y 值
     * 默认值：0
     */
    y?: number;

    /**
     * 视频流的宽度
     * 默认值：480
     */
    width?: number;

    /**
     * 视频流的高度
     * 默认值：640
     */
    height?: number;

    /**
     * 自定义视频tag
     * 默认值：null
     */
    tag?:string,

    /**
     * 自定义视频类型
     * 默认值：RCRTCStreamType.NORMAL
     */
    type?:RCRTCStreamType
}



/**
 * 错误码
 */
export enum RCRTCErrorCode {
    /**
     * 成功
     */
    Success = 0,
    /**
     * 引擎已销毁
     */
    EngineDestroy = -10,
    /**
     * RTCLib 未初始化
     */
    RTCEngineNotInit = -11,
    /**
     * 切换摄像头失败
     */
    SwitchCameraError = -12,
    /**
     * 本地用户未加入房间
     */
    LocalUserNotJoinedRTCRoom = -13,
    /**
     * 远端用户未加入房间
     */
    RemoteUserNotJoinedRTCRoom = -14,
    /**
     * 启动混音失败
     */
    StartAudioMixError = -15,
    /**
     * 流不存在
     */
    StreamNotExist = -16,
    /**
     * 参数错误
     */
    ParameterError = -17,
    /**
     * 创建自定义流失败
     */
    CreateCustomStreamError = -18,
    /**
     * 暂不支持
     */
    NotSupportYet = -19,
    /**
     * 自定义视频文件打开失败
     */
    CustomFileOpenError = -20,

    /**
     * 
     */
    CustomUserNotInLive = -21
}

/**
 * 音频编译类型
 */
export enum RCRTCAudioCodecType {
    OPUS,
    PCMU
}

/**
 * 音源类型
 */
export enum RCRTCAudioSource {
    /**
     * 默认音频源
     */
    DEFAULT,
    /**
     * 麦克风
     */
    MIC,
    /**
     * 语音呼叫上行音频源
     */
    VOICE_UPLINK,
    /**
     * 语音呼叫下行音频源
     */
    VOICE_DOWNLINK,
    /**
     * 语音呼叫音频源
     */
    VOICE_CALL,
    /**
     * 同方向的相机麦克风，若相机无内置相机或无法识别，则使用预设的麦克风
     */
    CAMCORDER,
    /**
     * 进过语音识别后的麦克风音频源
     */
    VOICE_RECOGNITION,
    /**
     * 针对VoIP调整后的麦克风音频源
     */
    VOICE_COMMUNICATION
}

export enum RCRTCAudioSampleRate {
    Type8000 = 8000,
    Type16000 = 16000,
    Type32000 = 32000,
    Type44100 = 44100,
    Type48000 = 48000,
}

/**
 * 音视频类型
 */
export enum RCRTCMediaType {
    /**
     * 仅音频
     */
    Audio = 0,
    /**
     * 仅视频
     */
    Video,
    /**
     * 音频 + 视频
     */
    AudioVideo,
}

/**
 * 角色类型
 */
export enum RCRTCRole {
    /**
     * 会议类型房间中用户
     */
    MeetingMember = 0,
    /**
     * 直播类型房间中主播
     */
    LiveBroadcaster,
    /**
     * 直播类型房间中观众
     */
    LiveAudience,
}

/**
 * 音频通话质量类型
 */
export enum RCRTCAudioQuality {

    /**
     * 人声音质，编码码率最大值为 32Kbps
     */
    Speech,

    /**
     * 标清音乐音质，编码码率最大值为 64Kbps
     */
    Music,

    /**
     * 高清音乐音质，编码码率最大值为 128Kbps
     */
    MusicHigh,
}

/**
 * 音频通话模式
 */
export enum RCRTCAudioScenario {

    /**
     * 普通通话模式(普通音质模式), 满足正常音视频场景
     */
    Normal,

    /**
     * 音乐聊天室模式, 提升声音质量，适用对音乐演唱要求较高的场景
     */
    MusicChatRoom,

    /**
     * 音乐教室模式，提升声音质量，适用对乐器演奏音质要求较高的场景
     */
    MusicClassRoom,
}

/**
 * 视频帧率
 */
export enum RCRTCVideoFps {

    /**
     * 每秒 10 帧
     */
    Fps10,

    /**
     * 每秒 15 帧
     */
    Fps15,

    /**
     * 每秒 25 帧
     */
    Fps25,

    /**
     * 每秒 30 帧
     */
    Fps30,
}

/**
 * 视频分辨率
 */
export enum RCRTCVideoResolution {
    Resolution_144x176,
    Resolution_180x180,
    Resolution_144x256,
    Resolution_180x240,
    Resolution_180x320,
    Resolution_240x240,
    Resolution_240x320,
    Resolution_360x360,
    Resolution_360x480,
    Resolution_360x640,
    Resolution_480x480,
    Resolution_480x640,
    Resolution_480x720,
    Resolution_480x848,
    Resolution_720x960,
    Resolution_720x1280,
    Resolution_1080x1920
}

/**
 * 视频填充模式
 */
export enum RCRTCViewFitType {
    /**
     * 满屏显示, 等比例填充, 直到填充满整个视图区域, 其中一个维度的部分区域会被裁剪
     */
    Cover=1,

    /**
     * 完整显示, 填充黑边, 等比例填充, 直到一个维度到达区域边界
     */
    Center=2,
}

/**
 * 摄像头类型
 */
export enum RCRTCCamera {

    /**
     * 无
     */
    None,

    /**
     * 前置摄像头
     */
    Front,

    /**
     * 后置摄像头
     */
    Back,
}

/**
 * 摄像头采集方向
 */
export enum RCRTCCameraCaptureOrientation {

    /**
     * 竖直, home 键在下部
     */
    Portrait = 0,

    /**
     * 顶部向下, home 键在上部
     */
    PortraitUpsideDown,

    /**
     * 顶部向右, home 键在左侧
     */
    LandscapeRight,

    /**
     * 顶部向左, home 键在右侧
     */
    LandscapeLeft
}

/**
 * 合流布局模式
 */
export enum RCRTCLiveMixLayoutMode {

    /**
     * 自定义布局
     */
    Custom,

    /**
     * 悬浮布局
     */
    Suspension,

    /**
     * 自适应布局
     */
    Adaptive,
}

/**
 * 输出视频流的裁剪模式
 */
export enum RCRTCLiveMixRenderMode {

    /**
     * 自适应裁剪
     */
    Crop,

    /**
     * 填充
     */
    Whole,
}

/**
 *  混音行为模式
 */
export enum RCRTCAudioMixingMode {

    /**
     * 对端只能听见麦克风采集的声音
     */
    None,

    /**
     * 对端能够听到麦克风采集的声音和音频文件的声音
     */
    Mixing,

    /**
     * 对端只能听到音频文件的声音
     */
    Replace,
}

export enum RCRTCNetworkType {
    Unknown,
    WiFi,
    Mobile
}

export enum RCRTCVideoCodecType {
    H264
}

export enum RCRTCStreamType {
    NORMAL,
    LIVE,
    FILE,
    SCREEN,
    CDN
}
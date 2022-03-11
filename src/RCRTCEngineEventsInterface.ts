import type {
    RCRTCCamera,
    RCRTCMediaType,
    RCRTCRole
} from "./RCRTCDefines";

export enum RCRTCEngineEventsName {
    OnError = 'Engine:OnError',
    OnKicked = 'Engine:OnKicked',
    OnRoomJoined = 'Engine:OnRoomJoined',
    OnRoomLeft = 'Engine:OnRoomLeft',
    OnPublished = 'Engine:OnPublished',
    OnUnpublished = 'Engine:OnUnpublished',
    OnSubscribed = 'Engine:OnSubscribed',
    OnUnsubscribed = 'Engine:OnUnsubscribed',
    OnLiveMixSubscribed = 'Engine:OnLiveMixSubscribed',
    OnLiveMixUnsubscribed = 'Engine:OnLiveMixUnsubscribed',
    OnEnableCamera = 'Engine:OnCameraEnabled',
    OnSwitchCamera = 'Engine:OnCameraSwitched',
    OnLiveCdnAdded = 'Engine:OnLiveCdnAdded',
    OnLiveCdnRemoved = 'Engine:OnLiveCdnRemoved',
    OnLiveMixLayoutModeSet = 'Engine:OnLiveMixLayoutModeSet',
    OnLiveMixRenderModeSet = 'Engine:OnLiveMixRenderModeSet',
    OnLiveMixCustomLayoutsSet = 'Engine:OnLiveMixCustomLayoutsSet',
    OnLiveMixCustomAudiosSet = 'Engine:OnLiveMixCustomAudiosSet',
    OnLiveMixAudioBitrateSet = 'Engine:OnLiveMixAudioBitrateSet',
    OnLiveMixVideoBitrateSet = 'Engine:OnLiveMixVideoBitrateSet',
    OnLiveMixVideoResolutionSet = 'Engine:OnLiveMixVideoResolutionSet',
    OnLiveMixVideoFpsSet = 'Engine:OnLiveMixVideoFpsSet',
    OnAudioEffectCreated = 'Engine:OnAudioEffectCreated',
    OnAudioEffectFinished = 'Engine:OnAudioEffectFinished',
    OnAudioMixingStarted = 'Engine:OnAudioMixingStarted',
    OnAudioMixingPaused = 'Engine:OnAudioMixingPaused',
    OnAudioMixingStopped = 'Engine:OnAudioMixingStopped',
    OnAudioMixingFinished = 'Engine:OnAudioMixingFinished',
    OnUserJoined = 'Engine:OnUserJoined',
    OnUserOffline = 'Engine:OnUserOffline',
    OnUserLeft = 'Engine:OnUserLeft',
    OnRemotePublished = 'Engine:OnRemotePublished',
    OnRemoteUnpublished = 'Engine:OnRemoteUnpublished',
    OnRemoteLiveMixPublished = 'Engine:OnRemoteLiveMixPublished',
    OnRemoteLiveMixUnpublished = 'Engine:OnRemoteLiveMixUnpublished',
    OnRemoteStateChanged = 'Engine:OnRemoteStateChanged',
    OnRemoteFirstFrame = 'Engine:OnRemoteFirstFrame',
    OnRemoteLiveMixFirstFrame = 'Engine:OnRemoteLiveMixFirstFrame',

    OnLiveMixBackgroundColorSet = 'Engine:OnLiveMixBackgroundColorSet',
    OnCustomStreamPublished = 'Engine:OnCustomStreamPublished',
    OnCustomStreamPublishFinished = 'Engine:OnCustomStreamPublishFinished',
    OnCustomStreamUnpublished = 'Engine:OnCustomStreamUnpublished',
    OnRemoteCustomStreamPublished = 'Engine:OnRemoteCustomStreamPublished',
    OnRemoteCustomStreamUnpublished = 'Engine:OnRemoteCustomStreamUnpublished',
    OnRemoteCustomStreamStateChanged = 'Engine:OnRemoteCustomStreamStateChanged',
    OnRemoteCustomStreamFirstFrame = 'Engine:OnRemoteCustomStreamFirstFrame',
    OnCustomStreamSubscribed = 'Engine:OnCustomStreamSubscribed',
    OnCustomStreamUnsubscribed = 'Engine:OnCustomStreamUnsubscribed',
    OnJoinSubRoomRequested = 'Engine:OnJoinSubRoomRequested',
    OnJoinSubRoomRequestCanceled = 'Engine:OnJoinSubRoomRequestCanceled',
    OnJoinSubRoomRequestResponded = 'Engine:OnJoinSubRoomRequestResponded',
    OnJoinSubRoomRequestReceived = 'Engine:OnJoinSubRoomRequestReceived',
    OnCancelJoinSubRoomRequestReceived = 'Engine:OnCancelJoinSubRoomRequestReceived',
    OnJoinSubRoomRequestResponseReceived = 'Engine:OnJoinSubRoomRequestResponseReceived',
    OnSubRoomJoined = 'Engine:OnSubRoomJoined',
    OnSubRoomLeft = 'Engine:OnSubRoomLeft',
    OnSubRoomBanded = 'Engine:OnSubRoomBanded',
    OnSubRoomDisband = 'Engine:OnSubRoomDisband',
    OnLiveRoleSwitched = 'Engine:OnLiveRoleSwitched',
    OnRemoteLiveRoleSwitched = 'Engine:OnRemoteLiveRoleSwitched'
}



export interface RCRTCEngineEventsInterface {
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
    setOnErrorListener(listener?: (code: number, message: string) => void): void;

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

    /**
     * 本地用户加入房间回调
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * 
     * 回调参数
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRoomJoinedListener(listener?: (code: number, message: string) => void): void;

    /**
     * 本地用户离开房间回调
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * 
     * 回调参数
     * @param code 返回码
     * @param message 返回消息
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRoomLeftListener(listener?: (code: number, message: string) => void): void;

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
    setOnPublishedListener(listener?: (type: RCRTCMediaType, code: number, message: string) => void): void;

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

    /**
     * 播放音效结束, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * 
     * 回调参数
     * @param id 音效文件ID
     * @memberof RCRTCEngineEventsInterface
     */
    setOnAudioEffectFinishedListener(listener?: (id: string) => void): void

    /**
     * 开始本地音频数据合流操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnAudioMixingStartedListener(listener?: () => void): void

    /**
     * 暂停本地音频数据合流操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnAudioMixingPausedListener(listener?: () => void): void

    /**
     * 停止本地音频文件数据合流操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnAudioMixingStoppedListener(listener?: () => void): void

    /**
     * 结束本地音频文件数据合流操作回调, 仅供会议用户或直播主播用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnAudioMixingFinishedListener(listener?: () => void): void

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

    /**
     * 远端用户发布直播资源操作回调, 仅供直播观众用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * 
     * 回调参数
     * @param type 媒体类型
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteLiveMixPublishedListener(listener?: (type: RCRTCMediaType) => void): void

    /**
     * 远端用户取消发布直播资源操作回调, 仅供直播观众用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * 
     * 回调参数
     * @param type 媒体类型
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteLiveMixUnpublishedListener(listener?: (type: RCRTCMediaType) => void): void

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
    setOnRemoteStateChangedListener(listener?: (roomId: string, userId: string, type: RCRTCMediaType, disabled: boolean,) => void): void

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

    /**
     * 收到远端用户第一个音频或视频关键帧回调, 仅供直播观众用户使用
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * 
     * 回调参数
     * @param type 媒体类型
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteLiveMixFirstFrameListener(listener?: (type: RCRTCMediaType) => void): void


    /**
     * 设置合流布局背景颜色操作回调
     *
     * 回调参数
     * @param code   0: 调用成功, 非0: 失败
     * @param message 失败原因
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveMixBackgroundColorSetListener(listener?: (code: number, message: string) => void): void


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

    /**
     * 本地自定义流发布结束回调
     *
     * 回调参数
     * @param tag 自定义流标签
     * @memberof RCRTCStatsEventsInterface
     */
    setOnCustomStreamPublishFinishedListener(listener?: (tag: string) => void): void

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

    /**
     * 连麦中的子房间回调, 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId 子房间id
     * @memberof RCRTCStatsEventsInterface
     */
    setOnSubRoomBandedListener(listener?: (roomId: string) => void): void

    /**
     * 子房间结束连麦回调, 仅供直播主播用户使用
     *
     * 回调参数
     * @param roomId 子房间id
     * @param userId 结束连麦的用户id
     * @memberof RCRTCStatsEventsInterface
     */
    setOnSubRoomDisbandListener(listener?: (roomId: string, userId: string) => void): void

    /**
     * 切换直播角色回调
     *
     * 回调参数
     * @param current   当前角色
     * @param code      错误码
     * @param message    错误消息
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveRoleSwitchedListener(listener?: ( current:RCRTCRole, code: number, message: string) => void): void


    /**
     * 远端用户身份切换回调
     *
     * 回调参数
     * @param roomId    房间号
     * @param userId    用户id
     * @param role      用户角色
     * @memberof RCRTCStatsEventsInterface
     */
    setOnRemoteLiveRoleSwitchedListener(listener?: (roomId: string, userId: string,  role:RCRTCRole) => void): void
}
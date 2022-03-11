import type { RCRTCAudioCodecType, RCRTCNetworkType, RCRTCVideoCodecType } from "./RCRTCDefines";


export enum RCRTCStatsEventsName {
    OnNetworkStats = "Stats:OnNetworkStats",
    OnLocalAudioStats = "Stats:OnLocalAudioStats",
    OnLocalVideoStats = "Stats:OnLocalVideoStats",
    OnRemoteAudioStats = "Stats:OnRemoteAudioStats",
    OnRemoteVideoStats = "Stats:OnRemoteVideoStats",
    OnLiveMixAudioStats = "Stats:OnLiveMixAudioStats",
    OnLiveMixVideoStats = "Stats:OnLiveMixVideoStats",
    OnLiveMixMemberAudioStats = "Stats:OnLiveMixMemberAudioStats",
    OnLiveMixMemberCustomAudioStats = "Stats:OnLiveMixMemberCustomAudioStats",
    OnLocalCustomAudioStats = "Stats:OnLocalCustomAudioStats",
    OnLocalCustomVideoStats = "Stats:OnLocalCustomVideoStats",
    OnRemoteCustomAudioStats = "Stats:OnRemoteCustomAudioStats",
    OnRemoteCustomVideoStats = "Stats:OnRemoteCustomVideoStats"
}

export interface RCRTCNetworkStats {
    /**
     * 网络类型, WLAN 4G
     */
    type: RCRTCNetworkType;
    /**
     * 网络地址
     */
    ip: string;
    /**
     * 发送码率
     */
    sendBitrate: number;
    /**
     * 接收码率
     */
    receiveBitrate: number;
    /**
     * 发送到服务端往返时间
     */
    rtt: number;
}
export interface RCRTCLocalAudioStats {
    /**
     * 音频编码
     */
    codec: RCRTCAudioCodecType;
    /**
     * 码率
     */
    bitrate: number;
    /**
     * 音量, 0 ~ 9 表示音量高低
     */
    volume: number;
    /**
     * 丢包率
     */
    packageLostRate: number;
    /**
     * 发送到服务端往返时间
     */
    rtt: number;
}
export interface RCRTCLocalVideoStats {
    /**
     * 是否小流
     */
    tiny: boolean;
    /**
     * 视频编码
     */
    codec: RCRTCVideoCodecType;
    /**
     * 码率
     */
    bitrate: number;
    /**
     * 帧率
     */
    fps: number;
    /**
     * 宽度
     */
    width: number;
    /**
     * 高度
     */
    height: number;
    /**
     * 丢包率
     */
    packageLostRate: number;
    /**
     * 发送到服务端往返时间
     */
    rtt: number;
}


export interface RCRTCRemoteAudioStats extends RCRTCLocalAudioStats {

}
/**
 * Omit<RCRTCLocalVideoStats, 'tiny'>： 去除 tiny 属性，生成一个新类型
 * RCRTCRemoteVideoStats 包含 RCRTCLocalVideoStats 中除了 tiny 之外的所有属性，
 */
export interface RCRTCRemoteVideoStats extends Omit<RCRTCLocalVideoStats, 'tiny'> {

}


export interface RCRTCStatsEventsInterface {
    /**
     * 上报网络状态统计信息
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnNetworkStatsListener(listener?: (stats: RCRTCNetworkStats) => void): void;
    /**
    * 上报本地音频统计信息
    * @param listener 回调函数，不传值表示移除当前事件的所有监听。
    * @memberof RCRTCEngineEventsInterface
    */
    setOnLocalAudioStatsListener(listener?: (stats: RCRTCLocalAudioStats) => void): void;
    /**
     * 上报本地视频统计信息
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnLocalVideoStatsListener(listener?: (stats: RCRTCLocalVideoStats) => void): void;
    /**
     * 上报远端音频统计信息
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteAudioStatsListener(listener?: (roomId: string, userId: string, stats: RCRTCRemoteAudioStats) => void): void;
    /**
     * 上报远端视频统计信息
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCEngineEventsInterface
     */
    setOnRemoteVideoStatsListener(listener?: (roomId: string, userId: string, stats: RCRTCRemoteVideoStats) => void): void;

    /**
     * 上报远端合流音频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveMixAudioStatsListener(listener?: (stats: RCRTCRemoteAudioStats) => void): void;

    /**
     * 上报远端合流视频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveMixVideoStatsListener(listener?: (stats: RCRTCRemoteVideoStats) => void): void;

    /**
     * 上报远端分流音频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveMixMemberAudioStatsListener(listener?: (userId: string, volume: number) => void): void;

    /**
     * 上报远端分流自定义音频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLiveMixMemberCustomAudioStatsListener(listener?: (userId: string, tag: string, volume: number) => void): void;

    /**
     * 上报本地自定义音频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLocalCustomAudioStatsListener(listener?: (tag: string, stats: RCRTCLocalAudioStats) => void): void;

    /**
     * 上报本地自定义视频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnLocalCustomVideoStatsListener(listener?: (tag: string, stats: RCRTCLocalVideoStats) => void): void;


    /**
     * 上报远端自定义音频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnRemoteCustomAudioStatsListener(listener?: (roomId: string, userId: string, tag: string, stats: RCRTCRemoteAudioStats) => void): void;


    /**
     * 上报远端自定义视频统计信息
     *
     * @param listener 回调函数，不传值表示移除当前事件的所有监听。
     * @memberof RCRTCStatsEventsInterface
     */
    setOnRemoteCustomVideoStatsListener(listener?: (roomId: string, userId: string, tag: string, stats: RCRTCRemoteVideoStats) => void): void;
}
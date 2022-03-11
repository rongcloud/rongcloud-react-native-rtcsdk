import { RCRTCVideoFps, RCRTCVideoResolution, RCRTCViewFitType } from '@rongcloud/react-native-rtc';




export const screens = [
    'Meeting',
    'Host',
    'Audience',
];

export const fps = [
    {
        value: RCRTCVideoFps.Fps10,
        label: '10FPS',
    },
    {
        value: RCRTCVideoFps.Fps15,
        label: '15FPS',
    },
    {
        value: RCRTCVideoFps.Fps25,
        label: '25FPS',
    },
    {
        value: RCRTCVideoFps.Fps30,
        label: '30FPS',
    },
];



export const resolution = [
    {
        value: RCRTCVideoResolution.Resolution_144x176,
        label: '144x176',
        width: 144,
        height: 176
    },
    {
        value: RCRTCVideoResolution.Resolution_180x180,
        label: '180x180',
        width: 180,
        height: 180
    },
    {
        value: RCRTCVideoResolution.Resolution_144x256,
        label: '144x256',
        width: 144,
        height: 256
    },
    {
        value: RCRTCVideoResolution.Resolution_180x240,
        label: '180x240',
        width: 180,
        height: 240
    },
    {
        value: RCRTCVideoResolution.Resolution_180x320,
        label: '180x320',
        width: 180,
        height: 320
    },
    {
        value: RCRTCVideoResolution.Resolution_240x240,
        label: '240x240',
        width: 240,
        height: 240
    },
    {
        value: RCRTCVideoResolution.Resolution_240x320,
        label: '240x320',
        width: 240,
        height: 320
    },
    {
        value: RCRTCVideoResolution.Resolution_360x360,
        label: '360x360',
        width: 360,
        height: 360
    },
    {
        value: RCRTCVideoResolution.Resolution_360x480,
        label: '360x480',
        width: 360,
        height: 480
    },
    {
        value: RCRTCVideoResolution.Resolution_360x640,
        label: '360x640',
        width: 360,
        height: 640
    },
    {
        value: RCRTCVideoResolution.Resolution_480x480,
        label: '480x480',
        width: 480,
        height: 480
    },
    {
        value: RCRTCVideoResolution.Resolution_480x640,
        label: '480x640',
        width: 480,
        height: 640
    },
    {
        value: RCRTCVideoResolution.Resolution_480x720,
        label: '480x720',
        width: 480,
        height: 720
    },
    {
        value: RCRTCVideoResolution.Resolution_480x848,
        label: '480x848',
        width: 480,
        height: 848
    },
    {
        value: RCRTCVideoResolution.Resolution_720x960,
        label: '720x960',
        width: 720,
        height: 960
    },
    {
        value: RCRTCVideoResolution.Resolution_720x1280,
        label: '720x1280',
        width: 720,
        height: 1280
    },
    {
        value: RCRTCVideoResolution.Resolution_1080x1920,
        label: '1080x1920',
        width: 1080,
        height: 1920
    },
];

export const audioKbps = [
    {
        value: 16,
        label: '16kbps',
    },
    {
        value: 32,
        label: '32kbps',
    },
    {
        value: 48,
        label: '48kbps',
    },
];




export const tinyMinVideoKbps = [
    {
        value: 50,
        label: '50kbps',
    },
    {
        value: 100,
        label: '100kbps',
    },
    {
        value: 200,
        label: '200kbps',
    },
    {
        value: 300,
        label: '300kbps',
    },
];

export const tinyMaxVideoKbps = [
    {
        value: 300,
        label: '300kbps',
    },
    {
        value: 500,
        label: '500kbps',
    },
    {
        value: 800,
        label: '800kbps',
    },
    {
        value: 1000,
        label: '1000kbps',
    },
    {
        value: 1200,
        label: '1200kbps',
    },
];



export const maxVideoKbps = [
    {
        value: 2000,
        label: '2000kbps',
    },
    {
        value: 2200,
        label: '2200kbps',
    },
    {
        value: 3500,
        label: '3500kbps',
    },
    {
        value: 4400,
        label: '4400kbps',
    },
    {
        value: 6000,
        label: '6000kbps',
    },
    {
        value: 8000,
        label: '8000kbps',
    },
];


export const minVideoKbps = [
    {
        value: 300,
        label: '300kbps',
    },
    {
        value: 500,
        label: '500kbps',
    },
    {
        value: 700,
        label: '700kbps',
    },
    {
        value: 900,
        label: '900kbps',
    },
    {
        value: 1200,
        label: '1200kbps',
    },
    {
        value: 1500,
        label: '1500kbps',
    },
];


export const liveMixAudioKbps = [
    {
        value: 16,
        label: '16kbps',
    },
    {
        value: 32,
        label: '32kbps',
    },
    {
        value: 48,
        label: '48kbps',
    }
];


export const viewFitType = [
    {
        value: RCRTCViewFitType.Cover,
        label: '裁剪',
    },
    {
        value: RCRTCViewFitType.Center,
        label: '自适应',
    },
];

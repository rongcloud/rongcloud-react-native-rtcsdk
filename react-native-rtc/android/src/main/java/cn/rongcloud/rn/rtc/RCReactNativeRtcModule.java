
package cn.rongcloud.rn.rtc;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import cn.rongcloud.rtc.wrapper.RCRTCIWEngine;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWCamera;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWLocalAudioStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWLocalVideoStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWMediaType;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWNetworkStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWRemoteAudioStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWRemoteVideoStats;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWStatusListener;
import io.rong.imlib.model.Message;

public class RCReactNativeRtcModule extends ReactContextBaseJavaModule {

    public RCReactNativeRtcModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @Override
    @NonNull
    public String getName() {
        return "RCReactNativeRtc";
    }

    @ReactMethod
    public void init(ReadableMap setup, Promise promise) {
        if (setup != null) {
            engine = RCRTCIWEngine.create(context, ArgumentAdapter.toEngineSetup(setup));
        } else {
            engine = RCRTCIWEngine.create(context);
        }
        engine.setListener(new ListenerImpl());
        engine.setStatsListener(new StatsListenerImpl());
        promise.resolve(null);
    }

    @ReactMethod
    public void unInit(Promise promise) {
        if (engine != null) {
            engine.destroy();
            engine = null;
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void joinRoom(String id, ReadableMap setup, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.joinRoom(id, ArgumentAdapter.toRoomSetup(setup));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void leaveRoom(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.leaveRoom();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void publish(Integer type, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.publish(ArgumentAdapter.toMediaType(type));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void unpublish(Integer type, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.unpublish(ArgumentAdapter.toMediaType(type));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void subscribe(String id, Integer type, Boolean tiny, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.subscribe(id, ArgumentAdapter.toMediaType(type), tiny);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void subscribes(ReadableArray ids, Integer type, Boolean tiny, Promise promise) {
        int code = -1;
        if (engine != null) {
            List<String> strings = new ArrayList<>(ids.size());
            for (int i = 0; i < ids.size(); i++) {
                strings.add(ids.getString(i));
            }
            code = engine.subscribe(strings, ArgumentAdapter.toMediaType(type), tiny);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void subscribeLiveMix(Integer type, Boolean tiny, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.subscribeLiveMix(ArgumentAdapter.toMediaType(type), tiny);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void unsubscribe(String id, Integer type, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.unsubscribe(id, ArgumentAdapter.toMediaType(type));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void unsubscribes(ReadableArray ids, Integer type, Promise promise) {
        int code = -1;
        if (engine != null) {
            List<String> strings = new ArrayList<>(ids.size());
            for (int i = 0; i < ids.size(); i++) {
                strings.add(ids.getString(i));
            }
            code = engine.unsubscribe(strings, ArgumentAdapter.toMediaType(type));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void unsubscribeLiveMix(Integer type, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.unsubscribeLiveMix(ArgumentAdapter.toMediaType(type));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setAudioConfig(ReadableMap config, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.setAudioConfig(ArgumentAdapter.toAudioConfig(config));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setVideoConfig(ReadableMap config, Boolean tiny, Promise promise) {
        int code = -1;
        if (engine != null) {
            if (tiny) {
                code = engine.setTinyVideoConfig(ArgumentAdapter.toVideoConfig(config));
            } else {
                code = engine.setVideoConfig(ArgumentAdapter.toVideoConfig(config));
            }
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void enableMicrophone(Boolean enable, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.enableMicrophone(enable);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void enableSpeaker(Boolean enable, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.enableSpeaker(enable);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void adjustLocalVolume(Integer volume, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.adjustLocalVolume(volume);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void enableCamera(Boolean enable, Integer camera, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.enableCamera(enable, ArgumentAdapter.toCamera(camera));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void switchCamera(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.switchCamera();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void switchToCamera(Integer camera, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.switchToCamera(ArgumentAdapter.toCamera(camera));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void whichCamera(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.whichCamera().getCamera();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void isCameraFocusSupported(Promise promise) {
        boolean code = false;
        if (engine != null) {
            code = engine.isCameraFocusSupported();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void isCameraExposurePositionSupported(Promise promise) {
        boolean code = false;
        if (engine != null) {
            code = engine.isCameraExposurePositionSupported();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setCameraFocusPositionInPreview(Double x, Double y, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.setCameraFocusPositionInPreview(x.floatValue(), y.floatValue());
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setCameraExposurePositionInPreview(Double x, Double y, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.setCameraExposurePositionInPreview(x.floatValue(), y.floatValue());
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setCameraExposurePositionInPreview(Integer orientation, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.setCameraCaptureOrientation(ArgumentAdapter.toCameraCaptureOrientation(orientation));
        }
        promise.resolve(code);
    }

    // TODO setLocalView

    @ReactMethod
    public void removeLocalView(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.removeLocalView();
        }
        promise.resolve(code);
    }

    // TODO setRemoteView

    @ReactMethod
    public void removeRemoteView(String id, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.removeRemoteView(id);
        }
        promise.resolve(code);
    }

    // TODO setLiveMixView

    @ReactMethod
    public void removeLiveMixView(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.removeLiveMixView();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void muteLocalStream(Integer type, Boolean mute, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.muteLocalStream(ArgumentAdapter.toMediaType(type), mute);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void muteRemoteStream(String id, Integer type, Boolean mute, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.muteRemoteStream(id, ArgumentAdapter.toMediaType(type), mute);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void addLiveCdn(String url, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.addLiveCdn(url);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void removeLiveCdn(String url, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.removeLiveCdn(url);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setLiveMixLayoutMode(Integer mode, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.setLiveMixLayoutMode(ArgumentAdapter.toLiveMixLayoutMode(mode));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setLiveMixRenderMode(Integer mode, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.setLiveMixRenderMode(ArgumentAdapter.toLiveMixRenderMode(mode));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setLiveMixCustomLayouts(ReadableArray layouts, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.setLiveMixCustomLayouts(ArgumentAdapter.toLiveMixCustomLayouts(layouts));
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setLiveMixCustomAudios(ReadableArray ids, Promise promise) {
        int code = -1;
        if (engine != null) {
            List<String> strings = new ArrayList<>(ids.size());
            for (int i = 0; i < ids.size(); i++) {
                strings.add(ids.getString(i));
            }
            code = engine.setLiveMixCustomAudios(strings);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setLiveMixAudioBitrate(Integer bitrate, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.setLiveMixAudioBitrate(bitrate);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setLiveMixVideoBitrate(Integer bitrate, Boolean tiny, Promise promise) {
        int code = -1;
        if (engine != null) {
            if (tiny) {
                code = engine.setLiveMixTinyVideoBitrate(bitrate);
            } else {
                code = engine.setLiveMixVideoBitrate(bitrate);
            }
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setLiveMixVideoResolution(Integer resolution, Boolean tiny, Promise promise) {
        int code = -1;
        if (engine != null) {
            if (tiny) {
                code = engine.setLiveMixTinyVideoResolution(ArgumentAdapter.toVideoResolution(resolution));
            } else {
                code = engine.setLiveMixVideoResolution(ArgumentAdapter.toVideoResolution(resolution));
            }
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setLiveMixVideoFps(Integer fps, Boolean tiny, Promise promise) {
        int code = -1;
        if (engine != null) {
            if (tiny) {
                code = engine.setLiveMixTinyVideoFps(ArgumentAdapter.toVideoFps(fps));
            } else {
                code = engine.setLiveMixVideoFps(ArgumentAdapter.toVideoFps(fps));
            }
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void createAudioEffect(String path, Integer id, Promise promise) {
        int code = -1;
        if (engine != null) {
            URI uri = null;
            try {
                uri = new URI(path);
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
            code = engine.createAudioEffect(uri, id);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void releaseAudioEffect(Integer id, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.releaseAudioEffect(id);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void playAudioEffect(Integer id, Integer volume, Integer loop, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.playAudioEffect(id, volume, loop);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void pauseAudioEffect(Integer id, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.pauseAudioEffect(id);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void pauseAudioEffect(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.pauseAllAudioEffects();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void resumeAudioEffect(Integer id, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.resumeAudioEffect(id);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void resumeAllAudioEffects(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.resumeAllAudioEffects();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void stopAudioEffect(Integer id, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.stopAudioEffect(id);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void stopAllAudioEffects(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.stopAllAudioEffects();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void adjustAudioEffectVolume(Integer id, Integer volume, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.adjustAudioEffectVolume(id, volume);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void getAudioEffectVolume(Integer id, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.getAudioEffectVolume(id);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void adjustAllAudioEffectsVolume(Integer volume, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.adjustAllAudioEffectsVolume(volume);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void startAudioMixing(String path, Integer mode, Boolean playback, Integer loop, Promise promise) {
        int code = -1;
        if (engine != null) {
            URI uri = null;
            try {
                uri = new URI(path);
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
            code = engine.startAudioMixing(uri, ArgumentAdapter.toAudioMixingMode(mode), playback, loop);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void stopAudioMixing(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.stopAudioMixing();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void pauseAudioMixing(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.pauseAudioMixing();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void resumeAudioMixing(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.resumeAudioMixing();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void adjustAudioMixingVolume(Integer volume, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.adjustAudioMixingVolume(volume);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void adjustAudioMixingPlaybackVolume(Integer volume, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.adjustAudioMixingPlaybackVolume(volume);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void getAudioMixingPlaybackVolume(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.getAudioMixingPlaybackVolume();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void adjustAudioMixingPublishVolume(Integer volume, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.adjustAudioMixingPublishVolume(volume);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void getAudioMixingPublishVolume(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.getAudioMixingPublishVolume();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void setAudioMixingPosition(Double position, Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.setAudioMixingPosition(position);
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void getAudioMixingPosition(Promise promise) {
        double code = -1;
        if (engine != null) {
            code = engine.getAudioMixingPosition();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void getAudioMixingDuration(Promise promise) {
        int code = -1;
        if (engine != null) {
            code = engine.getAudioMixingDuration();
        }
        promise.resolve(code);
    }

    @ReactMethod
    public void getSessionId(Promise promise) {
        String code = null;
        if (engine != null) {
            code = engine.getSessionId();
        }
        promise.resolve(code);
    }

    private class ListenerImpl extends RCRTCIWListener {
        @Override
        public void onError(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnError", arguments);
        }

        @Override
        public void onKicked(String id, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putString("id", id);
            arguments.putString("message", message);
            sendEvent("Engine:OnKicked", arguments);
        }

        @Override
        public void onRoomJoined(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnRoomJoined", arguments);
        }

        @Override
        public void onRoomLeft(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnRoomLeft", arguments);
        }

        @Override
        public void onPublished(RCRTCIWMediaType type, int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("type", type.ordinal());
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnPublished", arguments);
        }

        @Override
        public void onUnpublished(RCRTCIWMediaType type, int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("type", type.ordinal());
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnUnpublished", arguments);
        }

        @Override
        public void onSubscribed(String id, RCRTCIWMediaType type, int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putString("id", id);
            arguments.putInt("type", type.ordinal());
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnSubscribed", arguments);
        }

        @Override
        public void onUnsubscribed(String id, RCRTCIWMediaType type, int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putString("id", id);
            arguments.putInt("type", type.ordinal());
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnUnsubscribed", arguments);
        }

        @Override
        public void onLiveMixSubscribed(RCRTCIWMediaType type, int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("type", type.ordinal());
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixSubscribed", arguments);
        }

        @Override
        public void onLiveMixUnsubscribed(RCRTCIWMediaType type, int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("type", type.ordinal());
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixUnsubscribed", arguments);
        }

        @Override
        public void onEnableCamera(boolean enable, int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putBoolean("enable", enable);
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnEnableCamera", arguments);
        }

        @Override
        public void onSwitchCamera(RCRTCIWCamera camera, int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("camera", camera.ordinal());
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnSwitchCamera", arguments);
        }

        @Override
        public void onLiveCdnAdded(String url, int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putString("url", url);
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveCdnAdded", arguments);
        }

        @Override
        public void onLiveCdnRemoved(String url, int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putString("url", url);
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveCdnRemoved", arguments);
        }

        @Override
        public void onLiveMixLayoutModeSet(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixLayoutModeSet", arguments);
        }

        @Override
        public void onLiveMixRenderModeSet(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixRenderModeSet", arguments);
        }

        @Override
        public void onLiveMixCustomLayoutsSet(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixCustomLayoutsSet", arguments);
        }

        @Override
        public void onLiveMixCustomAudiosSet(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixCustomAudiosSet", arguments);
        }

        @Override
        public void onLiveMixAudioBitrateSet(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixAudioBitrateSet", arguments);
        }

        @Override
        public void onLiveMixVideoBitrateSet(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putBoolean("tiny", false);
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixVideoBitrateSet", arguments);
        }

        @Override
        public void onLiveMixTinyVideoBitrateSet(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putBoolean("tiny", true);
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixVideoBitrateSet", arguments);
        }

        @Override
        public void onLiveMixVideoResolutionSet(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putBoolean("tiny", false);
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixVideoResolutionSet", arguments);
        }

        @Override
        public void onLiveMixTinyVideoResolutionSet(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putBoolean("tiny", true);
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixVideoResolutionSet", arguments);
        }

        @Override
        public void onLiveMixVideoFpsSet(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putBoolean("tiny", false);
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixVideoFpsSet", arguments);
        }

        @Override
        public void onLiveMixTinyVideoFpsSet(int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putBoolean("tiny", true);
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnLiveMixVideoFpsSet", arguments);
        }

        @Override
        public void onAudioEffectCreated(int id, int code, String message) {
            WritableMap arguments = Arguments.createMap();
            arguments.putInt("id", id);
            arguments.putInt("code", code);
            arguments.putString("message", message);
            sendEvent("Engine:OnAudioEffectCreated", arguments);
        }

        @Override
        public void onAudioEffectFinished(final int id) {
            sendEvent("Engine:OnAudioEffectFinished", id);
        }

        @Override
        public void onAudioMixingStarted() {
            sendEvent("Engine:OnAudioMixingStarted", null);
        }

        @Override
        public void onAudioMixingPaused() {
            sendEvent("Engine:OnAudioMixingPaused", null);
        }

        @Override
        public void onAudioMixingStopped() {
            sendEvent("Engine:OnAudioMixingStopped", null);
        }

        @Override
        public void onAudioMixingFinished() {
            sendEvent("Engine:OnAudioMixingFinished", null);
        }

        @Override
        public void onUserJoined(final String id) {
            sendEvent("Engine:OnUserJoined", id);
        }

        @Override
        public void onUserOffline(final String id) {
            sendEvent("Engine:OnUserOffline", id);
        }

        @Override
        public void onUserLeft(final String id) {
            sendEvent("Engine:OnUserLeft", id);
        }

        @Override
        public void onRemotePublished(String id, RCRTCIWMediaType type) {
            WritableMap arguments = Arguments.createMap();
            arguments.putString("id", id);
            arguments.putInt("type", type.ordinal());
            sendEvent("Engine:OnRemotePublished", arguments);
        }

        @Override
        public void onRemoteUnpublished(String id, RCRTCIWMediaType type) {
            WritableMap arguments = Arguments.createMap();
            arguments.putString("id", id);
            arguments.putInt("type", type.ordinal());
            sendEvent("Engine:OnRemoteUnpublished", arguments);
        }

        @Override
        public void onRemoteLiveMixPublished(final RCRTCIWMediaType type) {
            sendEvent("Engine:OnRemoteLiveMixPublished", type.ordinal());
        }

        @Override
        public void onRemoteLiveMixUnpublished(final RCRTCIWMediaType type) {
            sendEvent("Engine:OnRemoteLiveMixUnpublished", type.ordinal());
        }

        @Override
        public void onRemoteStateChanged(String id, RCRTCIWMediaType type, boolean muted) {
            WritableMap arguments = Arguments.createMap();
            arguments.putString("id", id);
            arguments.putInt("type", type.ordinal());
            arguments.putBoolean("mute", muted);
            sendEvent("Engine:OnRemoteStateChanged", arguments);
        }

        @Override
        public void onRemoteFirstFrame(String id, RCRTCIWMediaType type) {
            WritableMap arguments = Arguments.createMap();
            arguments.putString("id", id);
            arguments.putInt("type", type.ordinal());
            sendEvent("Engine:OnRemoteFirstFrame", arguments);
        }

        @Override
        public void onRemoteLiveMixFirstFrame(final RCRTCIWMediaType type) {
            sendEvent("Engine:OnRemoteLiveMixFirstFrame", type.ordinal());
        }

        @Override
        public void onMessageReceived(Message message) {
            // TODO sendEvent("Engine:OnMessageReceived", argument);
        }
    }

    private class StatsListenerImpl extends RCRTCIWStatusListener {
        @Override
        public void onNetworkStats(RCRTCIWNetworkStats stats) {
            sendEvent("Stats:OnNetworkStats", ArgumentAdapter.fromNetworkStats(stats));
        }

        @Override
        public void onLocalAudioStats(RCRTCIWLocalAudioStats stats) {
            sendEvent("Stats:OnLocalAudioStats", ArgumentAdapter.fromLocalAudioStats(stats));
        }

        @Override
        public void onLocalVideoStats(RCRTCIWLocalVideoStats stats) {
            sendEvent("Stats:OnLocalVideoStats", ArgumentAdapter.fromLocalVideoStats(stats));
        }

        @Override
        public void onRemoteAudioStats(RCRTCIWRemoteAudioStats stats) {
            sendEvent("Stats:OnRemoteAudioStats", ArgumentAdapter.fromRemoteAudioStats(stats));
        }

        @Override
        public void onRemoteVideoStats(RCRTCIWRemoteVideoStats stats) {
            sendEvent("Stats:OnRemoteVideoStats", ArgumentAdapter.fromRemoteVideoStats(stats));
        }
    }

    private void sendEvent(String event, @Nullable WritableMap arguments) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(event, arguments);
    }

    private void sendEvent(String event, @Nullable Object object) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(event, object);
    }

    private final ReactApplicationContext context;
    private RCRTCIWEngine engine;
}
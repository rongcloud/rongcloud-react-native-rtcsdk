package cn.rongcloud.rn.call;

import androidx.annotation.Nullable;
import cn.rongcloud.call.wrapper.RongCallListenerWrapper;
import cn.rongcloud.call.wrapper.config.RCCallIWCallDisconnectedReason;
import cn.rongcloud.call.wrapper.config.RCCallIWCamera;
import cn.rongcloud.call.wrapper.config.RCCallIWMediaType;
import cn.rongcloud.call.wrapper.config.RCCallIWNetworkQuality;
import cn.rongcloud.call.wrapper.listener.IRCCallIWEngineListener;
import cn.rongcloud.call.wrapper.listener.RCCallIWEngineListener;
import cn.rongcloud.call.wrapper.model.RCCallIWCallSession;
import cn.rongcloud.call.wrapper.model.RCCallIWUserProfile;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RCCallIWEngineListenerImpl extends RCCallIWEngineListener {

    private final ReactApplicationContext context;

    public RCCallIWEngineListenerImpl(ReactApplicationContext context) {
       this.context = context;
    }

    @Override
    public void onCallReceived(RCCallIWCallSession session) {
		WritableMap arguments = ArgumentAdapter.fromRCCallIWCallSession(session);
		sendEvent("onCallReceived", arguments);
    }

    @Override
    public void onCallConnected() {
		sendEvent("onCallConnected", null);
    }

    @Override
    public void onCallDisconnected(RCCallIWCallDisconnectedReason reason) {
		sendEvent("onCallDisconnected", reason.ordinal());
    }

    @Override
    public void onRemoteUserJoined(RCCallIWUserProfile user) {
		WritableMap arguments = ArgumentAdapter.fromRCCallIWUserProfile(user);
		sendEvent("onRemoteUserJoined", arguments);
    }

    @Override
    public void onRemoteUserLeft(RCCallIWUserProfile user, RCCallIWCallDisconnectedReason reason) {
        WritableMap arguments = Arguments.createMap();
        arguments.putMap("user",ArgumentAdapter.fromRCCallIWUserProfile(user));
        arguments.putInt("reason", reason.ordinal());
		sendEvent("onRemoteUserLeft", arguments);
    }

    @Override
    public void onCallMissed(RCCallIWCallSession rcCallIWCallSession) {

    }

    @Override
    public void onEnableCamera(RCCallIWCamera camera, boolean enable) {
        WritableMap arguments = Arguments.createMap();
		arguments.putInt("camera", camera.ordinal());
		arguments.putBoolean("enable", enable);
		sendEvent("onEnableCamera", arguments);
    }

    @Override
    public void onSwitchCamera(RCCallIWCamera camera) {
		sendEvent("onSwitchCamera", camera.ordinal());
    }

    @Override
    public void onError(int code) {
		sendEvent("onError", code);
    }

    @Override
    public void onCallOutgoing() {
		sendEvent("onCallOutgoing", null);
    }

    @Override
    public void onRemoteUserRinging(String userId) {
		sendEvent("onRemoteUserRinging", userId);
    }

    @Override
    public void onRemoteUserInvited(String userId, RCCallIWMediaType mediaType) {
		WritableMap arguments = Arguments.createMap();
		arguments.putString("userId", userId);
		arguments.putInt("mediaType", mediaType.ordinal());
		sendEvent("onRemoteUserInvited", arguments);
    }

    @Override
    public void onRemoteUserMediaTypeChanged(RCCallIWUserProfile user, RCCallIWMediaType mediaType) {
		sendEvent("onRemoteUserMediaTypeChanged", mediaType.ordinal());
    }

    @Override
    public void onRemoteUserMicrophoneStateChanged(RCCallIWUserProfile user, boolean enable) {
		sendEvent("onRemoteUserMicrophoneStateChanged", enable);

    }

    @Override
    public void onRemoteUserCameraStateChanged(RCCallIWUserProfile user, boolean enable) {
		sendEvent("onRemoteUserCameraStateChanged", enable);

    }

    @Override
    public void onNetworkQuality(RCCallIWUserProfile user, RCCallIWNetworkQuality quality) {
		WritableMap arguments = Arguments.createMap();
		arguments.putMap("user",ArgumentAdapter.fromRCCallIWUserProfile(user));
		arguments.putInt("quality", quality.ordinal());
		sendEvent("onNetworkQuality", arguments);

    }

    @Override
    public void onAudioVolume(RCCallIWUserProfile user, int volume) {
		sendEvent("onAudioVolume", volume);

    }

    private void sendEvent(String event, @Nullable WritableMap arguments) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(event, arguments);
    }

    private void sendEvent(String event, @Nullable Object object) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(event, object);
    }
}

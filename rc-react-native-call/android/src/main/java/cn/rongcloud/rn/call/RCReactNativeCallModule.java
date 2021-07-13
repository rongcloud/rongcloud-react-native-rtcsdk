package cn.rongcloud.rn.call;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;
import java.util.List;

import io.rong.calllib.RongCallClient;
import io.rong.calllib.RongCallCommon;
import io.rong.imlib.model.Conversation;

public class RCReactNativeCallModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RCReactNativeCallModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return "RCReactNativeCall";
    }

    @ReactMethod
    public void startCall(ReadableMap arguments, Promise session) {
        int type = arguments.getInt("type");
        String target = arguments.getString("target");
        List<String> userIds = new ArrayList<>();
        userIds.add(target);
        int media = arguments.getInt("media");
        String extra = arguments.getString("extra");
        String id = RongCallClient.getInstance().startCall(
                Conversation.ConversationType.setValue(type),
                target,
                userIds,
                null,
                RongCallCommon.CallMediaType.valueOf(media),
                extra);
        session.resolve(id);
    }
}
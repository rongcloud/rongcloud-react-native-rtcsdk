package cn.rongcloud.im.rn;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import io.rong.imlib.RongIMClient;

public class RCReactNativeImModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RCReactNativeImModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return "RCReactNativeIm";
    }

    @ReactMethod
    public void init(String key, Promise promise) {
        RongIMClient.init(reactContext, key);
        promise.resolve(null);
    }

    @ReactMethod
    public void connect(String token, final Promise promise) {
        RongIMClient.connect(token, new RongIMClient.ConnectCallback() {
            @Override
            public void onSuccess(String s) {
                WritableMap arguments = Arguments.createMap();
                arguments.putInt("error", 0);
                arguments.putString("userId", s);
                promise.resolve(arguments);
            }

            @Override
            public void onError(RongIMClient.ConnectionErrorCode connectionErrorCode) {
                WritableMap arguments = Arguments.createMap();
                arguments.putInt("error", connectionErrorCode.getValue());
                promise.resolve(arguments);
            }

            @Override
            public void onDatabaseOpened(RongIMClient.DatabaseOpenStatus databaseOpenStatus) {

            }
        });
    }

    @ReactMethod
    public void disconnect(Promise promise) {
        RongIMClient.getInstance().disconnect();
        promise.resolve(null);
    }


}
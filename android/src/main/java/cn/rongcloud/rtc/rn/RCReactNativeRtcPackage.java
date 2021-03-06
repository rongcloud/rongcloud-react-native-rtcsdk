package cn.rongcloud.rtc.rn;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.List;

public class RCReactNativeRtcPackage implements ReactPackage {
  @Override
  @NonNull
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
    List<NativeModule> list = new ArrayList<>();
    RCReactNativeRtc module = RCReactNativeRtc.getInstance(reactContext);
    list.add(module);
    return list;
  }

  @Override
  @NonNull
  @SuppressWarnings("rawtypes")
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    List<ViewManager> list = new ArrayList<>();
    list.add(new RCReactNativeRtcViewManager());
    return list;
  }
}

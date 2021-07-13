package cn.rongcloud.rn.rtc;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import cn.rongcloud.rtc.wrapper.RCRTCIWView;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWViewFitType;

public class RCReactNativeRtcViewManager extends SimpleViewManager<RCRTCIWView> {
    @NonNull
    @Override
    public String getName() {
        return "RCReactNativeRtcView";
    }

    @NonNull
    @Override
    protected RCRTCIWView createViewInstance(@NonNull ThemedReactContext context) {
        return new RCRTCIWView(context);
    }

    @ReactProp(name = "fitType")
    public void setFitType(RCRTCIWView view, int fitType) {
        view.setFitType(RCRTCIWViewFitType.values()[fitType]);
    }

    @ReactProp(name = "mirror")
    public void setMirror(RCRTCIWView view, boolean mirror) {
        view.setMirror(mirror);
    }
}

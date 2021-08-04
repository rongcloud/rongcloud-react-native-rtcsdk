package cn.rongcloud.rn.call;

import android.widget.FrameLayout;
import cn.rongcloud.rtc.utils.FinLog;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

/**
 * Created by wangw on 2021/7/22.
 */
public class RCReactNativeCallViewManager extends SimpleViewManager<FrameLayout> {

    private static final String TAG = "RCReactNativeCallViewManager";

    @Override
    public String getName() {
        return "RCReactNativeCallVideoView";
    }

    @Override
    protected FrameLayout createViewInstance(ThemedReactContext themedReactContext) {
        FrameLayout frameLayout = new FrameLayout(themedReactContext);
        FinLog.d(TAG, "[createViewInstance] ==> frameLayout:" + frameLayout);
        return frameLayout;
    }
}

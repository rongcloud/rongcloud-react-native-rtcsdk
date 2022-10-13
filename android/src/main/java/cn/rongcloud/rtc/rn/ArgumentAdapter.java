package cn.rongcloud.rtc.rn;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.List;

import cn.rongcloud.rtc.wrapper.config.RCRTCIWAudioConfig;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWStreamType;
import cn.rongcloud.rtc.wrapper.module.RCRTCIWCustomLayout;
import cn.rongcloud.rtc.wrapper.config.RCRTCIWVideoConfig;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWAudioCodecType;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWAudioMixingMode;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWAudioQuality;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWAudioScenario;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWCamera;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWCameraCaptureOrientation;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWLiveMixLayoutMode;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWLiveMixRenderMode;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWLocalAudioStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWLocalVideoStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWMediaType;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWNetworkStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWRemoteAudioStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWRemoteVideoStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWRole;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWVideoFps;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWVideoResolution;
import cn.rongcloud.rtc.wrapper.setup.RCRTCIWAudioSetup;
import cn.rongcloud.rtc.wrapper.setup.RCRTCIWEngineSetup;
import cn.rongcloud.rtc.wrapper.setup.RCRTCIWRoomSetup;
import cn.rongcloud.rtc.wrapper.setup.RCRTCIWVideoSetup;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWNetworkProbeStats;

final class ArgumentAdapter {
  private ArgumentAdapter() {
  }

  static RCRTCIWMediaType toMediaType(@NonNull Integer type) {
    return RCRTCIWMediaType.values()[type];
  }

  static RCRTCIWCamera toCamera(@NonNull Integer camera) {
    return RCRTCIWCamera.values()[camera];
  }

  static RCRTCIWCameraCaptureOrientation toCameraCaptureOrientation(@NonNull Integer orientation) {
    return RCRTCIWCameraCaptureOrientation.values()[orientation];
  }

  static RCRTCIWLiveMixLayoutMode toLiveMixLayoutMode(@NonNull Integer mode) {
    return RCRTCIWLiveMixLayoutMode.values()[mode];
  }

  static RCRTCIWLiveMixRenderMode toLiveMixRenderMode(@NonNull Integer mode) {
    return RCRTCIWLiveMixRenderMode.values()[mode];
  }

  static RCRTCIWVideoResolution toVideoResolution(@NonNull Integer resolution) {
    return RCRTCIWVideoResolution.values()[resolution];
  }

  static RCRTCIWVideoFps toVideoFps(@NonNull Integer fps) {
    return RCRTCIWVideoFps.values()[fps];
  }

  static RCRTCIWAudioMixingMode toAudioMixingMode(@NonNull Integer mode) {
    return RCRTCIWAudioMixingMode.values()[mode];
  }

  static RCRTCIWAudioCodecType toAudioCodecType(@NonNull Integer type) {
    return RCRTCIWAudioCodecType.values()[type];
  }

  static RCRTCIWRole toRole(@NonNull Integer role) {
    return RCRTCIWRole.values()[role];
  }

  static RCRTCIWAudioQuality toAudioQuality(@NonNull Integer quality) {
    return RCRTCIWAudioQuality.values()[quality];
  }

  static RCRTCIWAudioScenario toAudioScenario(@NonNull Integer scenario) {
    return RCRTCIWAudioScenario.values()[scenario];
  }

  private static int getInt(@NonNull ReadableMap map, String key, int defaultValue) {
    if (map.hasKey(key)) {
      return map.getInt(key);
    }
    return defaultValue;
  }

  private static boolean getBoolean(@NonNull ReadableMap map, String key, boolean defaultValue) {
    if (map.hasKey(key)) {
      return map.getBoolean(key);
    }
    return defaultValue;
  }

  static RCRTCIWAudioSetup toAudioSetup(@NonNull ReadableMap setup) {
    int codec = getInt(setup, "codec", 1); // default opus
    int audioSource = getInt(setup, "audioSource", 7); // default VOICE_COMMUNICATION
    int audioSampleRate = getInt(setup, "audioSampleRate", 16000);
    boolean enableMicrophone = getBoolean(setup, "enableMicrophone", true);
    boolean enableStereo = getBoolean(setup, "enableStereo", true);
    return RCRTCIWAudioSetup.Builder.create()
      .withAudioCodecType(toAudioCodecType(codec))
      .withAudioSource(audioSource)
      .withAudioSampleRate(audioSampleRate)
      .withEnableMicrophone(enableMicrophone)
      .withEnableStereo(enableStereo)
      .build();
  }

  static RCRTCIWVideoSetup toVideoSetup(@NonNull ReadableMap setup) {
    boolean enableHardwareDecoder = getBoolean(setup, "enableHardwareDecoder", true);
    boolean enableHardwareEncoder = getBoolean(setup, "enableHardwareEncoder", true);
    boolean enableHardwareEncoderHighProfile = getBoolean(setup, "enableHardwareEncoderHighProfile", false);
    int hardwareEncoderFrameRate = getInt(setup, "hardwareEncoderFrameRate", 30);
    boolean enableEncoderTexture = getBoolean(setup, "enableEncoderTexture", true);
    boolean enableTinyStream = getBoolean(setup, "enableTinyStream", true);
    return RCRTCIWVideoSetup.Builder.create()
      .withEnableHardwareDecoder(enableHardwareDecoder)
      .withEnableHardwareEncoder(enableHardwareEncoder)
      .withEnableHardwareEncoderHighProfile(enableHardwareEncoderHighProfile)
      .withHardwareEncoderFrameRate(hardwareEncoderFrameRate)
      .withEnableEncoderTexture(enableEncoderTexture)
      .withEnableTinyStream(enableTinyStream)
      .build();
  }

  static RCRTCIWEngineSetup toEngineSetup(@NonNull ReadableMap setup) {
    boolean reconnectable = getBoolean(setup, "reconnectable", true);
    int statsReportInterval = getInt(setup, "statsReportInterval", 1000);
    RCRTCIWEngineSetup.Builder builder = RCRTCIWEngineSetup.Builder.create()
      .withReconnectable(reconnectable)
      .withStatsReportInterval(statsReportInterval);
    if (setup.hasKey("mediaUrl")) {
      builder.withMediaUrl(setup.getString("mediaUrl"));
    }
    if (setup.hasKey("audioSetup")) {
      ReadableMap audioSetup = setup.getMap("audioSetup");
      if (audioSetup != null) {
        builder.withAudioSetup(toAudioSetup(audioSetup));
      }
    }
    if (setup.hasKey("videoSetup")) {
      ReadableMap videoSetup = setup.getMap("videoSetup");
      if (videoSetup != null) {
        builder.withVideoSetup(toVideoSetup(videoSetup));
      }
    }
    return builder.build();
  }

  static RCRTCIWRoomSetup toRoomSetup(@NonNull ReadableMap setup) {
    int type = getInt(setup, "type", 2); // default audio_video
    int role = getInt(setup, "role", 0); // default meeting_member
    RCRTCIWRoomSetup.Builder builder = RCRTCIWRoomSetup.Builder.create()
      .withMediaType(toMediaType(type))
      .withRole(toRole(role));
    return builder.build();
  }

  static RCRTCIWAudioConfig toAudioConfig(@NonNull ReadableMap config) {
    int quality = getInt(config, "quality", 0); // default speech
    int scenario = getInt(config, "scenario", 0); // default normal
    return RCRTCIWAudioConfig.create()
      .setQuality(toAudioQuality(quality))
      .setScenario(toAudioScenario(scenario));
  }

  static RCRTCIWVideoConfig toVideoConfig(@NonNull ReadableMap config) {
    int minBitrate = getInt(config, "minBitrate", 250);
    int maxBitrate = getInt(config, "maxBitrate", 2200);
    int fps = getInt(config, "fps", 2); // default 25fps
    int resolution = getInt(config, "resolution", 15); // default 720p
    return RCRTCIWVideoConfig.create()
      .setMinBitrate(minBitrate)
      .setMaxBitrate(maxBitrate)
      .setFps(toVideoFps(fps))
      .setResolution(toVideoResolution(resolution));
  }

  static List<RCRTCIWCustomLayout> toLiveMixCustomLayouts(@NonNull ReadableArray layouts) {
    List<RCRTCIWCustomLayout> lists = new ArrayList<>(layouts.size());
    for (int i = 0; i < layouts.size(); i++) {
      lists.add(toLiveMixCustomLayout(layouts.getMap(i)));
    }
    return lists;
  }

  static RCRTCIWCustomLayout toLiveMixCustomLayout(@NonNull ReadableMap layout) {
    String id = layout.getString("id");
    int x = getInt(layout, "x", 0);
    int y = getInt(layout, "y", 0);
    int width = getInt(layout, "width", 480);
    int height = getInt(layout, "height", 640);
    RCRTCIWStreamType type;
    String tag = null;
    if (layout.hasKey("type"))
      type = RCRTCIWStreamType.values()[(getInt(layout, "type", 0))];
    else
      type = RCRTCIWStreamType.NORMAL;
    if (layout.hasKey("tag"))
      tag = layout.getString("tag");
    return new RCRTCIWCustomLayout(type, id, tag, x, y, width, height);
  }

  static WritableMap fromNetworkStats(@NonNull RCRTCIWNetworkStats stats) {
    WritableMap map = Arguments.createMap();
    map.putInt("type", stats.getType().ordinal());
    map.putString("ip", stats.getIp());
    map.putInt("sendBitrate", stats.getSendBitrate());
    map.putInt("receiveBitrate", stats.getReceiveBitrate());
    map.putInt("rtt", stats.getRtt());
    return map;
  }

  static WritableMap fromNetworkProbeStats(@NonNull RCRTCIWNetworkProbeStats stats) {
    WritableMap map = Arguments.createMap();
    map.putInt("qualityLevel", stats.getQualityLevel().ordinal());
    map.putInt("rtt", stats.getRtt());
    map.putDouble("packetLostRate", stats.getPacketLostRate());
    return map;
  }

  static WritableMap fromLocalAudioStats(@NonNull RCRTCIWLocalAudioStats stats) {
    WritableMap map = Arguments.createMap();
    map.putInt("codec", stats.getCodec().ordinal());
    map.putInt("bitrate", stats.getBitrate());
    map.putInt("volume", stats.getVolume());
    map.putDouble("packageLostRate", stats.getPackageLostRate());
    map.putInt("rtt", stats.getRtt());
    return map;
  }

  static WritableMap fromLocalVideoStats(@NonNull RCRTCIWLocalVideoStats stats) {
    WritableMap map = Arguments.createMap();
    map.putBoolean("tiny", stats.isTiny());
    map.putInt("codec", stats.getCodec().ordinal());
    map.putInt("bitrate", stats.getBitrate());
    map.putInt("fps", stats.getFps());
    map.putInt("width", stats.getWidth());
    map.putInt("height", stats.getHeight());
    map.putDouble("packageLostRate", stats.getPackageLostRate());
    map.putInt("rtt", stats.getRtt());
    return map;
  }

  static WritableMap fromRemoteAudioStats(@NonNull RCRTCIWRemoteAudioStats stats) {
    WritableMap map = Arguments.createMap();
    map.putInt("codec", stats.getCodec().ordinal());
    map.putInt("bitrate", stats.getBitrate());
    map.putInt("volume", stats.getVolume());
    map.putDouble("packageLostRate", stats.getPackageLostRate());
    map.putInt("rtt", stats.getRtt());
    return map;
  }

  static WritableMap fromRemoteVideoStats(@NonNull RCRTCIWRemoteVideoStats stats) {
    WritableMap map = Arguments.createMap();
    map.putInt("codec", stats.getCodec().ordinal());
    map.putInt("bitrate", stats.getBitrate());
    map.putInt("fps", stats.getFps());
    map.putInt("width", stats.getWidth());
    map.putInt("height", stats.getHeight());
    map.putDouble("packageLostRate", stats.getPackageLostRate());
    map.putInt("rtt", stats.getRtt());
    return map;
  }
}

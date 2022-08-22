if [ ! -d "outputs" ]; then
  mkdir outputs
else
  rm -rf outputs
  mkdir outputs
fi

current=$(date "+%Y_%m_%d_%H_%M_%S")



sh clean.sh
yarn





cd example || exit 1
 cd android || exit 1
 chmod +x ./gradlew
 ./gradlew clean
 ./gradlew assembleRelease
 mv ./app/build/outputs/apk/release/app-release.apk ../../outputs/"rn-rtc-example-$current".apk || exit 1
exit
cd ..





sh buildbundle.sh
cd ios || exit 1


xcodebuild clean \
           -workspace "./ReactNativeRtcExample.xcworkspace" \
           -scheme "ReactNativeRtcExample" \
           -configuration "Release" \
           -quiet

xcodebuild archive \
           -workspace "./ReactNativeRtcExample.xcworkspace" \
           -scheme "ReactNativeRtcExample" \
           -archivePath "./build/ReactNativeRtcExample.xcarchive" \
           -configuration "Release" \
           -sdk iphoneos \
           APP_PROFILE="" \
           SHARE_PROFILE="" \
           -allowProvisioningUpdates
         
xcodebuild -exportArchive \
           -archivePath "./build/ReactNativeRtcExample.xcarchive" \
           -exportOptionsPlist "archive.plist" \
           -exportPath "./build" \
           -allowProvisioningUpdates
           
mv ./build/ReactNativeRtcExample.ipa ../../outputs/"rn-trc-example-$current".ipa || exit 1
cd ../..
rm -rf example/ios/build

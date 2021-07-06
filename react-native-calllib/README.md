
# rc-react-native-calllib

## Getting started

`$ npm install rc-react-native-calllib --save`

### Mostly automatic installation

`$ react-native link rc-react-native-calllib`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `rc-react-native-calllib` and add `RCReactNativeCalllib.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRCReactNativeCalllib.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import cn.rongcloud.rn.call.RCReactNativeCalllibPackage;` to the imports at the top of the file
  - Add `new RCReactNativeCalllibPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':rc-react-native-calllib'
  	project(':rc-react-native-calllib').projectDir = new File(rootProject.projectDir, 	'../node_modules/rc-react-native-calllib/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':rc-react-native-calllib')
  	```


## Usage
```javascript
import RCReactNativeCalllib from 'rc-react-native-calllib';

// TODO: What to do with the module?
RCReactNativeCalllib;
```
  
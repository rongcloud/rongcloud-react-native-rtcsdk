import React from 'react';
import * as Util from '../util';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { rtcEngine } from './Connect';
import Slider from '@react-native-community/slider';
import ImagePicker from 'react-native-image-crop-picker';
import {
  RRCToast,
  RRCLoading
} from 'react-native-overlayer';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

interface IProps {
  
}

interface IStates {
  x: number,
  y: number,
  zoom: number
}

class SetWatermarkScreen extends React.Component<IProps, IStates> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      zoom: 0
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sliderView}>
          <Text style={styles.sliderText}>{'x:'}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor="#0000FF"
            maximumTrackTintColor="#0000FF50"
            step={1}
            onValueChange={(value: number) => {
              this.setState({x: value / 10.0});
            }}
          />
          <Text style={styles.sliderText}>{this.state.x}</Text>
        </View>
        <View style={styles.sliderView}>
          <Text style={styles.sliderText}>{'y:'}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor="#0000FF"
            maximumTrackTintColor="#0000FF50"
            step={1}
            onValueChange={(value: number) => {
              this.setState({y: value / 10.0});
            }}
          />
          <Text style={styles.sliderText}>{this.state.y}</Text>
        </View>
        <View style={styles.sliderView}>
          <Text style={styles.sliderText}>{'zoom:'}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor="#0000FF"
            maximumTrackTintColor="#0000FF50"
            step={1}
            onValueChange={(value: number) => {
              this.setState({zoom: value / 10.0});
            }}
          />
          <Text style={styles.sliderText}>{this.state.zoom}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => {
          ImagePicker.openPicker({
            mediaType: "photo",
            cropping: false,
            writeTempFile: false,
            waitAnimationEnd: false,

          }).then((video) => {
            let file = video.sourceURL ? video.sourceURL : video.path
            console.log(file)
            RRCLoading.show();
            rtcEngine?.setOnWatermarkSetListener((code: number, errMsg: string) => {
              RRCLoading.hide();
              if (code === 0) {
                RRCToast.show('设置成功');
              } else {
                RRCToast.show(errMsg);
              }
            })
            rtcEngine?.setWatermark(file, {'x': this.state.x, 'y': this.state.y}, this.state.zoom)
          });
        }}>
          <Text style={styles.text}>{'设置水印'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => {
          RRCLoading.show();
          rtcEngine?.setOnWatermarkRemovedListener((code: number, errMsg: string) => {
            RRCLoading.hide();
            if (code === 0) {
              RRCToast.show('删除成功');
            } else {
              RRCToast.show(errMsg);
            }
          })
          rtcEngine?.removeWatermark()
        }}>
          <Text style={styles.text}>{'删除水印'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#FFFFFF'
  },
  inputView: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  textInput: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  btn: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#000000',
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 5
  },
  text: {
    textAlign: 'center'
  },
  sliderView: {
    flexDirection: 'row',
    paddingLeft: 32,
    paddingVertical: 16
  },
  sliderText: {
    alignSelf: 'center',
    width: 50
  },
  slider: {
    flex: 1,
    marginHorizontal: 16,
    height: 40
  }
})

export default SetWatermarkScreen;

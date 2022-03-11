//下拉图
const dropdown = 'iVBORw0KGgoAAAANSUhEUgAAATgAAAE4CAMAAAD4oR9YAAAAe1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC9eBywAAAAKHRSTlMAYAT74QjZ9y8nGBLv6POYVMWgeMyGfWg9HAy/rkW0WVBMu6c3IG90Ij2N5AAAA0hJREFUeNrswYEAAAAAgKD9qRepAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZudelBIGYiiARvq0gJQqFURAeZn//0KHcZzO6A6UKs3Nbs5P3LlJdo0xxhjTm/xOu5JEDJ9YuZJk3I9YtZqkrDJWrBqQmE3Eak0TElSzVmlBotasU5STrCRlle5I2mHMCtUkb8767AYEoFQXremQIMxYl/hAIHasyeieULxoaq3RnHAUiqL1kZDMH1iJCiJQ9bXWaUJgjqxBXBCcV8aXIQXDt2TK8EpCtIgZHEJDddmDD4TRArXxBh2t6QvBQo7WMU7TcpgwqmxPyAao0Rq9E7YhaLQeCR1mtOIGKvZAeAnXUF2eGU0MMiq/pGIs4IHaSJYMBbOh4g+EURuqSw50AIaxQ9UXrToCtfHBGOIFKYMxEH6AbvbAA+EN6VMAtFasHWpbufiudUI6dRgIBx2oKGdMKMdc2lqrwkBtDJ74OkE2VJdFylewQJV/tqQ1UBsbbssCVT5aNQfq9a3Vyyvfv0h6j1bEYy4NrfWZfNFva52RP/ocCG9VjcoveeTzQh75YrxrVd1QJQfC6EdJqLtWfwL18q7VGuolK3ayQBVvrX401P5b6xjm/e4XLa01W5G/nNHqzYcYPyhprT41VJeSb+PV00B1tFYLVIBdK/ZzoxPMxzeRz4H6K1qtoYq3Vj8b6u13rVsPdqht1czBPZtBi9ZRTiFJ1hao3QzjUN6hnuC11nACtfEWWaB2U1ugdlRZoHZtrbZD7aaIQ77ylboQrihk75E/Xw+2ADAQDmHke97EjpK6Rmt4z2b+RzG2QO1mnllD7edPoaX3O9S2Zur/8pWytob62d7dpCAIhWEYNQgFJ02ysEwaBLX/FTYKamYvFxQ9ZxMP97t/mUtt5JvpJ6f1WfGb1jW+lJQq/zz/dcFv+c6ls0INjVaoaVqNfNO0OpSUptUKNXPe4LWZMg6buYda2iioaVoFNd0xFNTMrRHUUseYjoI6yWmx/6Eu3fD61hj5Zv+13iumavf2UDOPxsg3s/sE1ejyT52ghgZBTdMqqJm2FtRML6gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACr8QZycN6eG2Q8XwAAAABJRU5ErkJggg=='
//上拉图
const pullup = 'iVBORw0KGgoAAAANSUhEUgAAATgAAAE4CAMAAAD4oR9YAAAAe1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC9eBywAAAAKHRSTlMAYAT74QjZ9y8nGBLv6POYVMWgeMyGfWg9HAy/rkW0WVBMu6c3IG90Ij2N5AAAA21JREFUeNrs3Yta2kAUReFjCCByF1RQUfG63/8JS7+2QduYZGIsZ8j6X2J9e2YCBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4FsnaUMeid2YI9yAtrw2hTvuSbg2BXlL9dGEIMlzqlxNDgORJv/WfDdUtlElJa0hQM6Q1LKgZ0hoc1L1LQwXJUn/pPBjKTfWP/sZQ5ko5RgNDsa1y9UhrscFE+e4MBdapPjM1fCp51OeuDAFB3euvDAFB3RtzlF4aVNJaM6iktbphT4U4EM53faMKOveG/CPfHdIa4E0Z0hpg09EfpDXA6UgZ0lrdWaoMaa0uyQ0qqzVkoZLWAAsFG3PXajZTDfPE2q54oXKsWbJQwy2s1bpz1dTZWpudqxJuDL8eVJ4xfTzyJa3hC7W+c2ulYapgPGMy6z4qGM+YdqZqwOTU2uZVjUiH1i6bjppx17U2eR9U0lovqKQ1KKhNas9d61SNGrUlrVcqxIFwSFBZraUGY2VIa3NHvhwI50tu9T1mdtwulIPVWupE75DWyjZ9fZ/l8a7Wl8aD2o7vWusElWdMZsmjvttxfp05VR5Wa+2FSloLbfVfzI8trYOJvqC9L4TXqUqwWsOC2rzOMa3WC5VhtTYUVJ4x7axUDav1o8FI1bBa6y5UVus73RtVx11rQwu1xS+EFzqQXtzftc50MMuY71prLVTuWusElbR+OagtfiFcL6is1oUOLsrVei8HIjwQHkzkQXSrdZ3KhzeLyi6oTsR1IJw8yY2o7lov5UhEd60zuXITS1qf+/IlktU69BLUyH5TyE9Q40prci6HIvjnm1e55P671m1HPjn/+MZdUCP5NabBWH69mlvXPTnm90DYZ1AjSKurhZon9XnX6myhRnMgvPIbVNcHwmf+FmoUae3OFQVvP8/vPah7E1+/IezgDjXKA+GV14X6o707SEEgBoIAGC+iroIHfyAL+f8LPXkTEWHZbqj6xKSTzMxb6L7W83U2eY4Qa0dBjfvGtEQn1NwL4aQ31J8llNb4hPrJbR1/ahiIsaXj3qn11HQQCeprvdQVhoxBhy0JNS219iTUOaNWoVcW1IC2pYIr3+8ey9jF/dCu6c8hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO1e/BvenrILk0cAAAAASUVORK5CYII='

import React, { RefObject } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ListRenderItemInfo,
  ViewProps,
  StyleProp,
  TextStyle,
  ImageStyle
} from 'react-native';
import Pop from './Pop';

interface PickerItem {
  value: number,
  label: string
}

interface PickerProps extends ViewProps {
  items: Array<PickerItem>,
  value?: number,
  textStyle?: StyleProp<TextStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  onValueChange?: (value: number) => void
}


interface PickerStates {
  modalVisible: boolean,
  index: number
}


class Picker extends React.Component<PickerProps, PickerStates> {
  pop: RefObject<Pop>;
  _extraUniqueKey = (item: PickerItem, index: number) => {
    return item.label + index;
  }

  constructor(props: PickerProps) {
    super(props)
    this.pop = React.createRef<Pop>();
    const index = this.props.value ? this._itemValue2Index(this.props.value) : 0;
    this.state = {
      modalVisible: false,
      index: index
    };
  }

  _itemValue2Index(value: number) {
    if (this.props.items) {
      for (let index = 0; index < this.props.items.length; index++) {
        const item: PickerItem = this.props.items[index];
        if (item.value == value)
          return index;
      }
    }
    return 0;
  }

  show() {
    this.pop.current?.setView(this.addList())
  }

  close() {
    this.pop.current?.close();
  }

  _onOtemClick(item: PickerItem) {
    const index = this._itemValue2Index(item.value)
    this.setState({ index: index })
    this.close();

    this.props.onValueChange!(item.value)
  }

  _renderItem(itemInfo: ListRenderItemInfo<PickerItem>) {
    let item: PickerItem = itemInfo.item;

    return (
      <TouchableOpacity
        onPress={() => this._onOtemClick(itemInfo.item)}
        style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  addList() {
    return (
      <FlatList
        keyExtractor={this._extraUniqueKey}
        data={this.props.items}
        renderItem={(itemInfo: ListRenderItemInfo<PickerItem>) => {
          return this._renderItem(itemInfo)
        }}

        ItemSeparatorComponent={() => {
          return (<View style={{ height: 1, backgroundColor: 'grey' }} />)
        }}
      />);
  }

  render() {
    return (
      <View style={this.props.style}>
        <TouchableOpacity
          onPress={() => this.show()}
          style={{ flexDirection: 'row', alignItems: "center" }}>
          <Text
            style={[{ textAlign: 'center', fontSize: 15 }, this.props.textStyle]}>{this.props.items[this.state.index].label}</Text>
          <Image
            style={[{ width: 15, height: 15 }, this.props.imageStyle]}
            source={{ uri: `data:image/png;base64,${this.state.modalVisible ? pullup : dropdown}` }} />
        </TouchableOpacity>
        <Pop ref={this.pop} />
      </View>
    );
  }
}

export default Picker;

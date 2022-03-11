import React from "react";
import { FlexAlignType, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewProps, ViewStyle } from "react-native";

interface RadioItem {
    value: number,
    label: string
}


interface RadioProps extends ViewProps {
    items: Array<RadioItem>,
    value: number,
    textStyle?: StyleProp<TextStyle>,
    alignItems?: FlexAlignType;
    onSelect?: (value: number) => void
}


interface RadioStates {
    index: number
}



class Radio extends React.Component<RadioProps, RadioStates>
{
    oldValue: number
    constructor(props: RadioProps) {
        super(props);
        this.oldValue = this.props.value
        this.state = {
            index: this.props.value
        };
    }

    render() {
        let selectd: number
        if (this.props.value != this.oldValue)
            selectd = this.props.value
        else
            selectd = this.state.index
        let render_content = this.props.items.map((obj) => {
            return (<RadioButtun
                alignItems={this.props.alignItems}
                key={obj.value}
                selected={obj.value == selectd}
                textStyle={this.props.textStyle}
                obj={obj}
                onSelect={(value) => {
                    this.props.onSelect!(value)
                    this.setState({ index: value })
                }} />)
        })

        return (
            <View style={[this.props.style, { flexDirection: 'row' }]}>
                {
                    render_content
                }
            </View>
        )
    }
}





interface RadioButtunProps {
    obj: RadioItem,
    textStyle?: StyleProp<TextStyle>,
    alignItems?: FlexAlignType;
    onSelect: (value: number) => void,
    selected: boolean
}

interface RadioButtunStates {

}

export class RadioButtun extends React.Component<RadioButtunProps, RadioButtunStates>
{
    constructor(props: RadioButtunProps) {
        super(props);
    }
    render() {
        let radio: ViewStyle = {
            borderColor: '#2196f3',
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
            width: 15 + 10,
            height: 15 + 10,
            borderRadius: (15 + 10) / 2,
        }

        let radioActive: ViewStyle = {
            width: 15,
            height: 15,
            borderRadius: 15 / 2,
            backgroundColor: '#2196f3',
        }
        let align = this.props.alignItems ? { alignItems: this.props.alignItems } : {}
        return (
            <View style={[{ alignItems: 'center', flex: 1, }, align]}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", }}
                    onPress={() => { this.props.onSelect(this.props.obj.value) }}>

                    <View style={[radio]}>
                        <View style={[this.props.selected && radioActive]} />
                    </View>

                    <Text style={[{ marginLeft: 3 }, this.props.textStyle]}>{this.props.obj.label}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


export default Radio;
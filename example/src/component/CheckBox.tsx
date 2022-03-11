import { Image, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from 'react';

export default function CheckBox(props:
    {
        text: string,
        onValueChange: (value: boolean) => void,
        value: boolean,
        style?: ViewStyle,
        disabled?: boolean
    },
) {

    let [state, setState] = React.useState(props.value)
    let source = props.value ? 'ic_check_box' : 'ic_check_box_outline_blank'
    React.useEffect(() => {
        setState(props.value)
        source = props.value ? 'ic_check_box' : 'ic_check_box_outline_blank'
    }, [props.value]);
    let disabled = props.disabled ? true : false
 
    return (
        <TouchableOpacity
            disabled={disabled}
            style={{ flexDirection: 'row', alignItems: 'center', ...props.style }}
            onPress={() => {
                const checked = !state
                setState(checked)
                props.onValueChange(checked)
            }}>

            <Image source={{ uri: source, width: 22, height: 22 }}></Image>
            <Text style={{ fontSize: 15, color: disabled ? 'gray' : 'black' }}>{props.text}</Text>
        </TouchableOpacity>
    )
}


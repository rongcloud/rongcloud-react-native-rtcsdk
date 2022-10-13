import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, StyleProp, TextStyle } from 'react-native';
import LiBaseAlert from './RcBaseAlert';

interface IStates {
}

interface IProps {
    titleArr: string[]
    marginTop?: number; // 顶部距离
    hiddenCallBack?: any; // 隐藏时回调事件
    selectCallBack?: any; // 选中回调
}

let liBaseAlert: LiBaseAlert;
const { width, height } = Dimensions.get('window');

class RcTipAlert extends Component<IProps, IStates> {

    flatList!: any;

    constructor(props: IProps) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() { }

    // 显示
    public show = () => {
        liBaseAlert.show()
    }

    // 隐藏
    public hidden = () => {
        liBaseAlert.hidden()
        if (this.props.hiddenCallBack) {
            this.props.hiddenCallBack()
        }
    }

    // 内容视图
    private contentView = () => {
        return (
            <View style={[styles.container, this.props.marginTop ? { height: height - this.props.marginTop } : {}]}>
                <Text style={[styles.text, {alignSelf: 'center', fontSize: 26, marginTop: 30, paddingHorizontal: 10}]}>{'默认配置'}</Text>
                {this.props.titleArr && this.props.titleArr.map((text: string, index: number) => {
                    return (
                        <Text style={[styles.text, {marginTop: 16}]}>{text ? text : '-'}</Text>
                    )
                })}
                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                        liBaseAlert.hidden()
                    }}
                >
                    <Text style={styles.cancelText}>{'ok'}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <LiBaseAlert
                transition={'center'}
                ref={(ref) => {
                    liBaseAlert = ref!;
                }}>
                {this.contentView()}
            </LiBaseAlert>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 30,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 6
    },
    text: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000000'
    },
    cancelBtn: {
        alignSelf: 'flex-end',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 30
    },
    cancelText: {
        fontSize: 20,
        fontWeight: '400',
        color: '#D73C3C',
        lineHeight: 24,
        alignSelf: 'center',
    },
    normalView: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8
    },
    normalBtn: {
        paddingVertical: 16,
    },
    normalText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#2B2E3B',
        lineHeight: 24,
        alignSelf: 'center',
    }
});

export default RcTipAlert;


import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewProps,
} from 'react-native';


interface PopProps extends ViewProps {

}


interface PopStates {
  modalVisible: boolean
  element?: Element
}


class Pop extends React.Component<PopProps, PopStates> {
  constructor(props: PopProps) {
    super(props)

    this.state = {
      modalVisible: false,
    };
  }

  show() {
    this.setState({ modalVisible: true });
  }

  hide() {
    this.setState({ modalVisible: false });
  }

  close() {
    this.setState({ element: undefined, modalVisible: false });
  }

  setView(element: Element) {
    this.setState({ element: element, modalVisible: true })
  }

  render() {
    return (
      <View style={this.props.style}>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.show()}
          onShow={() => {
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => this.close()}>
            <View
              style={styles.modalLayer}>
              <TouchableWithoutFeedback
                onPress={() => { }}>
                <View
                  style={styles.modalContainer}>
                  {
                    this.state.element
                  }
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalLayer: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 32
  },
  modalContainer: {
    backgroundColor: 'white',
    justifyContent: 'center'
  }
});

export default Pop;

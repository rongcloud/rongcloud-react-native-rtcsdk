
import {
  StyleSheet,
} from 'react-native';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    paddingTop: 10,
    paddingBottom: 10,
  },
  stack: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 2,
    fontSize: 25,
    borderColor: 'black',
    marginBottom: 16,
    paddingLeft: 10,
    padding: 0,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  button: {
    color: 'black',
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 1,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    paddingLeft: 5,
    alignSelf: 'flex-start'
  },
  text: {
    fontSize: 25,
    color: 'black',
  },
});

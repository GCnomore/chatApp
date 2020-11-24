import React from 'react';
import { StyleSheet, Button, TextInput, Text, View } from 'react-native';

export default class Chat extends React.Component {
  componentDidMount() {
    let name = this.props.route.params.userName;
    this.props.navigation.setOptions({ title: name });
  }
  render() {
    return (
      <View
        style={[
          styles.chatContainer,
          { backgroundColor: this.props.route.params.color },
        ]}
      >
        <Text style={{ color: 'white' }}>Chat screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

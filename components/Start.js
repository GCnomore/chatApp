import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  View,
  ImageBackground,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      color: '',
      iconDisplay: true,
    };
  }

  // To show/hide icon inside the placeholder of name input field when the user starts typing
  handleInputChange(name) {
    if (name !== '') {
      this.setState({ userName: name });
      this.setState({ iconDisplay: false });
      return this.state.userName;
    }
    if (name === '') {
      this.setState({ userName: name });
      this.setState({ iconDisplay: true });
      return this.state.userName;
    }
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/BackgroundImage.png')}
        style={styles.bgImage}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>KOKOA TALK</Text>
        </View>
        <View style={styles.overlay}>
          <View style={styles.inputContainer}>
            {this.state.iconDisplay ? (
              <Image
                style={styles.icon}
                source={require('../assets/icon1.png')}
              />
            ) : (
              <Image></Image>
            )}

            <TextInput
              style={styles.nameInput}
              placeholder="       Your Name"
              onChangeText={(name) => this.handleInputChange(name)}
              value={this.state.userName}
            ></TextInput>
          </View>
          <View style={styles.bgOptionContainer}>
            <Text style={styles.chooseBg}>Choose Background Color:</Text>
            <View style={styles.bgColorContainer}>
              {/* Conditional statment to only show border around the selected color option */}
              {this.state.color === '#090C08' ? (
                <View
                  style={[
                    styles.bgColorOutlayer,
                    {
                      borderWidth: 3,
                      borderColor: 'gray',
                      borderRadius: 50,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.bgColor, styles.bgColor1]}
                    onPress={() =>
                      this.setState({
                        color: '#090C08',
                      })
                    }
                  ></TouchableOpacity>
                </View>
              ) : (
                <View style={styles.bgColorOutlayer}>
                  <TouchableOpacity
                    style={[styles.bgColor, styles.bgColor1]}
                    onPress={() =>
                      this.setState({
                        color: '#090C08',
                      })
                    }
                  ></TouchableOpacity>
                </View>
              )}
              {this.state.color === '#474056' ? (
                <View
                  style={[
                    styles.bgColorOutlayer,
                    {
                      borderWidth: 3,
                      borderColor: 'gray',
                      borderRadius: 50,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.bgColor, styles.bgColor2]}
                    onPress={() =>
                      this.setState({
                        color: '#474056',
                      })
                    }
                  ></TouchableOpacity>
                </View>
              ) : (
                <View style={styles.bgColorOutlayer}>
                  <TouchableOpacity
                    style={[styles.bgColor, styles.bgColor2]}
                    onPress={() =>
                      this.setState({
                        color: '#474056',
                      })
                    }
                  ></TouchableOpacity>
                </View>
              )}
              {this.state.color === '#8A95A5' ? (
                <View
                  style={[
                    styles.bgColorOutlayer,
                    {
                      borderWidth: 3,
                      borderColor: 'gray',
                      borderRadius: 50,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.bgColor, styles.bgColor3]}
                    onPress={() =>
                      this.setState({
                        color: '#8A95A5',
                      })
                    }
                  ></TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.bgColorOutlayer]}>
                  <TouchableOpacity
                    style={[styles.bgColor, styles.bgColor3]}
                    onPress={() =>
                      this.setState({
                        color: '#8A95A5',
                      })
                    }
                  ></TouchableOpacity>
                </View>
              )}
              {this.state.color === '#B9C6AE' ? (
                <View
                  style={[
                    styles.bgColorOutlayer,
                    {
                      borderWidth: 3,
                      borderColor: 'gray',
                      borderRadius: 50,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.bgColor, styles.bgColor4]}
                    onPress={() =>
                      this.setState({
                        color: '#B9C6AE',
                      })
                    }
                  ></TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.bgColorOutlayer]}>
                  <TouchableOpacity
                    style={[styles.bgColor, styles.bgColor4]}
                    onPress={() =>
                      this.setState({
                        color: '#B9C6AE',
                      })
                    }
                  ></TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() =>
                this.props.navigation.navigate('Chat', {
                  userName: this.state.userName,
                  color: this.state.color,
                })
              }
            >
              <Text style={styles.startBtnText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* This is for Android OS to avoid the keyboard blocking the visibility of input area  */}
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </ImageBackground>
    );
  }
}

// Contents' positions are fixed using absolute as instructed
const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 80,
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  overlay: {
    width: '88%',
    height: '44%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    position: 'absolute',
    top: 320,
  },
  inputContainer: {
    width: '88%',
  },
  icon: {
    width: 25,
    height: 25,
    opacity: 0.5,
    position: 'absolute',
    top: 30,
    left: 15,
  },
  nameInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 0.5,
    borderWidth: 2,
    padding: 17,
    width: '100%',
    position: 'absolute',
    top: 10,
  },
  bgOptionContainer: {
    width: '88%',
    position: 'absolute',
    top: 90,
    left: 25,
  },
  chooseBg: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    width: '88%',
  },
  bgColorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 35,
  },
  bgColorOutlayer: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
  },
  bgColor: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
  },
  bgColor1: {
    backgroundColor: '#090C08',
  },
  bgColor2: {
    backgroundColor: '#474056',
  },
  bgColor3: {
    backgroundColor: '#8A95A5',
  },
  bgColor4: {
    backgroundColor: '#B9C6AE',
  },
  btnContainer: {
    position: 'absolute',
    top: 240,
    width: '88%',
  },
  startBtn: {
    backgroundColor: '#757083',
    padding: 20,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
  },
});

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
import PropTypes from 'prop-types';

const backgroundImage = require('../assets/BackgroundImage.png');
const icon = require('../assets/icon1.png');

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
    top: '3%',
  },
  icon: {
    width: 25,
    height: 25,
    opacity: 0.5,
    position: 'absolute',
    top: 20,
    left: '6%',
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
  },
  bgOptionContainer: {
    width: '88%',
    position: 'absolute',
    top: '35%',
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
    top: '74%',
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
  handleInputChange(name = 'Me') {
    const { userName } = this.state;
    if (name !== '') {
      this.setState({ userName: name });
      this.setState({ iconDisplay: false });
      return userName;
    }
    if (name.length === 0) {
      this.setState({ userName: name });
      this.setState({ iconDisplay: true });
      return userName;
    }
    return null;
  }

  render() {
    const { iconDisplay, userName, color } = this.state;
    const { navigation } = this.props;
    return (
      <ImageBackground source={backgroundImage} style={styles.bgImage}>
        <View style={styles.titleContainer}>
          <Text
            accessibilityLabel='Name of the application... Kokoa Talk'
            style={styles.appTitle}>
            KOKOA TALK
          </Text>
        </View>
        <View style={styles.overlay}>
          <View style={styles.inputContainer}>
            {iconDisplay && <Image style={styles.icon} source={icon} />}

            <TextInput
              style={styles.nameInput}
              placeholder='           Your Name'
              onChangeText={(name) => this.handleInputChange(name)}
              value={userName}
            />
          </View>
          <View style={styles.bgOptionContainer}>
            <Text style={styles.chooseBg}>Choose Background Color:</Text>
            <View style={styles.bgColorContainer}>
              {/* Conditional statment to only show border around the selected color option */}
              {color === '#090C08' ? (
                <View
                  style={[
                    styles.bgColorOutlayer,
                    {
                      borderWidth: 3,
                      borderColor: 'gray',
                      borderRadius: 50,
                    },
                  ]}>
                  <TouchableOpacity
                    accessibilityLabel='black background'
                    style={[styles.bgColor, styles.bgColor1]}
                    onPress={() =>
                      this.setState({
                        color: '#090C08',
                      })
                    }
                  />
                </View>
              ) : (
                <View style={styles.bgColorOutlayer}>
                  <TouchableOpacity
                    accessibilityLabel='black background'
                    style={[styles.bgColor, styles.bgColor1]}
                    onPress={() =>
                      this.setState({
                        color: '#090C08',
                      })
                    }
                  />
                </View>
              )}
              {color === '#474056' ? (
                <View
                  style={[
                    styles.bgColorOutlayer,
                    {
                      borderWidth: 3,
                      borderColor: 'gray',
                      borderRadius: 50,
                    },
                  ]}>
                  <TouchableOpacity
                    accessibilityLabel='dark mauve background'
                    style={[styles.bgColor, styles.bgColor2]}
                    onPress={() =>
                      this.setState({
                        color: '#474056',
                      })
                    }
                  />
                </View>
              ) : (
                <View style={styles.bgColorOutlayer}>
                  <TouchableOpacity
                    accessibilityLabel='dark mauve background'
                    style={[styles.bgColor, styles.bgColor2]}
                    onPress={() =>
                      this.setState({
                        color: '#474056',
                      })
                    }
                  />
                </View>
              )}
              {color === '#8A95A5' ? (
                <View
                  style={[
                    styles.bgColorOutlayer,
                    {
                      borderWidth: 3,
                      borderColor: 'gray',
                      borderRadius: 50,
                    },
                  ]}>
                  <TouchableOpacity
                    accessibilityLabel='light grey background'
                    style={[styles.bgColor, styles.bgColor3]}
                    onPress={() =>
                      this.setState({
                        color: '#8A95A5',
                      })
                    }
                  />
                </View>
              ) : (
                <View style={[styles.bgColorOutlayer]}>
                  <TouchableOpacity
                    accessibilityLabel='light grey background'
                    style={[styles.bgColor, styles.bgColor3]}
                    onPress={() =>
                      this.setState({
                        color: '#8A95A5',
                      })
                    }
                  />
                </View>
              )}
              {color === '#B9C6AE' ? (
                <View
                  style={[
                    styles.bgColorOutlayer,
                    {
                      borderWidth: 3,
                      borderColor: 'gray',
                      borderRadius: 50,
                    },
                  ]}>
                  <TouchableOpacity
                    accessibilityLabel='light olive background'
                    style={[styles.bgColor, styles.bgColor4]}
                    onPress={() =>
                      this.setState({
                        color: '#B9C6AE',
                      })
                    }
                  />
                </View>
              ) : (
                <View style={[styles.bgColorOutlayer]}>
                  <TouchableOpacity
                    accessibilityLabel='light olive background'
                    style={[styles.bgColor, styles.bgColor4]}
                    onPress={() =>
                      this.setState({
                        color: '#B9C6AE',
                      })
                    }
                  />
                </View>
              )}
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() =>
                navigation.navigate('Chat', {
                  userName,
                  color,
                })
              }>
              <Text style={styles.startBtnText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* This is for Android OS to avoid the keyboard blocking the visibility of input area  */}
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior='height' />
        ) : null}
      </ImageBackground>
    );
  }
}

Start.propTypes = {
  navigation: PropTypes.object.isRequired,
};

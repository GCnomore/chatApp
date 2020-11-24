import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  View,
  ImageBackground,
  Image,
} from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      color: '',
      iconDisplay: '',
      bg1: {
        borderColor: '',
        borderWidth: 0,
      },
      bg2: {
        borderColor: '',
        borderWidth: 0,
      },
      bg3: {
        borderColor: '',
        borderWidth: 0,
      },
      bg4: {
        borderColor: '',
        borderWidth: 0,
      },
    };
  }

  handleInputChange(name) {
    if (name !== '') {
      this.setState({ userName: name });
      this.setState({ iconDisplay: 'none' });
      return this.state.userName;
    }
    if (name === '') {
      this.setState({ userName: name });
      this.setState({ iconDisplay: '' });
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
            <Image
              style={[styles.icon, { display: this.state.iconDisplay }]}
              source={require('../assets/icon1.png')}
            />
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
              <View
                style={[
                  styles.bgColorOutlayer,
                  {
                    borderWidth: this.state.bg1.borderWidth,
                    borderColor: this.state.bg1.borderColor,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.bgColor, styles.bgColor1]}
                  onPress={() =>
                    this.setState({
                      color: '#090C08',
                      bg1: { borderColor: 'gray', borderWidth: 3 },
                      bg2: { borderColor: '', borderWidth: 0 },
                      bg3: { borderColor: '', borderWidth: 0 },
                      bg4: { borderColor: '', borderWidth: 0 },
                    })
                  }
                ></TouchableOpacity>
              </View>
              <View
                style={[
                  styles.bgColorOutlayer,
                  {
                    borderWidth: this.state.bg2.borderWidth,
                    borderColor: this.state.bg2.borderColor,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.bgColor, styles.bgColor2]}
                  onPress={() =>
                    this.setState({
                      color: '#474056',
                      bg2: { borderColor: 'gray', borderWidth: 3 },
                      bg1: { borderColor: '', borderWidth: 0 },
                      bg3: { borderColor: '', borderWidth: 0 },
                      bg4: { borderColor: '', borderWidth: 0 },
                    })
                  }
                ></TouchableOpacity>
              </View>
              <View
                style={[
                  styles.bgColorOutlayer,
                  {
                    borderWidth: this.state.bg3.borderWidth,
                    borderColor: this.state.bg3.borderColor,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.bgColor, styles.bgColor3]}
                  onPress={() =>
                    this.setState({
                      color: '#8A95A5',
                      bg3: { borderColor: 'gray', borderWidth: 3 },
                      bg1: { borderColor: '', borderWidth: 0 },
                      bg2: { borderColor: '', borderWidth: 0 },
                      bg4: { borderColor: '', borderWidth: 0 },
                    })
                  }
                ></TouchableOpacity>
              </View>
              <View
                style={[
                  styles.bgColorOutlayer,
                  {
                    borderWidth: this.state.bg4.borderWidth,
                    borderColor: this.state.bg4.borderColor,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.bgColor, styles.bgColor4]}
                  onPress={() =>
                    this.setState({
                      color: '#B9C6AE',
                      bg4: { borderColor: 'gray', borderWidth: 3 },
                      bg1: { borderColor: '', borderWidth: 0 },
                      bg2: { borderColor: '', borderWidth: 0 },
                      bg3: { borderColor: '', borderWidth: 0 },
                    })
                  }
                ></TouchableOpacity>
              </View>
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
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 120,
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
    top: 380,
  },
  inputContainer: {
    width: '88%',
  },
  icon: {
    width: 25,
    height: 25,
    opacity: 0.5,
    position: 'absolute',
    top: 40,
    left: 15,
  },
  nameInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 0.5,
    borderWidth: 2,
    padding: 20,
    width: '100%',
    position: 'absolute',
    top: 18,
  },
  bgOptionContainer: {
    width: '88%',
    position: 'absolute',
    top: 120,
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
    right: 20,
  },
  bgColorOutlayer: {
    flex: 1,
    width: 50,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 55,
    marginRight: 5,
    marginLeft: 5,
  },
  bgColor: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  bgColor1: {
    backgroundColor: '#090C08',
    borderColor: 'black',
  },
  bgColor2: {
    backgroundColor: '#474056',
    borderColor: 'black',
  },
  bgColor3: {
    backgroundColor: '#8A95A5',
    borderColor: 'black',
  },
  bgColor4: {
    backgroundColor: '#B9C6AE',
    borderColor: 'black',
  },
  btnContainer: {
    position: 'absolute',
    top: 235,
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

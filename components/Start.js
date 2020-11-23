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
// import Svg from 'react-native-svg';
// import Icon from '../assets/icon.js';

//source={require('../assets/icon.svg')}
export default function Start() {
  return (
    <ImageBackground
      source={require('../assets/BackgroundImage.png')}
      style={styles.bgImage}>
      <View style={styles.titleContainer}>
        <Text style={styles.appTitle}>KOKOA TALK</Text>
      </View>
      <View style={styles.overlay}>
        <View style={styles.inputContainer}>
          <Image style={styles.icon} source={require('../assets/icon1.png')} />
          <TextInput
            style={styles.nameInput}
            placeholder='         Your Name'></TextInput>
        </View>
        <View style={styles.bgOptionContainer}>
          <Text style={styles.chooseBg}>Choose Background Color:</Text>
          <View style={styles.bgColorContainer}>
            <View style={[styles.bgColor, styles.bgColor1]}></View>
            <View style={[styles.bgColor, styles.bgColor2]}></View>
            <View style={[styles.bgColor, styles.bgColor3]}></View>
            <View style={[styles.bgColor, styles.bgColor4]}></View>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.startBtn}>
            <Text style={styles.startBtnText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
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
    top: 420,
  },
  inputContainer: {
    width: '88%',
  },
  icon: {
    width: 25,
    height: 25,
    opacity: 0.5,
    position: 'absolute',
    top: 42,
    left: 25,
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
    top: 130,
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
  bgColor: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 25,
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
    top: 270,
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

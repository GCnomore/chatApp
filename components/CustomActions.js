import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const firebase = require('firebase');
require('firebase/firestore');

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default class CustomActions extends React.Component {
  // Function to show alert when error occurs
  showAlert = (title, message) =>
    Alert.alert(
      `${title}`,
      `${message}`,
      [
        {
          text: 'Close',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );

  /**
   * Creates and define functionalities of each actions
   */
  onActionPress = () => {
    const options = [
      'Choose a Photo From Library',
      'Take Picture',
      'Send Your Current Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;

    // Context == Redux Allows to pass props down to all components.
    // Need to create an object defining actionSheet. GiftedChat expects function.
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        try {
          switch (buttonIndex) {
            case 0:
              console.log('user wants to pick image');
              this.pickImg();
              return;
            case 1:
              console.log('user wants to take a photo');
              this.takePhoto();
              return;
            case 2:
              console.log('user wants to get their location');
              this.getLocation();
              return;
            default:
          }
        } catch (error) {
          console.log(error.message);
          this.showAlert('Location Error', "Can't get your location");
        }
      }
    );
  };

  pickImg = async () => {
    const { onSend } = this.props;
    try {
      // Ask for user's permission to access their photo library
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
        }).catch((error) => console.log(error));
        // Upload image when access granted.
        if (!result.cancelled) {
          const imgURL = await this.uploadImage(result.uri);
          onSend({ image: imgURL });
        }
      }
    } catch (error) {
      console.log(error);
      this.showAlert(
        'Photo library error',
        'Error accessing photo library. Please try again.'
      );
    }
  };

  takePhoto = async () => {
    const { onSend } = this.props;
    try {
      // Ask for user's permission to access their camera
      const { status } = await Permissions.askAsync(Permissions.CAMERA);

      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'Images',
        }).catch((error) => console.log(error));
        // Upload image when access granted.
        if (!result.cancelled) {
          const imgURL = await this.uploadImage(result.uri);
          onSend({ image: imgURL });
        }
      }
    } catch (error) {
      console.log(error.message);
      this.showAlert(
        'Camera Error',
        "Can't access your camera. Please try again."
      );
    }
  };

  getLocation = async () => {
    const { onSend } = this.props;
    try {
      // Ask for user's permission to access their geolocation
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        const result = await Location.getCurrentPositionAsync({});

        if (result) {
          onSend({
            location: {
              latitude: result.coords.latitude,
              longitude: result.coords.longitude,
            },
          });
        }
      }
    } catch (error) {
      () => {
        console.log(error.message);
        this.showAlert(
          'Location Error',
          "Can't get your location. Please try again."
        );
      };
    }
  };

  uploadImage = async (uri) => {
    // Extrating imgaes name from uri
    const nameFrom = uri.indexOf('ImagePicker/') + 12;
    const imgName = uri.slice(nameFrom);

    // Converts image uri into blob
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = (e) => {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    // Creating reference of an image to upload with name
    const ref = firebase.storage().ref().child(`${imgName}`);
    // Storing image to Firebse's storage
    const snapshot = await ref.put(blob);
    blob.close();

    // Returns download url for uploaded image
    return snapshot.ref.getDownloadURL();
  };

  render() {
    const { wrapperStyle, iconTextStyle } = this.props;
    return (
      <TouchableOpacity
        accessibilityLabel='More function button'
        style={styles.container}
        onPress={this.onActionPress}>
        <View style={[styles.wrapper, wrapperStyle]}>
          <Text style={[styles.iconText, iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

CustomActions.propTypes = {
  wrapperStyle: PropTypes.shape.isRequired,
  iconTextStyle: PropTypes.shape.isRequired,
  onSend: PropTypes.func.isRequired,
};

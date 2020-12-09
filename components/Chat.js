import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import MapView from 'react-native-maps';
import ImageModal from 'react-native-image-modal';
import PropTypes from 'prop-types';

import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
});

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      _id: '',
      avatar: '',
      name: '',
    };

    const firebaseConfig = {
      apiKey: 'AIzaSyDTfZbGc70PRFta61zpICpWDUgYSR5ru_U',
      authDomain: 'test-ed657.firebaseapp.com',
      databaseURL: 'https://test-ed657.firebaseio.com',
      projectId: 'test-ed657',
      storageBucket: 'test-ed657.appspot.com',
      messagingSenderId: '150420115705',
      appId: '1:150420115705:web:7a0326de80b55184dbd228',
      measurementId: 'G-3DJL8W9LC3',
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      // firebase.analytics();
    }
  }

  componentDidMount() {
    // Created reference for adding data purpose
    this.refMessages = firebase.firestore().collection('messages');

    // Setting setOptions' title to show current user's name on the nav bar
    const { route, navigation } = this.props;
    const name = route.params.userName;
    navigation.setOptions({ title: name });

    // Send system message stating a user has entered the chat
    const enterMessage = [
      {
        text: `${name} has entered the chat`,
        system: true,
        createdAt: new Date(),
      },
    ];
    this.onSend(enterMessage);

    // Using NetInfo to check whether the browser is connected to the internet
    NetInfo.fetch().then((connection) => {
      // If connected to internet
      if (connection.isConnected) {
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            // Wait until user data is set
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            // Save user's info on current session (state)
            this.setState({
              _id: user.uid,
              name,
              avatar: 'https://placeimg.com/140/140/any',
              isConnected: true,
              createdAt: new Date(),
            });

            // Creating reference that has current user's documents. Ordering them by date
            this.refAuthMessages = firebase
              .firestore()
              .collection('messages')
              .orderBy('createdAt', 'desc');

            // Calling onCollectionsUpdate when current user's data changes
            // (when received/sent new messages)
            this.unsubscribeMessages = this.refAuthMessages.onSnapshot(
              this.onCollectionUpdate
            );
          });
      } else {
        this.setState({ isConnected: false });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    const { isConnected } = this.state;
    if (isConnected) {
      this.authUnsubscribe();
      this.unsubscribeMessages();
    }
  }

  /**
   * Receives message reference's snapshot and sets the state.
   * @param {Object} querySnapshot
   */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through each snapshots and add those data to current session (state)
    querySnapshot.forEach((message) => {
      const data = message.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: data.user
          ? {
              _id: data.user._id,
              avatar: data.user.avatar,
              name: data.user.name,
              system: data.user.system,
            }
          : '',
        image: data.image,
        location: data.location,
        system: data.system || '',
      });
    });
    this.setState({ messages });
  };

  /**
   * This func keeps appending new messages to messages state and GiftedChat to render
   * all conversation to screen.
   * @param {Array} messages
   */
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.saveMessages();

        // Adding sent message data to message collection's reference -- Chat data format
        this.refMessages.add({
          _id: messages[0]._id || Math.random(),
          createdAt: messages[0].createdAt,
          text: messages[0].text || '',
          user: messages[0].user || '',
          location: messages[0].location || '',
          image: messages[0].image || '',
          system: messages[0].system || '',
        });
      }
    );
  }

  // If offline, get messages from AsyncStorage
  getMessages = async () => {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Save messages to AsyncStorage (Accessible offline)
  saveMessages = async () => {
    const { messages } = this.state;
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Do not render InputToolbar when offline
  renderInputToolbar(props) {
    const { isConnected } = this.state;
    if (isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  renderCustomActions = (props) => <CustomActions {...props} />;

  static renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          accessibilityLabel='Snapshot of a map showing current location'
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        />
      );
    }
    return null;
  }

  // Using ImageModal to get rid of Animated.event warning
  static renderMessageImage(props) {
    return (
      <View>
        <ImageModal
          swipeToDismiss={true}
          resizeMode='contain'
          imageBackgroundColor='#000000'
          source={{ uri: props.currentMessage.image }}
          style={{ width: 200, height: 200, borderRadius: 3 }}
        />
      </View>
    );
  }

  // sendLeaveMessage() {
  //   const name = this.props.route.params.userName;
  //   const leaveMessage = {
  //     text: `${name} has left the chat`,
  //     system: true,
  //     createdAt: new Date(),
  //   };

  //   this.refMessages.add(leaveMessage);
  // }

  static renderBubble(props) {
    return (
      // Setting text bubble's style
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#3CAEA3' },
          left: { backgroundColor: '#4a4a4a' },
        }}
        textStyle={{
          left: { color: 'white' },
        }}
        timeTextStyle={{
          left: { color: 'white' },
        }}
      />
    );
  }

  render() {
    const { route } = this.props;
    const { messages, _id, name, avatar } = this.state;
    return (
      <View
        accessibilityLabel="You've clicked the background... Left side shows opponent's message... Right side shows my message"
        style={[styles.chatContainer, { backgroundColor: route.params.color }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={messages}
          onSend={(message) => this.onSend(message)}
          user={{
            _id,
            name,
            avatar,
          }}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          renderMessageImage={this.renderMessageImage}
        />
        {/* This is for Android OS to avoid the keyboard blocking the visibility of input area  */}
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior='height' />
        ) : null}
      </View>
    );
  }
}

Chat.propTypes = {
  route: PropTypes.shape.isRequired,
  navigation: PropTypes.shape.isRequired,
};

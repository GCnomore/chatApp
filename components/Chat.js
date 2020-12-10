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

  /**
   *  <code>componentDidMount</code> will:
   * <ol>
   *    <li>Create reference of Firestore collection.</li>
   *    <li>Using <code>NetInfo</code>, it will determine whether the browser is online or offline.</li>
   *      <ul>
   *        <li>Online: It will authorize user anonymously and load message data from Firestore. It will also subscribe to ref collection to update changes.<br/></li>
   *        <li>Offline: It will call <code>getMessages</code> method and load message data from <code>asyncStorage</code></li>
   *      </ul>
   * </ol>
   *
   *  Misc:
   * <ol>
   *    <li>Receive user name from <code>route</code> API and set it as navigation title to display user name
   *       on top of the chat screen.</li>
   *    <li>Sends system message stating that the user has entered the chat.
   *       ('${userName} has entered the chat')</li>
   * </ol>
   * @name componentDidMount
   * @method
   * @global
   */
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
      if (connection.isConnected) {
        /**
         * <code>authUnsubscribe</code> is defined inside the <code>componentDidMount</code><br/>
         * <br/>
         * When the browser is connect to internet, <code>authUnsubscribe</code> will:
         * <ol>
         *  <li>Create observer that listens to user's sign-in-sate change <code>onAuthStateChanged</code></li>
         *  <li><code>onAuthStateChanged</code> provides user object and return <code>unsubscribe()</code></li>
         *  <li>Check to see is there's user data.</li>
         *    <ul>
         *      <li>If no user data: Sign in anonymously</li>
         *      <li>If user data: Sets the state</li>
         *    </ul>
         * </ol>
         * @name authUnsubscribe
         */
        this.authUnsubscribe = firebase
          .auth()
          // onAuthStateChanged provides user object and returns unsubscribe
          .onAuthStateChanged(async (user) => {
            // Wait until user data is set. (This takes some time)
            // If no user data, sign in anonymously
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            // Save user's info on current session (state)
            this.setState({
              _id: user.uid,
              name,
              avatar: 'https://placeimg.com/140/140/any',
              isConnected: true,
            });

            // Creating reference that has current user's documents. Ordering them by date
            this.refAuthMessages = firebase
              .firestore()
              .collection('messages')
              .orderBy('createdAt', 'desc');

            // onSnapshot listens to changes on refAuthMessagese. It returns unsubscribe()
            /**
             * <code>unsubscribeMessages</code> is defined inside the componentDidMount<br/>
             * <br/>
             * Calls <code>onSnapshot</code> to listens to changes on Firestore collection
             * and executes <code>onCollectionUpdate</code><br/>
             * <code>onSnapshot</code> returns <code>unsubscribe()</code>
             * @name unsubscribeMessages
             */
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

  /**
   * <code>componentWillUnmount</code> will call <code>authUnsubscribe</code> and <code>authUnsubscribe</code>
   * before <code>Chat</code> is unmounted to unsubscribe from both user's sign-in-state and ref collection.
   * @method
   * @global
   */
  componentWillUnmount() {
    const { isConnected } = this.state;
    if (isConnected) {
      this.authUnsubscribe();
      this.unsubscribeMessages();
    }
  }

  /**
   * Receives reference of collection's snapshot and sets messages state that will be rendered via <code>GiftedChat</code>.
   * @param {Array} querySnapshot Array of objects that contains message data.
   * Message data can be accessed by <code>querySnapshot[i].data()</code>
   * @global
   * @method
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
   * This function keeps appending new messages to messages state for <code>GiftedChat</code> to render
   * all conversation to screen.<br/>
   * 2 functions are called in this method:<br/>
   * <ul>
   * <li>{@link saveMessages|saveMessages} to save messages data to <code>AsyncStorage</code></li><br/>
   * <li>{@link addMessages|addMessages} to add message data to collection reference</li>
   * </ul>
   * @param {Array} messages Suggested format: <br/>
   * <pre>
   * {
   *  _id: string,
   *  createdAt: date,
   *  text: string,
   *  user: object,
   *  location: object,
   *  image: string,
   *  system: boolean,
   * }
   * </pre>
   * @name onSend
   * @method
   * @global
   */
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.saveMessages();

        // Adding sent message data to message collection's reference -- Chat data format
        this.addMessages();
      }
    );
  }

  // If offline, get messages from AsyncStorage
  /**
   * Loads message data from <code>messages</code> array in <code>AsyncStorage</code> when offline.
   * @name getMessages
   * @global
   * @method
   * @async
   */
  getMessages = async () => {
    let messages = [];
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
  /**
   * Saves message data to <code>messages</code> array in <code>AsyncStorage</code>
   * This helps to load messages faster and accessible while offline.
   * @saveMessages
   * @method
   * @global
   * @async
   */
  saveMessages = async () => {
    const { messages } = this.state;
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // deleteMessages = async () => {
  //   try {
  //     await AsyncStorage.removeItem('messages');
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  /**
   * Get message data from current state and add is to Firestore collection.
   * Undefined fields from message data will be saved as <code>''</code> execpt <code>_id</code> <br/>
   * When <code>_id</code> is empty, it will be given <code>Math.random().toString()</code>
   * @name addMessages
   * @global
   * @method
   */
  addMessages() {
    const message = this.state.messages[0];
    this.refMessages.add({
      _id: message._id || Math.random().toString(),
      createdAt: message.createdAt,
      text: message.text || '',
      user: message.user || '',
      location: message.location || '',
      image: message.image || '',
      system: message.system || '',
    });
  }

  // Do not render InputToolbar when offline
  /**
   * InputToolbar will not show when offline.
   * @param {Object} props GiftedChat's props
   * @returns {Component} <code>InputTollbar</code> component
   * @name renderInputToolbar
   * @global
   * @method
   */
  renderInputToolbar(props) {
    const { isConnected } = this.state;
    if (isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  /**
   * Shows available actions when pressed action button (+ button)
   * @param {props} props GiftedChat's prop
   */
  renderCustomActions = (props) => <CustomActions {...props} />;

  /**
   * Defining custom view for location share. <code>MapView</code> component of
   * <code>react-native-map</code> is used to render user's location.
   * @param {props} props GiftedChat's props. It will show user's current location. <br/>
   * width: 150, height: 100
   * @method
   * @global
   * @returns {Component} <code>MapView</code> Component
   */
  renderCustomView(props) {
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
  /**
   * Renders message's image with customized style. This method uses <code>ImageModal</code> component of <code>{@link https://github.com/dev-yakuza/react-native-image-modal| image modal}</code>
   * @param {props} props GiftedChat's props
   * @method
   * @global
   * @returns {Component} ImageModal
   *
   */
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

  /**
   * Renders chat bubble with customized style.
   * @param {props} props GiftedChat's props
   * @returns {Component} Bubble
   */
  renderBubble(props) {
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
    // this.deleteMessages();
    return (
      <View
        accessibilityLabel="You've clicked the background... Left side shows opponent's message... Right side shows my message"
        style={[styles.chatContainer, { backgroundColor: route.params.color }]}>
        <GiftedChat
          renderBubble={this.renderBubble}
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

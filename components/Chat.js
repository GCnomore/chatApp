import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      _id: '',
      avatar: '',
      name: '',
    };

    var firebaseConfig = {
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
    console.log('const', this.state);
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];

    // Go through each snapshots and add those data to current session (state)
    querySnapshot.forEach((message) => {
      var data = message.data();

      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: {
          _id: data.user._id,
          avatar: data.user.avatar,
          name: data.user.name,
          system: data.user.system,
        },
      });
    });
    this.setState({ messages });
  };

  onSend(messages = []) {
    /*
      This func keeps appending previous message and new message to GiftedChat
      to render all conversation to screen.    
    */
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.saveMessages();
      }
    );

    // Adding sent message data to message collection's reference
    this.refMessages.add({
      _id: messages[0]._id,
      createdAt: messages[0].createdAt,
      text: messages[0].text,
      user: {
        _id: messages[0].user._id,
        name: messages[0].user.name,
        avatar: messages[0].user.avatar,
      },
    });
  }

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
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  // Do not render InputToolbar when offline
  renderInputToolbar(props) {
    console.log('rnder input', this.state);
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  componentDidMount() {
    console.log('mount', this.state);
    // Created reference for adding data purpose
    this.refMessages = firebase.firestore().collection('messages');

    // Setting setOptions' title to show current user's name on the nav bar
    var name = this.props.route.params.userName;
    this.props.navigation.setOptions({ title: name });

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
            });

            // Creating reference that has current user's documents. Ordering them by date
            this.refAuthMessages = firebase
              .firestore()
              .collection('messages')
              .orderBy('createdAt', 'desc');

            // Calling onCollectionsUpdate when current user's data changes (when received/sent new messages)
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
    if (this.state.isConnected) {
      this.authUnsubscribe();
      this.unsubscribeMessages();
    }
  }

  render() {
    console.log('render', this.state);
    return (
      <View
        accessibilityLabel="You've clicked the background... Left side shows opponent's message... Right side shows my message"
        style={[
          styles.chatContainer,
          { backgroundColor: this.props.route.params.color },
        ]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state._id,
            name: this.state.name,
            avatar: this.state.avatar,
          }}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
        />
        {/* This is for Android OS to avoid the keyboard blocking the visibility of input area  */}
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior='height' />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
});

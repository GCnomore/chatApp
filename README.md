# KOKOA TALK
##### React-Native Chat App Using GiftedChat
- **KOKOA TALK** is a chat application built using GiftedChat that allows users to send text messages, images from their     library, photo taken using their camera, and share their current location.
- Uses **Firebase/Firestore** to store message data

### Installation
Clone this repository to your local directory.
`git clone https://github.com/GCnomore/chatApp.git`

Then run `npm install` to install dependencies.

### Dependencies & versions used
```  
    "@react-native-community/async-storage": "~1.12.0",
    "@react-native-community/masked-view": "0.1.10",
    "@react-native-community/netinfo": "5.9.6",
    "@react-navigation/native": "^5.8.10",
    "@react-navigation/stack": "^5.12.8",
    "expo": "^39.0.0",
    "expo-image-picker": "~9.1.1",
    "expo-location": "~9.0.0",
    "expo-permissions": "~9.3.0",
    "expo-status-bar": "~1.0.2",
    "firebase": "^7.9.0",
    "react": "16.13.1",
    "react-dom": "16.13.1",
    "react-native": "https://github.com/expo/react-native/archive/sdk-39.0.3.tar.gz",
    "react-native-gesture-handler": "~1.7.0",
    "react-native-gifted-chat": "^0.16.3",
    "react-native-image-modal": "^1.0.15",
    "react-native-maps": "0.27.1",
    "react-native-reanimated": "~1.13.0",
    "react-native-safe-area-context": "3.1.4",
    "react-native-screens": "~2.10.1",
    "react-native-svg-transformer": "^0.14.3",
    "react-native-web": "~0.13.7",
    "react-navigation": "^4.4.3" 
```


### Setup Firestore

-  Go to https://firebase.google.com/
-  Create an account if you don't have a Google account.
-  Once logged in with your Google account, click **Get Started**
-  Give you project a name and follow along the instruction to create project.
-  Click on **Develop** from the menu on the left-hand side and click **Cloud Firestore**.
-  Click **Create database**.
-  2 options show: **Production mode** and **Test mode** (Choose test mode to try it out)
-  Choose the location that is relevant (This will be the location of users of your app)
-  Finish creating the collection by following along the instruction.
-  The **default collection name** for KOKOA TALK is **messages**
-  Create an example document that will be rendered on your initial launch of KOKOA TALK.


### Configure Firebase
- From your Firebase page, click the gear icon and click **Project Settings**
- Under **Your App* section, click **Firestore for Web or </> icon**
- Fill in the name of your project and click **Register**
- Copy the config object and paste it in **Chat.js**
```
export default class Chat extends React.Component {
    const firebaseConfig = {
      apiKey,
      authDomain,
      databaseURL,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
      measurementId,
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }
```
##### Kanban Board
https://trello.com/b/zM3uptbW/chat-app-kanban


![](https://github.com/GCnomore/chatApp/blob/master/assets/Screenshot_1607649101.png?raw=false)

import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Header,
  View,
  Icon,
  Fab,
  Text,
  Left,
  Body,
  Right,
  Button,
  Title,
} from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Amplify, { Analytics, Interactions } from 'aws-amplify';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);

const botUser = {
  _id: 2,
  name: 'React Native',
  avatar:
    'https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_960_720.png',
};
let chatId = 1;

const botconfig = {
  name: 'BookTrip_dev',
  alias: '$LATEST',
  region: 'us-east-1',
};

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef();

  const loadFonts = async () => {
    // for native-base
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    setIsLoading(!isLoading);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Stack.Navigator mode='modal'>
          <Stack.Screen
            name='Home'
            component={HomeScreen}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name='Chat'
            component={ChatScreen}
            options={() => ({
              headerShown: false,
            })}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <Container>
      <Header>
        <Body>
          <Title>Lex Demo</Title>
        </Body>
      </Header>
      <View style={{ flex: 1 }}>
        <Fab
          direction='up'
          containerStyle={{}}
          style={{ backgroundColor: '#5067FF' }}
          position='bottomRight'
          onPress={() => navigation.navigate('Chat')}
        >
          <Icon name='md-chatbubbles' />
        </Fab>
      </View>
    </Container>
  );
}

function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      _id: chatId,
      text:
        'Hello developer, this is a BookTrip Lex Chatbot. Try "I want to reserve a hotel for tonight"',
      user: botUser,
      createdAt: new Date(),
    },
  ]);

  sendMessageToBot = async (userInput) => {
    // Provide a bot name and user input
    const response = await Interactions.send(botconfig.name, userInput);

    // Log chatbot response
    appendChatMessages([formatMessage(response.message)]);
    Analytics.record('sendMessageToBot');
  };

  formatMessage = (message) => {
    chatId = chatId + 1;
    return {
      _id: chatId,
      createdAt: new Date(),
      text: message,
      user: botUser,
    };
  };

  onSend = (messages) => {
    messages.map((msg) => sendMessageToBot(msg.text));
    appendChatMessages(messages);
  };

  appendChatMessages = (newMessages) => {
    setMessages(GiftedChat.append(messages, newMessages));
  };

  return (
    <Container>
      <Header>
        <Left />
        <Body>
          <Title>Chat</Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon name='close' onPress={() => navigation.goBack()} />
          </Button>
        </Right>
      </Header>
      <GiftedChat
        messages={messages}
        onSend={(m) => onSend(m)}
        user={{
          _id: 1,
        }}
      />
    </Container>
  );
}

function LoadingScreen() {
  return (
    <Container>
      <Header />
      <Text>Loading</Text>
    </Container>
  );
}

export default App;

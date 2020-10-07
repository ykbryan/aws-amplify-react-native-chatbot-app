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
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
        <Stack.Navigator
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
          mode='modal'
        >
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
      <Text>Chat Screen</Text>
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

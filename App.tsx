import React, { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import AppNavigator from './src/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './src/screens/auth/StartScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import { RootStackParamList } from './src/types';
import { AuthProvider } from './src/context/authContext';
import messaging from  '@react-native-firebase/messaging';
import { Alert } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

function App() {  
  const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  }
  useEffect(() => {
    requestUserPermission().then(() => {
      messaging()
        .getToken()
        .then((token) => {
          console.log('FCM Token:', token);
        })
        .catch((error) => {
          console.error('Error fetching FCM Token:', error);
        });
    }).catch(() => {
      console.log('Permission not granted');
    });

    messaging()
      .getInitialNotification()
      .then( async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      })

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const { title, body } = remoteMessage.notification || {}; 
      if (title && body) {
        Alert.alert(
          title,  
          body,   
          [
            {
              text: 'OK',
              onPress: () => console.log('User pressed OK'),
            },
          ],
          { cancelable: false } 
        );
      }
    });

    return unsubscribe;
  }, []);
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Start' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Start' component={StartScreen} />
          <Stack.Screen name='SignIn' component={SignInScreen} />
          <Stack.Screen name='SignUp' component={SignUpScreen} />
          <Stack.Screen name='Home' component={AppNavigator} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  )
}

export default registerRootComponent(App);
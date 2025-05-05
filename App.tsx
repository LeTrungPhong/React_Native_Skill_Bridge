import React from 'react';
import { registerRootComponent } from 'expo';
import AppNavigator from './src/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './src/screens/auth/StartScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import { RootStackParamList } from './src/types';
import { AuthProvider } from './src/context/authContext';

const Stack = createStackNavigator<RootStackParamList>();

function App() {  
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
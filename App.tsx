import React from 'react';
import { registerRootComponent } from 'expo';
import AppNavigator from './src/AppNavigator';

function App() {
  return <AppNavigator />;
}

export default registerRootComponent(App);
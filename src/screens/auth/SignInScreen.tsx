import api from '@/src/api/axios';
import { AuthContext } from '@/src/context/authContext';
import { IUserAsyncStorage, RootStackParamList } from '@/src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { push } from 'expo-router/build/global-state/routing';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

interface SignInScreenProps {
  navigation: SignInScreenNavigationProp;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useContext(AuthContext);

  useEffect(() => {
    if (state) {
      console.log('Sign In Screen: State updated:', state);
    }
  }, [state]);

  const handleSignIn = async () => {
    console.log('Login info:', { username, password });

    try {
      // Gọi API đăng nhập ở đây
      if (!username || !password) {
        alert('Please enter your username and password.');
        return;
      }

      const response = await api.post('/log-in', { username, password });
      const newLogin: IUserAsyncStorage = {
        ...response.data.result,
        expiresAt: new Date((new Date()).getTime() + 30 * 60 * 1000).toISOString()
      };
      
      await AsyncStorage.setItem('@auth', JSON.stringify(newLogin)); // Lưu token vào AsyncStorage
      
      // Recent logins 
      const existingLoginsJson = await AsyncStorage.getItem('recentLogins');
      let recentLogins: IUserAsyncStorage[] = existingLoginsJson ? JSON.parse(existingLoginsJson) : [];
      const existingLoginId = recentLogins.findIndex((login: IUserAsyncStorage) => login.info.id === newLogin.info.id);
      if(existingLoginId !== -1){
        recentLogins[existingLoginId] = newLogin;
      }else{
        recentLogins.push(newLogin);
      }
      await AsyncStorage.setItem('recentLogins', JSON.stringify(recentLogins.slice(-5)));

      setState({ 
        ...state, 
        token: newLogin.token, 
        info: {
          name: newLogin.info.name,
          id: newLogin.info.id,
          username: newLogin.info.username,
          email: newLogin.info.email,
          phone: newLogin.info.phone,
          role: newLogin.info.role,
        } 
      });

      // console.log('state:', state);
      // console.log('Đăng nhập thành công:', response.data);
      navigation.navigate('Home');

    } catch (error) {
      console.error('Error login:', error);
      alert('Login failed. Please check your account information.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>SIGN IN</Text>
        
        <TextInput
          style={styles.input}
          placeholder='Username'
          value={username}
          onChangeText={setUsername}
          autoCapitalize='none'
        />
        
        <TextInput
          style={styles.input}
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => {
            handleSignIn();
          }}
        >
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  cancelButton: {
    paddingVertical: 5,
  },
  cancelText: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: '#5E5CFF',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
  },
});

export default SignInScreen;
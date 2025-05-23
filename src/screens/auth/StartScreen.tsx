import { AuthContext } from '@/src/context/authContext';
import { IUser, IUserAsyncStorage, RootStackParamList } from '@/src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native'; // Sửa import từ đây
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';

type StartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Start'>;

interface StartScreenProps {
  navigation: StartScreenNavigationProp;
}

const getRecentLogins = async () => {
  try {
    const existingLoginsJson = await AsyncStorage.getItem('recentLogins');
    let recentLogins: IUserAsyncStorage[] = existingLoginsJson ? JSON.parse(existingLoginsJson) : [];

    const validLogins = recentLogins.filter((login: any) => {
      const expiresTime = new Date(login.expiresAt);
      const currentTime = new Date();
      return expiresTime > currentTime;
    });
    
    console.log('Valid logins after filter:', validLogins);
    
    if (validLogins.length !== recentLogins.length) {
      await AsyncStorage.setItem('recentLogins', JSON.stringify(validLogins));
    }
    
    return validLogins;
  } catch (error) {
    console.error('Error getting recent logins:', error);
    return [];
  }
};

const COLORS = [
  '#5DADE2', 
  '#F5B041',
  '#58D68D',
  '#BB8FCE',
  '#EC7063',
  '#45B39D',
  '#AF7AC5',
  '#5499C7',
  '#52BE80',
  '#F4D03F',
];

// Get random color
const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
};

const StartScreen = ({ navigation }: StartScreenProps) => {
  const [state, setState] = useContext(AuthContext);
  const [users, setUsers] = useState<IUserAsyncStorage[]>([]);
  
  useFocusEffect(
    useCallback(() => {
      const fetchRecentLogins = async () => {
        const recentLogins = await getRecentLogins();
        setUsers(recentLogins);
      };
      
      fetchRecentLogins();
      return () => {};
    }, [])
  );

  useEffect(() => {
    console.log('Start Screen: State updated:', state);
  }, [users]);

  const saveAuth = async (user: any) => {
    try {

      const loginUser: IUser = {
        token: user.token,
        info: {
          id: user.info.id,
          name: user.info.name,
          username: user.info.username,
          email: user.info.email,
          phone: user.info.phone,
          role: user.info.role,
        },
      };

      if (loginUser.token == "") {
        navigation.navigate('SignIn');
        return;
      }

      await AsyncStorage.setItem('@auth', JSON.stringify(loginUser));
      console.log()
      setState({ 
        ...state, 
        ...loginUser,
      });

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving auth:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
      <View style={styles.header}>
        <Text style={styles.title}>SKILL BRIDGE</Text>
      </View>
      
      <ScrollView style={styles.userList}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/skillBridge.png')}
            style={styles.logo}
            resizeMode='contain'
          />
        </View>
  
        {users && users.length > 0 ? (
          users.map((user: any, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.userItem}
              onPress={() => {
                saveAuth(user);
              }}
            >
              <View style={[styles.avatar, { backgroundColor: getRandomColor() }]}>
                <Text style={styles.avatarText}>{user.info.name.charAt(0) || "U"}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{user.info.name || "User"}</Text>
                <Text style={styles.username}>{user.info.username || ""}</Text>
              </View>
              {user.token === "" && (
                <View style={styles.loggedOutContainer}>
                  <Text style={styles.loggedOutText}>đã log out</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noRecentLogins}>No recent logins</Text>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.alternateSignIn}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.alternateSignInText}>Sign in with another account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signUpButtonText}>Sign up for free</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#5E5CFF',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
    padding: 20,
  },
  userList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
  },
  alternateSignIn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  alternateSignInText: {
    color: '#5E5CFF',
    fontSize: 16,
  },
  signUpButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#5E5CFF',
  },
  signUpButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  noRecentLogins: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
  loggedOutText: {
    color: '#FF5252',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  loggedOutContainer: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
  },
});

export default StartScreen;
import { RootStackParamList } from '@/src/types';
import { StackNavigationProp } from '@react-navigation/stack';
<<<<<<< Updated upstream
import React, { useMemo } from 'react';
=======
import { useFocusEffect } from '@react-navigation/native'; // Sửa import từ đây
import React, { useCallback, useContext, useEffect, useState } from 'react';
>>>>>>> Stashed changes
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';

type StartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Start'>;

interface StartScreenProps {
  navigation: StartScreenNavigationProp;
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
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

<<<<<<< Updated upstream
  // Get random color
  const getRandomColor = (): string => {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    return COLORS[randomIndex];
=======
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
>>>>>>> Stashed changes
  };

  // Mock data for users
  const users = [
    { id: 1, name: 'Vo Thanh Tu', email: 'thanhtu@gmail.com', password: '12345' },
    { id: 2, name: 'Duong Quang Minh Hoang', email: 'hoangduong@gmail.com', password: '12345' },
    { id: 3, name: 'Nguyen Thanh Trung', email: 'trung@gmail.com', password: '12345' },
    { id: 4, name: 'Le Trung Phong', email: 'phong@gmail.com', password: '12345' },
  ];

  const usersWithColors = useMemo(() => {
    return users.map(user => ({
      ...user,
      color: getRandomColor()
    }));
  }, []);

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
  
<<<<<<< Updated upstream
        {usersWithColors.map((user) => (
          <TouchableOpacity 
            key={user.id} style={styles.userItem}
            onPress={() => navigation.navigate('Home')}
          >
            <View style={[styles.avatar, { backgroundColor: user.color }]}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.email}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </TouchableOpacity>
          
        ))}
=======
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
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noRecentLogins}>No recent logins</Text>
        )}
>>>>>>> Stashed changes
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
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
  },
  userEmail: {
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
});

export default StartScreen;
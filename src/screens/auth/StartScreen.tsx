import { RootStackParamList } from '@/src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';

type StartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Start'>;

interface StartScreenProps {
  navigation: StartScreenNavigationProp;
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  const colors = [
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
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
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
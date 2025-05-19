import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { apiJson } from '../api/axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IUserAsyncStorage, RootStackParamList } from '@/src/types';
import { useContext } from 'react';
import { AuthContext } from '@/src/context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MoreScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
}

function MenuItem({ icon, title, onPress }: MenuItemProps) {
  const colorScheme = useColorScheme();
  
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons 
        name={icon as any} 
        size={24} 
        style={styles.menuIcon} 
      />
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
      />
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<MoreScreenNavigationProp>();
  const [state, setState] = useContext(AuthContext);

  const handleLogout = async () => {
    try {

      // console.log('Logging out...', state.token);

      const existingLoginsJson = await AsyncStorage.getItem('recentLogins');
      let recentLogins: IUserAsyncStorage[] = existingLoginsJson ? JSON.parse(existingLoginsJson) : [];
      // console.log('existingLoginsJson', existingLoginsJson);

      // Find the current user in recentLogins and set their token to empty string
      const updatedLogins = recentLogins.map(login => {
        if (login.token === state.token) {
          return { ...login, token: "" };
        }
        return login;
      });
      await AsyncStorage.setItem('recentLogins', JSON.stringify(updatedLogins));
      
      // Call logout API
      await apiJson.post('/log-out', {
        token: state.token,
      });

      console.log('Logged out');
      
      // Clear authentication state
      setState({
        info: {
          id: null,
          username: null,
          name: null,
          email: null,
          phone: null,
          role: null,
        },
        token: "",
      });
      
      // Remove auth data from AsyncStorage
      await AsyncStorage.removeItem('@auth');
      
      // Navigate to Start screen
      navigation.navigate('Start');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <BlurView 
        intensity={80} 
        style={styles.header} 
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
      >
        <Text style={styles.title}>More</Text>
      </BlurView>
      <View style={styles.content}>
        <MenuItem 
          icon="person-outline" 
          title="Profile" 
          onPress={() => console.log('Profile pressed')} 
        />
        <MenuItem 
          icon="notifications-outline" 
          title="Notifications" 
          onPress={() => console.log('Notifications pressed')} 
        />
        <MenuItem 
          icon="help-circle-outline" 
          title="Help & Support" 
          onPress={() => console.log('Help pressed')} 
        />
        <MenuItem 
          icon="information-circle-outline" 
          title="About" 
          onPress={() => console.log('About pressed')} 
        />
        <MenuItem 
          icon="settings-outline" 
          title="Log out" 
          onPress={handleLogout} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
}); 
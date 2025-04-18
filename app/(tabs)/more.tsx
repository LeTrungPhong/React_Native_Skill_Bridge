import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

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
          icon="settings-outline" 
          title="Settings" 
          onPress={() => console.log('Settings pressed')} 
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
import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/src/hooks/useColorScheme';

export default function AssignmentScreen() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <BlurView 
        intensity={80} 
        style={styles.header} 
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
      >
        <Text style={styles.title}>Assignment</Text>
      </BlurView>
      <View style={styles.content}>
        <Text>Your assignments will appear here</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
}); 
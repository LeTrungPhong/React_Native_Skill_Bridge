import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  useColorScheme
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IActivity } from '../../types';
import ActivityItem from '../../components/activities/ActivityItem';

// type ActivityScreenNavigationProp = StackNavigationProp<
//   { 
//     ActivityScreen: undefined; 
//     ActivityDetailScreen: { activity: IActivity };
//   }, 
//   'ActivityScreen'
// >;

const ACTIVITIES: IActivity[] = [
  {
    id: '1',
    title: 'New Assignment Posted',
    content: 'You have a new assignment in the Math group.',
    timestamp: '2025-04-20T08:30:00Z',
    group: 'Math Group',
  },
  {
    id: '2',
    title: 'Team Meeting Reminder',
    content: 'Your weekly team meeting starts in 30 minutes.',
    timestamp: '2025-04-20T07:00:00Z',
    group: 'Project Team A',
  },
  {
    id: '3',
    title: 'System Update',
    content: 'Skill Bridge app was updated to version 2.1.',
    timestamp: '2025-04-19T21:15:00Z',
    group: 'Project Team A',
  },
  {
    id: '4',
    title: 'New Message',
    content: 'Anna sent you a message in the Chat.',
    timestamp: '2025-04-19T18:45:00Z',
    group: 'Chat',
  },
  {
    id: '5',
    title: 'Submission Deadline',
    content: 'Your assignment is due in 2 hours!',
    timestamp: '2025-04-19T15:00:00Z',
    group: 'English Group',
  },
];

const ActivityScreen = () => {
  const colorScheme = useColorScheme();
  const [activities] = useState<IActivity[]>(ACTIVITIES);

  const renderActivityItem = ({ item }: { item: IActivity }) => (
    <ActivityItem 
      activity={item} 
      onPress={() => {
        console.log(`Selected activity: ${item.id}`);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <BlurView
        intensity={80}
        style={styles.header}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
      >
        <Text style={styles.title}>Activities</Text>
        <View style={styles.searchBar}>
          <Ionicons
            name='search'
            size={20}
            style={styles.searchIcon}
          />
          <Text style={styles.searchText}>Search</Text>
        </View>
      </BlurView>

      <FlatList
        data={activities}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
    color: '#888',
  },
  searchText: {
    color: '#888',
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  }
});

export default ActivityScreen;
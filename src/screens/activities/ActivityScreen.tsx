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
import { IActivity } from '../../types';
import ActivityItem from '../../components/activities/ActivityItem';


const ActivityScreen = () => {
  const colorScheme = useColorScheme();
  const [activities] = useState<IActivity[]>();

  const renderActivityItem = ({ item }: { item: IActivity }) => (
    <ActivityItem 
      activity={item}
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
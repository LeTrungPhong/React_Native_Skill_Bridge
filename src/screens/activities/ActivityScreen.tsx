import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Alert,
  TouchableOpacity
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { IActivity } from '../../types';
import ActivityItem from '../../components/activities/ActivityItem';
import { apiJson } from '@/src/api/axios';
import { TextInput } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";

type ActivityScreenNavigationProp = StackNavigationProp<
  { 
    ActivityScreen: undefined; 
    ActivityDetailScreen: { activity: IActivity };
  }, 
  'ActivityScreen'
>;

const ActivityScreen = () => {
  const navigation = useNavigation<ActivityScreenNavigationProp>();

  const [activities, setActivities] = useState<IActivity[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    try{
      const res = await apiJson.get('/notification');
      if(res && res.data.result){
        setActivities(res.data.result);
      }
    }catch(error){
      console.error('Error fetching activities:', error);
      Alert.alert('Error', 'Failed to fetch activities.');
      setActivities([]);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [])
  );

  // Filter activities based on search text
  const filteredActivities = searchText ? 
    activities.filter(activity => 
      activity.title.toLowerCase().includes(searchText.toLowerCase()) ||
      activity.body.toLowerCase().includes(searchText.toLowerCase())
    ) :
    activities;

  const renderActivityItem = ({ item }: { item: IActivity }) => (
    <ActivityItem
      activity={item}
      onPress={() => {
        navigation.navigate('ActivityDetailScreen', { activity: item });
      }}
    />
  );

  return (
    <View style={styles.container}>
      <BlurView
        intensity={80}
        style={styles.header}
      >
        <Text style={styles.title}>Activities</Text>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchText}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#888"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>

      {loading ? (
        <View style={styles.content}>
          <Text>Loading activities...</Text>
        </View>
      ) : filteredActivities.length > 0 ? (
        <FlatList
          data={filteredActivities}
          renderItem={renderActivityItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.content}>
          <Text style={styles.noActivitiesText}>
            {searchText 
              ? 'No activities match your search.' 
              : 'There are no activities at this time.'}
          </Text>
        </View>
      )}
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
  },
  searchText: {
    color: '#888',
    flex: 1,
    padding: -5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  noActivitiesText: {
    marginTop: 16,
    color: '#555',
    fontSize: 16,
  },
});

export default ActivityScreen;
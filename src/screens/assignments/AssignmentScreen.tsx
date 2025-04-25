import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  useColorScheme
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UpcomingScreen from './UpcomingScreen';
import OverdueScreen from './OverdueScreen';
import CompletedScreen from './CompletedScreen';
import { createStackNavigator } from '@react-navigation/stack';
import AssignmentDetailScreen from './AssignmentDetailScreen';

const TobTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const AssignmentTabs = () =>{
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <BlurView
        intensity={80}
        style={styles.header}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
      >
        <Text style={styles.title}>Assignments</Text>
        <View style={styles.searchBar}>
          <Ionicons
            name='search'
            size={20}
            style={styles.searchIcon}
          />
          <Text style={styles.searchText}>Search</Text>
        </View>
      </BlurView>

      <TobTab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'blue',
          tabBarIndicatorStyle: {
            backgroundColor: 'blue',
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          }, 
        }}>

        <TobTab.Screen 
          name='UpcomingScreen' 
          component={ UpcomingScreen } 
          options={{ 
            title: 'Upcoming'
          }} 
        />
        
        <TobTab.Screen 
          name='OverdueScreen' 
          component={ OverdueScreen } 
          options={{ 
            title: 'Overdue' 
          }} 
        />
        
        <TobTab.Screen 
          name='CompletedScreen' 
          component={ CompletedScreen } 
          options={{ 
            title: 'Completed' 
          }} 
        />
      </TobTab.Navigator>
    </View>
  );
};

const AssignmentScreen = () => {
  
  const navigation = useNavigation();

  useFocusEffect(() => {
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          paddingTop: 10,
          paddingBottom: 10,
          height: 70,
          borderTopColor: 'gray',
        },
      });
    };
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='AssignmentTabs'
        component={AssignmentTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='AssignmentDetailScreen'
        component={AssignmentDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

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
});

export default AssignmentScreen;
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your screen components
import ActivityScreen from './screens/ActivityScreen';
import AssignmentScreen from './screens/AssignmentScreen';
import ChatScreen from './screens/ChatScreen';
import TeamsScreen from './screens/TeamsScreen';
import MoreScreen from './screens/MoreScreen';

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        paddingTop: 10,
                        paddingBottom: 10,
                        height: 70,
                    },
                }}>
                <Tab.Screen
                    name="activity"
                    component={ActivityScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="notifications-outline" size={size} color={color} />
                        ),
                        title: 'Activity',
                    }}
                />
                <Tab.Screen
                    name="assignment"
                    component={AssignmentScreen} options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="assignment" size={size} color={color} />
                        ),
                        title: 'Assignment',
                    }} />
                <Tab.Screen
                    name="teams"
                    component={TeamsScreen} options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="people-sharp" size={size} color={color} />
                        ),
                        title: 'Teams',
                    }} />
                <Tab.Screen
                    name="chat"
                    component={ChatScreen} options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
                        ),
                        title: 'Chat',
                    }} />
                <Tab.Screen
                    name="more"
                    component={MoreScreen} options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="more" size={size} color={color} />
                        ),
                        title: 'More',
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
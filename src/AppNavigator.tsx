import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your screen components
import ActivityScreen from './screens/ActivityScreen';
import AssignmentScreen from './screens/AssignmentScreen';
import ChatScreen from './screens/ChatScreen';
import TeamsScreen from './screens/teams/TeamsScreen';
import MoreScreen from './screens/MoreScreen';

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import GeneralScreen from './screens/teams/GeneralScreen';
import { TeamsStackParamList } from './navigation/type';

const Tab = createBottomTabNavigator();

const TeamsStack = createStackNavigator();

const TeamsStackScreen = () => (
    <TeamsStack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <TeamsStack.Screen name="TeamsList" component={TeamsScreen}  />
        <TeamsStack.Screen name="GeneralScreen" component={GeneralScreen}  />
    </TeamsStack.Navigator>
);

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        paddingTop: 10,
                        paddingBottom: 10,
                        height: 70,
                        borderTopColor: 'gray',
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
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="assignment"
                    component={AssignmentScreen} options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="assignment" size={size} color={color} />
                        ),
                        title: 'Assignment',
                        headerShown: false,
                    }} />
                <Tab.Screen
                    name="teams"
                    component={TeamsStackScreen} options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="people-sharp" size={size} color={color} />
                        ),
                        title: 'Teams',
                        headerShown: false,
                    }} />
                <Tab.Screen
                    name="chat"
                    component={ChatScreen} options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
                        ),
                        title: 'Chat',
                        headerShown: false,
                    }} />
                <Tab.Screen
                    name="more"
                    component={MoreScreen} options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="more" size={size} color={color} />
                        ),
                        title: 'More',
                        headerShown: false,
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
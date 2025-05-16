import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ActivityScreen from './screens/activities/ActivityScreen';
import ChatScreen from './screens/chat/ChatScreen';
import TeamsScreen from './screens/teams/TeamsScreen';
import MoreScreen from './screens/MoreScreen';
import { createStackNavigator } from '@react-navigation/stack';
import GeneralScreen from './screens/teams/GeneralScreen';
import ChatDetailScreen from './screens/chat/ChatDetailScreen';
import AssignmentScreen from './screens/assignments/AssignmentScreen';
import LessonDetailScreen from './screens/teams/LessonDetailScreen';
import AssignmentDetailScreen from './screens/assignments/AssignmentDetailScreen';

const Tab = createBottomTabNavigator();

const ChatStack = createStackNavigator();

const ChatStackScreen = () => (
    <ChatStack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <ChatStack.Screen name='ChatScreen' component={ChatScreen}  />
        <ChatStack.Screen name='ChatDetailScreen' component={ChatDetailScreen}  />
    </ChatStack.Navigator> 
);

const TeamsStack = createStackNavigator();

const TeamsStackScreen = () => (
    <TeamsStack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <TeamsStack.Screen name='TeamsList' component={TeamsScreen}  />
        <TeamsStack.Screen name='GeneralScreen' component={GeneralScreen}  />
        <TeamsStack.Screen name='LessonDetailScreen' component={LessonDetailScreen}  />
    </TeamsStack.Navigator>
);

const AssignmentStack = createStackNavigator();
const AssignmentStackScreen = () => (
    <AssignmentStack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <AssignmentStack.Screen name='AssignmentHome' component={AssignmentScreen} />
        <AssignmentStack.Screen name='AssignmentDetailScreen' component={AssignmentDetailScreen} />
    </AssignmentStack.Navigator>
);

const AppNavigator = () => {
    return (
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
                name='activity'
                component={ActivityScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='notifications-outline' size={size} color={color} />
                    ),
                    title: 'Activity',
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name='assignment'
                component={AssignmentStackScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name='assignment' size={size} color={color} />
                    ),
                    title: 'Assignments',
                    headerShown: false,
                }} />
            <Tab.Screen
                name='teams'
                component={TeamsStackScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='people-sharp' size={size} color={color} />
                    ),
                    title: 'Teams',
                    headerShown: false,
                }} />
            <Tab.Screen
                name='chat'
                component={ChatStackScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='chatbubble-ellipses-outline' size={size} color={color} />
                    ),
                    title: 'Chat',
                    headerShown: false,
                }} />
            <Tab.Screen
                name='more'
                component={MoreScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name='more' size={size} color={color} />
                    ),
                    title: 'More',
                    headerShown: false,
                }} />
        </Tab.Navigator>
    );
};

export default AppNavigator;
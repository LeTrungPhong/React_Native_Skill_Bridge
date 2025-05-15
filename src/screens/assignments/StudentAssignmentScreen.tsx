import React, { useContext, useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  useColorScheme,
  Alert
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
import { AuthContext } from '@/src/context/authContext';
import { apiJson } from '@/src/api/axios';
import { IAssignment, IStudentSubmission } from '@/src/types';

const TobTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const AssignmentTabs = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  
  const [assignments, setAssignments] = useState<{
    upcoming: IAssignment[], 
    overdue: IAssignment[], 
    completed: IAssignment[]
  }>({
    upcoming: [],
    overdue: [],
    completed: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<{[key: string]: IStudentSubmission}>({});

  // Get classname 
  const getClassName = async(classId: string): Promise<string | undefined> => {
    try{
      const res = await apiJson.get(`/api/classes/${classId}`);
      if(res && res.data){
        const className = res.data.name;
        return className;
      }
      return undefined;
    }catch(error){
      console.error('Error getting class name:', error);
      Alert.alert('Error', 'Unable to fetch class.');
    }
  };

  const getStudentAssignmentSubmission = async(classId: string, assignmentId: string): Promise<IStudentSubmission | undefined> => {
    try {
      const res = await apiJson.get(`/api/assignment/${classId}/${assignmentId}`);
      
      if(res?.data?.result?.submission){
        const submissionData = res.data.result.submission;
        return {
          id: submissionData.id,
          submissionTime: submissionData.submissionTime,
          filesName: submissionData.filesNames,
          score: submissionData.score ? submissionData.score : undefined,
          feedback: submissionData.feedback ? submissionData.feedback : undefined,
        }
      } 
      
      return undefined;
    } catch(error) {
      console.error('Error fetching student assignment submission:', error);
      Alert.alert('Error', 'Unable to fetch assignment submission.');
      return undefined;
    }
  }

  // Fetch all assignments
  const fetchStudentAssignments = async () => {
    setIsLoading(true);
    try {
      const res = await apiJson.get(`/api/assignment`);

      if(res && res.data) {
        const data = res.data.result;
        const allSubmissions: {[key: string]: IStudentSubmission} = {};
        const upcomingAssignments: IAssignment[] = [];
        const overdueAssignments: IAssignment[] = [];
        const completedAssignments: IAssignment[] = [];
        
        // Current date for comparison
        const now = new Date();

        for (let item of data) {
          const className = await getClassName(item.classId);

          const assignment: IAssignment = {
            id: item.id,
            title: item.title,
            description: item.description,
            deadLine: item.deadLine,
            createBy: item.createBy,
            filesName: item.filesName,
            classId: item.classId,
            className: className ? className : 'Unknown Class',
          }

          // Get the submission for this assignment
          const submission = await getStudentAssignmentSubmission(item.classId, item.id);
          
          // Store submission data with assignment ID as key
          if (submission) {
            allSubmissions[item.id] = submission;
          }

          const deadline = new Date(assignment.deadLine);
          if (submission) {
            completedAssignments.push(assignment);
          } else if (deadline < now) {
            overdueAssignments.push(assignment);
          } else {
            upcomingAssignments.push(assignment);
          }
        }
        
        // Update state with all assignments and submissions
        setSubmissions(allSubmissions);
        setAssignments({
          upcoming: upcomingAssignments,
          overdue: overdueAssignments,
          completed: completedAssignments
        });
      } 
    } catch(error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch assignments when the component mounts
  useEffect(() => {
    fetchStudentAssignments();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("Screen in focus - reloading assignments data");
      fetchStudentAssignments();
      return () => {
        // cleanup if needed
      };
    }, [])
  );

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
          options={{ title: 'Upcoming' }}
        >
          {() => <UpcomingScreen 
            assignments={assignments.upcoming} 
            submissions={submissions} 
            isLoading={isLoading} 
          />}
        </TobTab.Screen>
        
        <TobTab.Screen 
          name='OverdueScreen' 
          options={{ title: 'Overdue' }}
        >
          {() => <OverdueScreen 
            assignments={assignments.overdue} 
            submissions={submissions} 
            isLoading={isLoading} 
          />}
        </TobTab.Screen>
        
        <TobTab.Screen 
          name='CompletedScreen' 
          options={{ title: 'Completed' }}
        >
          {() => <CompletedScreen 
            assignments={assignments.completed} 
            submissions={submissions} 
            isLoading={isLoading} 
          />}
        </TobTab.Screen>
      </TobTab.Navigator>
    </View>
  );
};

const StudentAssignmentScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

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

export default StudentAssignmentScreen;
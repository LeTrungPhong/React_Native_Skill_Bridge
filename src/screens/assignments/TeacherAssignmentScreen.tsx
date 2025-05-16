import React, { useContext, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Image,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IAssignment } from '@/src/types';
import AssignmentItem from '@/src/components/assignments/AssignmentItem';
import { AuthContext } from '@/src/context/authContext';
import { apiJson } from '@/src/api/axios';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

type TeacherAssignmentScreenNavigationProp = StackNavigationProp<
  { 
    TeacherAssignmentScreen: undefined; 
    AssignmentDetailScreen: { assignment: IAssignment };
  }, 
  'TeacherAssignmentScreen'
>;

const TeacherAssignmentScreen = () => {
  const navigation = useNavigation<TeacherAssignmentScreenNavigationProp>();
  const [state] = useContext(AuthContext);
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [classNames, setClassNames] = useState<{[key: string]: string}>({});
  const [searchText, setSearchText] = useState<string>('');

  // Get classname 
  const getClassName = async (classId: string): Promise<string> => {
    try {
      // Check if we already have this class name cached
      if (classNames[classId]) {
        return classNames[classId];
      }
      
      const res = await apiJson.get(`/api/classes/${classId}`);
      if (res && res.data) {
        const className = res.data.name;
        
        // Update our cache
        setClassNames(prev => ({
          ...prev,
          [classId]: className
        }));
        
        return className;
      }
      return 'Unknown Class';
    } catch (error: any) {
      console.error('Error getting class name:', {
        message: error.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      return 'Unknown Class';
    }
  };

  // Fetch all assignments
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await apiJson.get('/api/assignment/myCreate');
      
      if (res && res.data && res.data.result) {
        const allTeacherAssignments: IAssignment[] = [];
        
        // First create assignments with temp class names
        for (let item of res.data.result) {
          const assignment: IAssignment = {
            id: item.id,
            title: item.title,
            description: item.description,
            deadLine: item.deadLine,
            createBy: item.createBy,
            filesName: item.filesName,
            classId: item.classId,
            className: classNames[item.classId] || 'Loading classname...',
          };
          
          allTeacherAssignments.push(assignment);
        }
        
        // Set assignments immediately to show content
        setAssignments(allTeacherAssignments);
        
        // Then update class names one by one
        for (let i = 0; i < allTeacherAssignments.length; i++) {
          const item = allTeacherAssignments[i];
          const className = await getClassName(item.classId);
          
          setAssignments(current => 
            current.map(assignment => 
              assignment.id === item.id 
                ? { ...assignment, className } 
                : assignment
            )
          );
        }
      } else {
        setAssignments([]);
      }
    } catch (error: any) {
      console.error('Error fetching assignments:', {
        message: error.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      Alert.alert('Error', 'Failed to fetch assignments. Please try again.');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (classId: string, assignmentId: string) => {
    try {
      console.log('Delete assignment:', `/api/assignment/${classId}/${assignmentId}`);
      await apiJson.delete(`/api/assignment/${classId}/${assignmentId}`);
      // Re-fetch assignments after deletion
      fetchAssignments();
    } catch (error: any) {
      console.error('Error deleting assignment:', {
        message: error.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      Alert.alert('Error', 'Failed to delete assignment. Please try again.');
    }
  };

  // Render assignment item
  const renderAssignmentItem = ({ item }: { item: IAssignment }) => (
    <AssignmentItem
      assignment={item} 
      onPress={() => {
        console.log(`Selected assignment: ${item.id}`);
        navigation.navigate('AssignmentDetailScreen', { assignment: item });
      }}
      isTeacher={state.info.role === 'TEACHER'}
    />
  );

  // Filter assignments based on search text
  const filteredAssignments = searchText ? 
    assignments.filter(assignment => 
      assignment.title.toLowerCase().includes(searchText.toLowerCase())
    ) : 
    assignments;

  useEffect(() => {
    fetchAssignments();
    
    // Refresh assignments when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAssignments();
    });
    
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <BlurView
        intensity={80}
        style={styles.header}
      >
        <Text style={styles.title}>Assignments</Text>
        <View style={styles.searchBar}>
          <Ionicons
            name='search'
            size={20}
            style={styles.searchIcon}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TextInput
            style={styles.searchText}
            placeholder='Search assignments...'
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor='#888'
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name='close-circle' size={20} color='#888' />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>

      {loading ? (
        <View style={styles.content}>
          <Text>Loading assignments...</Text>
        </View>
      ) : filteredAssignments.length > 0 ? (
        <FlatList
          data={filteredAssignments}
          renderItem={renderAssignmentItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.content}>
          <Image
            source={require('../../assets/stackOfBooks.png')}
            resizeMode='cover'
          />
          <Text style={styles.noAssignmentsText}>
            {searchText 
              ? 'No assignments match your search.' 
              : 'There are no assignments at this time.'}
          </Text>
        </View>
      )}
    </View>
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
    padding: -5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  noAssignmentsText: {
    marginTop: 16,
    color: '#555',
    fontSize: 16,
  },
  button_add: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  formField: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
  },
});

export default TeacherAssignmentScreen;
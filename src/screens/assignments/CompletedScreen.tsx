import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  useColorScheme,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IDemooAssignment } from '@/src/types';
import AssignmentItem from '@/src/components/assignments/AssignmentItem';

type CompletedScreenNavigationProp = StackNavigationProp<
  { 
    AssignmentTabs: undefined; 
    AssignmentDetailScreen: { assignment: IDemooAssignment };
  }, 
  'AssignmentTabs'
>;

const ASSIGNMENTS: IDemooAssignment[] = [
  {
    id: '1',
    title: 'Code Review Assigned',
    content: 'You’ve been assigned to review PR #102.',
    submittedAt: '2025-04-22T17:30:00Z',
    deadline: '2025-04-24T17:00:00Z',
    group: 'Dev Team',
  },
  {
    id: '2',
    title: 'Resource Added',
    content: 'A new learning resource was added to your course.',
    submittedAt: '2025-04-22T14:20:00Z',
    deadline: '2025-04-28T23:59:59Z',
    group: 'Web Dev Bootcamp',
  },
  {
    id: '3',
    title: 'Upcoming Exam Reminder',
    content: 'Your midterm exam is scheduled for Monday morning.',
    submittedAt: '2025-04-21T12:00:00Z',
    deadline: '2025-04-28T08:00:00Z',
    group: 'CS101',
  },
];

const CompletedScreen = () => {
  const colorScheme = useColorScheme();
  const [assignments] = useState<IDemooAssignment[]>(ASSIGNMENTS);
  const navigation = useNavigation<CompletedScreenNavigationProp>();

  const renderAssignmentItem = ({ item }: { item: IDemooAssignment }) => (
    <AssignmentItem
      assignment={item} 
      onPress={() => {
        console.log(`Selected assignment: ${item.id}`);
        navigation.navigate('AssignmentDetailScreen', { assignment: item });
      }}
    />
  );

  return (
    <View style={styles.container}>
      { assignments.length !== 0 ? (
        <FlatList
          data={assignments}
          renderItem={renderAssignmentItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      ) : (
        <View style={styles.content}>
          <Image
            source={require('../../assets/stackOfBooks.png')}
            resizeMode='cover'
          />
          <Text>There are no submitted assignments at this time.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
  }
});

export default CompletedScreen;

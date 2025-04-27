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
import { IAssignment } from '@/src/types';
import TeamAssignmentItem from '@/src/components/teams/TeamAssignmentItem';

type TeamAssignmentScreenNavigationProp = StackNavigationProp<
  { 
    TeamAssignmentScreen: undefined; 
    AssignmentDetailScreen: { assignment: IAssignment };
  }, 
  'TeamAssignmentScreen'
>;

const ASSIGNMENTS: IAssignment[] = [
  {
    id: '1',
    title: 'Weekly Reflection',
    content: 'Write a reflection on what you learned this week.',
    deadline: '2025-04-23T23:59:59Z',
    timestamp: '2025-04-26T12:00:00Z',
    group: 'Self-Development',
  },
  {
    id: '2',
    title: 'Design Feedback Session',
    content: 'Join the design feedback meeting at 3 PM.',
    deadline: '2025-04-27T08:00:00Z',
    timestamp: '2025-04-26T10:00:00Z',
    group: 'UX Team',
  },
  {
    id: '3',
    title: 'Code Review Assigned',
    content: 'You’ve been assigned to review PR #102.',
    deadline: '2025-04-28T17:00:00Z',
    group: 'Dev Team',
  },
];

const TeamAssignmentScreen = () => {
  const colorScheme = useColorScheme();
  const [assignments] = useState<IAssignment[]>(ASSIGNMENTS);
  const navigation = useNavigation<TeamAssignmentScreenNavigationProp>();

  const renderAssignmentItem = ({ item }: { item: IAssignment }) => (
    <TeamAssignmentItem
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
          <Text>There are no assignments at this time.</Text>
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

export default TeamAssignmentScreen;

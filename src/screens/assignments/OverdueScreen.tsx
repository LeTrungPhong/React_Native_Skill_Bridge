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
import { IAssignment, IStudentSubmission } from '@/src/types';
import AssignmentItem from '@/src/components/assignments/AssignmentItem';

type OverdueScreenNavigationProp = StackNavigationProp<
  { 
    AssignmentTabs: undefined; 
    AssignmentDetailScreen: { assignment: IAssignment };
  }, 
  'AssignmentTabs'
>;

interface AssignmentProps {
  assignments: IAssignment[];
  submissions: { [key: string]: IStudentSubmission };
  isLoading: boolean;
}

const OverdueScreen = ({assignments, submissions, isLoading}: AssignmentProps) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<OverdueScreenNavigationProp>();

  console.log('OverdueScreen - assignments:', assignments);
  const renderAssignmentItem = ({ item }: { item: IAssignment }) => (
    <AssignmentItem
      assignment={item} 
      onPress={() => {
        console.log(`Selected assignment: ${item.id}`);
        navigation.navigate('AssignmentDetailScreen', { assignment: item });
      }}
      isTeacher={false}
    />
  );

return (
    <View style={styles.container}>
      {
        isLoading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          assignments.length !== 0 ? (
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
              <Text>There are no overdue assignments at this time.</Text>
            </View>
          )
        )
      }
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
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default OverdueScreen;

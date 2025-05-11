import React, { useContext } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { IAssignment } from '@/src/types';
import AssignmentCard from '@/src/components/assignments/AssignmentCard';
import { AuthContext } from '@/src/context/authContext';

type AssignmentDetailScreenRouteProp = RouteProp<
  { AssignmentDetailScreen: { assignment: IAssignment }; }, 
  'AssignmentDetailScreen'
>;

const AssignmentDetailScreen = () => {
  const route = useRoute<AssignmentDetailScreenRouteProp>();
  const { assignment } = route.params;
  const navigation = useNavigation();

  const [state] = useContext(AuthContext);

  // Ẩn bottom tab bar khi vào màn hình chi tiết
  useFocusEffect(() => {
    // Khi vào màn hình, ẩn tab bar
    const parent = navigation.getParent();
    const grandParent = parent?.getParent();
    parent?.setOptions({
      tabBarStyle: { display: 'none' }
    });
    grandParent?.setOptions({
      tabBarStyle: { display: 'none' }
    });


    // Khi rời màn hình, hiện lại tab bar
    return () => {
      parent?.setOptions({
        tabBarStyle: {
          paddingTop: 10,
          paddingBottom: 10,
          height: 70,
          borderTopColor: 'gray',
        },
      });
      grandParent?.setOptions({
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={24} color='black' />
        </Pressable>
        <View style={styles.headerInfo}>
            <Text style={styles.title}>{assignment.className}</Text>
        </View>
      </View>    

      <View style={styles.content}>
        {(state.info.role === 'TEACHER') ? (
          // <AssignmentCard
          //   assignment={assignment}
          //   onSubmit={() => {}}
          // />
          <Text>Oke teacher</Text>
        ) : (
          <AssignmentCard
            assignment={assignment}
            onSubmit={() => {}}
          />
          // <Text>Oke student</Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  }
});

export default AssignmentDetailScreen;
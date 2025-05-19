import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { IActivity, IAssignment, IPost } from '@/src/types';
import { AuthContext } from '@/src/context/authContext';
import { apiJson } from '@/src/api/axios';
import GradingAssignmentCard from '@/src/components/assignments/GradingAssignmentCard';
import AssignmentCard from '@/src/components/assignments/AssignmentCard';
import Card from '@/src/components/teams/Card';

type ActivityDetailScreenRouteProp = RouteProp<
  { ActivityDetailScreen: { activity: IActivity }; }, 
  'ActivityDetailScreen'
>;

const ActivityDetailScreen = () => {
  const route = useRoute<ActivityDetailScreenRouteProp>();
  const { activity } = route.params;
  const navigation = useNavigation();
  const [state] = useContext(AuthContext);
  const [assignment, setAssignment] = useState<IAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<IPost | null>(null);

  const fetchAssignment = async () => {
    setLoading(true);
    try {
      const res = await apiJson.get(`/api/assignment/go/${activity.assignmentId}`);
      if (res && res.data.result) {
        setAssignment({
          ...res.data.result,
          className: activity.className,
        });
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
      Alert.alert('Error', 'Failed to fetch assignment.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await apiJson.get(`/api/posts/${activity.postId}`);
      if (res && res.data) {
        setPost(res.data);
      }
    } catch (error: any) {
      console.error('Error fetching post:', {
        message: error.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });

      Alert.alert('Error', 'Failed to fetch post.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activity.type === 'ASSIGNMENT') {
      fetchAssignment();
    } else if (activity.type === 'POST') {
      fetchPost();
    }
  }, []);

  const handleDeletePost = async (postId: string) => {
    setLoading(true);
    try {
      await apiJson.delete(`/api/posts/${postId}`);
      
      const response = await apiJson.get(`/api/posts/class/${activity.classId}`);
      console.log('Post class data:', response.data);

      Alert.alert('Success', 'Deleted post successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post');
    } finally {
      setLoading(true);
    }
  };

  // Ẩn bottom tab bar khi vào màn hình chi tiết
  useFocusEffect(() => {
    // Khi vào màn hình, ẩn tab bar
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' }
    });

    // Khi rời màn hình, hiện lại tab bar
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

    const renderContent = () => {
    // if (loading) {
    //   return (
    //     <View style={styles.centerContainer}>
    //       <Text style={styles.loadingText}>Loading...</Text>
    //     </View>
    //   );
    // }

    if (activity.type === 'ASSIGNMENT') {
      if (!assignment) {
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Not found assignment information</Text>
          </View>
        );
      }
      
      return state.info.role === 'TEACHER' ? (
        <GradingAssignmentCard assignment={assignment} />
      ) : (
        <AssignmentCard assignment={assignment} />
      );
    } 
    
    if (activity.type === 'POST') {
      if (!post) {
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Not found post information</Text>
          </View>
        );
      }
      
      return (
        <Card
          key={post.id} 
          id={post.id.toString()}
          author={post.teacherName}
          title={post.title}
          content={post.content} 
          time={new Date(post.createdAt).toLocaleString()}
          onDelete={handleDeletePost}
          currentUser={state.info.name}
        />
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Loại hoạt động không xác định</Text>
      </View>
    );
  };

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
            <Text style={styles.title}>{activity.className}</Text>
        </View>
      </View>    

      <View style={styles.content}>
        {renderContent()}
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
  },
  centerContainer: {   
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#888',
  },
  errorText: {
    textAlign: 'center',
    color: '#ff6b6b',
  }
});

export default ActivityDetailScreen;
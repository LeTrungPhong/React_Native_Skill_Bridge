import React from 'react';
import Card from '@/src/components/teams/Card';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { IActivity } from '@/src/types';

// Định nghĩa kiểu dữ liệu cho route params
type ActivityDetailScreenRouteProp = RouteProp<
  { ActivityDetailScreen: { activity: IActivity }; }, 
  'ActivityDetailScreen'
>;

const ActivityDetailScreen = () => {
  const route = useRoute<ActivityDetailScreenRouteProp>();
  const { activity } = route.params;
  const navigation = useNavigation();

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
            <Text style={styles.title}>{activity.group}</Text>
        </View>
      </View>    

      <View style={styles.content}>
        <Card id={''} author={''} title={''} content={''} time={''} />
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

export default ActivityDetailScreen;
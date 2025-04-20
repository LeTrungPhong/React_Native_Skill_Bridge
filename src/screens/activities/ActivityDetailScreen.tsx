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
      <View style={styles.content}>
        <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={24} color='black' style={styles.arrowBack} />
        </Pressable>

        <Card />
      </View>      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  arrowBack: {
    marginBottom: 20,
  },
});

export default ActivityDetailScreen;
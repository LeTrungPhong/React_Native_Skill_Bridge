import { IActivity } from '@/src/types';
import { formatShortTime, truncateText } from '@/src/utils/string-date.utils';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { getRandomColor } from '../teams/TeamItem';

interface ActivityItemProps {
  activity: IActivity;
  onPress?: () => void;
}

const ActivityItem = ({ activity, onPress }: ActivityItemProps) => {
  const avatarColor = getRandomColor();
  const initial = activity.title.charAt(0).toUpperCase();
  
  const displayContent = truncateText(activity.body, 35);
  const displayTime = formatShortTime(activity.createdAt);

  return (
    <TouchableOpacity style={styles.activityItem} onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.activityContent}>
        <Text style={styles.timestamp}>{displayTime}</Text>
        <Text style={styles.title}>{activity.title}</Text>
        
        <Text style={styles.contentText}>{displayContent}</Text>
        
        <Text style={styles.groupInfo}>{activity.className}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cfcbcb',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  contentText: {
    fontSize: 14,
    marginBottom: 4,
  },
  groupInfo: {
    fontSize: 12,
    color: '#888',
  }
});

export default ActivityItem;
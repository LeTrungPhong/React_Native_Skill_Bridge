import { IActivity } from '@/src/types';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface ActivityItemProps {
  activity: IActivity;
}

const COLORS = [
  '#5DADE2', 
  '#F5B041',
  '#58D68D',
  '#BB8FCE',
  '#EC7063',
  '#45B39D',
  '#AF7AC5',
  '#5499C7',
  '#52BE80',
  '#F4D03F',
];

// Get random color
const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
};

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day} Th${month}`;
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const avatarColor = getRandomColor();
  const initial = activity.title.charAt(0).toUpperCase();
  
  const displayContent = truncateText(activity.content, 35);
  const formattedDate = formatShortDate(activity.timestamp);

  return (
    <TouchableOpacity style={styles.activityItem}>
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text style={styles.title}>{activity.title}</Text>
          <Text style={styles.timestamp}>{formattedDate}</Text>
        </View>
        
        <Text style={styles.contentText}>{displayContent}</Text>
        
        <Text style={styles.groupInfo}>{activity.group}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
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
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 13,
    color: '#888',
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
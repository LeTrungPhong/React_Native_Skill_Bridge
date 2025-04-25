import { IAssignment } from '@/src/types';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface AssignmentItemProps {
  assignment: IAssignment;
  onPress?: () => void;
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

function formatShortTime(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${hour}:${minute}, ${day} Th${month}`;
}

const AssignmentItem = ({ assignment, onPress }: AssignmentItemProps) => {
  const avatarColor = getRandomColor();
  const initial = assignment.title.charAt(0).toUpperCase();
  const displayContent = truncateText(assignment.content, 35);

  const [overdue, setOverdue] = useState(false);
  const [displayTime, setDisplayTime] = useState('');
  
  useEffect(() => {
    const submittedAt = assignment.submittedAt;    
    if(submittedAt){
      setDisplayTime(`Submitted at ${formatShortTime(submittedAt)}`);
      setOverdue(false);
      return;
    }

    const deadline = assignment.deadline;
    const isOverdue = new Date(deadline) < new Date();
    if(isOverdue){
      setDisplayTime(`Overdue at ${formatShortTime(deadline)}`);
      setOverdue(true);
    }else{
      setDisplayTime(`Due at ${formatShortTime(deadline)}`);
      setOverdue(false);
    }
  }, [assignment]);  

  return (
    <TouchableOpacity style={styles.assignmentItem} onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.assignmentContent}>
        <View style={styles.assignmentHeader}>
          <Text style={styles.title}>{displayContent}</Text>
        </View>

        <Text style={ [styles.timestamp, overdue && styles.overdue] }>{displayTime}</Text>
        
        <Text style={styles.groupInfo}>{assignment.group}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  assignmentItem: {
    width: '100%',
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  assignmentContent: {
    flex: 1,
  },
  assignmentHeader: {
    flexDirection: 'column',
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
    marginBottom: 4,
  },
  overdue: {
    color: 'red',
  },
  groupInfo: {
    fontSize: 12,
    color: '#888',
  }
});

export default AssignmentItem;
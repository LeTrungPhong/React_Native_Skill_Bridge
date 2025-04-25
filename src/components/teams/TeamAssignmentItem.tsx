import { IAssignment } from '@/src/types';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface TeamAssignmentItemProps {
  assignment: IAssignment;
  onPress?: () => void;
}

function formatShortTime(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${hour}:${minute}, ${day} Th${month}`;
}

const TeamAssignmentItem = ({ assignment, onPress }: TeamAssignmentItemProps) => {
  const timestamp = assignment.timestamp && formatShortTime(assignment.timestamp);
  const displayDeadline = formatShortTime(assignment.deadline);
  
  return (
    <View style={styles.assignmentItem}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.info}>
            <MaterialIcons name='assignment' size={28} color='#5E5CFF' />
            <View style={styles.info_text}>
              <Text style={styles.asg}>Assignments</Text>
              <Text style={styles.timestamp}>{timestamp}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <MaterialIcons name='more-vert' size={24} color='#000' />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentBox}>
          <Text style={styles.title}>{assignment.title}</Text>
          <Text style={styles.dueDate}>{displayDeadline}</Text>
          <TouchableOpacity style={styles.viewButton} onPress={onPress}>
            <Text style={styles.viewButtonText}>View assignment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  info: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  info_text: {
    flexDirection: 'column',
  },
  asg: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121'
  },
  timestamp: {
    fontSize: 12,
    color: '#757575'
  },
  menuButton: {
    padding: 5
  },
  contentBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  viewButton: {
    borderWidth: 1,
    borderColor: '#5E5CFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#5E5CFF',
    fontSize: 16,
  }
});


export default TeamAssignmentItem;
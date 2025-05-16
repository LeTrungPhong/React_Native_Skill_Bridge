import { formatShortTime } from '@/src/utils/string-date.utils';
import { IAssignment } from '@/src/types';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Modal, Dimensions, findNodeHandle } from 'react-native';
import { UIManager } from 'react-native';

interface TeamAssignmentItemProps {
  assignment: IAssignment;
  onPress?: () => void;
  onDelete?: (assignmentId: string) => void;
  isTeacher?: boolean;
}

const TeamAssignmentItem = ({ assignment, onPress, onDelete, isTeacher }: TeamAssignmentItemProps) => {
  // const timestamp = assignment.timestamp && formatShortTime(assignment.timestamp);
  const displayDeadline = `Due at ${formatShortTime(assignment.deadLine)}`;

  const [menuVisible, setMenuVisible] = useState(false);
  const menuButtonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const handleDelete = () => {
    Alert.alert(
      "Delete Assignment",
      "Are you sure you want to delete this assignment?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setMenuVisible(false)
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (onDelete) {
              onDelete(assignment.id);
            }
            setMenuVisible(false);
          }
        }
      ]
    );
  };

  const showMenu = () => {
    if (menuButtonRef.current) {
      const handle = findNodeHandle(menuButtonRef.current);
      if (handle) {
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
          setMenuPosition({
            top: pageY + height - 30,
            right: Dimensions.get('window').width - (pageX + width)
          });
          setMenuVisible(true);
        });
      }
    }
  };
  
  return (
    <View style={styles.assignmentItem}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.info}>
            <MaterialIcons name='assignment' size={28} color='#5E5CFF' />
            <View style={styles.info_text}>
              <Text style={styles.asg}>Assignments</Text>
              {/* <Text style={styles.timestamp}>{timestamp}</Text> */}
            </View>
          </View>
          
          {isTeacher && (
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={showMenu}
              ref={menuButtonRef}
            >
              <MaterialIcons name='more-vert' size={24} color='#000' />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.contentBox}>
          <Text style={styles.title}>{assignment.title}</Text>
          <Text style={styles.dueDate}>{displayDeadline}</Text>
          <TouchableOpacity style={styles.viewButton} onPress={onPress}>
            <Text style={styles.viewButtonText}>View assignment</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Popup */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={[
            styles.menuPopup,
            {
              top: menuPosition.top,
              right: menuPosition.right,
            }
          ]}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleDelete}
            >
              <MaterialIcons name="delete" size={20} color="#FF5252" />
              <Text style={styles.menuItemTextDelete}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuPopup: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    width: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemTextDelete: {
    marginLeft: 12,
    fontSize: 15,
    color: '#FF5252',
    fontWeight: '500',
  }
});

export default TeamAssignmentItem;
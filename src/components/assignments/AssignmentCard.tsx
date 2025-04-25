import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { IAssignment } from '@/src/types';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

interface AssignmentCardProps {
  assignment: IAssignment;
  onSubmit?: (id: string) => void;
}

function formatShortTime(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${hour}:${minute}, ${day} Th${month}`;
}

const AssignmentCard = ({ assignment, onSubmit }: AssignmentCardProps) => {
  const [overdue, setOverdue] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitNoti, setSubmitNoti] = useState('');
  const [submitBtnText, setSubmitBtnText] = useState('');
  const [score, setScore] = useState('No score yet');
  const [attachment, setAttachment] = useState('');
  
  const displayDeadline = `Due at ${formatShortTime(assignment.deadline)}`;
  useEffect(() => {
    const submittedAt = assignment.submittedAt;    
    if(submittedAt){
      setSubmitNoti(`Submitted at ${formatShortTime(submittedAt)}`);
      setIsSubmitted(true);
      setOverdue(false);
      setSubmitBtnText('Undo turn in');

      setScore(
        assignment.score !== undefined && assignment.score !== null
          ? String(assignment.score)
          : '100 points possible'
      );
      
      return;
    }

    const isOverdue = new Date(assignment.deadline) < new Date();
    if(isOverdue){
      setSubmitNoti('Not submitted yet');
      setOverdue(true);
      setSubmitBtnText('Turn in late');
    }else{
      setOverdue(false);
      setSubmitBtnText('Turn in');
    }
  }, [assignment]);  

  // Handle submission
  function handleSubmit() {
    if (onSubmit) {
      onSubmit(assignment.id);
    }
  };

  // Handle attachment
  function handleAttachment() {
    if (onSubmit) {
      onSubmit(assignment.id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={(isSubmitted || overdue) && styles.assignmentHeader}>
        <View style={styles.submissionStatusContainer}>
          <Text style={styles.submissionStatus}>{submitNoti}</Text>
          <TouchableOpacity style={styles.turnInButton} onPress={handleSubmit}>
            {<Text style={styles.turnInButtonText}>{submitBtnText}</Text>}
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.assignmentBody}>
        <Text style={styles.assignmentTitle}>{assignment.title}</Text>
        <Text style={styles.assignmentDeadline}>{displayDeadline}</Text>
        
        <View style={styles.assignmentInstructions}>
          <Text style={styles.instructionTitle}>Instructions</Text>
          <Text style={styles.instructionText}>{assignment.content}</Text>
        </View>

        <View style={styles.myWork}>
          <Text style={styles.workTitle}>My work</Text>
          {attachment && <Text style={styles.workText}></Text>}
        </View>
        
        <View style={styles.assignmentActions}>
          <View style={styles.attachments}>
            <TouchableOpacity onPress={handleAttachment}>
              <Text style={styles.attachmentIcon}>📎 Add work</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.assignmentFooter}>
          <View style={styles.scoreSection}>
            <Text style={styles.scoreLabel}>Points</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16, 
    backgroundColor: 'white', 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3.84, 
    elevation: 3,
    marginBottom: 10
  },
  assignmentHeader: {
    padding: 10,
    backgroundColor: '#F5EFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submissionStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  submissionStatus: {
    fontSize: 12,
  },
  turnInButton: {
    backgroundColor: '#5E5CFF',
    padding: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  turnInButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  assignmentBody: {
    padding: 16,
  },
  assignmentTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#202124',
    textTransform: 'uppercase',
  },
  assignmentDeadline: {
    color: '#5f6368',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 16,
  },
  assignmentInstructions: {
    marginBottom: 16,
  },
  instructionTitle: {
    marginVertical: 4,
    color: '#70757a',
    fontWeight: '500',
    fontSize: 14,
  },
  instructionText: {
    marginVertical: 4,
    color: '#202124',
    fontSize: 15,
  },
  myWork: {
    marginBottom: 16,
  },
  workTitle: {
    marginVertical: 4,
    color: '#70757a',
    fontWeight: '500',
    fontSize: 14,
  },
  workText: {
    marginVertical: 4,
    color: '#202124',
    fontSize: 15,
  },
  assignmentActions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  attachments: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  attachmentIcon: {
    color: '#5E5CFF',
    fontSize: 14,
    marginRight: 16,
  },
  assignmentFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  scoreSection: {
    flexDirection: 'column',
  },
  scoreLabel: {
    marginVertical: 4,
    color: '#70757a',
    fontWeight: '500',
    fontSize: 14,
  },
  scoreValue: {
    marginVertical: 4,
    color: '#5f6368',
    fontSize: 14,
  },
});

export default AssignmentCard;
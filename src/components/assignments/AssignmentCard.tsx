import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { IAssignment, IStudentSubmission } from '@/src/types';
import { AuthContext } from '@/src/context/authContext';
import { apiJson } from '@/src/api/axios';
import { Ionicons } from '@expo/vector-icons';
import { formatShortTime } from '@/src/services';

interface AssignmentCardProps {
  assignment: IAssignment;
  onSubmit?: (id: string) => void;
}

const AssignmentCard = ({ assignment, onSubmit }: AssignmentCardProps) => {
  const [state] = useContext(AuthContext);
  const [submission, setSubmission] = useState<IStudentSubmission | null>(null);

  const [overdue, setOverdue] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitNoti, setSubmitNoti] = useState('');
  const [submitBtnText, setSubmitBtnText] = useState('');
  const [score, setScore] = useState('No score yet');
  
  const [addAttachment, setAttachment] = useState(false);

  const displayDeadline = `Due at ${formatShortTime(assignment.deadLine)}`;

  const fetchSubmission = async () => {
    try {
      const res = await apiJson.get(`/api/assignment/${assignment.classId}/${assignment.id}`);
      
      if(res && res.data && res.data.result.submission){
        const submissionData = res.data.result.submission;
        setSubmission({
          id: submissionData.id,
          submissionTime: submissionData.submissionTime,
          filesName: submissionData.filesNames,
        });
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    }
  }

  useEffect(() => {
    fetchSubmission();
  }, []);

  useEffect(() => {
    console.log('assignment', assignment);
    console.log('submission', submission);

    const submittedAt = submission?.submissionTime;
    if(submittedAt){
      setSubmitNoti(`Submitted at ${formatShortTime(submittedAt)}`);
      setIsSubmitted(true);
      setOverdue(false);
      setSubmitBtnText('Undo turn in');

      setScore(
        submission.score !== undefined && submission.score !== null
          ? String(submission.score)
          : '10 points possible'
      );
      
      return;
    }

    const isOverdue = new Date(assignment.deadLine) < new Date();
    if(isOverdue){
      setSubmitNoti('Not submitted yet');
      setOverdue(true);
      setSubmitBtnText('Turn in late');
    }else{
      setOverdue(false);
      setSubmitBtnText('Turn in');
    }
  }, [submission]);  

  // Handle submission
  function handleSubmit() {
    if (onSubmit) {
      onSubmit(assignment.id);
    }
  };

  // Handle attachment
  function handleAttachment() {
    Alert.alert(
      'Add attachment')
  };

  const getTeacherAttachment = async (filename: string) => {
    const res = await apiJson.get(`/api/assignment/${assignment.classId}/${assignment.id}/${filename}`);
    return res.data;
  };

  const getStudentAttachment = async (filename: string) => {
    const res = await apiJson.get(`/api/assignment/${assignment.classId}/${assignment.id}/${filename}`);
    return res.data;
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
          <Text style={styles.instructionText}>{assignment.description}</Text>
          
          {assignment.filesName.map((file, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => getTeacherAttachment(file)} 
              style={styles.filesContainer}
            >
              <Ionicons name='document-text-outline' size={16} color='#5E5CFF' />
              <Text style={styles.file}>{file}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.assignmentSubmissions}>
          <Text style={styles.submissionTitle}>My work</Text>

          <TouchableOpacity 
            onPress={handleAttachment} 
            style={styles.addFileContainer}
            disabled={addAttachment}
          >
            <Ionicons 
              name='attach-outline' 
              size={16} 
              color='#ACAAAA' 
              style={{ transform: [{ rotate: '30deg' }] }}
            />
            <Text style={styles.addFile}>Add work</Text>
          </TouchableOpacity>

          {submission && 
            submission.filesName.map((file, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => getStudentAttachment(file)} 
                style={styles.filesContainer}
              >
                <Ionicons name='document-text-outline' size={16} color='#5E5CFF' />
                <Text style={styles.file}>{file}</Text>
              </TouchableOpacity>
            ))}
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
  filesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6, 
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f5f7fabe',
    marginBottom: 8,
    borderColor: '#e3e4e5',
    borderWidth: 1,
  },
  file: {
    color: '#5E5CFF',
  },
  assignmentSubmissions: {
    marginBottom: 16,
  },
  submissionTitle: {
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
  addFileContainer: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  addFile: {
    color: '#ACAAAA',
    fontSize: 15,
    fontStyle: 'italic',
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
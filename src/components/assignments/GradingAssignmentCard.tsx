import { apiJson } from '@/src/api/axios';
import { formatShortTime, truncateText } from '@/src/utils/string-date.utils';
import { IAssignment, IStudentSubmission } from '@/src/types';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
  Modal,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AssignmentCardProps {
  assignment: IAssignment;
}

const GradingAssignmentCard = ({ assignment }: AssignmentCardProps) => {
  const [submissions, setSubmissions] = useState<IStudentSubmission[]>([]);
  const [editingSubmission, setEditingSubmission] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<IStudentSubmission | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tempScores, setTempScores] = useState<{[key: string]: string}>({});
  const [tempFeedbacks, setTempFeedbacks] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchStudentSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await apiJson.get(`/api/assignment/${assignment.classId}/${assignment.id}/all`);

      if(res && res.data) {
        const data = res.data.result.submissionResponses || [];
        const result: IStudentSubmission[] = data.map((submission: any) => {
          return {
            id: submission.id,
            submissionTime: submission.submissionTime,
            filesName: submission.filesNames,
            submissionBy: submission.submissionBy,
            score: submission.score || undefined,
            feedback: submission.feedback || undefined,
          }
        });
        
        setSubmissions(result);
        // Initialize temp scores and feedbacks with fetched data
        const initialScores: {[key: string]: string} = {};
        const initialFeedbacks: {[key: string]: string} = {};
        
        data.forEach((submission: IStudentSubmission) => {
          initialScores[submission.id] = submission.score !== undefined ? submission.score.toString() : '';
          initialFeedbacks[submission.id] = submission.feedback || '';
        });
        
        setTempScores(initialScores);
        setTempFeedbacks(initialFeedbacks);
      }
    } catch(error: any) {
      console.error('Error fetching student submissions:', {
        message: error.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      Alert.alert('Error', 'Unable to load submissions list');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentSubmissions();
  }, []);

  // Scoring
  const handleSaveScore = (submissionId: string) => {
    const scoreValue = parseFloat(tempScores[submissionId]);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 10) {
      Alert.alert('Error', 'Score must be a number between 0 and 10');
      return;
    }

    setSubmissions(prevSubmissions => 
      prevSubmissions.map(sub => 
        sub.id === submissionId 
          ? { ...sub, score: scoreValue, feedback: tempFeedbacks[submissionId] } 
          : sub
      )
    );
    
    setEditingSubmission(null);
    Alert.alert('Success', 'Score saved successfully');
  };

  // Helper function for formatting date and time
  const formatDateTime = (dateString: string): string => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleString();
  };

  // Handle file downloads
  const handleFileDownload = async (filename: string, isTeacherFile = false) => {
    try {
      setIsLoading(true);
      // const endpoint = isTeacherFile 
      //   ? `/api/assignment/${assignment.classId}/${assignment.id}/teacher/${filename}`
      //   : `/api/assignment/${assignment.classId}/${assignment.id}/student/${filename}`;
        
      // const res = await apiJson.get(endpoint);
      
      // if (!res?.data) {
      //   throw new Error('Failed to download file');
      // }
      
      // Handle file download here
      Alert.alert('Success', 'File downloaded successfully');
      
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', 'Failed to download file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle when a student is selected in the table
  const openSubmissionModal = (submission: IStudentSubmission) => {
    setSelectedSubmission(submission);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingSubmission(null);
  };

  // Renderer list of submissions
  const renderSubmissionList = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#5E5CFF' />
          <Text style={styles.loadingText}>Loading submissions...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.submissionListContainer}>
        {!submissions || submissions.length <= 0 ? (
          <Text style={styles.noSubmissionText}>No submissions</Text>
        ) : (
          <View>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 0.4 }]}>No.</Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Student</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.0 }]}>Submitted</Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>Score</Text>
            </View>
            
            {/* Rows */}
            {submissions.map((submission, index) => (
              <TouchableOpacity 
                key={submission.id}
                style={styles.tableRow}
                onPress={() => openSubmissionModal(submission)}
              >
                <Text style={[styles.tableCell, { flex: 0.4 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>{truncateText(submission.submissionBy, 5)}</Text>
                <Text style={[styles.tableCell, { flex: 1.0 }]}>
                  {formatDateTime(submission.submissionTime).split(', ')[0]}
                </Text>
                <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>
                  {submission.score !== undefined ? submission.score : '-'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Submission details modal
  const renderSubmissionModal = () => {
    if (!selectedSubmission) return null;
    
    const isEditing = editingSubmission === selectedSubmission.id;
    
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detail submission</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.studentInfoModal}>
                <Text style={styles.studentNameModal}>{selectedSubmission.submissionBy}</Text>
                <Text style={styles.submissionTimeModal}>
                  Submitted at: {formatDateTime(selectedSubmission.submissionTime)}
                </Text>
              </View>
              
              <View style={styles.attachmentsContainer}>
                <Text style={styles.sectionTitle}>Submission:</Text>
                {selectedSubmission.filesName && selectedSubmission.filesName.length > 0 ? (
                    selectedSubmission.filesName.map((file, index) => (
                      <TouchableOpacity 
                        key={index} 
                        onPress={() => handleFileDownload(file, true)} 
                        style={styles.filesContainer}
                        disabled={isLoading}
                      >
                        <Ionicons name='document-text-outline' size={16} color='#5E5CFF' />
                        <Text style={styles.file}>{file}</Text>
                      </TouchableOpacity>
                    ))) 
                    : 
                    (<Text style={styles.noAttachment}>No attachments</Text>)
                }
              </View>
              
              <View style={styles.gradingSection}>
                <Text style={styles.sectionTitle}>Score:</Text>
                
                {isEditing ? (
                  <View style={styles.editingContainer}>
                    <View style={styles.scoreInputContainer}>
                      <TextInput
                        style={styles.scoreInput}
                        keyboardType='numeric'
                        value={tempScores[selectedSubmission.id] || ''}
                        onChangeText={(text) => setTempScores({...tempScores, [selectedSubmission.id]: text})}
                        placeholder={'0 - 10'}
                      />
                      <Text style={styles.maxScore}>/10</Text>
                    </View>
                    
                    <TextInput
                      style={styles.feedbackInput}
                      multiline
                      numberOfLines={3}
                      value={tempFeedbacks[selectedSubmission.id] || ''}
                      onChangeText={(text) => setTempFeedbacks({...tempFeedbacks, [selectedSubmission.id]: text})}
                      placeholder='Enter feedback...'
                    />
                    
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity 
                        style={[styles.button, styles.saveButton]} 
                        onPress={() => handleSaveScore(selectedSubmission.id)}
                      >
                        <Text style={styles.buttonText}>Save</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.button, styles.cancelButton]} 
                        onPress={() => setEditingSubmission(null)}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.displayContainer}>
                    <View style={styles.scoreDisplay}>
                      <Text style={styles.scoreText}>
                        {selectedSubmission.score !== undefined ? selectedSubmission.score : '-'}
                      </Text>
                      <Text style={styles.maxScore}>/10</Text>
                    </View>
                    
                    {selectedSubmission.feedback ? (
                      <Text style={styles.feedbackText}>{selectedSubmission.feedback}</Text>
                    ) : (
                      <Text style={styles.noFeedbackText}>No feedback yet</Text>
                    )}
                    
                    <TouchableOpacity 
                      style={[styles.button, styles.editButton]} 
                      onPress={() => setEditingSubmission(selectedSubmission.id)}
                    >
                      <Text style={styles.buttonText}>
                        {selectedSubmission.score !== undefined ? 'Edit score' : 'Grade submission'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Assignment display section */}
        <View style={styles.assignmentSection}>
          <Text style={styles.assignmentTitle}>{assignment.title}</Text>
          <Text style={styles.assignmentDeadline}>{`Due at ${formatShortTime(assignment.deadLine)}`}</Text>
          
          <View style={styles.assignmentInstructions}>
            <Text style={styles.instructionTitle}>Instructions</Text>
            <Text style={styles.instructionText}>{assignment.description}</Text>
            
            {Array.isArray(assignment.filesName) && assignment.filesName.length > 0 && (
              <View style={styles.attachmentsSection}>
                {assignment.filesName.map((file, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => handleFileDownload(file, true)} 
                    style={styles.filesContainer}
                    disabled={isLoading}
                  >
                    <Ionicons name='document-text-outline' size={16} color='#5E5CFF' />
                    <Text style={styles.file}>{file}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        
        {/* Grading table display section */}
        <View style={styles.gradingTableSection}>
          <Text style={styles.gradingTableTitle}>
            Submission list table ({submissions ? submissions.length : 0})
          </Text>
          {renderSubmissionList()}
        </View>
      </ScrollView>
      
      {/* Submission details modal */}
      {renderSubmissionModal()}
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white', 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3.84, 
    elevation: 3,
    marginBottom: 16,
  },
  scrollView: {
    width: '100%',
    padding: 16,
  },

  // Styles for assignment section
  assignmentSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  assignmentTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#202124',
  },
  assignmentDeadline: {
    color: '#5f6368',
    fontSize: 14,
    marginBottom: 16,
  },
  assignmentInstructions: {
    marginBottom: 8,
  },
  instructionTitle: {
    color: '#70757a',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 8,
  },
  instructionText: {
    color: '#202124',
    fontSize: 15,
    lineHeight: 22,
  },
  pointsContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f1f3f4',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  pointsText: {
    color: '#5f6368',
    fontWeight: '500',
  },
  
  // Styles for grading table section
  gradingTableSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 8,
  },
  gradingTableTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#202124',
  },
  
  // Loading styles
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#5f6368',
  },
  
  // Styles for submission list
  submissionListContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  noSubmissionText: {
    padding: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#70757a',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f4',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeaderCell: {
    fontWeight: '600',
    fontSize: 14,
    color: '#5f6368',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    fontSize: 14,
    color: '#202124',
  },
  
  // Styles for Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#5f6368',
    fontWeight: '600',
  },
  modalScrollView: {
    padding: 16,
    maxHeight: height * 0.7,
  },
  
  // Styles for student info in modal
  studentInfoModal: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  studentNameModal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  submissionTimeModal: {
    fontSize: 14,
    color: '#5f6368',
  },
  
  // Styles for attachments section
  attachmentsContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  attachmentsSection: {
    marginTop: 12,
  },
  filesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f1f3f4',
    borderRadius: 4,
  },
  file: {
    marginLeft: 8,
    color: '#5E5CFF',
    fontSize: 14,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f1f3f4',
    borderRadius: 4,
    marginBottom: 8,
  },
  attachmentIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  attachmentName: {
    color: '#1a73e8',
    fontSize: 14,
  },
  noAttachment: {
    fontStyle: 'italic',
    color: '#70757a',
    padding: 8,
  },
  
  // Styles for grading section
  gradingSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#70757a',
    marginBottom: 12,
  },
  editingContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
  },
  scoreInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 10,
    width: 80,
    textAlign: 'center',
    fontSize: 16,
  },
  maxScore: {
    marginLeft: 4,
    fontSize: 16,
    color: '#5f6368',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#1a73e8',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  editButton: {
    backgroundColor: '#5E5CFF',
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  cancelButtonText: {
    color: '#5f6368',
    fontWeight: '500',
    fontSize: 14,
  },
  
  // Styles for displaying score and feedback
  displayContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },
  feedbackText: {
    color: '#5f6368',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  noFeedbackText: {
    fontStyle: 'italic',
    color: '#70757a',
    marginBottom: 16,
  }
});

export default GradingAssignmentCard;
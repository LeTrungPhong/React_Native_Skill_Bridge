import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { IAssignment, IFileUpload, IStudentSubmission } from '@/src/types';
import { AuthContext } from '@/src/context/authContext';
import { apiForm, apiJson } from '@/src/api/axios';
import { Ionicons } from '@expo/vector-icons';
import { formatShortTime } from '@/src/services/time.service';
import * as DocumentPicker from 'expo-document-picker';

interface AssignmentCardProps {
  assignment: IAssignment;
}

const AssignmentCard = ({ assignment }: AssignmentCardProps) => {
  const [state] = useContext(AuthContext);
  const [submission, setSubmission] = useState<IStudentSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [overdue, setOverdue] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitNoti, setSubmitNoti] = useState('');
  const [submitBtnText, setSubmitBtnText] = useState('Turn in');
  const [score, setScore] = useState('No score yet');
  
  // File upload
  const [formData, setFormData] = useState<IFileUpload[]>([]);
  const [formErrors, setFormErrors] = useState('');

  const displayDeadline = `Due at ${formatShortTime(assignment.deadLine)}`;

  const fetchSubmission = async () => {
    try {
      setIsLoading(true);
      const res = await apiJson.get(`/api/assignment/${assignment.classId}/${assignment.id}`);
      
      if(res?.data?.result?.submission){
        const submissionData = res.data.result.submission;
        setSubmission({
          id: submissionData.id,
          submissionTime: submissionData.submissionTime,
          filesName: submissionData.filesNames || [],
          score: submissionData.score
        });
      } else {
        setSubmission(null);
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
      Alert.alert('Error', 'Failed to fetch submission details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
  }, [assignment.id, assignment.classId]);

  useEffect(() => {
    updateSubmissionStatus();
  }, [submission]);

  const updateSubmissionStatus = () => {
    const submittedAt = submission?.submissionTime;
    
    if(submittedAt){
      setSubmitNoti(`Submitted at ${formatShortTime(submittedAt)}`);
      setIsSubmitted(true);
      setOverdue(false);
      setSubmitBtnText('Undo turn in');

      setScore(
        submission.score !== undefined && submission.score !== null
          ? `${submission.score} / 10 points`
          : '10 points possible'
      );
      return;
    }

    const isOverdue = new Date(assignment.deadLine) < new Date();
    setOverdue(isOverdue);
    setIsSubmitted(false);

    if(!submission){
      setSubmitNoti('');
      setSubmitBtnText('Turn in');

      if(isOverdue){
        setSubmitNoti('Not submitted yet');
        setSubmitBtnText('Turn in late');
      }
    }
  };

  // Form validation
  const validateForm = () => {
    if (submitBtnText === 'Undo turn in') {
      return true;
    }
    
    if(!formData.length) {
      setFormErrors('At least one file is required');
      return false;
    }
    
    setFormErrors('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please select at least one file to upload');
      return;
    }

    try {
      setIsLoading(true);
      
      if(submitBtnText === 'Undo turn in'){
        // if (!submission?.id) {
        //   throw new Error('Submission ID is missing');
        // }
        
        const res = await apiForm.delete(`/api/assignment/${assignment.classId}/${assignment.id}/${submission?.id}`);
        if(!res?.data?.message){
          throw new Error('Failed to undo submission');
        }
        
        setSubmission(null);
        setFormData([]);
        
      } else if(submitBtnText === 'Turn in' || submitBtnText === 'Turn in late'){
        const form = new FormData();
        formData.forEach((file) => {
          const fileToUpload: any = {
            uri: file.uri,
            name: file.name || 'file',
            size: file.size,
            type: file.type || 'application/octet-stream',
          };
          
          form.append('files', fileToUpload);
        });

        const res = await apiForm.post(`/api/assignment/${assignment.classId}/${assignment.id}`, form);
        
        if(res?.data?.result){
          await fetchSubmission();
          setFormData([]);
        } else {
          throw new Error('Failed to submit assignment');
        }
      }      
    } catch (error: any) {
      console.error('Error submitting assignment:', error.message);
      Alert.alert('Error', 'Failed to process assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // File picker
  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
        multiple: true, 
      });
      
      if (result.canceled) {
        return;
      }
      
      const files = result.assets.map(asset => ({
        uri: asset.uri,
        name: asset.name,
        size: asset.size,
        type: asset.mimeType,
      }));
      
      setFormData([...formData, ...files]);
      setFormErrors('');
    } catch (error) {
      console.error('Error adding file:', error);
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...formData];
    updatedFiles.splice(index, 1);
    setFormData(updatedFiles);
  };

  // Handle file downloads
  const handleFileDownload = async (filename: string, isTeacherFile = false) => {
    try {
      setIsLoading(true);
      const endpoint = isTeacherFile 
        ? `/api/assignment/${assignment.classId}/${assignment.id}/teacher/${filename}`
        : `/api/assignment/${assignment.classId}/${assignment.id}/student/${filename}`;
        
      const res = await apiJson.get(endpoint);
      
      if (!res?.data) {
        throw new Error('Failed to download file');
      }
      
      // Handle file download here based on your app's requirements
      // This might involve using Expo's FileSystem or other methods
      Alert.alert('Success', 'File downloaded successfully');
      
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', 'Failed to download file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.assignmentHeader, 
        isSubmitted
        ? styles.submittedHeader
        : !isSubmitted && overdue
          ? styles.overdueHeader
          : styles.notSubmitHeader
      ]}>
        <View style={styles.submissionStatusContainer}>
          <Text style={styles.submissionStatus}>{submitNoti}</Text>
          <TouchableOpacity 
            style={[styles.turnInButton, isLoading && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 
              <Text style={styles.turnInButtonText}>Processing...</Text> :
              <Text style={styles.turnInButtonText}>{submitBtnText}</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.assignmentBody}>
        <Text style={styles.assignmentTitle}>{assignment.title}</Text>
        <Text style={styles.assignmentDeadline}>{displayDeadline}</Text>
        
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

        <View style={styles.assignmentSubmissions}>
          <Text style={styles.submissionTitle}>My work</Text>

          {submission && Array.isArray(submission.filesName) && submission.filesName.length > 0 && (
            <View style={styles.submittedFilesContainer}>
              {submission.filesName.map((file, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => handleFileDownload(file, false)} 
                  style={styles.filesContainer}
                  disabled={isLoading}
                >
                  <Ionicons name='document-text-outline' size={16} color='#5E5CFF' />
                  <Text style={styles.file}>{file}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!isSubmitted && (
            <View style={styles.formField}>
              <TouchableOpacity 
                style={[styles.filePickerButton, isLoading && styles.disabledButton]} 
                onPress={handleFilePicker}
                disabled={isLoading}
              >
                <Text style={styles.filePickerText}>
                  {isLoading ? 'Please wait...' : 'Choose file'}
                </Text>
              </TouchableOpacity>
              
              {formData.length > 0 && (
                <View style={styles.fileListContainer}>
                  {formData.map((file, index) => (
                    <View key={index} style={styles.fileItem}>
                      <Text style={styles.fileName} numberOfLines={1} ellipsizeMode='middle'>
                        {file.name}
                      </Text>
                      <TouchableOpacity 
                        onPress={() => removeFile(index)}
                        disabled={isLoading}
                      >
                        <Ionicons name='close-circle' size={20} color='#ff6b6b' />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              
              {formErrors ? <Text style={styles.errorText}>{formErrors}</Text> : null}
              
              {/* {formData.length > 0 && !isSubmitted && (
                <TouchableOpacity 
                  style={[styles.submitButton, isLoading && styles.disabledButton]} 
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Processing...' : submitBtnText}
                  </Text>
                </TouchableOpacity>
              )} */}
            </View>
          )}
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
    backgroundColor: 'white', 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3.84, 
    elevation: 3,
    marginBottom: 16,
    overflow: 'hidden'
  },
  assignmentHeader: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submittedHeader: {
    backgroundColor: '#EBF3FF',
  },
  overdueHeader: {
    backgroundColor: '#FFEBEB',
  },
  notSubmitHeader: {
    backgroundColor: '#f4f2f2db',
  },
  submissionStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  submissionStatus: {
    fontSize: 13,
    fontWeight: '500',
  },
  turnInButton: {
    backgroundColor: '#5E5CFF',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
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
    marginBottom: 8,
  },
  instructionTitle: {
    marginBottom: 8,
    color: '#70757a',
    fontWeight: '500',
    fontSize: 14,
  },
  instructionText: {
    color: '#202124',
    fontSize: 15,
    lineHeight: 22,
  },
  attachmentsSection: {
    marginTop: 12,
  },
  filesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8, 
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f5f7fa',
    marginBottom: 8,
    borderColor: '#e3e4e5',
    borderWidth: 1,
  },
  file: {
    color: '#5E5CFF',
    fontSize: 14,
  },
  assignmentSubmissions: {
    marginBottom: 8,
  },
  submissionTitle: {
    marginBottom: 12,
    color: '#70757a',
    fontWeight: '500',
    fontSize: 14,
  },
  submittedFilesContainer: {
    marginBottom: 12,
  },
  addFileContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f4ff',
  },
  addFile: {
    color: '#5E5CFF',
    fontSize: 14,
    fontWeight: '500',
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
    marginBottom: 4,
    color: '#70757a',
    fontWeight: '500',
    fontSize: 14,
  },
  scoreValue: {
    color: '#5f6368',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
  },
  filePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  filePickerText: {
    color: '#555',
    fontWeight: '500',
  },
  fileListContainer: {
    // marginBottom: 16,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  fileName: {
    flex: 1,
    marginRight: 8,
    fontSize: 14,
  },
  formField: {
    marginBottom: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default AssignmentCard;
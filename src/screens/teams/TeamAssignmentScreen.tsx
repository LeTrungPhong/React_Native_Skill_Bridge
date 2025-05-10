import React, { useContext, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  useColorScheme,
  Image,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IAssignment, IAssignmentCreation } from '@/src/types';
import TeamAssignmentItem from '@/src/components/teams/TeamAssignmentItem';
import { AuthContext } from '@/src/context/authContext';
import { apiForm, apiJson } from '@/src/api/axios';
import { GeneralScreenRouteProp } from '@/src/navigation/type';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import CalendarPicker from 'react-native-calendar-picker';

type TeamAssignmentScreenNavigationProp = StackNavigationProp<
  { 
    TeamAssignmentScreen: undefined; 
    AssignmentDetailScreen: { assignment: IAssignment };
  }, 
  'TeamAssignmentScreen'
>;

const TeamAssignmentScreen = () => {
  const navigation = useNavigation<TeamAssignmentScreenNavigationProp>();

  const [state] = useContext(AuthContext);
  const route = useRoute<GeneralScreenRouteProp>();
  const { team } = route.params;

  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState<IAssignmentCreation>({
    title: '',
    description: '',
    classId: team.id,
    deadLine: '',
    files: [],
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    deadLine: '',
    files: '',
  });

  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [date, setDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch all assignments
  const fetchAssignments = async () => {
    try{
      let res;
      if(state.info.role === 'TEACHER'){
        res = await apiJson.get(`/api/assignment/teacher/${team.id}`);
      }else{
        res = await apiJson.get(`/api/assignment/${team.id}`);
      }

      if(res && res.data){
        const assignments: IAssignment[] = res.data.result.map((item: any) => {
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            deadLine: item.deadLine,
            createBy: item.createBy,
            filesName: item.filesName,
            className: team.name,
            classId: team.id,
          }
        });
        setAssignments(assignments);
        console.log('Assignments:', assignments);
      }
    }catch(error){
      console.error('Error fetching assignments:', error);
    }
  };

  // Render assignment item
  const renderAssignmentItem = ({ item }: { item: IAssignment }) => (
    <TeamAssignmentItem
      assignment={item} 
      onPress={() => {
        console.log(`Selected assignment: ${item.id}`);
        navigation.navigate('AssignmentDetailScreen', { assignment: item });
      }}
    />
  );

  // Add assignment form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      description: '',
      deadLine: '',
      files: '',
    };

    if(!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if(!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if(!formData.deadLine.trim()) {
      newErrors.deadLine = 'Deadline is required';
      isValid = false;
    }

    if(!formData.files.length) {
      newErrors.files = 'At least one file is required';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };
  
  // File
  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
        multiple: true, 
      });
      
      if (result.canceled) {
        console.log('User cancelled document picker');
        return;
      }
      
      const files = result.assets.map(asset => ({
        uri: asset.uri,
        name: asset.name,
        size: asset.size,
        type: asset.mimeType,
      }));
      
      setFormData({ 
        ...formData, 
        files: [...formData.files, ...files] 
      });

      if (formErrors.files) {
        setFormErrors({ 
          ...formErrors, 
          files: '' 
        });
      }
    } catch (error) {
      console.error('Error adding file:', error);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);

    setFormData({ 
      ...formData, 
      files: updatedFiles 
    });
  };

  //Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      classId: team.id,
      deadLine: '',
      files: [],
    });
    setFormErrors({
      title: '',
      description: '',
      deadLine: '',
      files: '',
    });
    setHour('');
    setMinute('');
    setDate('');
  };

  // Add assignment
  const handleAddAssignment = async() => {
    try{
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('classId', formData.classId);
      form.append('deadLine', formData.deadLine);
      
      formData.files.forEach((file) => {
        const fileToUpload: any = {
          uri: file.uri,
          name: file.name || 'file',
          size: file.size,
          type: file.type || 'application/octet-stream',
        }
        
        form.append('files', fileToUpload);
      });

      const res = await apiForm.post(`/api/assignment/${team.id}`, form);
      console.log('Response:', res.data);

      if(res.data.message === 'success'){
        console.log('Assignment added successfully:', res.data.result);
        Alert.alert('Success', 'Assignment added successfully!');
        setIsFormVisible(false);
        fetchAssignments();
      }
    }catch(error){
      console.error('Error adding assignment:', error);
      Alert.alert('Error', 'Failed to add assignment. Please try again.');
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    handleAddAssignment();
    resetForm();
  };

  useEffect(() => {
    fetchAssignments();
  }, []);
  
  const formatTime = (dateInput: string, hour: string, minute: string) => {
    const date = new Date(dateInput);
    date.setHours(parseInt(hour, 10));
    date.setMinutes(parseInt(minute, 10));
    date.setSeconds(0);
    date.setMilliseconds(0);
  
    return date.toISOString()
  };

  useEffect(() => {
    if(date && hour && minute) {
      setFormData({ 
        ...formData, 
        deadLine: formatTime(date, hour, minute) 
      });
    } 

    if(formErrors.deadLine) {
      setFormErrors({ ...formErrors, deadLine: '' });
    }
  }, [date, hour, minute]);

  const formatDisplayDate = () => {
    try {
      if(!date) return 'Select date';

      const dateObj = new Date(date);

      if (isNaN(dateObj.getTime())) {
        return date;
      }

      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); 
      const year = dateObj.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return date;
    }
  }

  const handleDateChange = (selectedDate: any) => {
    setDate(selectedDate);
    setShowCalendar(false);
  };
  
  const handleHourChange = (text: string) => {
    if (!text) {
      setHour('');
      return;
    }
    
    const hourNum = parseInt(text, 10);
    if (!isNaN(hourNum) && hourNum >= 0 && hourNum <= 23) {
      setHour(text);
    } else {
      setFormErrors({ 
        ...formErrors, 
        deadLine: 'Hour must be between 0-23' 
      });
    }
  };
  
  const handleMinuteChange = (text: string) => {
    if (!text) {
      setMinute('');
      return;
    }
    
    const minuteNum = parseInt(text, 10);
    if (!isNaN(minuteNum) && minuteNum >= 0 && minuteNum <= 59) {
      setMinute(text);
    } else {
      setFormErrors({ 
        ...formErrors, 
        deadLine: 'Minute must be between 0-59' 
      });
    }
  };
  const RenderDeadline = () => {
    return (
      <View style={styles.timeInputContainer}>
      <View style={styles.timeField}>
        <Text style={styles.timeLabel}>Time due</Text>
        <View style={styles.timeInputWrapper}>
          <TextInput
            style={styles.timeInput}
            placeholder='HH'
            keyboardType='number-pad'
            maxLength={2}
            value={hour}
            onChangeText={(text) => {
              handleHourChange(text);
            }}
          />
          <Text style={styles.timeSeparator}>:</Text>
          <TextInput
            style={styles.timeInput}
            placeholder='MM'
            keyboardType='number-pad'
            maxLength={2}
            value={minute}
            onChangeText={(text) => {
              handleMinuteChange(text);
            }}
          />
        </View>
      </View>

      <View style={styles.timeField}>
        <Text style={styles.timeLabel}>Date due</Text>
        <TouchableOpacity 
          style={styles.dateSelector}
          onPress={() => setShowCalendar(true)}
        >
          <Text style={styles.dateText}>{formatDisplayDate()}</Text>
          <Feather name='calendar' size={20} color='#333' />
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCalendar(false)}
        >
          <View 
            style={styles.calendarContainer}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select a date</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Feather name='x' size={24} color='#333' />
              </TouchableOpacity>
            </View>
            <CalendarPicker
              onDateChange={handleDateChange}
              minDate={new Date()}
              selectedDayColor='#007AFF'
              selectedDayTextColor='#FFFFFF'
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
    );
  };

  return (
    <View style={styles.container}>
      { assignments.length !== 0 ? (
        <FlatList
          data={assignments}
          renderItem={renderAssignmentItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      ) : (
        <View style={styles.content}>
          <Image
            source={require('../../assets/stackOfBooks.png')}
            resizeMode='cover'
          />
          <Text>There are no assignments at this time.</Text>
        </View>
      )}

      {/* Add assignment */}
      { state.info.role === 'TEACHER' && (
        <View>
          <TouchableOpacity
            style={styles.button_add}
            onPress={() => setIsFormVisible(true)}
          >
            <Ionicons name='add' size={24} color='white' />
          </TouchableOpacity>
        </View>
      )}
      <Modal
        animationType='slide'
        visible={isFormVisible}
        onRequestClose={() => setIsFormVisible(false)}
      >
        <SafeAreaView style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Assignment</Text>
            <TouchableOpacity onPress={() => {
                setIsFormVisible(false); 
                resetForm();
              }}>
              <Ionicons name='close' size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={[styles.input, formErrors.title ? styles.inputError : null]}
                placeholder='Enter title'
                value={formData.title}
                onChangeText={(text) => {
                  setFormData({ ...formData, title: text });
                  if (formErrors.title) {
                    setFormErrors({ ...formErrors, title: '' });
                  }
                }}
              />
              {formErrors.title ? <Text style={styles.errorText}>{formErrors.title}</Text> : null}
            </View>

            <View style={styles.formField}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder='Enter description'
                multiline={true}
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => {
                  setFormData({ ...formData, description: text });
                  if(formErrors.description) {
                    setFormErrors({ ...formErrors, description: '' });
                  }
                }}
              />
              {formErrors.description ? <Text style={styles.errorText}>{formErrors.description}</Text> : null}
            </View>

            <View style={styles.formField}>
              <Text style={styles.inputLabel}>Deadline</Text>
              <RenderDeadline/>
              {formErrors.deadLine ? <Text style={styles.errorText}>{formErrors.deadLine}</Text> : null}
            </View>

            <View style={styles.formField}>
              <Text style={styles.inputLabel}>Attachment</Text>
              <TouchableOpacity style={styles.filePickerButton} onPress={handleFilePicker}>
                <Text style={styles.filePickerText}>Choose file</Text>
              </TouchableOpacity>
              
              {formData.files.length > 0 && (
                <View style={styles.fileListContainer}>
                  {formData.files.map((file, index) => (
                    <View key={index} style={styles.fileItem}>
                      <Text style={styles.fileName} numberOfLines={1} ellipsizeMode='middle'>
                        {file.name}
                      </Text>
                      <TouchableOpacity onPress={() => removeFile(index)}>
                        <Ionicons name='close-circle' size={20} color='#ff6b6b' />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {formErrors.files ? <Text style={styles.errorText}>{formErrors.files}</Text> : null}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Add Assignment</Text>
            </TouchableOpacity>

            <View style={{ height: 50 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
  },

  button_add: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  formField: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
  },
  filePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  filePickerText: {
    color: '#555',
    fontWeight: '500',
  },
  fileListContainer: {
    marginTop: 8,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  fileName: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#4B89DC',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  timeInputContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  timeField: {
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  timeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    width: 50,
    textAlign: 'center',
  },
  timeSeparator: {
    marginHorizontal: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TeamAssignmentScreen;
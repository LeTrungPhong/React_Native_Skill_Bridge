import { StyleSheet, FlatList, TouchableOpacity, Button, Modal, TextInput, ScrollView, Switch, SafeAreaView, Alert } from 'react-native';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TeamItem, Team } from '@/src/components/teams/TeamItem';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TeamsStackParamList } from '@/src/navigation/type';
import { AuthContext } from '@/src/context/authContext';
import api from '@/src/api/axios'; // Import your API utility

type TeamsScreenNavigationProp = StackNavigationProp<TeamsStackParamList, 'TeamsList'>;

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
type TimeField = 'startHour' | 'startMinute' | 'endHour' | 'endMinute';

interface DaySchedule {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

interface ScheduleItem {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

interface FormDataType {
  className: string;
  weeks: string;
  roomName: string;
  days: {
    [key in DayOfWeek]: boolean;
  };
  times: {
    [key in DayOfWeek]: DaySchedule;
  };
}

interface FormErrorsType {
  className: string;
  weeks: string;
  roomName: string;
  schedule: string;
}

export default function TeamsScreen() {
  const colorScheme = useColorScheme();
  const [teams, setTeams] = useState<Team[]>();
  const navigation = useNavigation<TeamsScreenNavigationProp>();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrorsType>({
    className: '',
    weeks: '',
    roomName: '',
    schedule: ''
  });
  const [formData, setFormData] = useState<FormDataType>({
    className: '',
    weeks: '',
    roomName: '',
    days: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
    },
    times: {
      Monday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
      Tuesday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
      Wednesday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
      Thursday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
      Friday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
      Saturday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
    }
  });

  const [isJoinFormVisible, setIsJoinFormVisible] = useState(false);
  const [classIdToJoin, setClassIdToJoin] = useState('');
  const [foundClass, setFoundClass] = useState<Team | null>(null);
  const [searchError, setSearchError] = useState('');

  const [state] = useContext(AuthContext);
  console.log('AuthContext state:', state);

  const fetchTeams = async () => {
    try {
      // Simulate fetching data from an API or local storage
      if (state.user.role == 'TEACHER') {
        const data = await api.get('/api/classes/teacher') // Replace with your API endpoint
        // const data = await response.json();
        console.log('Fetched teams:', data);
        if (data && data.data && data.data.result) {
          // Transform the API response to match the Team interface
          const transformedData: Team[] = data.data.result.map((item: any) => ({
            id: item.id,
            name: item.name,
            initials: (removeVietnameseTones(item.name || '')).substring(0, 2).toUpperCase(),
            description: `Room: ${item.lessons[0].room || 'N/A'}, Weeks: ${item.numberOfWeeks || 'N/A'}`,
          }));

          console.log('Transformed teams data:', transformedData);
          setTeams(transformedData); 
        }
      } else if (state.user.role == 'STUDENT') { 
        const data = await api.get('/api/classes/student') // Replace with your API endpoint
        // const data = await response.json();
        console.log('Fetched teams:', data.data.result);
        if (data && data.data && data.data.result) {
          // Transform the API response to match the Team interface
          const transformedData: Team[] = data.data.result.map((item: any) => ({
            id: item.id, 
            name: item.name,
            initials: (removeVietnameseTones(item.name || '')).substring(0, 2).toUpperCase(),
            description: `Room: ${item.lessons[0].room || 'N/A'}, Weeks: ${item.numberOfWeeks || 'N/A'}`,
          }));

          console.log('Transformed teams data:', transformedData);
          setTeams(transformedData);
        }
      }
      // setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  // Thêm hàm tìm kiếm lớp học theo ID
  const searchClassById = async () => {
    if (!classIdToJoin.trim()) {
      setSearchError('Vui lòng nhập ID lớp học');
      return;
    }

    setSearchError('');
    
    try {
      // Gọi API để tìm kiếm lớp học theo ID
      const response = await api.get(`/api/classes/${classIdToJoin}`);
      console.log('Found class:', response.data)
      
      if (response.data) {
        const classData = response.data;
        // Chuyển đổi dữ liệu API thành định dạng Team
        setFoundClass({
          id: classData.id,
          name: classData.name,
          initials: (removeVietnameseTones(classData.name || '')).substring(0, 2).toUpperCase(),
          description: `Room: ${classData.lessons && classData.lessons[0] ? classData.lessons[0].room : 'N/A'}, Weeks: ${classData.numberOfWeeks || 'N/A'}`,
        });
      } else {
        setSearchError('Không tìm thấy lớp học với ID đã nhập');
        setFoundClass(null);
      }
    } catch (error) {
      console.error('Error searching for class:', error);
      setSearchError('Lớp không tồn tại hoặc đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.');
      setFoundClass(null);
    }
  };

  // Thêm hàm xử lý tham gia lớp học
  const handleJoinClass = async () => {
    if (!foundClass) return;
    
    try {
      // Gọi API để tham gia lớp học
      await api.post(`/api/enrollments`, {
        'classId': foundClass.id,
      });
      
      // Cập nhật danh sách lớp học
      await fetchTeams();
      
      // Hiển thị thông báo thành công
      Alert.alert(
        'Thành công',
        `Bạn đã tham gia lớp ${foundClass.name}`,
        [{ text: 'OK' }]
      );
      
      // Reset form và đóng modal
      setFoundClass(null);
      setClassIdToJoin('');
      setIsJoinFormVisible(false);
    } catch (error) {
      console.error('Error joining class:', error);
      Alert.alert(
        'Lỗi',
        'Đã xảy ra lỗi khi tham gia lớp học. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    }
  };

  // Thêm hàm reset form tham gia
  const resetJoinForm = () => {
    setClassIdToJoin('');
    setFoundClass(null);
    setSearchError('');
  };

  useEffect(() => {
    // Fetch teams from the server or local storage
    fetchTeams();
  }, []);

  const resetForm = () => {
    setFormData({
      className: '',
      weeks: '',
      roomName: '',
      days: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
      },
      times: {
        Monday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
        Tuesday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
        Wednesday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
        Thursday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
        Friday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
        Saturday: { startHour: '', startMinute: '', endHour: '', endMinute: '' },
      }
    });
    setFormErrors({
      className: '',
      weeks: '',
      roomName: '',
      schedule: ''
    });
  };

  const toggleDay = (day: DayOfWeek) => {
    setFormData({
      ...formData,
      days: {
        ...formData.days,
        [day]: !formData.days[day]
      }
    });

    // Clear any schedule error when a day is selected
    if (formErrors.schedule && !formData.days[day]) {
      setFormErrors({
        ...formErrors,
        schedule: ''
      });
    }
  };

  const updateTimeField = (day: DayOfWeek, field: TimeField, value: string) => {
    // Allow only numeric values
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    setFormData({
      ...formData,
      times: {
        ...formData.times,
        [day]: {
          ...formData.times[day],
          [field]: value
        }
      }
    });
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrorsType = {
      className: '',
      weeks: '',
      roomName: '',
      schedule: ''
    };

    // Validate class name
    if (!formData.className.trim()) {
      newErrors.className = 'Class name is required';
      isValid = false;
    }

    // Validate weeks
    if (!formData.weeks.trim()) {
      newErrors.weeks = 'Number of weeks is required';
      isValid = false;
    } else if (!/^\d+$/.test(formData.weeks) || parseInt(formData.weeks) <= 0) {
      newErrors.weeks = 'Please enter a valid number';
      isValid = false;
    }

    // Validate room name
    if (!formData.roomName.trim()) {
      newErrors.roomName = 'Room name is required';
      isValid = false;
    }

    // Validate that at least one day is selected
    const anyDaySelected = Object.values(formData.days).some(day => day);
    if (!anyDaySelected) {
      newErrors.schedule = 'Please select at least one day';
      isValid = false;
    } else {
      // Validate time fields for selected days
      const daysWithMissingTimes: DayOfWeek[] = [];

      (Object.keys(formData.days) as DayOfWeek[]).forEach(day => {
        if (formData.days[day]) {
          const times = formData.times[day];
          if (!times.startHour || !times.startMinute || !times.endHour || !times.endMinute) {
            daysWithMissingTimes.push(day);
            isValid = false;
          }
        }
      });

      if (daysWithMissingTimes.length > 0) {
        newErrors.schedule = `Please complete time fields for: ${daysWithMissingTimes.join(', ')}`;
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check the form for errors');
      return;
    }

    // Convert form data to the desired format
    const scheduleData: ScheduleItem[] = [];

    (Object.keys(formData.days) as DayOfWeek[]).forEach(day => {
      if (formData.days[day]) {
        const times = formData.times[day];
        scheduleData.push({
          day,
          startTime: `${times.startHour}:${times.startMinute}`,
          endTime: `${times.endHour}:${times.endMinute}`
        });
      }
    });

    // // Create a new team object
    // const newTeam: Team = {
    //   id: (teams.length + 1).toString(),
    //   name: formData.className,
    //   initials: formData.className.substring(0, 2).toUpperCase(),
    //   description: `Room: ${formData.roomName}, Weeks: ${formData.weeks}`,
    //   // Add additional fields if needed in your Team interface
    //   // schedule: scheduleData
    // };

    // // Add the new team to the list
    // setTeams([...teams, newTeam]);

    // Log the full data for debugging
    console.log('Form submitted successfully:', {
      className: formData.className,
      weeks: formData.weeks,
      roomName: formData.roomName,
      schedule: scheduleData
    });

    scheduleData.forEach((schedule) => {
      console.log(`Day: ${schedule.day}, Start Time: ${schedule.startTime}, End Time: ${schedule.endTime}`);
    });

    api.post('/api/classes', {
      name: formData.className,
      numberOfWeeks: formData.weeks,
      dateStudy: scheduleData.reduce((result, { day, startTime, endTime }) => {
        result[day] = {
          startTime: `${startTime}:00`,
          endTime: `${endTime}:00`
        };
        return result;
      }, {} as Record<string, { startTime: string; endTime: string }>)
    });

    // const res = await api.get('/api/classes/teacher');
    // setTeams(res.data.result.map((item: any) => ({
    //     id: item.id,
    //     name: item.name,
    //     initials: (removeVietnameseTones(item.name || '')).substring(0, 2).toUpperCase(),
    //     description: `Room: ${item.lessons[0].room || 'N/A'}, Weeks: ${item.numberOfWeeks || 'N/A'}`,
    //   })));

    fetchTeams();

    // Show success message
    Alert.alert('Success', 'New class has been created successfully');

    // Reset form and close modal
    resetForm();
    setIsFormVisible(false);
    // fetchTeams();
  };

  const renderTeamItem = ({ item }: { item: Team }) => (
    <TeamItem
      team={item}
      onPress={() => {
        console.log(`Selected team: ${item.name}`);
        // Navigate to the GeneralScreen with the selected team as a parameter
        navigation.navigate('GeneralScreen', { team: item });
      }}
    />
  );

  const renderTimeInputs = (day: DayOfWeek) => {
    if (!formData.days[day]) return null;

    return (
      <View style={styles.timeInputContainer}>
        <View style={styles.timeField}>
          <Text style={styles.timeLabel}>Start:</Text>
          <View style={styles.timeInputWrapper}>
            <TextInput
              style={styles.timeInput}
              placeholder="HH"
              keyboardType="number-pad"
              maxLength={2}
              value={formData.times[day].startHour}
              onChangeText={(text) => updateTimeField(day, 'startHour', text)}
            />
            <Text>:</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="MM"
              keyboardType="number-pad"
              maxLength={2}
              value={formData.times[day].startMinute}
              onChangeText={(text) => updateTimeField(day, 'startMinute', text)}
            />
          </View>
        </View>

        <View style={styles.timeField}>
          <Text style={styles.timeLabel}>End:</Text>
          <View style={styles.timeInputWrapper}>
            <TextInput
              style={styles.timeInput}
              placeholder="HH"
              keyboardType="number-pad"
              maxLength={2}
              value={formData.times[day].endHour}
              onChangeText={(text) => updateTimeField(day, 'endHour', text)}
            />
            <Text>:</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="MM"
              keyboardType="number-pad"
              maxLength={2}
              value={formData.times[day].endMinute}
              onChangeText={(text) => updateTimeField(day, 'endMinute', text)}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BlurView
        intensity={80}
        style={styles.header}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Teams</Text>
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            style={styles.searchIcon}
          />
          <Text style={styles.searchText}>Search</Text>
        </View>
      </BlurView>
      <FlatList
        data={teams}
        renderItem={renderTeamItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      {
        state.user.role === 'TEACHER' ? (
          <View>
            <TouchableOpacity
              style={styles.button_add}
              onPress={() => setIsFormVisible(true)}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={styles.button_join}
              onPress={() => setIsJoinFormVisible(true)}
            >
              <Ionicons name="enter-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

      {/* Class Addition Form Modal */}
      <Modal
        animationType="slide"
        visible={isFormVisible}
        onRequestClose={() => setIsFormVisible(false)}
      >
        <SafeAreaView style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Class</Text>
            <TouchableOpacity onPress={() => setIsFormVisible(false)}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={styles.formField}>
              <Text style={styles.inputLabel}>Class Name</Text>
              <TextInput
                style={[styles.input, formErrors.className ? styles.inputError : null]}
                placeholder="Enter class name"
                value={formData.className}
                onChangeText={(text) => {
                  setFormData({ ...formData, className: text });
                  if (formErrors.className) {
                    setFormErrors({ ...formErrors, className: '' });
                  }
                }}
              />
              {formErrors.className ? <Text style={styles.errorText}>{formErrors.className}</Text> : null}
            </View>

            <View style={styles.formField}>
              <Text style={styles.inputLabel}>Number of Weeks</Text>
              <TextInput
                style={[styles.input, formErrors.weeks ? styles.inputError : null]}
                placeholder="Enter number of weeks"
                keyboardType="number-pad"
                value={formData.weeks}
                onChangeText={(text) => {
                  setFormData({ ...formData, weeks: text });
                  if (formErrors.weeks) {
                    setFormErrors({ ...formErrors, weeks: '' });
                  }
                }}
              />
              {formErrors.weeks ? <Text style={styles.errorText}>{formErrors.weeks}</Text> : null}
            </View>

            <View style={styles.formField}>
              <Text style={styles.inputLabel}>Room Name</Text>
              <TextInput
                style={[styles.input, formErrors.roomName ? styles.inputError : null]}
                placeholder="Enter room name"
                value={formData.roomName}
                onChangeText={(text) => {
                  setFormData({ ...formData, roomName: text });
                  if (formErrors.roomName) {
                    setFormErrors({ ...formErrors, roomName: '' });
                  }
                }}
              />
              {formErrors.roomName ? <Text style={styles.errorText}>{formErrors.roomName}</Text> : null}
            </View>

            <Text style={[styles.inputLabel, { marginTop: 20 }]}>Class Schedule</Text>
            {formErrors.schedule ? <Text style={styles.errorText}>{formErrors.schedule}</Text> : null}

            {/* Days of week */}
            <View style={styles.daysContainer}>
              {/* Monday */}
              <View style={styles.dayRow}>
                <Text style={styles.dayText}>Monday</Text>
                <Switch
                  value={formData.days.Monday}
                  onValueChange={() => toggleDay('Monday')}
                />
              </View>
              {renderTimeInputs('Monday')}

              {/* Tuesday */}
              <View style={styles.dayRow}>
                <Text style={styles.dayText}>Tuesday</Text>
                <Switch
                  value={formData.days.Tuesday}
                  onValueChange={() => toggleDay('Tuesday')}
                />
              </View>
              {renderTimeInputs('Tuesday')}

              {/* Wednesday */}
              <View style={styles.dayRow}>
                <Text style={styles.dayText}>Wednesday</Text>
                <Switch
                  value={formData.days.Wednesday}
                  onValueChange={() => toggleDay('Wednesday')}
                />
              </View>
              {renderTimeInputs('Wednesday')}

              {/* Thursday */}
              <View style={styles.dayRow}>
                <Text style={styles.dayText}>Thursday</Text>
                <Switch
                  value={formData.days.Thursday}
                  onValueChange={() => toggleDay('Thursday')}
                />
              </View>
              {renderTimeInputs('Thursday')}

              {/* Friday */}
              <View style={styles.dayRow}>
                <Text style={styles.dayText}>Friday</Text>
                <Switch
                  value={formData.days.Friday}
                  onValueChange={() => toggleDay('Friday')}
                />
              </View>
              {renderTimeInputs('Friday')}

              {/* Saturday */}
              <View style={styles.dayRow}>
                <Text style={styles.dayText}>Saturday</Text>
                <Switch
                  value={formData.days.Saturday}
                  onValueChange={() => toggleDay('Saturday')}
                />
              </View>
              {renderTimeInputs('Saturday')}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Create Class</Text>
            </TouchableOpacity>

            <View style={{ height: 50 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Join Class Form Modal */}
      <Modal
        animationType="slide"
        visible={isJoinFormVisible}
        onRequestClose={() => {
          resetJoinForm();
          setIsJoinFormVisible(false);
        }}
      >
        <SafeAreaView style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tham gia lớp học</Text>
            <TouchableOpacity onPress={() => {
              resetJoinForm();
              setIsJoinFormVisible(false);
            }}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.formField}>
            <Text style={styles.inputLabel}>Mã lớp học</Text>
            <View style={styles.searchClassContainer}>
              <TextInput
                style={[
                  styles.input, 
                  styles.searchClassInput,
                  searchError ? styles.inputError : null
                ]}
                placeholder="Nhập mã lớp học"
                value={classIdToJoin}
                onChangeText={(text) => {
                  setClassIdToJoin(text);
                  if (searchError) setSearchError('');
                }}
              />
              <TouchableOpacity 
                style={styles.searchClassButton}
                onPress={searchClassById}
              >
                <Ionicons name="search" size={20} color="white" />
              </TouchableOpacity>
            </View>
            {searchError ? <Text style={styles.errorText}>{searchError}</Text> : null}
          </View>

          {/* Hiển thị thông tin lớp học tìm thấy */}
          {foundClass && (
            <View style={styles.foundClassCard}>
              <View style={styles.foundClassHeader}>
                <View style={styles.classInitials}>
                  <Text style={styles.classInitialsText}>{foundClass.initials}</Text>
                </View>
                <View style={styles.classInfo}>
                  <Text style={styles.className}>{foundClass.name}</Text>
                  <Text style={styles.classDescription}>{foundClass.description}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.joinButton}
                onPress={handleJoinClass}
              >
                <Text style={styles.joinButtonText}>Tham gia</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchText: {
    color: '#999',
  },
  list: {
    flex: 1,
    padding: 16,
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
    backgroundColor: 'white',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalScroll: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayText: {
    fontSize: 16,
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timeField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  timeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    width: 40,
    padding: 4,
    textAlign: 'center',
    marginHorizontal: 2,
  },
  submitButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formField: {
    marginBottom: 16,
  },
  daysContainer: {
    marginBottom: 20,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
  },
  button_join: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#34A853', // Màu xanh lá cây
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchClassContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchClassInput: {
    flex: 1,
    marginRight: 8,
  },
  searchClassButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foundClassCard: {
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foundClassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  classInitials: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  classInitialsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  classDescription: {
    fontSize: 14,
    color: '#757575',
  },
  joinButton: {
    backgroundColor: '#34A853',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

function removeVietnameseTones(str: any) {
  return str.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D");
}
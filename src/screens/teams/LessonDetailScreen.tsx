import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { apiJson } from '@/src/api/axios';

// Định nghĩa kiểu cho params của route
type LessonDetailParams = {
    lessonId: string;
    date: string;
    startTime: string;
    endTime: string;
};

type LessonDetailScreenRouteProp = RouteProp<
    { LessonDetailScreen: LessonDetailParams },
    'LessonDetailScreen'
>;

// Định nghĩa các trạng thái điểm danh có thể có
type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED';

// Định nghĩa cấu trúc status option
interface StatusOption {
    value: AttendanceStatus;
    label: string;
    color: string;
}

// Các option trạng thái điểm danh
const STATUS_OPTIONS: StatusOption[] = [
    { value: 'PRESENT', label: 'Present', color: '#4CAF50' },
    { value: 'LATE', label: 'Late', color: '#FF9800' },
    { value: 'ABSENT', label: 'Absent', color: '#F44336' },
    { value: 'EXCUSED', label: 'Excused', color: '#9E9E9E' }
];

export default function LessonDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute<LessonDetailScreenRouteProp>();
    const { lessonId, date, startTime, endTime } = route.params;
    const [data, setData] = useState<any>([]); 
    const [loading, setLoading] = useState(true);
    const [updatingAttendance, setUpdatingAttendance] = useState(false);
    
    // State để quản lý modal chọn trạng thái
    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const fetchLessonDetail = async () => {
        try {
            setLoading(true);
            const response = await apiJson.get(`/api/attendance/lesson/${lessonId}`);
            console.log("Lesson detail data:", response.data);
            if (response && response.data) {
                // Chuyển đổi dữ liệu API thành định dạng chuẩn hóa
                const formattedData = response.data.map((item: any) => ({
                    ...item,
                    // Chuyển đổi trạng thái thành dạng viết hoa nếu cần
                    status: item.status?.toUpperCase() || 'ABSENT'
                }));
                setData(formattedData);
            }
        } catch (error) {
            console.error("Error fetching lesson detail:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm cập nhật trạng thái điểm danh
    const updateAttendanceStatus = async (studentId: number, newStatus: AttendanceStatus) => {
        try {
            setUpdatingAttendance(true);
            
            // Gọi API cập nhật trạng thái điểm danh
            await apiJson.post(`/api/attendance`, {
                studentId,
                lessonId: lessonId,
                status: newStatus
            });
            
            // Cập nhật state local để hiển thị ngay lập tức
            fetchLessonDetail();
            
            console.log(`Updated attendance status for student ${studentId} to ${newStatus}`);
        } catch (error) {
            console.error("Error updating attendance status:", error);
            // Có thể hiển thị thông báo lỗi ở đây
        } finally {
            setUpdatingAttendance(false);
        }
    };

    // Hàm mở modal chọn trạng thái
    const openStatusPicker = (student: any) => {
        setSelectedStudent(student);
        setShowStatusPicker(true);
    };

    // Hàm chọn trạng thái mới và cập nhật
    const selectNewStatus = (status: AttendanceStatus) => {
        if (selectedStudent) {
            updateAttendanceStatus(selectedStudent.studentId, status);
        }
        setShowStatusPicker(false);
    };

    // Fetch dữ liệu lesson detail khi component mount
    useEffect(() => {
        fetchLessonDetail();
    }, []);

    // Hàm lấy màu tương ứng với trạng thái
    const getStatusColor = (status: string): string => {
        const option = STATUS_OPTIONS.find(opt => opt.value === status.toUpperCase());
        return option ? option.color : '#757575';
    };

    // Hàm lấy label hiển thị cho trạng thái
    const getStatusLabel = (status: string): string => {
        const option = STATUS_OPTIONS.find(opt => opt.value === status.toUpperCase());
        return option ? option.label : status;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header với nút trở về */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Attendance</Text>
                <View style={{ width: 24 }} />
            </View>
            
            {/* Thông tin buổi học */}
            <View style={styles.lessonInfoContainer}>
                <Text style={styles.lessonDate}>Date: {date}</Text>
                <Text style={styles.lessonTime}>Time: {startTime} - {endTime}</Text>
            </View>
            
            {/* Loading indicator while fetching data */}
            {loading ? (
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="#4285F4" />
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>Loading attendance data...</Text>
                </View>
            ) : data.length === 0 ? (
                <View style={styles.content}>
                    <Text style={styles.noDataText}>No attendance data available</Text>
                </View>
            ) : (
                <View style={styles.attendanceListContainer}>
                    <Text style={styles.sectionTitle}>Attendance List</Text>
                    {data.map((item: any, index: number) => (
                        <View key={index} style={styles.attendanceCard}>
                            <View style={styles.studentInfo}>
                                <Text style={styles.studentName}>{item.studentName}</Text>
                                <Text style={styles.checkinTime}>
                                    Check In: {item.checkinDate == null 
                                        ? 'Not checked in' 
                                        : new Date(item.checkinDate).toLocaleString('en-US', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                </Text>
                            </View>
                            
                            <View style={styles.statusContainer}>
                                <Text style={styles.statusLabel}>Status: </Text>
                                <TouchableOpacity 
                                    style={[
                                        styles.statusButton,
                                        { backgroundColor: getStatusColor(item.status) }
                                    ]}
                                    onPress={() => openStatusPicker(item)}
                                    disabled={updatingAttendance}
                                >
                                    <Text style={styles.statusButtonText}>
                                        {getStatusLabel(item.status)}
                                    </Text>
                                    <Ionicons name="chevron-down" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}
            
            {/* Modal cho Status Picker */}
            <Modal
                transparent={true}
                visible={showStatusPicker}
                animationType="fade"
                onRequestClose={() => setShowStatusPicker(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowStatusPicker(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Update Status for {selectedStudent?.studentName}
                        </Text>
                        
                        {STATUS_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.statusOption,
                                    { backgroundColor: option.color }
                                ]}
                                onPress={() => selectNewStatus(option.value)}
                            >
                                <Text style={styles.statusOptionText}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                        
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => setShowStatusPicker(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    lessonInfoContainer: {
        backgroundColor: 'white',
        padding: 16,
        marginTop: 10,
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    lessonDate: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    lessonTime: {
        fontSize: 14,
        color: '#666',
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    attendanceListContainer: {
        padding: 16,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 12,
    },
    attendanceCard: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    studentInfo: {
        marginBottom: 8,
    },
    studentName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkinTime: {
        color: '#666',
        fontSize: 14,
        marginTop: 2,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusLabel: {
        fontSize: 14,
        marginRight: 8,
    },
    statusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusButtonText: {
        color: 'white',
        fontWeight: '500',
        marginRight: 4,
    },
    noDataText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    // Styles cho modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    statusOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    statusOptionText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 5,
        padding: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
});
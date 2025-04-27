import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '@/src/api/axios';

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

export default function LessonDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute<LessonDetailScreenRouteProp>();
    const { lessonId, date, startTime, endTime } = route.params;
    const [data, setData] = useState<any>([]); 

    const fetchLessonDetail = async () => {
        try {
            const response = await api.get(`/api/attendance/lesson/${lessonId}`);
            console.log("Lesson detail data:", response.data);
            if (response && response.data) {
                setData(response.data);
            }
            // Xử lý dữ liệu lesson detail ở đây
        } catch (error) {
            console.error("Error fetching lesson detail:", error);
            // Xử lý lỗi ở đây
        }
    };

    // Fetch dữ liệu lesson detail khi component mount
    useEffect(() => {
        fetchLessonDetail();
    }, []);

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
            <View style={{ padding: 16 }}>
                <Text>Date: {date}</Text>
                <Text>Start Time: {startTime}</Text>
                <Text>End Time: {endTime}</Text>
            </View>
            {/* Loading indicator while fetching data */}
            {data.length === 0 ? (
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="#4285F4" />
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>Loading attendance data...</Text>
                </View>
            ) : (
                <View style={{ padding: 16 }}>
                    <Text style={styles.sectionTitle}>Attendance List</Text>
                    {data.map((item: any, index: number) => (
                        <View key={index} style={{
                            backgroundColor: 'white',
                            padding: 16,
                            marginBottom: 10,
                            borderRadius: 8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 2,
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.studentName}</Text>
                            {/* <Text style={{ color: '#666' }}>Student ID: {item.studentId}</Text> */}
                            <Text style={{ color: '#666' }}>Check In: {item.checkinDate == null ? 'Null' : item.checkinDate}</Text>
                            <View style={{ 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                marginTop: 8 
                            }}>
                                <Text>Status: </Text>
                                <Text style={{ 
                                    fontWeight: 'bold', 
                                    color: item.status === 'Present' ? 'green' : 'red' 
                                }}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
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
    lessonHeader: {
        backgroundColor: 'white',
        padding: 20,
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    lessonTime: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    classId: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },
    lessonContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    noDataText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});
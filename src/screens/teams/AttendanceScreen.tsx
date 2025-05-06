import api from "@/src/api/axios";
import Attendance from "@/src/components/teams/Attendance";
import Lesson from "@/src/components/teams/Lesson";
import { AuthContext } from "@/src/context/authContext";
import { GeneralScreenRouteProp } from "@/src/navigation/type";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type AttendanceStatus = "Attendance" | "Late" | "Absent";

export interface AttendanceRecord {
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  status: AttendanceStatus;
}

export interface LessonRecord {
    id: string;
    lessonDate: string;
    startTime: string;
    endTime: string;
}

export default function AttendanceScreen() {
    const [state] = useContext(AuthContext);
    const [data, setData] = useState<AttendanceRecord[]>([]);
    const [lessonData, setLessonData] = useState<LessonRecord[]>([]);

    console.log("AttendanceScreen state:", state);

    const route = useRoute<GeneralScreenRouteProp>();
    const { team } = route.params;
    // console.log("AttendanceScreen team:", team); 

    const fetchAttendanceData = async () => {
        try {
            if (state.info.role === "STUDENT") {
                const response = await api.get(`/api/attendance/student/${state.info.id}/${team.id}`);
                // console.log("Attendance data:", response.data);
                if (response && response.data) {
                    // console.log("Attendance data:", response.data);
                    const attendanceRecords: AttendanceRecord[] = response.data.map((record: any) => {
                        // Parse the date and format to DD/MM/YYYY
                        const date = new Date(record.lessonDate);
                        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                        
                        return {
                            date: formattedDate,
                            time: record.checkinDate,
                            status: record.status,
                        };
                    });
                    setData(attendanceRecords);
                }
            } else if (state.info.role === "TEACHER") {
                const response = await api.get(`/api/lesson/${team.id}`);
                // console.log("Lesson data:", response.data);

                if (response && response.data) {
                    const lessonRecords: LessonRecord[] = response.data.map((record: any) => {
                        // Parse the date and format to DD/MM/YYYY
                        const date = new Date(record.lessonDate);
                        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                        
                        // Extract just hours and minutes from time strings
                        const formatTime = (timeStr: string) => {
                            if (!timeStr) return "";
                            // Handle full datetime strings by extracting only time portion
                            try {
                                const date = new Date(timeStr);
                                if (!isNaN(date.getTime())) {
                                    return date.toTimeString().substring(0, 5); // Get HH:MM format
                                }
                            } catch (e) {
                                // Continue if parsing fails
                            }
                            
                            // Fallback to simple extraction for time-only strings
                            const timeParts = timeStr.split(':');
                            return timeParts.length >= 2 ? `${timeParts[0]}:${timeParts[1]}` : timeStr;
                        };
                        
                        return {
                            id: record.id,
                            lessonDate: formattedDate,
                            startTime: formatTime(record.startTime),
                            endTime: formatTime(record.endTime)
                        };
                    });
                    setLessonData(lessonRecords);
                }

            }
        } catch (error) { 
            console.error("Error fetching attendance data:", error);
        }
    }

    useEffect(() => {
        // Fetch attendance data from API or local storage if needed
        fetchAttendanceData();
    }, []); 

    return (
        state.info.role === "STUDENT" ? (
            <ScrollView contentContainerStyle={styles.container}>
                {data.map((record, index) => (
                    <Attendance key={index} data={record} />
                ))}
            </ScrollView>) : (
            <ScrollView contentContainerStyle={styles.container}>
                {lessonData.map((record, index) => (
                    <Lesson key={index} data={record} />
                ))}
            </ScrollView>
        )
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 20,

    },
});
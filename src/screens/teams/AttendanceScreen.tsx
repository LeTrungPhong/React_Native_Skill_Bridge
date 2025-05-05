import { apiJson } from "@/src/api/axios";
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
                const response = await apiJson.get(`/api/attendance/student/${state.info.id}/${team.id}`);
                // console.log("Attendance data:", response.data);
                if (response && response.data) {
                    // console.log("Attendance data:", response.data);
                    const attendanceRecords: AttendanceRecord[] = response.data.map((record: any) => ({
                        date: record.lessonDate,
                        time: record.checkinDate,
                        status: record.status,
                    }));
                    setData(attendanceRecords);
                }
            } else if (state.info.role === "TEACHER") {
                const response = await apiJson.get(`/api/lesson/${team.id}`);
                // console.log("Lesson data:", response.data);

                if (response && response.data) {
                    const lessonRecords: LessonRecord[] = response.data.map((record: any) => ({
                        lessonDate: record.lessonDate,
                        startTime: record.startTime,
                        endTime: record.endTime,
                        id: record.id,
                    }));
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
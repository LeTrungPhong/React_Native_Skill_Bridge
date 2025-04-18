import Attendance from "@/src/components/teams/Attendance";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type AttendanceStatus = "Attendance" | "Late" | "Absent";

export interface AttendanceRecord {
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  status: AttendanceStatus;
}

const data: AttendanceRecord[] = [
    { date: "2024-04-01", time: "08:24", status: "Attendance" },
    { date: "2024-04-02", time: "09:17", status: "Late" },
    { date: "2024-04-03", time: "08:42", status: "Absent" },
    { date: "2024-04-01", time: "08:24", status: "Attendance" },
    { date: "2024-04-02", time: "09:17", status: "Late" },
    { date: "2024-04-03", time: "08:42", status: "Absent" },
    { date: "2024-04-01", time: "08:24", status: "Attendance" },
    { date: "2024-04-02", time: "09:17", status: "Late" },
    { date: "2024-04-03", time: "08:42", status: "Absent" },
]

export default function AttendanceScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {data.map((record, index) => (
                <Attendance key={index} data={record} />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 20,

    },
});
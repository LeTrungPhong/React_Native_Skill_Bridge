import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AttendanceRecord } from "@/src/screens/teams/AttendanceScreen";

type AttendanceStatus = 'Attendance' | 'Late' | 'Absent';

export default function Attendance({ data }: { data: AttendanceRecord }) {
    const getStatusColor = (status: AttendanceStatus) => {
        switch (status) {
            case 'Attendance':
                return '#4CAF50'; // xanh lá
            case 'Late':
                return '#FFC107'; // vàng
            case 'Absent':
                return '#F44336'; // đỏ
            default:
                return '#000';
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.date}>{data.date}</Text>
                <Text style={styles.time}>{data.time}</Text>
            </View>
            <Text style={[styles.status, { color: getStatusColor(data.status) }]}>
                {data.status}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 14,
        color: '#666',
    },
    status: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
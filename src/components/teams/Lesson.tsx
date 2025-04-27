import { LessonRecord } from "@/src/screens/teams/AttendanceScreen";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Lesson({ data }: { data: LessonRecord }) {

    const navigation = useNavigation<any>();

    const handleSelectLesson = () => {
        // Handle lesson selection here
        console.log("Lesson selected:", data);

        navigation.navigate('LessonDetailScreen', {
            lessonId: data.id,
            date: data.lessonDate,
            startTime: data.startTime,
            endTime: data.endTime,
        });
    }

    return (
        <TouchableOpacity onPress={handleSelectLesson} style={styles.container}>
            <View>
                <Text style={styles.date}>{data.lessonDate}</Text>
                <Text style={styles.time}>{`${data.startTime} - ${data.endTime}`}</Text>
            </View>
        </TouchableOpacity>
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
})























import Card from "@/src/components/teams/Card";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PostScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        gap: 20,
    },
});
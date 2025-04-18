import React from 'react';
import { View, Text, StyleSheet, Button, Pressable } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Team } from '@/src/components/teams/TeamItem';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Định nghĩa kiểu cho params
type PostScreenRouteProp = RouteProp<{
    PostScreen: { team: Team };
}, 'PostScreen'>;

export default function PostScreen() {
    const route = useRoute<PostScreenRouteProp>();
    const { team } = route.params;
    const navigation = useNavigation();

    useFocusEffect(() => {
        // Khi vào màn hình, ẩn tab bar
        navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'none' }
        });

        // Khi rời màn hình, hiện lại tab bar
        return () => {
            navigation.getParent()?.setOptions({
                tabBarStyle: {
                    paddingTop: 10,
                    paddingBottom: 10,
                    height: 70, 
                    borderTopColor: 'gray',
                },
            });
        };
    });
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </Pressable>
                <Text style={styles.title}>{team.name}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        // fontWeight: 'bold',
        // marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 25,
        paddingBottom: 10,
        paddingHorizontal: 16,
        gap: 20,
        elevation: 4,
    },
});
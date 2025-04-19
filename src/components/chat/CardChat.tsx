import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

export interface Chat {
    id: string;
    name: string;
    avatar?: string;
    lastMessage: string;
    initials: string; // Ký tự đầu tiên của tên
}

interface CardChatProps {
    chat: Chat;
    onPress?: () => void;
}

// Mảng các màu pastel dễ nhìn
const AVATAR_COLORS = [
    '#4285F4', // Google Blue
    '#EA4335', // Google Red
    '#FBBC05', // Google Yellow
    '#34A853', // Google Green
    '#7986CB', // Indigo
    '#9575CD', // Deep Purple
    '#4FC3F7', // Light Blue
    '#4DD0E1', // Cyan
    '#4DB6AC', // Teal
    '#81C784', // Light Green
    '#AED581', // Lime
    '#DCE775', // Yellow
    '#FFD54F', // Amber
    '#FFB74D', // Orange
    '#FF8A65', // Deep Orange
    '#A1887F', // Brown
    '#E0E0E0', // Gray
    '#90A4AE', // Blue Gray
];

// Hàm lấy màu random từ mảng màu
export function getRandomColor() {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

// Hàm lấy màu dựa trên ký tự đầu tiên (nhất quán)
export function getColorFromInitials(initials: string) {
    // Lấy ký tự đầu tiên và chuyển thành mã ASCII
    const charCode = initials.charCodeAt(0);
    // Sử dụng mã ký tự để chọn màu từ mảng
    return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
}

export default function CardChat({ chat, onPress }: CardChatProps) {
    const backgroundColor = getColorFromInitials(chat.initials);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.avatar, { backgroundColor }]}>
                <Text style={styles.avatarText}>{chat.initials}</Text>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.name} numberOfLines={1}>{chat.name}</Text>
                </View>

                <View style={styles.messageRow}>
                    <Text
                        numberOfLines={1}
                    >
                        {chat.lastMessage}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: 'white',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212121',
        flex: 1,
        marginRight: 8,
    },
    time: {
        fontSize: 12,
        color: '#757575',
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    message: {
        fontSize: 14,
        color: '#757575',
        flex: 1,
        marginRight: 8,
    },
    unreadMessage: {
        fontWeight: '500',
        color: '#212121',
    },
    unreadBadge: {
        backgroundColor: '#4285F4',
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    unreadCount: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
    },
});

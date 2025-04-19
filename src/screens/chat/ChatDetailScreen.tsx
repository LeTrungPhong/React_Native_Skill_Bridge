import React, { useEffect, useRef, useState } from "react";
import { Chat } from "@/src/components/chat/CardChat";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { 
    Pressable, 
    StyleSheet, 
    Text, 
    useColorScheme, 
    View, 
    FlatList, 
    TextInput, 
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image
} from "react-native";

type ChatDetailScreenRouteProp = RouteProp<{
    ChatDetailScreen: { chat: Chat };
}, 'ChatDetailScreen'>;

// Kiểu dữ liệu cho một tin nhắn
interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
    isSentByMe: boolean;
}

export default function ChatDetailScreen() {
    const colorScheme = useColorScheme();
    const route = useRoute<ChatDetailScreenRouteProp>();
    const { chat } = route.params;
    const navigation = useNavigation();
    const [newMessage, setNewMessage] = useState("");
    const flatListRef = useRef<FlatList>(null);

    // Dữ liệu mẫu - tin nhắn ban đầu
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Chào bạn, bạn co biet su dung AI để code khong?",
            senderId: chat.id,
            timestamp: "10:30",
            isSentByMe: false
        },
        {
            id: "2",
            text: "Mình khong, còn bạn thì sao?",
            senderId: "me",
            timestamp: "10:31",
            isSentByMe: true
        },
        {
            id: "3",
            text: "Mình cũng vậy. Nhưng nếu không biết sử dụng AI thì chúng mình sẽ bị thầy Duy mắng",
            senderId: chat.id,
            timestamp: "10:32",
            isSentByMe: false
        },
        {
            id: "4",
            text: "Vậy thì chúng mình cùng nhau học AI nhé",
            senderId: "me",
            timestamp: "10:33",
            isSentByMe: true
        },
        {
            id: "5",
            text: "oke bạn. Let's go",
            senderId: chat.id,
            timestamp: "10:35",
            isSentByMe: false
        }
    ]);

    // Cuộn xuống tin nhắn mới nhất khi mở màn hình hoặc có tin nhắn mới
    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    // Xử lý gửi tin nhắn
    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        const newMessageObj: Message = {
            id: Date.now().toString(),
            text: newMessage,
            senderId: "me",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSentByMe: true
        };

        setMessages([...messages, newMessageObj]);
        setNewMessage("");
    };

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

    // Render từng tin nhắn trong cuộc trò chuyện
    const renderMessage = ({ item }: { item: Message }) => {
        return (
            <View style={[
                styles.messageContainer,
                item.isSentByMe ? styles.myMessageContainer : styles.otherMessageContainer
            ]}>
                {!item.isSentByMe && (
                    <View style={styles.avatarContainer}>
                        {chat.avatar ? (
                            <Image source={{ uri: chat.avatar }} style={styles.avatar} />
                        ) : (
                            <FontAwesome5 name="user-circle" size={30} color="#4285F4" />
                        )}
                    </View>
                )}
                
                <View style={[
                    styles.messageBubble,
                    item.isSentByMe ? styles.myMessageBubble : styles.otherMessageBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        item.isSentByMe ? styles.myMessageText : styles.otherMessageText
                    ]}>
                        {item.text}
                    </Text>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </Pressable>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{chat.name}</Text>
                </View>
                <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="call" size={22} color="#4285F4" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="videocam" size={22} color="#4285F4" />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContainer}
            />

            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.attachButton}>
                    <Ionicons name="attach" size={24} color="#757575" />
                </TouchableOpacity>
                
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                />
                
                <TouchableOpacity 
                    style={[
                        styles.sendButton,
                        !newMessage.trim() ? styles.sendButtonDisabled : {}
                    ]}
                    onPress={handleSendMessage}
                    disabled={!newMessage.trim()}
                >
                    <Ionicons 
                        name="send" 
                        size={20} 
                        color={!newMessage.trim() ? "#BDBDBD" : "white"} 
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    onlineStatus: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 2,
    },
    headerButton: {
        padding: 8,
        marginLeft: 8,
    },
    messagesList: {
        flex: 1,
    },
    messagesContainer: {
        padding: 16,
        paddingBottom: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        maxWidth: '80%',
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
        marginLeft: 'auto',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        marginRight: 'auto',
    },
    avatarContainer: {
        marginRight: 8,
        alignSelf: 'flex-end',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 18,
        maxWidth: '100%',
    },
    myMessageBubble: {
        backgroundColor: '#4285F4',
        borderBottomRightRadius: 4,
    },
    otherMessageBubble: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        marginBottom: 4,
    },
    myMessageText: {
        color: 'white',
    },
    otherMessageText: {
        color: '#212121',
    },
    timestamp: {
        fontSize: 10,
        alignSelf: 'flex-end',
        opacity: 0.7,
        marginTop: 2,
        color: '#EEEEEE',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 8,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    attachButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 8,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#4285F4',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#F5F5F5',
    },
});




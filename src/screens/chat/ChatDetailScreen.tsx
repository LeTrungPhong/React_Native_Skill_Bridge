import React, { useEffect, useRef, useState, useContext } from "react";
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
    Image,
    ActivityIndicator,
    Alert
} from "react-native";
import { io, Socket } from "socket.io-client";
import api from "@/src/api/axios";
import { AuthContext } from "@/src/context/authContext";

type ChatDetailScreenRouteProp = RouteProp<{
    ChatDetailScreen: { chat: Chat };
}, 'ChatDetailScreen'>;

// Kiểu dữ liệu cho một tin nhắn
interface Message {
    id: string;
    text: string;
    senderId: string;
    receiverId: string;
    timestamp: string;
    isSentByMe: boolean;
}

// Định nghĩa cấu trúc tin nhắn WebSocket theo backend
interface ChatRequest {
    type: 'JOIN' | 'CHAT';
    sender: string;
    receiver: string;
    message?: string;
}

export default function ChatDetailScreen() {
    const colorScheme = useColorScheme();
    const route = useRoute<ChatDetailScreenRouteProp>();
    const { chat } = route.params;
    const navigation = useNavigation();
    const [newMessage, setNewMessage] = useState("");
    const flatListRef = useRef<FlatList>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [state] = useContext(AuthContext);
    const websocketRef = useRef<WebSocket | null>(null);
    const currentUsername = state.info.username;
    const token = state.token;

    // Kết nối tới WebSocket server
    useEffect(() => {
        if (!token) {
            Alert.alert("Lỗi", "Bạn cần đăng nhập để sử dụng chat");
            navigation.goBack();
            return;
        }

        const connectWebSocket = () => {
            try {
                setConnecting(true);
                
                // // URL WebSocket server với token xác thực
                const WS_URL = `${api.defaults.baseURL?.replace('http', 'ws') || 'ws://localhost:8080'}/websocket?token=${token}`;
                
                // // Tạo kết nối WebSocket mới
                const ws = new WebSocket(WS_URL);
                websocketRef.current = ws;

                // console.log("Connecting to WebSocket:", WS_URL);
                
                // // Xử lý sự kiện kết nối thành công
                ws.onopen = () => {
                    console.log("WebSocket connected");
                    setConnecting(false);
                    
                    // Gửi tin nhắn JOIN để thiết lập kết nối
                    const joinMessage: ChatRequest = {
                        type: 'JOIN',
                        sender: currentUsername,
                        receiver: chat.username
                    };
                    
                    ws.send(JSON.stringify(joinMessage));
                };
                
                // // Xử lý tin nhắn nhận được
                ws.onmessage = (event) => {
                    try {
                        const receivedData = JSON.parse(event.data);
                        console.log("Received message:", receivedData);
                        
                        // Kiểm tra nếu là tin nhắn CHAT
                        if (receivedData.type === 'CHAT') {
                            // Chuyển đổi message từ server thành định dạng phù hợp
                            const newMsg: Message = {
                                id: receivedData.id || Date.now().toString(),
                                text: receivedData.content,
                                senderId: receivedData.sender,
                                receiverId: receivedData.receiver,
                                timestamp: new Date(receivedData.timestamp || Date.now()).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                }),
                                isSentByMe: receivedData.sender === currentUsername
                            };
                            
                            // Thêm tin nhắn mới vào danh sách
                            setMessages(prevMessages => [...prevMessages, newMsg]);
                        }
                    } catch (error) {
                        console.error("Error parsing WebSocket message:", error);
                    }
                };
                
                // // Xử lý lỗi
                ws.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    setConnecting(false);
                };
                
                // Xử lý sự kiện đóng kết nối
                ws.onclose = (event) => {
                    console.log("WebSocket connection closed:", event.code, event.reason);
                    setConnecting(false);
                    
                    // Thử kết nối lại sau 3 giây nếu bị đóng không mong muốn
                    if (event.code !== 1000) { // 1000 là đóng bình thường
                        setTimeout(() => {
                            if (websocketRef.current === ws) { // Đảm bảo đây là kết nối cần được kết nối lại
                                connectWebSocket();
                            }
                        }, 3000);
                    }
                };
            } catch (error) {
                console.error("Error connecting to WebSocket:", error);
                setConnecting(false);
            }
        };
        
        connectWebSocket();
        
        // Cleanup khi component unmount
        return () => {
            if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
                websocketRef.current.close();
                websocketRef.current = null;
            }
        };
    }, [currentUsername, chat.username, token]);

    // Tải lịch sử tin nhắn khi vào màn hình chat
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                setLoading(true);
                
                // Gọi API lấy lịch sử chat
                const response = await api.get(`/api/message`, {
                    params: {
                        user1: currentUsername,
                        user2: chat.username,
                        // lastTime: new Date().toISOString()
                    }
                });

                console.log("Chat history response:", response.data);
                
                if (response && response.data && response.data.result.length > 0) {
                    const formattedMessages = response.data.result.map((msg: any) => ({
                        id: msg.id || Date.now().toString(),
                        text: msg.message,
                        senderId: msg.sender,
                        receiverId: msg.receiver,
                        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        }),
                        isSentByMe: msg.sender === currentUsername
                    })).reverse();
                    
                    // Cập nhật danh sách tin nhắn
                    setMessages(formattedMessages);
                }

                
            } catch (error) {
                console.error("Error fetching chat history:", error);
                // Hiển thị thông báo lỗi
                Alert.alert("Lỗi", "Không thể tải lịch sử chat. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchChatHistory();
    }, [currentUsername, chat.username]);

    // Cuộn xuống tin nhắn mới nhất khi mở màn hình hoặc có tin nhắn mới
    useEffect(() => {
        if (!loading && messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages, loading]);

    // Xử lý gửi tin nhắn
    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
            if (websocketRef.current?.readyState !== WebSocket.OPEN) {
                Alert.alert("Lỗi", "Không thể kết nối đến server, vui lòng thử lại sau");
            }
            return;
        }

        // Tạo đối tượng tin nhắn theo định dạng của server
        const messageData: ChatRequest = {
            type: 'CHAT',
            sender: currentUsername,
            receiver: chat.username,
            message: newMessage,
            // timestamp: new Date().toISOString()
        };

        // Gửi tin nhắn qua WebSocket
        try {
            websocketRef.current.send(JSON.stringify(messageData));
            
            // Thêm tin nhắn vào state local để hiển thị ngay
            const newMessageObj: Message = {
                id: Date.now().toString(),
                text: newMessage,
                senderId: currentUsername,
                receiverId: chat.username,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSentByMe: true
            };

            setMessages([...messages, newMessageObj]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            Alert.alert("Lỗi", "Không thể gửi tin nhắn. Vui lòng thử lại.");
        }
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
                    <Text style={[
                        styles.timestamp, 
                        item.isSentByMe ? styles.myTimestamp : styles.otherTimestamp
                    ]}>
                        {item.timestamp}
                    </Text>
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
                    <Text style={styles.title}>{chat.username}</Text>
                    {connecting && <Text style={styles.connectingStatus}>Đang kết nối...</Text>}
                </View>
                <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="call" size={22} color="#4285F4" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="videocam" size={22} color="#4285F4" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4285F4" />
                    <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    style={styles.messagesList}
                    contentContainerStyle={styles.messagesContainer}
                />
            )}

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
                        (!newMessage.trim() || loading || connecting || 
                         websocketRef.current?.readyState !== WebSocket.OPEN) ? 
                            styles.sendButtonDisabled : {}
                    ]}
                    onPress={handleSendMessage}
                    disabled={!newMessage.trim() || loading || connecting || 
                             websocketRef.current?.readyState !== WebSocket.OPEN}
                >
                    <Ionicons 
                        name="send" 
                        size={20} 
                        color={(!newMessage.trim() || loading || connecting || 
                                websocketRef.current?.readyState !== WebSocket.OPEN) ? 
                                    "#BDBDBD" : "white"} 
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
    connectingStatus: {
        fontSize: 12,
        color: '#FFA000',
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
    },
    myTimestamp: {
        color: '#EEEEEE',
    },
    otherTimestamp: {
        color: '#999999',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 15,
    },
});




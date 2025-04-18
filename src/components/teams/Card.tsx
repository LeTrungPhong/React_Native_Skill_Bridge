import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image } from "react-native";
import { FontAwesome5, Ionicons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

// Định nghĩa kiểu dữ liệu cho comments
type Comment = {
    id: string;
    author: string;
    content: string;
    time: string;
};

export default function Card() {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [comments, setComments] = useState<Comment[]>([
        {
            id: '1',
            author: 'Nguyễn Văn A',
            content: 'Đúng vậy, AI đang thay đổi tương lai của lập trình rất nhiều.',
            time: '9:30 15 thg 4',
        },
        {
            id: '2',
            author: 'Trần Thị B',
            content: 'Tôi vẫn thích code thủ công hơn, giúp hiểu sâu vấn đề.',
            time: '10:15 15 thg 4',
        },
    ]);
    
    // Hàm xử lý khi gửi bình luận
    const handleSendComment = () => {
        if (replyText.trim()) {
            const newComment: Comment = {
                id: Date.now().toString(),
                author: 'Bạn',
                content: replyText,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' ' + new Date().toLocaleDateString('vi-VN', {day: '2-digit', month: 'numeric'}),
            };
            
            setComments([...comments, newComment]);
            setReplyText('');
            setShowReplyInput(false); // Đóng input sau khi gửi bình luận
        }
    };

    // Hàm để hiển thị hoặc ẩn input trả lời
    const toggleReplyInput = () => {
        setShowReplyInput(!showReplyInput);
        setReplyText('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.postHeader}>
                <View style={styles.infor}>
                    <FontAwesome5 name="user-circle" size={40} color="#4285F4" />
                    <View style={styles.infor_text}>
                        <Text style={styles.authorName}>Lê Trung Phong</Text>
                        <Text style={styles.timestamp}>9:10 15 thg 4</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                </TouchableOpacity>
            </View>
            
            <Text style={styles.postContent}>
                Ai không biết sử dụng AI để code thì tôi cho học lại hết, tương lai AI nó làm hết, AI là nhất
            </Text>
            
            <View style={styles.interactionBar}>
                <TouchableOpacity 
                    style={styles.interactionButton}
                    onPress={toggleReplyInput}
                >
                    <MaterialCommunityIcons name="reply" size={20} color="purple" />
                    <Text style={styles.interactionText}>Reply</Text>
                </TouchableOpacity>
            </View>
            
            {/* Hiển thị số lượng bình luận */}
            {comments.length > 0 && (
                <TouchableOpacity 
                    style={styles.commentCountButton}
                    onPress={toggleReplyInput}
                >
                    <Text style={styles.commentCountText}>
                        {comments.length} bình luận
                    </Text>
                </TouchableOpacity>
            )}
            
            {/* Danh sách bình luận */}
            {comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                    <FontAwesome5 name="user-circle" size={28} color="#4285F4" />
                    <View style={styles.commentContent}>
                        <View style={styles.commentBubble}>
                            <Text style={styles.commentAuthor}>{comment.author}</Text>
                            <Text>{comment.content}</Text>
                        </View>
                        <Text style={styles.commentTime}>{comment.time}</Text>
                    </View>
                </View>
            ))}
            
            {/* Input bình luận chính cho post */}
            {showReplyInput && (
                <View style={styles.replyContainer}>
                    <FontAwesome5 name="user-circle" size={28} color="#4285F4" />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.replyInput}
                            placeholder="Viết bình luận..."
                            value={replyText}
                            onChangeText={setReplyText}
                            multiline
                            autoFocus
                        />
                        <TouchableOpacity 
                            style={[styles.sendButton, !replyText.trim() && styles.disabledButton]}
                            onPress={handleSendComment}
                            disabled={!replyText.trim()}
                        >
                            <Ionicons name="send" size={20} color={replyText.trim() ? "#4285F4" : "#BDBDBD"} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 16, 
        backgroundColor: 'white', 
        borderRadius: 12, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 3.84, 
        elevation: 3,
        marginBottom: 10
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    infor: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    infor_text: {
        flexDirection: 'column',
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212121'
    },
    timestamp: {
        fontSize: 12,
        color: '#757575'
    },
    menuButton: {
        padding: 5
    },
    postContent: {
        marginTop: 6,
        marginBottom: 16,
        fontSize: 15,
        lineHeight: 22,
        color: '#212121'
    },
    interactionBar: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 12,
        marginTop: 4
    },
    interactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        paddingVertical: 6,
        paddingHorizontal: 4
    },
    interactionText: {
        marginLeft: 6,
        fontSize: 13,
        color: 'purple',
    },
    commentCountButton: {
        paddingVertical: 8,
        marginTop: 8,
    },
    commentCountText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500'
    },
    commentItem: {
        flexDirection: 'row',
        marginTop: 12,
        alignItems: 'flex-start',
        gap: 8
    },
    commentContent: {
        flex: 1,
    },
    commentBubble: {
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        padding: 10,
        paddingVertical: 8
    },
    commentAuthor: {
        fontWeight: '600',
        fontSize: 13,
        marginBottom: 2
    },
    commentTime: {
        fontSize: 11,
        color: '#9E9E9E',
        marginTop: 4,
        marginLeft: 4
    },
    replyContainer: {
        flexDirection: 'row',
        marginTop: 16,
        alignItems: 'flex-start',
        gap: 8
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    replyInput: {
        flex: 1,
        minHeight: 36,
        maxHeight: 100,
        fontSize: 14,
        paddingVertical: 4
    },
    sendButton: {
        padding: 6,
    },
    disabledButton: {
        opacity: 0.5
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    replyButton: {
        marginLeft: 12,
    },
    replyButtonText: {
        fontSize: 12,
        color: '#4285F4',
    },
    replyIndicator: {
        width: 2,
        height: '100%',
        backgroundColor: '#4285F4',
        marginRight: 8,
    },
});
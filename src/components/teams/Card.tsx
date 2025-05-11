import { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image, Modal, Alert } from "react-native";
import { FontAwesome5, Ionicons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { apiJson } from "@/src/api/axios";
import { AuthContext } from "@/src/context/authContext";

// Định nghĩa kiểu dữ liệu cho comments
type Comment = {
    id: string;
    author: string;
    content: string;
    time: string;
    username?: string;
};

export interface CardProps {
    id: string;
    author: string;
    title: string;
    content: string;
    time: string;
    onDelete?: (id: string) => void;
    currentUser?: string;
}

export default function Card(data: CardProps) {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [state] = useContext(AuthContext);
    const currentUserId = state.info.username;
    
    // State để theo dõi comment nào đang hiển thị menu
    const [activeCommentMenu, setActiveCommentMenu] = useState<string | null>(null);

    useEffect(() => {
        fetchComments();
    }, []);

    // Hàm lấy comments
    const fetchComments = async () => {
        try {
            const response = await apiJson.get(`/api/comments/post/${data.id}`);
            const commentsData = response.data.map((comment: any) => ({
                id: comment.id,
                author: comment.userFullName,
                content: comment.content,
                username: comment.username,
                time: new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' ' + new Date(comment.createdAt).toLocaleDateString('vi-VN', {day: '2-digit', month: 'numeric'}),
            }));
            setComments(commentsData);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };
    
    // Hàm xử lý khi gửi bình luận
    const handleSendComment = async () => {
        if (replyText.trim()) {
            try {
                await apiJson.post('/api/comments', {
                    postId: data.id,
                    content: replyText,
                });

                await fetchComments();
                setReplyText('');
                setShowReplyInput(false);
            } catch (error) {
                console.error("Error sending comment:", error);
                Alert.alert("Lỗi", "Không thể gửi bình luận. Vui lòng thử lại sau.");
            }
        }
    };

    // Hàm xóa bình luận
    const handleDeleteComment = async (commentId: string) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa bình luận này không?",
            [
                { text: "Hủy", style: "cancel" },
                { 
                    text: "Xóa", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await apiJson.delete(`/api/comments/${commentId}`);
                            // setComments(comments.filter(comment => comment.id !== commentId));

                            const response = await apiJson.get(`/api/comments/post/${data.id}`);
                            const commentsData = response.data.map((comment: any) => ({
                                id: comment.id,
                                author: comment.userFullName,
                                content: comment.content,
                                username: comment.username,
                                time: new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' ' + new Date(comment.createdAt).toLocaleDateString('vi-VN', {day: '2-digit', month: 'numeric'}),
                            })); 

                            setComments(commentsData);

                            setActiveCommentMenu(null); // Đóng menu sau khi xóa
                        } catch (error) {
                            console.error("Error deleting comment:", error);
                            Alert.alert("Lỗi", "Không thể xóa bình luận. Vui lòng thử lại sau.");
                        }
                    } 
                }
            ]
        );
    };

    // Hàm để hiển thị hoặc ẩn input trả lời
    const toggleReplyInput = () => {
        setShowReplyInput(!showReplyInput);
        setReplyText('');
    };
    
    // Hàm hiển thị menu bài viết
    const toggleMenu = () => {
        setShowMenu(!showMenu);
        // Đóng bất kỳ menu comment nào đang mở
        setActiveCommentMenu(null);
    };
    
    // Hàm hiển thị menu của comment
    const toggleCommentMenu = (commentId: string) => {
        // Nếu đang hiển thị menu của comment này thì ẩn đi
        if (activeCommentMenu === commentId) {
            setActiveCommentMenu(null);
        } else {
            // Ngược lại, hiển thị menu của comment này
            setActiveCommentMenu(commentId);
            // Đảm bảo đóng menu bài viết nếu đang mở
            setShowMenu(false);
        }
    };
    
    // Hàm xóa bài viết
    const handleDelete = () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa bài viết này không?",
            [
                { text: "Hủy", style: "cancel" },
                { 
                    text: "Xóa", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            if (data.onDelete) {
                                data.onDelete(data.id);
                            }
                            setShowMenu(false);
                        } catch (error) {
                            console.error("Error deleting post:", error);
                            Alert.alert("Lỗi", "Không thể xóa bài viết. Vui lòng thử lại sau.");
                        }
                    } 
                }
            ]
        );
    };

    // Kiểm tra xem người dùng hiện tại có phải là tác giả của bài viết không
    const isAuthor = data.currentUser === data.author;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.postHeader}>
                <View style={styles.infor}>
                    <FontAwesome5 name="user-circle" size={40} color="#4285F4" />
                    <View style={styles.infor_text}>
                        <Text style={styles.authorName}>{data.author}</Text>
                        <Text style={styles.timestamp}>{data.time}</Text>
                    </View>
                </View>
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                        <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                    </TouchableOpacity>
                    
                    {/* Menu dropdown */}
                    {showMenu && (
                        <View style={styles.dropdownMenu}>
                            {isAuthor && (
                                <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                                    <AntDesign name="delete" size={16} color="#FF3B30" />
                                    <Text style={styles.deleteText}>Xóa bài viết</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </View>
            
            <Text style={styles.postTitle}>{data.title}</Text>
            <Text style={styles.postContent}>{data.content}</Text>
            
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
                        <TouchableOpacity 
                            activeOpacity={0.7}
                            onLongPress={() => comment.username === currentUserId && toggleCommentMenu(comment.id)}
                        >
                            <View style={styles.commentBubble}>
                                <View style={styles.commentHeader}>
                                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                                    
                                    {/* Hiển thị nút ba chấm cho comment của người dùng hiện tại */}
                                    {comment.username === currentUserId && (
                                        <TouchableOpacity 
                                            style={styles.commentMenuButton}
                                            onPress={() => toggleCommentMenu(comment.id)}
                                        >
                                            <Ionicons name="ellipsis-horizontal" size={14} color="#666" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <Text>{comment.content}</Text>
                            </View>
                        </TouchableOpacity>
                        
                        {/* Menu xóa comment */}
                        {activeCommentMenu === comment.id && comment.username === currentUserId && (
                            <View style={styles.commentDropdownMenu}>
                                <TouchableOpacity 
                                    style={styles.commentMenuItem} 
                                    onPress={() => handleDeleteComment(comment.id)}
                                >
                                    <AntDesign name="delete" size={14} color="#FF3B30" />
                                    <Text style={styles.commentDeleteText}>Xóa bình luận</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        
                        <Text style={styles.commentTime}>{comment.time}</Text>
                    </View>
                </View>
            ))}
            
            {/* Input bình luận */}
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
    menuContainer: {
        position: 'relative',
    },
    menuButton: {
        padding: 8,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 35,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
        width: 150,
        zIndex: 1000,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuItemText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#212121',
    },
    deleteText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#FF3B30',
        fontWeight: '500',
    },
    postTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#212121',
        marginTop: 6,
        marginBottom: 10,
        lineHeight: 24
    },
    postContent: {
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
        position: 'relative',
    },
    commentBubble: {
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        padding: 10,
        paddingVertical: 8
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2
    },
    commentAuthor: {
        fontWeight: '600',
        fontSize: 13,
    },
    // Nút ba chấm cho comment
    commentMenuButton: {
        padding: 2,
        marginLeft: 5,
    },
    // Menu xóa comment
    commentDropdownMenu: {
        position: 'absolute',
        top: 30,
        right: 5,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
        width: 140,
        zIndex: 999,
    },
    commentMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    commentDeleteText: {
        marginLeft: 8,
        fontSize: 13,
        color: '#FF3B30',
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
});
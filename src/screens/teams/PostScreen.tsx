import React, { useEffect, useState, useContext } from "react";
import Card, { CardProps } from "@/src/components/teams/Card";
import { 
    ScrollView, 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Modal, 
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "@/src/api/axios";
import { GeneralScreenRouteProp } from "@/src/navigation/type";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "@/src/context/authContext";

export default function PostScreen() {
    const [showPostForm, setShowPostForm] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const route = useRoute<GeneralScreenRouteProp>();
    const { team } = route.params;
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [state] = useContext(AuthContext);
    const currentUser = state.info.name;
    
    const fetchPosts = async () => {
        try {
            setRefreshing(true);
            const response = await api.get(`/api/posts/class/${team.id}`);
            console.log("Post class data:", response.data);

            setPosts(response.data.map((post: any) => ({
                id: post.id,
                content: post.content,
                title: post.title,
                time: new Date(post.createdAt).toLocaleString(),
                author: post.teacherName,
            })));
        } catch (error) {
            console.error("Error fetching posts:", error);
            Alert.alert("Lỗi", "Không thể tải bài đăng. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Xử lý đăng bài viết
    const handlePostSubmit = async () => {
        if (postTitle.trim() && postContent.trim()) {
            try {
                setRefreshing(true);
                await api.post("/api/posts", {
                    classId: team.id,
                    title: postTitle,
                    content: postContent,
                });

                // Reset form và đóng
                setPostTitle("");
                setPostContent("");
                setShowPostForm(false);
                
                // Tải lại danh sách bài đăng
                await fetchPosts();
            } catch (error) {
                console.error("Error creating post:", error);
                Alert.alert("Lỗi", "Không thể đăng bài. Vui lòng thử lại sau.");
                setRefreshing(false);
            }
        }
    };

    // Hàm xử lý xóa bài viết
    const handleDeletePost = async (postId: string) => {
        try {
            setRefreshing(true);
            await api.delete(`/api/posts/${postId}`);
            
            // Cập nhật state để xóa bài viết khỏi UI
            setPosts(posts.filter(post => post.id !== postId));
            Alert.alert("Thành công", "Đã xóa bài viết");
        } catch (error) {
            console.error("Error deleting post:", error);
            Alert.alert("Lỗi", "Không thể xóa bài viết. Vui lòng thử lại sau.");
        } finally {
            setRefreshing(false);
        }
    };

    // Đóng form khi click ra ngoài
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    // State cho posts
    const [posts, setPosts] = useState<CardProps[]>([]);

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4285F4" />
                    <Text style={styles.loadingText}>Đang tải bài viết...</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.container}>
                    {posts.length === 0 ? (
                        <Text style={styles.emptyText}>Chưa có bài viết nào.</Text>
                    ) : (
                        posts.map((post) => (
                            <Card
                                key={post.id} 
                                id={post.id}
                                author={post.author}
                                title={post.title}
                                content={post.content} 
                                time={post.time}
                                onDelete={handleDeletePost}
                                currentUser={currentUser}
                            />
                        ))
                    )}
                </ScrollView>
            )}

            {refreshing && (
                <View style={styles.refreshOverlay}>
                    <ActivityIndicator size="large" color="#4285F4" />
                </View>
            )}

            {/* Floating button để đăng bài */}
            <TouchableOpacity 
                style={styles.floatingButton}
                onPress={() => setShowPostForm(true)}
            >
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>

            {/* Modal form đăng bài */}
            <Modal
                visible={showPostForm}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowPostForm(false)}
            >
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.modalContainer}
                    >
                        <View style={styles.formContainer}>
                            <View style={styles.formHeader}>
                                <Text style={styles.formTitle}>Tạo bài đăng mới</Text>
                                <TouchableOpacity onPress={() => setShowPostForm(false)}>
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Thêm input cho tiêu đề */}
                            <TextInput
                                style={styles.titleInput}
                                placeholder="Tiêu đề bài đăng..."
                                value={postTitle}
                                onChangeText={setPostTitle}
                                maxLength={100}
                                autoFocus
                            />
                            
                            {/* Input cho nội dung */}
                            <TextInput
                                style={styles.contentInput}
                                placeholder="Nội dung bài đăng..."
                                value={postContent}
                                onChangeText={setPostContent}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                            />

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    style={[
                                        styles.postButton,
                                        (!postTitle.trim() || !postContent.trim() || refreshing) && styles.disabledButton
                                    ]}
                                    onPress={handlePostSubmit}
                                    disabled={!postTitle.trim() || !postContent.trim() || refreshing}
                                >
                                    {refreshing ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.postButtonText}>Đăng bài</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        gap: 20,
        paddingBottom: 80, // Thêm padding bottom để tránh bị che bởi floating button
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20, 
        color: '#666',
        fontSize: 16,
    },
    refreshOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    floatingButton: {
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#4285F4",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    formContainer: {
        backgroundColor: "white",
        margin: 20,
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    formHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    titleInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 12,
    },
    contentInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 120,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: "flex-end",
    },
    postButton: {
        backgroundColor: "#4285F4",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: "#BDBDBD",
    },
    postButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
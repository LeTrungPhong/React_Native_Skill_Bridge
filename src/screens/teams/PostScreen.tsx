import React, { useState } from "react";
import Card from "@/src/components/teams/Card";
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
    Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PostScreen() {
    const [showPostForm, setShowPostForm] = useState(false);
    const [postContent, setPostContent] = useState("");

    // Xử lý đăng bài viết
    const handlePostSubmit = () => {
        if (postContent.trim()) {
            console.log("Đăng bài:", postContent);
            // Ở đây bạn sẽ thêm code để lưu bài đăng vào state hoặc gửi lên server
            
            // Reset form và đóng
            setPostContent("");
            setShowPostForm(false);
        }
    };

    // Đóng form khi click ra ngoài
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <View style={{ flex: 1 }}>
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

                            <TextInput
                                style={styles.input}
                                placeholder="Viết nội dung bài đăng..."
                                value={postContent}
                                onChangeText={setPostContent}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                autoFocus
                            />

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    style={[
                                        styles.postButton,
                                        !postContent.trim() && styles.disabledButton
                                    ]}
                                    onPress={handlePostSubmit}
                                    disabled={!postContent.trim()}
                                >
                                    <Text style={styles.postButtonText}>Đăng bài</Text>
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
    input: {
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
import { StyleSheet } from 'react-native';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  ActivityIndicator, 
  Alert,
  Keyboard 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import CardChat, { Chat } from '@/src/components/chat/CardChat';
import { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlatList } from 'react-native-gesture-handler';
import api from '@/src/api/axios';
import { AuthContext } from '@/src/context/authContext';

type ChatScreenNavigationProp = StackNavigationProp<
  { ChatScreen: undefined; ChatDetailScreen: { chat: Chat } }, 'ChatScreen'
>;

// Định nghĩa kiểu dữ liệu cho người dùng tìm thấy
interface UserSearchResult {
  username: string;
  fullName?: string;
  avatar?: string;
}

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const [state] = useContext(AuthContext);
  const currentUsername = state.info.username;

  // State cho chức năng tìm kiếm người dùng
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResult, setSearchResult] = useState<UserSearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch user data from the API using the username from the context
      const response = await api.get(`/user/${state.info.username}`);
      console.log('ChatScreen state:', state.info.username);
      console.log('ChatScreen response:', response.data.result);

      const newChats = await Promise.all(response.data.result.map(async (item: any) => {
        const lastMessage = await api.get(`/api/lastmessage`, {
          params: {
            user1: state.info.username,
            user2: item.username,
          },
        })

        console.log('Last message:', lastMessage.data.result);

        return ({
          username: item.username,
          avatar: '',
          lastMessage: lastMessage && lastMessage.data.result ? lastMessage.data.result.message : 'No messages yet',
          initials: item.username.charAt(0).toUpperCase(),
        });
      }));

      setChats(newChats);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm tìm kiếm người dùng theo username
  const searchUser = async () => {
    if (!searchUsername.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên người dùng cần tìm');
      return;
    }

    try {
      setSearching(true);
      setSearchResult(null);
      
      // Gọi API tìm kiếm người dùng
      const response = await api.get(`/api/user/search/${searchUsername.trim()}`);
      console.log('Search response:', response.data);
      if (response.data && response.data.result) {
        // Kiểm tra nếu người dùng tìm kiếm chính là mình
        if (response.data.result.username === currentUsername) {
          Alert.alert('Thông báo', 'Bạn không thể trò chuyện với chính mình');
          setSearching(false);
          return;
        }
        console.log('User found:', response.data.result[0].username);
        
        // Tạo kết quả tìm kiếm
        const result: UserSearchResult = {
          username: response.data.result[0].username,
          fullName: response.data.result[0].username,
          // avatar: response.data.result.avatar || ''
        };
        
        setSearchResult(result);
      } else {
        Alert.alert('Thông báo', 'Không tìm thấy người dùng');
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      Alert.alert('Lỗi', 'Không thể tìm kiếm người dùng. Vui lòng thử lại sau.');
    } finally {
      setSearching(false);
    }
  };

  // Hàm gửi tin nhắn mới và chuyển đến màn hình chat
  const initiateChat = async () => {
    if (!searchResult || !newMessage.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tin nhắn');
      return;
    }

    try {
      setSendingMessage(true);

      // Tạo đối tượng chat mới
      const newChat: any = {
        type: 'CHAT',
        sender: currentUsername,
        receiver: searchResult.username,
        message: newMessage,
      };

      // Gửi tin nhắn đầu tiên thông qua API
      await api.post('/api/chat/send', newChat);

      // Đóng modal tìm kiếm
      setSearchModalVisible(false);
      setSearchUsername('');
      setNewMessage('');
      setSearchResult(null);

      // Cập nhật lại danh sách chat
      await fetchData();

      // Điều hướng đến màn hình chat chi tiết
      // navigation.navigate('ChatDetailScreen');
    } catch (error) {
      console.error('Error initiating chat:', error);
      Alert.alert('Lỗi', 'Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại sau.');
    } finally {
      setSendingMessage(false);
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <CardChat
      chat={item}
      onPress={() => {
        console.log(`Selected chat: ${item.username}`);
        // Navigate to the ChatDetailScreen with the selected chat as a parameter
        navigation.navigate('ChatDetailScreen', { chat: item });
      }}
    />
  );

  return (
    <View style={styles.container}>
      <BlurView
        intensity={80}
        style={styles.header}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
      >
        <Text style={styles.title}>Chat</Text>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => setSearchModalVisible(true)}
        >
          <Ionicons
            name="search"
            size={20}
            style={styles.searchIcon}
          />
          <Text style={styles.searchText}>Tìm kiếm người dùng</Text>
        </TouchableOpacity>
      </BlurView>

      {chats && chats.length > 0 ? (
        <View style={styles.content}>
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.username}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ width: '100%' }}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="comments" size={50} color="#C5C5C5" />
          <Text style={styles.emptyText}>Bạn chưa có cuộc trò chuyện nào</Text>
          <Text style={styles.emptySubtext}>Tìm kiếm người dùng để bắt đầu trò chuyện</Text>
          <TouchableOpacity 
            style={styles.startChatButton}
            onPress={() => setSearchModalVisible(true)}
          >
            <Text style={styles.startChatButtonText}>Tìm kiếm người dùng</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Nút thêm cuộc trò chuyện mới */}
      <TouchableOpacity 
        style={styles.addChatButton}
        onPress={() => setSearchModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal tìm kiếm người dùng */}
      <Modal
        visible={searchModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setSearchModalVisible(false);
          setSearchUsername('');
          setSearchResult(null);
          setNewMessage('');
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tìm kiếm người dùng</Text>
              <TouchableOpacity 
                onPress={() => {
                  setSearchModalVisible(false);
                  setSearchUsername('');
                  setSearchResult(null);
                  setNewMessage('');
                }}
              >
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Nhập tên người dùng"
                value={searchUsername}
                onChangeText={setSearchUsername}
                autoCapitalize="none"
                returnKeyType="search"
                onSubmitEditing={searchUser}
              />
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={searchUser}
                disabled={searching}
              >
                {searching ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="search" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>

            {/* Kết quả tìm kiếm */}
            {searchResult && (
              <View style={styles.resultContainer}>
                <View style={styles.userInfoContainer}>
                  <Text style={styles.usernameText}>{searchResult.username}</Text>
                </View>

                <View style={styles.messageInputContainer}>
                  <TextInput
                    style={styles.messageInput}
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                    returnKeyType="send"
                    onSubmitEditing={Keyboard.dismiss}
                  />
                  <TouchableOpacity 
                    style={[
                      styles.sendButton,
                      (!newMessage.trim() || sendingMessage) ? styles.sendButtonDisabled : {}
                    ]}
                    onPress={initiateChat}
                    disabled={!newMessage.trim() || sendingMessage}
                  >
                    {sendingMessage ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Ionicons name="send" size={20} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchText: {
    color: '#999',
  },
  addChatButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '50%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 10,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  initialsContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  usernameText: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4285F4',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  startChatButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  startChatButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
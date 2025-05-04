import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import CardChat, { Chat } from '@/src/components/chat/CardChat';
import { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlatList } from 'react-native-gesture-handler';
import api from '@/src/api/axios';
import { AuthContext } from '@/src/context/authContext';

// const CHATS: Chat[] = [
//   {
//     username: 'Nguyen Van A',
//     avatar: 'https://example.com/avatar1.jpg',
//     lastMessage: 'Hello! How are you?',
//     initials: 'A',
//   },
//   {
//     username: 'Nguyen Van B',
//     avatar: 'https://example.com/avatar2.jpg',
//     lastMessage: 'See you tomorrow!',
//     initials: 'B',
//   },
//   {
//     username: 'Nguyen Van C',
//     avatar: 'https://example.com/avatar3.jpg',
//     lastMessage: 'Let\'s meet up!',
//     initials: 'C',
//   },
// ];

type ChatScreenNavigationProp = StackNavigationProp<
  { ChatScreen: undefined; ChatDetailScreen: { chat: Chat } }, 'ChatScreen'
>;

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const [chats, setChats] = useState<Chat[]>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const [state, setState] = useContext(AuthContext); // Replace 'any' with the appropriate type for your state

  // console.log('ChatScreen state:', state);

  useEffect(() => {

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

    fetchData();

  }, []);

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
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            style={styles.searchIcon}
          />
          <Text style={styles.searchText}>Search</Text>
        </View>
      </BlurView>
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
}); 
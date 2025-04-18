import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';

export interface Team {
  id: string;
  name: string;
  initials: string;
  color?: string;
  description: string;
}

interface TeamItemProps {
  team: Team;
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

export function TeamItem({ team, onPress }: TeamItemProps) {
  // Sử dụng màu từ team nếu có, không thì lấy màu dựa trên initials
  const backgroundColor = team.color || getColorFromInitials(team.initials);
  
  return (
    <TouchableOpacity style={styles.teamItem} onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor }]}>
        <Text style={styles.avatarText}>{team.initials}</Text>
      </View>
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.teamDescription}>{team.description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
  teamInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  teamDescription: {
    fontSize: 12,
    color: '#888',
  },
}); 
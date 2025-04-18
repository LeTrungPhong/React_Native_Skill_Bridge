import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TeamItem, Team } from '@/src/components/teams/TeamItem';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TeamsStackParamList } from '@/src/navigation/type';

const TEAMS: Team[] = [
  {
    id: '1',
    name: 'GVCN',
    initials: 'G',
    description: 'Nguyen Van A - CNTT',
  },
  {
    id: '2',
    name: 'KHDL',
    initials: 'K',
    description: 'Nguyen Van A - CNTT',
  },
  {
    id: '3',
    name: 'AI',
    initials: 'AI',
    description: 'Nguyen Van A - CNTT',
  },
  {
    id: '4',
    name: 'Mobile',
    initials: 'EP',
    description: 'Nguyen Van A - CNTT',
  },
];

type TeamsScreenNavigationProp = StackNavigationProp<TeamsStackParamList, 'TeamsList'>;

export default function TeamsScreen() {
  const colorScheme = useColorScheme();
  const [teams] = useState<Team[]>(TEAMS);
  const navigation = useNavigation<TeamsScreenNavigationProp>();

  const renderTeamItem = ({ item }: { item: Team }) => (
    <TeamItem
      team={item}
      onPress={() => {
        console.log(`Selected team: ${item.name}`);
        // Navigate to the GeneralScreen with the selected team as a parameter
        navigation.navigate('GeneralScreen', { team: item });
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
        <View style={styles.headerContent}>
          <Text style={styles.title}>Teams</Text>
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            style={styles.searchIcon}
          />
          <Text style={styles.searchText}>Search</Text>
        </View>
      </BlurView>
      <FlatList
        data={teams}
        renderItem={renderTeamItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  list: {
    flex: 1,
    padding: 16,
  },
}); 
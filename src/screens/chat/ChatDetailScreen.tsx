import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text, useColorScheme, View } from "react-native";

export default function ChatDetailScreen() {
    const colorScheme = useColorScheme();

    const navigation = useNavigation();

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

    return (
        <View>
            <Text>Detail Chat</Text>
        </View>
    );
}




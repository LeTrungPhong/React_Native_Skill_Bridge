import { Text, View } from "react-native";

export default function Card() {
    return (
        <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Card Title</Text>
            <Text style={{ marginTop: 10 }}>This is a card component.</Text>
        </View>
    );
}
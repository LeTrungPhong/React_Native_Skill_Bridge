import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the activity tab
  return <Redirect href="/(tabs)/activity" />;
} 
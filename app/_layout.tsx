import { GradientBackground } from '@/src/components/ui';
import { useDatabase } from '@/src/hooks/useDatabase';
import { colors, theme } from '@/src/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PaperProvider, Text } from 'react-native-paper';
import 'react-native-reanimated';
import '../global.css';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function DatabaseLoader({ children }: { children: React.ReactNode }) {
  const { isReady, error } = useDatabase();

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-error text-base text-center p-5">Database Error: {error.message}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.red.primary} />
        <Text className="mt-4 text-base text-text-secondary">Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <GradientBackground>
          <DatabaseLoader>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </DatabaseLoader>
        </GradientBackground>
      </PaperProvider>
    </QueryClientProvider>
  );
}


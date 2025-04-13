import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Toast />
            <Stack
              screenOptions={{
                headerShown: true,
                header:() => <Header />,
              }}
            >
              <Stack.Screen
              name="login"
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name="signup"
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name="forgot-password"
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name="reset-password"
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SafeAreaView>
        </AuthProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}

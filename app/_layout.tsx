import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider, StyledProvider } from "@gluestack-ui/themed";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Header from "@/components/Header";
import { GoalProvider } from "@/contexts/GoalContext";
import { PostProvider } from "@/contexts/PostContext";
import { FollowerProvider } from "@/contexts/FollowerContext";
import { config } from "@/components/ui/gluestack-ui-provider/config";
import { LikesProvider } from "@/contexts/LikesContext";
import { CommentsProvider } from "@/contexts/CommentsContext";
import { BookmarksProvider } from "@/contexts/BookmarksContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log("RootLayout rendering");
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
    <GluestackUIProvider config={config}>
      <ThemeProvider value={DefaultTheme}>
        <AuthProvider>
          <GoalProvider>
            <PostProvider>
              <FollowerProvider>
                <BookmarksProvider>
                  <LikesProvider>
                    <CommentsProvider>
                      <SafeAreaView style={{ flex: 1 }}>
                        <Toast />
                        <Stack
                          screenOptions={{
                            headerShown: true,
                            header: () => <Header />,
                          }}
                        >
                          <Stack.Screen
                            name="login"
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="signup"
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="forgot-password"
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="reset-password"
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="dashboard/[userId]"
                            options={{ headerShown: true }}
                          />
                          <Stack.Screen
                            name="+not-found"
                            options={{ headerShown: true }}
                          />
                        </Stack>
                      </SafeAreaView>
                    </CommentsProvider>
                  </LikesProvider>
                </BookmarksProvider>
              </FollowerProvider>
            </PostProvider>
          </GoalProvider>
        </AuthProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}

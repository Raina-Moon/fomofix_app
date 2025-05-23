import { useEffect, useState } from "react";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { AuthProvider } from "@/contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Header from "@/components/Header";
import { GoalProvider } from "@/contexts/GoalContext";
import { PostProvider } from "@/contexts/PostContext";
import { FollowerProvider } from "@/contexts/FollowerContext";
import { LikesProvider } from "@/contexts/LikesContext";
import { CommentsProvider } from "@/contexts/CommentsContext";
import { BookmarksProvider } from "@/contexts/BookmarksContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <NotificationsProvider>
          <GoalProvider>
            <PostProvider>
              <FollowerProvider>
                <BookmarksProvider>
                  <LikesProvider>
                    <CommentsProvider>
                      <SafeAreaView style={{ flex: 1 }}>
                        <Toast position="bottom" />
                        <Stack
                          screenOptions={{
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
                            options={{ title: "Dashboard" }}
                          />
                          <Stack.Screen
                            name="profile/[userId]"
                            options={{ title: "Profile" }}
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
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

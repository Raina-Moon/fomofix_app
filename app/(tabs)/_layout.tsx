import { Tabs } from "expo-router";
import { Platform } from "react-native";
import Header from "@/components/Header";
import TabBarBackground from "@/components/ui/TabBarBackground";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarActiveTintColor: "#1EBD7B",
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({ ios: { position: "absolute" } }),
      }}
    >
    </Tabs>
  );
}

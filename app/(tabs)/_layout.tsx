import { Tabs } from "expo-router";
import { Platform } from "react-native";
import Header from "@/components/Header";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { IconSymbol } from "@/components/ui/IconSymbol";

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
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="paperplane.fill" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

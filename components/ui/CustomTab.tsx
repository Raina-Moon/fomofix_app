import { useState } from "react";
import { Box, Pressable, Text } from "@gluestack-ui/themed";

type Tab = {
  value: string;
  label: string;
};

type CustomTabsProps = {
  tabs: Tab[];
  defaultValue: string;
  onValueChange: (value: string) => void;
  children: (activeTab: string) => React.ReactNode;
};

export const CustomTabs = ({
  tabs,
  defaultValue,
  onValueChange,
  children,
}: CustomTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onValueChange(value);
  };

  return (
    <Box>
      {/* Tabs List */}
      <Box flexDirection="row" justifyContent="space-between" marginBottom={16}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => handleTabChange(tab.value)}
            flex={1}
            style={{
              backgroundColor: activeTab === tab.value ? "$primary600" : "$gray200",
            }}
            p="$2"
            borderRadius="$md"
            mx="$1"
          >
            <Text
              color={activeTab === tab.value ? "$white" : "$gray900"}
              textAlign="center"
              fontWeight="$medium"
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </Box>

      {/* Tabs Content */}
      <Box>{children(activeTab)}</Box>
    </Box>
  );
};
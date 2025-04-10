import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  disabled?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
};

const GlobalButton: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  onPress,
  style,
}) => {
  const primary500 = useThemeColor({}, "primary-500");
  const gray300 = useThemeColor({}, "gray-300");

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: disabled ? gray300 : primary500,
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text
          style={{
            color: "white",
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default GlobalButton;

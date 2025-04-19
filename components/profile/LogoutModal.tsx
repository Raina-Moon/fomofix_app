import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal = ({ onConfirm, onCancel }: LogoutModalProps) => {
  const black = "#000";
  const white = "#fff";
  const gray900 = useThemeColor({}, "gray-900");
  const red500 = useThemeColor({}, "red-500");
  const primary400 = useThemeColor({}, "primary-400");

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: black,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: white,
          padding: 24,
          borderRadius: 8,
          width: "90%",
          maxWidth: 400,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: gray900,
            fontSize: 24,
            marginBottom: 16,
          }}
        >
          Logging out already? We'll miss you! 😢
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: red500,
              padding: 10,
              borderRadius: 9999,
              paddingVertical: 16,
              paddingHorizontal: 8,
            }}
            onPress={onConfirm}
          >
            <Text style={{ color: white }}>Bye for now 👋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: primary400,
              padding: 10,
              borderRadius: 9999,
              paddingVertical: 12,
              paddingHorizontal: 8,
            }}
            onPress={onCancel}
          >
            <Text style={{ color: white }}>Stay a bit longer 🫶</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LogoutModal;

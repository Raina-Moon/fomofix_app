import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, TouchableOpacity, View } from "react-native";

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  const black = "#000";
  const white = "#fff";
  const gray300 = useThemeColor({}, "gray-300");
  const red500 = useThemeColor({}, "red-500");

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
        zIndex: 50,
      }}
    >
      <View
        style={{
          backgroundColor: white,
          padding: 24,
          borderRadius: 10,
          maxWidth: "85%",
          width: "100%",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          Confirm Account Deletion
        </Text>
        <Text style={{ marginBottom: 16 }}>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: gray300,
              paddingVertical: 16,
              borderRadius: 5,
              paddingHorizontal: 8,
            }}
            onPress={onCancel}
          >
            No
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: red500,
              paddingVertical: 16,
              borderRadius: 5,
              paddingHorizontal: 8,
            }}
            onPress={onConfirm}
          >
            <Text style={{ color: white }}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DeleteConfirmModal;

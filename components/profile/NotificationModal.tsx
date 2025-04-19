"use client";

import React from "react";
import GoBackArrow from "@/assets/icons/GoBackArrow";
import { Notification } from "@/types";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

interface NotificationModalProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (notificationId: number) => void;
  onDelete: (notificationId: number) => void;
}

const NotificationModal = ({
  notifications,
  onClose,
  onMarkAsRead,
  onDelete,
}: NotificationModalProps) => {
  const white = "#fff";
  const gray100 = useThemeColor({}, "gray-100");
  const gray200 = useThemeColor({}, "gray-200");
  const gray500 = useThemeColor({}, "gray-500");
  const primary100 = useThemeColor({}, "primary-100");
  const red500 = useThemeColor({}, "red-500");

  return (
    <View
      style={{
        position: "absolute",
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: white,
        zIndex: 50,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: gray200,
          backgroundColor: gray100,
        }}
      >
        <TouchableOpacity onPress={onClose}>
          <GoBackArrow />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "semibold",
            marginLeft: 16,
          }}
        >
          Notifications
        </Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 8,
              marginBottom: 8,
              backgroundColor: item.is_read ? gray100 : primary100,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
              }}
              onpress={() => onMarkAsRead(item.id)}
            >
              <Text>{item.message}</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text
                style={{
                  color: gray500,
                  fontSize: 8,
                }}
              >
                {formatTimeAgo(item.created_at || "")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  onDelete(item.id);
                }}
              >
                <Text style={{ color: red500 }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default NotificationModal;

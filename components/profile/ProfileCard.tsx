import React, { useState } from "react";
import CameraIcon from "../../../../../public/icons/CameraIcon";
import BellIcon from "../../../../../public/icons/BellIcon";
import LockIcon from "../../../../../public/icons/LockIcon";
import SavedIcon from "../../../../../public/icons/SavedIcon";
import LogoutIcon from "../../../../../public/icons/LogoutIcon";
import ArrowRightIcon from "../../../../../public/icons/ArrowRightIcon";
import PencilIcon from "../../../../../public/icons/PencilIcon";
import {
  Image,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteIcon from "../../../../../public/icons/DeleteIcon";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ProfileCardProps {
  user: { username: string; email: string | undefined; profile_image?: any };
  updateProfile: (userId: number, username: string) => Promise<void>;
  updateProfileImage: (userId: number, file: File) => Promise<void>;
  userId: string;
  onLoadNotifications: () => void;
  onShowBookmarks: () => void;
  onLogoutConfirm: () => void;
  onDeleteConfirm: () => void;
  notificationEnabled: boolean;
  toggleNotification: () => void;
}

const ProfileCard = ({
  user,
  updateProfile,
  updateProfileImage,
  userId,
  onLoadNotifications,
  onShowBookmarks,
  onLogoutConfirm,
  onDeleteConfirm,
  notificationEnabled,
  toggleNotification,
}: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState(user.username);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      if (newUsername !== user.username) {
        await updateProfile(Number(userId), newUsername);
      }
      if (selectedFile) {
        await updateProfileImage(Number(userId), selectedFile);
      }
      setIsEditing(false);
      setSelectedFile(null);
      setImagePreview(null);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(
        err.message === "Username is already taken"
          ? "Username is already taken!"
          : "Failed to update profile!"
      );
    }
  };

  const handleOpenChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };

  const white = "#fff";
  const black = "#000";
  const primary100 = useThemeColor({}, "primary-100");
  const primary200 = useThemeColor({}, "primary-200");
  const primary500 = useThemeColor({}, "primary-500");
  const gray400 = useThemeColor({}, "gray-400");
  const gray500 = useThemeColor({}, "gray-500");
  const gray600 = useThemeColor({}, "gray-600");
  const gray900 = useThemeColor({}, "gray-900");
  const red500 = useThemeColor({}, "red-500");
  const red700 = useThemeColor({}, "red-700");

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 400,
        backgroundColor: white,
        borderRadius: 16,
        paddingTop: 28,
        paddingHorizontal: 12,
        paddingBottom: 44,
        shadowColor: black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      {/* Profile Image */}
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <Image
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 40,
            resizeMode: "cover",
          }}
          source={
            imagePreview || user.profile_image || "/images/DefaultProfile.png"
          }
        />
        {isEditing && (
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: black,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => document.getElementById("imageUpload")?.click()}
          >
            <CameraIcon />
          </TouchableOpacity>
        )}
        <TextInput
          id="imageUpload"
          className="hidden"
          onChangeText={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 2 * 1024 * 1024) {
                setErrorMessage("Image must be less than 2MB.");
                setSelectedFile(null);
                setImagePreview(null);
                return;
              }
              setSelectedFile(file);
              setImagePreview(URL.createObjectURL(file));
              setErrorMessage(null);
            }
          }}
        />
      </View>

      {/* User Info */}
      <View className="text-center mb-4 flex flex-col">
        <View className="text-gray-900 text-lg">
          {isEditing ? (
            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              style={{
                borderBottomWidth: 1,
                borderColor: gray400,
                paddingVertical: 4,
                paddingHorizontal: 8,
                color: gray900,
                fontSize: 16,
              }}
            />
          ) : (
            user.username
          )}
          {!isEditing && (
            <TouchableOpacity
              style={{ marginLeft: 8 }}
              onPress={() => setIsEditing(true)}
            >
              <PencilIcon />
            </TouchableOpacity>
          )}
        </View>
        <Text
          style={{
            color: gray500,
            fontSize: 8,
            marginTop: 4,
          }}
        >
          {user.email}
        </Text>
        {isEditing && (
          <View
            style={{
              marginTop: 8,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: primary500,
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
              onPress={handleUpdateProfile}
            >
              <Text style={{ color: white, fontSize: 8 }}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Error Message */}
      {errorMessage && (
        <Text
          style={{
            color: red500,
            fontSize: 8,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {errorMessage}
        </Text>
      )}

      {/* Profile Sections */}
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderColor: primary200,
            borderRadius: 8,
            marginBottom: 16,
            gap: 4,
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: primary100,
              paddingVertical: 8,
            }}
            onPress={onLoadNotifications}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <BellIcon />
              <Text>The Buzz Box</Text>
            </View>
            <ArrowRightIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: primary100,
              paddingVertical: 8,
            }}
            onPress={onShowBookmarks}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <SavedIcon />
              <Text style={{ color: gray600, fontSize: 8 }}>Saved</Text>
            </View>
            <ArrowRightIcon />
          </TouchableOpacity>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              paddingVertical: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <BellIcon />
              <Text style={{ color: gray600, fontSize: 8 }}>Buzz Mode</Text>
            </View>
            <Switch
              value={notificationEnabled}
              onValueChange={toggleNotification}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderColor: primary200,
            borderRadius: 8,
            marginBottom: 16,
            gap: 4,
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: primary100,
              paddingVertical: 8,
            }}
            onPress={handleOpenChangePasswordModal}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <LockIcon />
              <Text style={{ color: gray600, fontSize: 8 }}>Key Tweaker</Text>
            </View>
            <ArrowRightIcon />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full flex justify-start items-center py-2 hover:bg-gray-100 rounded"
            onPress={onLogoutConfirm}
          >
            <View className="flex items-center gap-2">
              <LogoutIcon />
              <Text style={{ color: red700, fontSize: 8 }}>Peace Out</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
            }}
            onPress={onDeleteConfirm}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <DeleteIcon />
              <Text style={{ color: red700, fontSize: 8 }}>Delete Account</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </View>
  );
};

export default ProfileCard;

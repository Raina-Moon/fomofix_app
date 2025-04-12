import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface ProfileHeaderProps {
  userId: number;
  storedId: number | null;
  username: string;
  profileImage: string | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userId,
  storedId,
  profileImage,
}) => {
  const router = useRouter();
  const isMyProfile = userId === storedId;

  const defaultImage = "/images/DefaultProfile.png";

  return isMyProfile ? (
    <TouchableOpacity onPress={() => router.push(`/profile/${userId}` as any)}>
      <Image
        source={{ uri: profileImage ?? defaultImage }}
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
        }}
      />
    </TouchableOpacity>
  ) : (
    <Image
      source={{ uri: profileImage ?? defaultImage }}
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
      }}
    />
  );
};

export default ProfileHeader;

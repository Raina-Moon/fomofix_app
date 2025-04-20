import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface PostHeaderProps {
  userId: number | null;
  username: string;
  profileImage?: string;
}

const PostHeader = ({ userId, username, profileImage }: PostHeaderProps) => {
  const router = useRouter();

  const handleProfileClick = useCallback(() => {
    if (userId !== null) {
      router.push(`/dashboard/${userId}`);
    }
  }, [router, userId]);

  const gray800 = useThemeColor({}, "gray-800");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
      }}
    >
      {" "}
      <TouchableOpacity
        onPress={handleProfileClick}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Image
          source={{ uri: profileImage || "/images/DefaultProfile.png" }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
          }}
          defaultSource={require("@/assets/images/DefaultProfile.png")}
          onError={() => {
            console.log("Error loading image");
          }}
        />
        <Text
          style={{
            fontSize: 12,
            color: gray800,
            fontWeight: "medium",
          }}
        >
          {" "}
          {username || "Unknown User"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostHeader;


import { useThemeColor } from "@/hooks/useThemeColor";
import { Follower } from "@/types";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface FollowersListProps {
  followers: Follower[];
}

const FollowersList = ({ followers }: FollowersListProps) => {
  const router = useRouter();

  const goToDashboard = (userId: number) => {
    router.push(`/dashboard/${userId}`);
  };

  if (!followers || followers.length === 0) return null;

  const gray700 = useThemeColor({}, "gray-700");

  return (
    <View style={{ marginBottom: 24, gap: 8 }}>
      {followers.map((follower) => (
        <TouchableOpacity
          onPress={() => goToDashboard(follower.id)}
          key={follower.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Image
            src={follower.profile_image ?? "/images/DefaultProfile.png"}
            alt={follower.username}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
            }}
          />
          <Text style={{ color: gray700, fontSize: 14 }}>
            {follower.username}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default FollowersList;

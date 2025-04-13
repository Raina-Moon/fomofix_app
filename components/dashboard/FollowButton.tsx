import { useFollowers } from "@/contexts/FollowerContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

interface FollowButtonProps {
  storedId: number | null;
  userId: number;
  isFollowing: boolean;
  setIsFollowing: (value: boolean) => void;
}

const FollowButton = ({
  storedId,
  userId,
  isFollowing,
  setIsFollowing,
}: FollowButtonProps) => {
  const { followUser, unfollowUser, fetchFollowers } = useFollowers();

  const handleFollowToggle = async () => {
    if (!storedId) return;

    const newState = !isFollowing;
    setIsFollowing(newState);

    try {
      if (newState) {
        await followUser(storedId, userId);
      } else {
        await unfollowUser(storedId, userId);
      }
      const updatedFollowers = await fetchFollowers(userId);
      const isNowFollowing = (updatedFollowers ?? []).some(
        (f) => f.id === storedId
      );
      setIsFollowing(isNowFollowing);
    } catch (err: any) {
      console.error("Toggle error:", err);
      if (err.message.includes("duplicate key value")) {
        setIsFollowing(true);
      } else if (err.message.includes("Not following")) {
        setIsFollowing(false);
      } else {
        setIsFollowing(!newState);
      }
      Toast.show({
        type: "error",
        text1: `Failed to update follow status: ${
          err.message || "Unknown error"
        }`,
      });
    }
  };

  const gray500 = useThemeColor({}, "gray-500");
  const gray600 = useThemeColor({}, "gray-600");
  const white = "#fff";
  const primary500 = useThemeColor({}, "primary-500");
  const primary600 = useThemeColor({}, "primary-600");

  return (
    <TouchableOpacity
      onPress={handleFollowToggle}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 6,
        backgroundColor: isFollowing ? gray500 : primary500,
        borderRadius: 100,
      }}
    >
      <Text>{isFollowing ? "bye-bye vibe" : "vibe with you"}</Text>
    </TouchableOpacity>
  );
};

export default FollowButton;

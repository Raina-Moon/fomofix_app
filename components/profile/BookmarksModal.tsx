import GoBackArrow from "@/assets/icons/GoBackArrow";
import { Post } from "@/types";
import { Text, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FlatList } from "react-native";
import { Image } from "react-native";

interface BookmarksModalProps {
  bookmarkedPosts: Post[];
  onClose: () => void;
  onSelectPost: (post: Post) => void;
}

const BookmarksModal = ({
  bookmarkedPosts,
  onClose,
  onSelectPost,
}: BookmarksModalProps) => {
  const white = "#fff";
  const gray200 = useThemeColor({}, "gray-200");
  const gray600 = useThemeColor({}, "gray-600");

  return (
    <View
      style={{
        backgroundColor: white,
        top: 64,
        position: "absolute",
        zIndex: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: gray200,
        }}
      >
        <TouchableOpacity onPress={onClose}>
          <GoBackArrow />
        </TouchableOpacity>
        <Text
          style={{
            color: gray600,
            fontSize: 18,
            fontWeight: "semibold",
            marginLeft: 16,
          }}
        >
          Saved Posts
        </Text>
      </View>

      <FlatList
        data={bookmarkedPosts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelectPost(item)}>
            <Image
              source={{ uri: item.image_url }}
              style={{ width: "33%", aspectRatio: 1, margin: 2 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default BookmarksModal;

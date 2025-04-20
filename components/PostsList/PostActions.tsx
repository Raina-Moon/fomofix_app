import BookmarkEmpty from "@/assets/icons/BookmarkEmpty";
import BookmarkFull from "@/assets/icons/BookmarkFull";
import HeartEmpty from "@/assets/icons/HeartEmpty";
import HeartFull from "@/assets/icons/HeartFull";
import MessageIcon from "@/assets/icons/MessageIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, TouchableOpacity, View } from "react-native";

interface PostActionsProps {
  postId: number;
  likeStatus: boolean;
  likeCount: number;
  commentCount: number;
  bookmarkStatus: boolean;
  onLike: (postId: number) => void;
  onCommentClick: (postId: number) => void;
  onBookmark: (postId: number) => void;
}

const PostActions = ({
  postId,
  likeStatus,
  likeCount,
  commentCount,
  bookmarkStatus,
  onLike,
  onCommentClick,
  onBookmark,
}: PostActionsProps) => {
  const gray900 = useThemeColor({}, "gray-900");

  return (
    <View
      style={{
        marginTop: 8,
        gap: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => onLike(postId)}
        style={{
          flexDirection: "row",
          gap: 4,
        }}
      >
        {likeStatus ? <HeartFull /> : <HeartEmpty />}
        {likeCount > 0 && <Text style={{ color: gray900 }}>{likeCount}</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onCommentClick(postId)}
        style={{
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
        }}
      >
        <MessageIcon />
        {commentCount > 0 && (
          <Text style={{ color: gray900 }}>{commentCount}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onBookmark(postId)}>
        {bookmarkStatus ? <BookmarkFull /> : <BookmarkEmpty />}
      </TouchableOpacity>
    </View>
  );
};

export default PostActions;

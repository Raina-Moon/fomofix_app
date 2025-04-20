import { Post } from "@/types";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import { useThemeColor } from "@/hooks/useThemeColor";
import { View } from "react-native";

interface PostItemProps {
  post: Post;
  userId: number | null;
  likeStatus: boolean;
  likeCount: number;
  commentCount: number;
  bookmarkStatus: boolean;
  onLike: (postId: number) => void;
  onCommentClick: (postId: number) => void;
  onBookmark: (postId: number) => void;
}

const PostItem = ({
  post,
  likeStatus,
  likeCount,
  commentCount,
  bookmarkStatus,
  onLike,
  onCommentClick,
  onBookmark,
}: PostItemProps) => {
  const primary200 = useThemeColor({}, "primary-200");
  const white = "#FFFFFF";
  const black = "#000000";

  return (
    <View style={{ marginBottom: 16 }}>
      <PostHeader
        userId={post.user_id ?? null}
        username={post.username}
        profileImage={post.profile_image}
      />
      <View
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 16,
          shadowColor: black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
          borderColor: primary200,
          backgroundColor: white,
        }}
      >
        {" "}
        <PostContent
          title={post.title}
          duration={post.duration}
          imageUrl={post.image_url}
          description={post.description}
          createdAt={post.created_at}
          postId={post.post_id}
        />
        <PostActions
          postId={post.post_id}
          likeStatus={likeStatus}
          likeCount={likeCount}
          commentCount={commentCount}
          bookmarkStatus={bookmarkStatus}
          onLike={onLike}
          onCommentClick={onCommentClick}
          onBookmark={onBookmark}
        />
      </View>
    </View>
  );
};

export default PostItem;

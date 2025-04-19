import { useCallback, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Post } from "@/types";
import { useRouter } from "expo-router";
import HeartFull from "@/assets/icons/HeartFull";
import HeartEmpty from "@/assets/icons/HeartEmpty";
import MessageIcon from "@/assets/icons/MessageIcon";
import BookmarkFull from "@/assets/icons/BookmarkFull";
import BookmarkEmpty from "@/assets/icons/BookmarkEmpty";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { useLikes } from "@/contexts/LikesContext";
import { useComments } from "@/contexts/CommentsContext";
import CommentsModal from "@/components/PostsList/CommentsModal";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
  user: { id: number; username: string; profile_image?: string | null };
  onBookmarkChange?: (postId: number, isBookmarked: boolean) => void;
}

const PostDetailModal = ({
  post: initialPost,
  onClose,
  user,
  onBookmarkChange,
}: PostDetailModalProps) => {
  const { likePost, unlikePost, getLikeStatus, fetchLikeCount } = useLikes();
  const {
    commentsByPost,
    fetchComments,
    addComment,
    editComment,
    deleteComment,
  } = useComments();
  const { bookmarkPost, unbookmarkPost, fetchBookmarkedPostDetail } =
    useBookmarks();
  const router = useRouter();

  const [post, setPost] = useState<Post>(initialPost);
  const [isLiked, setIsLiked] = useState(initialPost.liked_by_me || false);
  const [likeCount, setLikeCount] = useState(initialPost.like_count || 0);
  const [isBookmarked, setIsBookmarked] = useState(
    initialPost.bookmarked_by_me || false
  );
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch initial data when the component mounts or user changes
  const initializeData = useCallback(async () => {
    if (!user.id || !initialPost.id || isInitialized) return;

    try {
      const bookmarkedPosts = await fetchBookmarkedPostDetail(user.id);
      const detailedPost = bookmarkedPosts.find(
        (bp) => bp.post_id === initialPost.id
      );
      if (detailedPost) {
        setPost(detailedPost);
        setIsLiked(detailedPost.liked_by_me || false);
        setLikeCount(detailedPost.like_count || 0);
        setIsBookmarked(detailedPost.bookmarked_by_me || false);
      }

      const likeStatus = await getLikeStatus(initialPost.id, user.id);
      const count = await fetchLikeCount(initialPost.id);
      await fetchComments(initialPost.id);

      setIsLiked(likeStatus);
      setLikeCount(count);
      setIsInitialized(true);
    } catch (err) {
      console.error("Failed to initialize post data:", err);
      setError("Failed to load post data");
    }
  }, [
    initialPost.id,
    user.id,
    fetchBookmarkedPostDetail,
    getLikeStatus,
    fetchLikeCount,
    fetchComments,
    isInitialized,
  ]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleProfileClick = useCallback(() => {
    if (post.user_id !== undefined) {
      router.push(`/dashboard/${post.user_id}`);
    }
  }, [router, post.user_id]);

  const handleLike = async () => {
    if (!user.id) {
      router.replace("/login");
      return;
    }
    try {
      setError(null);
      const newCount = isLiked
        ? await unlikePost(user.id, post.post_id)
        : await likePost(user.id, post.post_id);
      const newLikeStatus = await getLikeStatus(post.post_id, user.id);
      setIsLiked(newLikeStatus);
      setLikeCount(newCount);
    } catch (err) {
      console.error("Like action failed:", err);
      setError("Failed to update like status");
    }
  };

  const handleBookmark = async () => {
    if (!user.id) {
      router.replace("/login");
      return;
    }
    try {
      setError(null);
      const newState = !isBookmarked;
      newState
        ? await bookmarkPost(user.id, post.post_id)
        : await unbookmarkPost(user.id, post.post_id);
      setIsBookmarked(newState);
      onBookmarkChange?.(post.post_id, newState); // Notify parent component if provided
    } catch (err) {
      console.error("Bookmark action failed:", err);
      setError("Failed to update bookmark status");
    }
  };

  const handleCommentClick = () => {
    if (!post.post_id) {
      setError("Cannot load comments: Post ID is missing");
      return;
    }
    setShowCommentsModal(true);
  };

  const black = "#000000";
  const white = "#FFFFFF";
  const gray500 = useThemeColor({}, "gray-500");
  const gray600 = useThemeColor({}, "gray-600");
  const gray900 = useThemeColor({}, "gray-900");
  const primary400 = useThemeColor({}, "primary-400");
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
      }}
      onTouchStart={onClose}
    >
      <View
        style={{
          backgroundColor: white,
          padding: 16,
          borderRadius: 8,
          width: "90%",
          maxWidth: 600,
          maxHeight: 750,
          overflowY: "auto",
        }}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <TouchableOpacity
            onPress={handleProfileClick}
            className="flex flex-row items-end gap-2"
          >
            <Image
              source={{
                uri: post.profile_image || "/images/DefaultProfile.png",
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 9999,
              }}
            />
            <Text
              style={{
                color: gray900,
                fontSize: 12,
                fontWeight: "medium",
                alignContent: "flex-end",
              }}
            >
              {post.username || "Unknown User"}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              color: gray900,
              fontWeight: "semibold",
            }}
          >
            title : {post.title}
          </Text>
          <Text
            style={{
              color: gray600,
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            duration : {post.duration} min
          </Text>
          {post.created_at && (
            <Text
              style={{
                color: gray500,
                fontSize: 8,
              }}
            >
              {formatTimeAgo(String(post.created_at))}
            </Text>
          )}{" "}
        </View>

        <Image
          source={{ uri: post.image_url }}
          resizeMode="cover"
          style={{
            width: "100%",
            maxHeight: 750,
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
        <Text>{post.description}</Text>

        {error && (
          <Text style={{ color: red500, fontSize: 8, marginTop: 8 }}>
            {error}
          </Text>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={handleLike}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            {isLiked ? <HeartFull /> : <HeartEmpty />}
            {likeCount > 0 && (
              <Text style={{ color: gray900 }}>{likeCount}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCommentClick}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <MessageIcon />
            {commentsByPost[post.post_id]?.length > 0 && (
              <Text>{commentsByPost[post.post_id].length}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBookmark}>
            {isBookmarked ? <BookmarkFull /> : <BookmarkEmpty />}
          </TouchableOpacity>
        </View>
      </View>

      {showCommentsModal && (
        <CommentsModal
          postId={post.post_id}
          userId={user.id}
          comments={commentsByPost[post.post_id] || []}
          onClose={() => setShowCommentsModal(false)}
          addComment={addComment}
          editComment={editComment}
          deleteComment={deleteComment}
        />
      )}
    </View>
  );
};

export default PostDetailModal;

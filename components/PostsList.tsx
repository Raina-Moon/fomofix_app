import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "expo-router";
import { Post } from "@/types";
import { useLikes } from "@/contexts/LikesContext";
import { useComments } from "@/contexts/CommentsContext";
import { useBookmarks } from "@/contexts/BookmarksContext";
import Toast from "react-native-toast-message";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import PostItem from "./PostsList/PostItem";
import CommentsModal from "./PostsList/CommentsModal";

interface PostsListProps {
  posts: Post[];
  userId: number | null;
}

const POSTS_PER_PAGE = 10;

const PostsList = ({ posts, userId }: PostsListProps) => {
  const { likePost, unlikePost, getLikeStatus, fetchLikeCount } = useLikes();
  const {
    commentsByPost,
    fetchComments,
    addComment,
    editComment,
    deleteComment,
  } = useComments();
  const { bookmarkPost, unbookmarkPost, fetchBookmarkedPosts } = useBookmarks();
  const router = useRouter();

  const [likeStatus, setLikeStatus] = useState<{ [key: number]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});
  const [bookmarkStatus, setBookmarkStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [modalPostId, setModalPostId] = useState<number | null>(null);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const white = "#FFFFFF";
  const gray800 = useThemeColor({}, "gray-800");

  const filteredPosts = useMemo(
    () =>
      userId ? posts.filter((post) => Number(post.user_id) !== userId) : posts,
    [posts, userId]
  );

  const initializeData = useCallback(async () => {
    const status: { [key: number]: boolean } = {};
    const counts: { [key: number]: number } = {};
    const bookmarkStatusTemp: { [key: number]: boolean } = {};

    try {
      await Promise.all(
        filteredPosts.map(async (post) => {
          try {
            await fetchComments(post.post_id);
            counts[post.post_id] = await fetchLikeCount(post.post_id);
            if (userId) {
              status[post.post_id] = await getLikeStatus(post.post_id, userId);
              const bookmarkedPosts = await fetchBookmarkedPosts(userId);
              bookmarkStatusTemp[post.post_id] = bookmarkedPosts.some(
                (bp) => bp.id === post.post_id
              );
            } else {
              status[post.post_id] = false;
              bookmarkStatusTemp[post.post_id] = false;
            }
          } catch (err) {
            if (err instanceof Error && err.message.includes("Unauthorized")) {
              router.push("/login");
              return;
            }
            console.error(`Error processing post ${post.post_id}:`, err);
          }
        })
      );
      setLikeStatus(status);
      setLikeCounts(counts);
      setBookmarkStatus(bookmarkStatusTemp);
    } catch (err) {
      console.error("Failed to initialize data:", err);
    }
  }, [
    userId,
    filteredPosts,
    fetchComments,
    fetchLikeCount,
    getLikeStatus,
    fetchBookmarkedPosts,
    router,
  ]);

  // Load more posts when the user scrolls to the bottom of the page
  const loadPosts = useCallback(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const newPosts = filteredPosts.slice(0, end);
    setDisplayedPosts(newPosts);
  }, [page, filteredPosts]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleLoadMore = useCallback(() => {
    if (isLoading || displayedPosts.length >= filteredPosts.length) return;
    setIsLoading(true);
    setPage((prev) => prev + 1);
  }, [isLoading, displayedPosts.length, filteredPosts.length]);

  const handleLike = async (postId: number) => {
    if (!userId) {
      return Toast.show({
        type: "info",
        text1: "log in to spread the love ❤️",
        onPress: () => router.push("/login"),
      });
    }
    const alreadyLiked = likeStatus[postId] || false;
    try {
      const newCount = alreadyLiked
        ? await unlikePost(userId, postId)
        : await likePost(userId, postId);
      const newLikeStatus = await getLikeStatus(postId, userId);
      setLikeStatus((prev) => ({ ...prev, [postId]: newLikeStatus }));
      setLikeCounts((prev) => ({ ...prev, [postId]: newCount }));
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleBookmark = async (postId: number) => {
    if (!userId) {
      return Toast.show({
        type: "info",
        text1: "wanna save that gem? gotta log in first 💎",
        onPress: () => router.push("/login"),
      });
      return;
    }
    const isBookmarked = bookmarkStatus[postId] || false;
    const newState = !isBookmarked;
    setBookmarkStatus((prev) => ({ ...prev, [postId]: newState }));
    try {
      if (isBookmarked) {
        await unbookmarkPost(userId, postId);
      } else {
        await bookmarkPost(userId, postId);
      }
    } catch (err) {
      console.error("Bookmark action failed:", err);
      setBookmarkStatus((prev) => ({ ...prev, [postId]: isBookmarked }));
    }
  };

  const openCommentsModal = (postId: number) => setModalPostId(postId);
  const closeCommentsModal = () => setModalPostId(null);

  const renderItem = ({ item }: { item: Post }) => (
    <PostItem
      post={item}
      userId={userId}
      likeStatus={likeStatus[item.post_id] || false}
      likeCount={likeCounts[item.post_id] || item.like_count}
      commentCount={
        (commentsByPost[item.post_id] || item.comments || []).length
      }
      bookmarkStatus={bookmarkStatus[item.post_id] || false}
      onLike={handleLike}
      onCommentClick={openCommentsModal}
      onBookmark={handleBookmark}
    />
  );

  const renderFooter = () => {
    if (isLoading) {
      return (
        <View style={{ paddingVertical: 16, alignItems: "center" }}>
          <ActivityIndicator size="small" color="#6B7280" />
          <Text style={{ fontSize: 14, color: gray800, textAlign: "center" }}>
            Loading more posts...
          </Text>
        </View>
      );
    }
    if (displayedPosts.length < filteredPosts.length) {
      return (
        <View style={{ paddingVertical: 16, alignItems: "center" }}>
          <Text style={{ fontSize: 14, color: gray800, textAlign: "center" }}>
            Scroll to load more
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <View
        style={{
          paddingVertical: 27,
          backgroundColor: white,
        }}
      >
        <FlatList
          data={displayedPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.post_id.toString()}
          contentContainerStyle={{ paddingVertical: 27, paddingHorizontal: 16 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
        {modalPostId && (
          <CommentsModal
            postId={modalPostId}
            userId={userId}
            comments={commentsByPost[modalPostId] || []}
            onClose={closeCommentsModal}
            addComment={addComment}
            editComment={editComment}
            deleteComment={deleteComment}
          />
        )}
      </View>
    </>
  );
};

export default PostsList;

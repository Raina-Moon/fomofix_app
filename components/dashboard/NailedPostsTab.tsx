import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  StyleSheet,
  ListRenderItem,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Post } from "@/types";
import { useLikes } from "@/contexts/LikesContext";
import { useComments } from "@/contexts/CommentsContext";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { useRouter } from "expo-router";

interface NailedPostsTabProps {
  posts: Post[];
  userId: number | null;
}

const NailedPostsTab = ({ posts = [], userId }: NailedPostsTabProps) => {
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

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("latest");
  const [likeStatus, setLikeStatus] = useState<{ [key: number]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
  const [bookmarkStatus, setBookmarkStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [commentEdit, setCommentEdit] = useState<{ [key: number]: string }>({});

  const initializeData = useCallback(async () => {
    if (!userId) return;
    const status: { [key: number]: boolean } = {};
    const counts: { [key: number]: number } = {};
    const bookmarkStatusTemp: { [key: number]: boolean } = {};

    try {
      const bookmarkedPosts = await fetchBookmarkedPosts(userId);
      for (const post of posts) {
        status[post.post_id] = await getLikeStatus(post.post_id, userId);
        counts[post.post_id] = await fetchLikeCount(post.post_id);
        bookmarkStatusTemp[post.post_id] = bookmarkedPosts.some(
          (bp) => bp.id === post.post_id
        );
        await fetchComments(post.post_id);
      }
      setLikeStatus(status);
      setLikeCounts(counts);
      setBookmarkStatus(bookmarkStatusTemp);
    } catch (err) {
      console.error("Failed to initialize data:", err);
    }
  }, [
    userId,
    posts,
    getLikeStatus,
    fetchLikeCount,
    fetchBookmarkedPosts,
    fetchComments,
  ]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "latest") return b.goal_id - a.goal_id;
    if (sortBy === "oldest") return a.goal_id - b.goal_id;
    if (sortBy === "most-time") return b.duration - a.duration;
    if (sortBy === "least-time") return a.duration - b.duration;
    return 0;
  });

  const handleLike = async (postId: number) => {
    if (!userId) return;
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
    if (!userId) return;
    const isBookmarked = bookmarkStatus[postId] || false;
    const newState = !isBookmarked;
    setBookmarkStatus((prev) => ({ ...prev, [postId]: newState }));
    try {
      if (isBookmarked) await unbookmarkPost(userId, postId);
      else await bookmarkPost(userId, postId);
    } catch (err) {
      console.error("Bookmark action failed:", err);
      setBookmarkStatus((prev) => ({ ...prev, [postId]: isBookmarked }));
    }
  };

  const submitComment = async (postId: number) => {
    if (!userId || !newComments[postId]) return;
    await addComment(userId, postId, newComments[postId]);
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
    await fetchComments(postId);
  };

  const handleEditComment = async (
    postId: number,
    commentId: number,
    content: string
  ) => {
    try {
      await editComment(postId, commentId, content);
      await fetchComments(postId);
      setCommentEdit((prev) => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      await deleteComment(postId, commentId);
      await fetchComments(postId);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const closePostModal = () => setSelectedPostId(null);

  const handlePostClick = useCallback(
    (userId: number, postId: number) => {
      router.push(`dashboard/${userId}/post/${postId}` as any);
    },
    [router]
  );

  const selectedPost = sortedPosts.find((p) => p.post_id === selectedPostId);

  const renderPost: ListRenderItem<Post> = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePostClick(item.user_id ?? 0, item.post_id)}
      style={styles.postItem}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.postImage}
          alt={item.title}
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter section */}
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={sortBy}
          onValueChange={(value) => setSortBy(value)}
          style={styles.picker}
        >
          <Picker.Item label="Latest" value="latest" />
          <Picker.Item label="Oldest" value="oldest" />
          <Picker.Item label="Most Time" value="most-time" />
          <Picker.Item label="Shortest Time" value="least-time" />
        </Picker>
      </View>

      {/* 3-column grid */}
      <FlatList
        data={sortedPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.post_id.toString()}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />

      {/* Post modal */}
      <Modal
        visible={!!selectedPost}
        transparent={true}
        animationType="fade"
        onRequestClose={closePostModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closePostModal}
        >
          <View style={styles.modalContainer}>
            {selectedPost && (
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedPost.title || "Untitled"}
                  </Text>
                  <TouchableOpacity onPress={closePostModal}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>
                {selectedPost.image_url && (
                  <Image
                    source={{ uri: selectedPost.image_url }}
                    style={styles.modalImage}
                    alt={selectedPost.title}
                  />
                )}
                <Text style={styles.modalDuration}>
                  Duration: {selectedPost.duration || 0} min
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedPost.description || "No description"}
                </Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    onPress={() => handleLike(selectedPost.post_id)}
                  >
                    <Text style={styles.actionText}>
                      {likeStatus[selectedPost.post_id]
                        ? "❤️ Liked"
                        : "🤍 Like"}{" "}
                      (
                      {likeCounts[selectedPost.post_id] ||
                        selectedPost.like_count ||
                        0}
                      )
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleBookmark(selectedPost.post_id)}
                  >
                    <Text style={styles.actionText}>
                      {bookmarkStatus[selectedPost.post_id]
                        ? "⭐ Bookmarked"
                        : "☆ Bookmark"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TextInput
                    value={newComments[selectedPost.post_id] || ""}
                    onChangeText={(text) =>
                      setNewComments((prev) => ({
                        ...prev,
                        [selectedPost.post_id]: text,
                      }))
                    }
                    placeholder="Add a comment..."
                    style={styles.commentInput}
                  />
                  <TouchableOpacity
                    onPress={() => submitComment(selectedPost.post_id)}
                  >
                    <Text style={styles.commentButton}>Post Comment</Text>
                  </TouchableOpacity>
                  <View style={styles.commentsContainer}>
                    {(commentsByPost[selectedPost.post_id] || []).map((c) => (
                      <View key={c.id} style={styles.commentRow}>
                        <Text style={styles.commentUsername}>
                          {c.username || "User"}:
                        </Text>
                        <TextInput
                          value={commentEdit[c.id] ?? c.content}
                          onChangeText={(text) =>
                            setCommentEdit((prev) => ({
                              ...prev,
                              [c.id]: text,
                            }))
                          }
                          style={styles.commentEditInput}
                        />
                        <TouchableOpacity
                          onPress={() =>
                            handleEditComment(
                              selectedPost.post_id,
                              c.id,
                              commentEdit[c.id] || c.content
                            )
                          }
                          style={styles.commentAction}
                        >
                          <Text style={styles.commentActionText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleDeleteComment(selectedPost.post_id, c.id)
                          }
                          style={styles.commentAction}
                        >
                          <Text style={styles.commentActionDeleteText}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default NailedPostsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  filterContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  picker: {
    width: 150,
    height: 44,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  grid: {
    paddingBottom: 16,
  },
  postItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 1,
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  noImageContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  noImageText: {
    color: "#6B7280",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000",
    opacity: 0.75,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    fontSize: 16,
    color: "#111827",
  },
  modalImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalDuration: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  actionText: {
    fontSize: 14,
    color: "#DB2777", // pink600 for like, yellow500 for bookmark
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    marginBottom: 8,
  },
  commentButton: {
    fontSize: 14,
    color: "#3B82F6",
    marginBottom: 8,
  },
  commentsContainer: {
    marginTop: 8,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentUsername: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#111827",
    marginRight: 8,
  },
  commentEditInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  commentAction: {
    marginHorizontal: 8,
  },
  commentActionText: {
    fontSize: 14,
    color: "#22C55E",
  },
  commentActionDeleteText: {
    fontSize: 14,
    color: "#EF4444",
  },
});

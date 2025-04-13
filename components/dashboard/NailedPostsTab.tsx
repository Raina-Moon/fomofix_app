"use client";

import { useCallback, useEffect, useState } from "react";
import { Post } from "@/types";
import { useLikes } from "@/contexts/LikesContext";
import { useComments } from "@/contexts/CommentsContext";
import { useBookmarks } from "@/contexts/BookmarksContext";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
  Box,
  Text,
  Pressable,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import {
  Image,
  TextInput,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  FlatList,
} from "react-native";
import { ListRenderItem } from "react-native";

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
      router.push(`/${userId}/post/${postId}` as any);
    },
    [router]
  );

  const selectedPost = sortedPosts.find((p) => p.post_id === selectedPostId);

  const renderPost: ListRenderItem<Post> = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePostClick(item.user_id ?? 0, item.post_id)}
      style={{ flex: 1 / 3, aspectRatio: 1, margin: 1 } as StyleProp<ViewStyle>}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={{ width: "100%", height: "100%", borderRadius: 4 }}
          alt={item.title}
        />
      ) : (
        <Box
          style={{
            flex: 1,
            backgroundColor: "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
        >
          <Text style={{ color: "#6B7280", fontSize: 14 }}>No Image</Text>
        </Box>
      )}
    </TouchableOpacity>
  );

  return (
    <Box style={{ paddingHorizontal: 12, flex: 1 }}>
      {/* Filter section */}
      <Box style={{ alignItems: "flex-end", marginBottom: 16 }}>
        <Select
          onValueChange={(value) => setSortBy(value)}
          defaultValue="latest"
        >
          <SelectTrigger
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 6,
              padding: 8,
            }}
          >
            <SelectInput placeholder="Sort by" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectItem label="Latest" value="latest" />
              <SelectItem label="Oldest" value="oldest" />
              <SelectItem label="Most Time" value="most-time" />
              <SelectItem label="Shortest Time" value="least-time" />
            </SelectContent>
          </SelectPortal>
        </Select>
      </Box>

      {/* 3-column grid */}
      <FlatList<Post>
        data={sortedPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.post_id.toString()}
        numColumns={3}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {/* Post modal */}
      {selectedPost && (
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#000000",
            opacity: 0.75,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
          onTouchStart={closePostModal}
        >
          <Box
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              width: "90%",
              maxHeight: "80%",
              padding: 16,
            }}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Box
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "600", color: "#111827" }}
              >
                {selectedPost.title || "Untitled"}
              </Text>
              <Pressable onPress={closePostModal}>
                <Text style={{ fontSize: 16, color: "#111827" }}>✕</Text>
              </Pressable>
            </Box>
            {selectedPost.image_url && (
              <Image
                source={{ uri: selectedPost.image_url }}
                style={{ width: "100%", height: 300, borderRadius: 8 }}
                alt={selectedPost.title}
              />
            )}
            <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
              Duration: {selectedPost.duration || 0} min
            </Text>
            <Text style={{ fontSize: 14, color: "#374151", marginBottom: 16 }}>
              {selectedPost.description || "No description"}
            </Text>
            <Box style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
              <Pressable onPress={() => handleLike(selectedPost.post_id)}>
                <Text style={{ color: "#DB2777", fontSize: 14 }}>
                  {likeStatus[selectedPost.post_id] ? "❤️ Liked" : "🤍 Like"} (
                  {likeCounts[selectedPost.post_id] ||
                    selectedPost.like_count ||
                    0}
                  )
                </Text>
              </Pressable>
              <Pressable onPress={() => handleBookmark(selectedPost.post_id)}>
                <Text style={{ color: "#F59E0B", fontSize: 14 }}>
                  {bookmarkStatus[selectedPost.post_id]
                    ? "⭐ Bookmarked"
                    : "☆ Bookmark"}
                </Text>
              </Pressable>
            </Box>
            <Box>
              <TextInput
                value={newComments[selectedPost.post_id] || ""}
                onChangeText={(text) =>
                  setNewComments((prev) => ({
                    ...prev,
                    [selectedPost.post_id]: text,
                  }))
                }
                placeholder="Add a comment..."
                style={{
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  fontSize: 14,
                  marginBottom: 8,
                }}
              />
              <Pressable onPress={() => submitComment(selectedPost.post_id)}>
                <Text style={{ color: "#3B82F6", fontSize: 14 }}>
                  Post Comment
                </Text>
              </Pressable>
              <Box style={{ marginTop: 8 }}>
                {(commentsByPost[selectedPost.post_id] || []).map((c) => (
                  <Box
                    key={c.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginRight: 8,
                        color: "#111827",
                        fontSize: 14,
                      }}
                    >
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
                      style={{
                        borderWidth: 1,
                        borderColor: "#D1D5DB",
                        borderRadius: 4,
                        paddingHorizontal: 8,
                        flex: 1,
                        fontSize: 14,
                      }}
                    />
                    <Pressable
                      onPress={() =>
                        handleEditComment(
                          selectedPost.post_id,
                          c.id,
                          commentEdit[c.id] || c.content
                        )
                      }
                      style={{ marginHorizontal: 8 }}
                    >
                      <Text style={{ color: "#22C55E", fontSize: 14 }}>
                        Save
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        handleDeleteComment(selectedPost.post_id, c.id)
                      }
                    >
                      <Text style={{ color: "#EF4444", fontSize: 14 }}>
                        Delete
                      </Text>
                    </Pressable>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NailedPostsTab;

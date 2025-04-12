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
  FlatList,
  Pressable,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { Image, TextInput, TouchableOpacity } from "react-native";

interface NailedPostsTabProps {
  posts: Post[];
  userId: number | null;
}

const NailedPostsTab = ({ posts, userId }: NailedPostsTabProps) => {
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

  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(
    null
  );
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
  }, [userId, posts]);

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
  };

  const handleEditComment = async (
    postId: number,
    commentId: number,
    content: string
  ) => {
    try {
      await editComment(postId, commentId, content);
      fetchComments(postId);
      setCommentEdit((prev) => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    await deleteComment(postId, commentId);
  };

  const closePostModal = () => setSelectedPostIndex(null);

  const handlePostClick = useCallback(
    (userId: number, postId: number) => {
      router.push(`${userId}/post/${postId}` as any);
    },
    [router]
  );

  const selectedPost = sortedPosts.find((p) => p.post_id === selectedPostIndex);

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      onPress={() => handlePostClick(item.user_id ?? 0, item.post_id)}
      style={{ flex: 1 / 3, aspectRatio: 1, margin: 1 }}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={{ width: "100%", height: "100%", borderRadius: 4 }}
          alt={item.title}
        />
      ) : (
        <Box
          flex={1}
          bg="$gray200"
          alignItems="center"
          justifyContent="center"
          borderRadius="$sm"
        >
          <Text color="$gray500">No Image</Text>
        </Box>
      )}
    </TouchableOpacity>
  );

  return (
    <Box>
      {/* filter section */}
      <Box alignItems="flex-end" mb="$4">
        <Select
          onValueChange={(value: any) => setSortBy(value)}
          defaultValue="latest"
          width={160}
        >
          <SelectTrigger
            borderWidth={1}
            borderColor="$gray300"
            borderRadius="$md"
            p="$2"
          >
            <SelectInput placeholder="Latest" />
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

      {/* 3row grid */}
      <FlatList
        data={sortedPosts}
        renderItem={renderPost}
        keyExtractor={(item: any) => item.post_id.toString()}
        numColumns={3}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {/* posts modal */}
      {selectedPost && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="$black"
          opacity={0.75}
          justifyContent="center"
          alignItems="center"
          zIndex={50}
          onTouchStart={closePostModal}
        >
          <Box
            bg="$white"
            borderRadius="$lg"
            w="90%"
            maxHeight="80%"
            p="$4"
            onTouchStart={(e: any) => e.stopPropagation()}
          >
            <Box flexDirection="row" justifyContent="space-between" mb="$4">
              <Text fontSize="$lg" fontWeight="$semibold" color="$gray900">
                {selectedPostIndex !== null &&
                  sortedPosts[selectedPostIndex]?.title}
              </Text>
              <Pressable onPress={closePostModal}>✕</Pressable>
            </Box>
            {selectedPost.image_url && (
              <Image
                source={{ uri: selectedPost.image_url }}
                style={{ width: "100%", height: 300, borderRadius: 8 }}
                alt={selectedPost.title}
              />
            )}
            <Text fontSize="$sm" color="$gray600" mb="$2">
              Duration: {selectedPost.duration} min
            </Text>
            <Text fontSize="$sm" color="$gray800" mb="$4">
              {selectedPost.description}
            </Text>
            <Box flexDirection="row" gap="$4" mb="$4">
              <Pressable onPress={() => handleLike(selectedPost.post_id)}>
                <Text color="$pink600">
                  {likeStatus[selectedPost.post_id] ? "❤️ Liked" : "🤍 Like"} (
                  {likeCounts[selectedPost.post_id] || selectedPost.like_count})
                </Text>
              </Pressable>
              <Pressable onPress={() => handleBookmark(selectedPost.post_id)}>
                <Text color="$yellow500">
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
                <Text color="$blue500" fontSize="$sm">
                  Post
                </Text>
              </Pressable>
              <Box mt="$2">
                {(commentsByPost[selectedPost.post_id] || []).map((c) => (
                  <Box
                    key={c.id}
                    flexDirection="row"
                    alignItems="center"
                    mb="$2"
                  >
                    <Text fontWeight="$bold" mr="$2">
                      {c.username}:
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
                      mx="$2"
                    >
                      <Text color="$green500">Save</Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        handleDeleteComment(selectedPost.post_id, c.id)
                      }
                    >
                      <Text color="$red500">Delete</Text>
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

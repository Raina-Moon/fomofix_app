import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePosts } from "@/contexts/PostContext";
import { Post } from "@/types";
import GoalForm from "@/components/GoalForm";
import PostsList from "@/components/PostsList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { View } from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  const { fetchAllPosts } = usePosts();

  const [posts, setPosts] = useState<Post[]>([]);

  const fetchAndShufflePosts = useCallback(async () => {
    try {
      const allPosts = await fetchAllPosts();
      const shuffledPosts = [...allPosts].sort(() => Math.random() - 0.5);
      setPosts(shuffledPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  }, [fetchAllPosts]);

  useEffect(() => {
    fetchAndShufflePosts();
  }, [fetchAndShufflePosts, user]);

  const primary200 = useThemeColor({}, "primary-200");

  return (
    <View style={{ flex: 1 }}>
      <GoalForm />
      <View
        style={{
          borderBottomWidth: 1,
          marginVertical: 20,
          marginHorizontal: 20,
          borderBottomColor: primary200,
        }}
      />
      <PostsList posts={posts} userId={user ? Number(user.id) : null} />
    </View>
  );
}

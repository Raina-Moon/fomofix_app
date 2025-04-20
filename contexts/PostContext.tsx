import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Post } from "@/types";
import { fetchApi } from "@/constants/api/fetch";
import * as ImagePicker from "expo-image-picker";

interface PostState {
  nailedPosts: Post[];
  fetchNailedPosts: (userId: number) => Promise<Post[]>;
  fetchAllPosts: () => Promise<Post[]>;
  createPost: (
    userId: number,
    goalId: number,
    imageUrl: string,
    description: string
  ) => Promise<void>;
  uploadPostImage: (asset: ImagePicker.ImagePickerAsset) => Promise<string>;
}

const PostContext = createContext<PostState | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [nailedPosts, setNailedPosts] = useState<Post[]>([]);
  const { user } = useAuth();

  const fetchNailedPosts = async (userId: number) => {
    const posts = await fetchApi<Post[]>(`/posts/nailed/${userId}`);
    setNailedPosts(posts);
    return posts;
  };

  const fetchAllPosts = async () => {
    const query = user?.id ? `?viewerId=${user.id}` : "";
    const posts = await fetchApi<Post[]>(`/posts${query}`);
    return posts;
  };

  const createPost = async (
    userId: number,
    goalId: number,
    imageUrl: string,
    description: string
  ) => {
    console.log("🚀 Call createPost", {
      userId,
      goalId,
      imageUrl,
      description,
    }); //Debugging Line
try {
    const newPost = await fetchApi<Post>("/posts", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        goal_id: goalId,
        image_url: imageUrl,
        description,
      }),
    });
    console.log("✅ createPost Response:", newPost); // Debugging line
    setNailedPosts((prev) => [...prev, newPost]);
  } catch (err) {
    console.error("❌ createPost Error:", err);
    throw err;
  }
};

  const uploadPostImage = async (
    asset: ImagePicker.ImagePickerAsset
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("image", {
      uri: asset.uri,
      name: asset.fileName || "photo.jpg",
      type: asset.type || "image/jpeg",
    } as any);
    const data = await fetchApi<{ imageUrl: string }>("/posts/upload-image", {
      method: "POST",
      body: formData,
    });
    return data.imageUrl;
  };

  const value: PostState = {
    nailedPosts,
    fetchNailedPosts,
    fetchAllPosts,
    createPost,
    uploadPostImage,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePosts must be used within a PostProvider");
  return context;
};

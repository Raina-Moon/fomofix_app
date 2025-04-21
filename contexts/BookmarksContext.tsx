import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Post } from "@/types";
import { fetchApi } from "@/constants/api/fetch";

interface BookmarksState {
  bookmarkPost: (userId: number, postId: number) => Promise<void>;
  unbookmarkPost: (userId: number, postId: number) => Promise<void>;
  fetchBookmarkedPosts: (userId: number) => Promise<Post[]>;
  fetchBookmarkedPostDetail: (userId: number) => Promise<Post[]>;
}

const BookmarksContext = createContext<BookmarksState | undefined>(undefined);

export const BookmarksProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();

  const bookmarkPost = async (userId: number, postId: number) => {
    if (!token) {
      console.log("No token, redirecting to login");
      throw new Error("Unauthorized");
    }
    try {
      await fetchApi("/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, postId }),
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        console.log("Unauthorized, redirecting to login");
        throw new Error("Unauthorized");
      }
      console.error("Failed to bookmark post:", err);
      throw err;
    }
  };

  const unbookmarkPost = async (userId: number, postId: number) => {
    if (!token) {
      console.log("No token, redirecting to login");
      throw new Error("Unauthorized");
    }
    try {
      await fetchApi(`/bookmarks/${userId}/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        console.log("Unauthorized, redirecting to login");
        throw new Error("Unauthorized");
      }
      console.error("Failed to unbookmark post:", err);
      throw err;
    }
  };

  const fetchBookmarkedPosts = async (userId: number) => {
    if (!token) {
      console.log("No token, redirecting to login");
      throw new Error("Unauthorized");
    }
    try {
      const posts = await fetchApi<Post[]>(`/bookmarks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return posts;
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        console.log("Unauthorized, redirecting to login");
        throw new Error("Unauthorized");
      }
      console.error("Failed to fetch bookmarked posts:", err);
      return [];
    }
  };

  const fetchBookmarkedPostDetail = async (userId: number) => {
    if (!token) {
      console.log("No token, redirecting to login");
      throw new Error("Unauthorized");
    }
    try {
      const posts = await fetchApi<Post[]>(`/bookmarks/${userId}/detailed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return posts;
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        console.log("Unauthorized, redirecting to login");
        throw new Error("Unauthorized");
      }
      console.error("Failed to fetch bookmarked post details:", err);
      return [];
    }
  };

  const value: BookmarksState = {
    bookmarkPost,
    unbookmarkPost,
    fetchBookmarkedPosts,
    fetchBookmarkedPostDetail,
  };

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (!context)
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  return context;
};
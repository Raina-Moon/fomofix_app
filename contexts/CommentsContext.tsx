import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Comment } from "@/types";
import { fetchApi } from "@/constants/api/fetch";

interface CommentState {
  commentsByPost: { [postId: number]: Comment[] };
  fetchComments: (postId: number) => Promise<void>;
  addComment: (
    userId: number,
    postId: number,
    content: string
  ) => Promise<void>;
  editComment: (
    postId: number,
    commentId: number,
    content: string
  ) => Promise<void>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;
}

const CommentsContext = createContext<CommentState | undefined>(undefined);

export const CommentsProvider = ({ children }: { children: ReactNode }) => {
  const [commentsByPost, setCommentsByPost] = useState<{
    [postId: number]: Comment[];
  }>({});
  const { user } = useAuth();

  const fetchComments = async (postId: number) => {
    try {
      const data = await fetchApi<Comment[]>(`/comments/${postId}`);
      if (!Array.isArray(data)) {
        console.error(`Invalid comments data for post ${postId}:`, data);
        setCommentsByPost((prev) => ({ ...prev, [postId]: [] }));
        return;
      }
      setCommentsByPost((prev) => ({ ...prev, [postId]: data }));
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        console.log("Unauthorized, redirecting to login");
        throw new Error("Unauthorized");
      }
      console.error("Error fetching comments:", err);
      setCommentsByPost((prev) => ({ ...prev, [postId]: [] }));
    }
  };

  const addComment = async (
    userId: number,
    postId: number,
    content: string
  ) => {
    const tempComment: Comment = {
      id: Date.now(),
      user_id: userId,
      post_id: postId,
      content,
      username: user?.username || "You",
      profile_image: user?.profile_image || "/images/DefaultProfile.png",
      created_at: new Date().toISOString(),
    };

    const previousComments = commentsByPost[postId] || [];

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: [tempComment, ...(prev[postId] || [])],
    }));

    try {
      const newComment = await fetchApi<Comment>("/comments", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, post_id: postId, content }),
      });
      const mergedComments = {
        ...tempComment,
        ...newComment,
      };
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: prev[postId].map((c) =>
          c.id === tempComment.id ? mergedComments : c
        ),
      }));
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        console.log("Unauthorized, redirecting to login");
        throw new Error("Unauthorized");
      }
      console.error("Error adding comment:", err);
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: previousComments,
      }));
    }
  };

  const editComment = async (
    postId: number,
    commentId: number,
    content: string
  ) => {
    const previousComments = commentsByPost[postId] || [];
    const commentToEdit = previousComments.find((c) => c.id === commentId);

    if (!commentToEdit) {
      console.error("Comment not found for editing:", commentId);
      return;
    }

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: prev[postId].map((c) =>
        c.id === commentId ? { ...c, content } : c
      ),
    }));

    try {
      const updatedComment = await fetchApi<Comment>(`/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify({ content }),
      });
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: prev[postId].map((c) =>
          c.id === commentId
            ? {
                ...c,
                ...updatedComment,
                username: c.username,
                profile_image: c.profile_image,
              }
            : c
        ),
      }));
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        console.log("Unauthorized, redirecting to login");
        throw new Error("Unauthorized");
      }
      console.error("Error editing comment:", err);
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: previousComments,
      }));
      throw err;
    }
  };

  const deleteComment = async (postId: number, commentId: number) => {
    try {
      await fetchApi<{ message: string }>(`/comments/${commentId}`, {
        method: "DELETE",
      });
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        console.log("Unauthorized, redirecting to login");
        throw new Error("Unauthorized");
      }
      console.error("Error deleting comment:", err);
    }
  };

  const value: CommentState = {
    commentsByPost,
    fetchComments,
    addComment,
    editComment,
    deleteComment,
  };

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("useComments must be used within a CommentsProvider");
  }
  return context;
};
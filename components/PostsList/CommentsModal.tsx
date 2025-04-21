import { useState, useEffect, useRef } from "react";
import CommentList from "./CommentsList";
import CommentForm from "./CommentForm";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Comment } from "@/types";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CommentsModalProps {
  postId: number;
  userId: number | null;
  comments: Comment[];
  onClose: () => void;
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

const CommentsModal = ({
  postId,
  userId,
  comments,
  onClose,
  addComment,
  editComment,
  deleteComment,
}: CommentsModalProps) => {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [editTextMap, setEditTextMap] = useState<{ [key: number]: string }>({});
  const inputRef = useRef<TextInput>(null);

  const submitComment = async () => {
    if (!userId || !newComment.trim()) return;
    await addComment(userId, postId, newComment);
    setNewComment("");
  };

  const handleEditComment = async (commentId: number) => {
    const newContent = editTextMap[commentId];
    if (!userId || !newContent.trim()) return;
    await editComment(postId, commentId, newContent);
    setEditingCommentId(null);
    setEditTextMap((prev) => ({ ...prev, [commentId]: "" }));
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!userId) return;
    await deleteComment(postId, commentId);
    setDeleteConfirmId(null);
  };

  useEffect(() => {
    if (editingCommentId && inputRef.current) inputRef.current.focus();
  }, [editingCommentId]);

  const gray900 = useThemeColor({}, "gray-900");
  const primary200 = useThemeColor({}, "primary-200");
  const black = "#000000";
  const white = "#FFFFFF";
  return (
    <>
      <Modal visible={true} transparent={true} animationType="slide">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: black,
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
            pointerEvents="box-none"
          >
            <View
              style={{
                backgroundColor: white,
                padding: 16,
                borderRadius: 8,
                width: "90%",
                minWidth: 300,
                maxHeight: "80%",
                shadowColor: black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Text
                style={[
                  { fontSize: 18, fontWeight: "600", marginBottom: 8 },
                  { color: gray900 },
                ]}
              >
                comments {comments.length > 0 && <Text>{comments.length}</Text>}
              </Text>
              <View
                style={[
                  { borderTopWidth: 1, marginBottom: 8 },
                  { borderColor: primary200 },
                ]}
              />
              <CommentList
                comments={comments}
                userId={userId}
                editingCommentId={editingCommentId}
                dropdownOpen={dropdownOpen}
                editTextMap={editTextMap}
                setEditTextMap={setEditTextMap}
                setEditingCommentId={setEditingCommentId}
                setDropdownOpen={setDropdownOpen}
                setDeleteConfirmId={setDeleteConfirmId}
                handleEditComment={handleEditComment}
                inputRef={inputRef}
              />
              <CommentForm
                newComment={newComment}
                setNewComment={setNewComment}
                submitComment={submitComment}
                userId={userId}
              />
            </View>
          </View>
        </TouchableOpacity>
        {deleteConfirmId && (
          <DeleteConfirmModal
            onConfirm={() => handleDeleteComment(deleteConfirmId)}
            onCancel={() => setDeleteConfirmId(null)}
          />
        )}
      </Modal>
    </>
  );
};

export default CommentsModal;

import { useRef } from "react";
import CommentItem from "./CommentItem";
import { Comment } from "@/types";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CommentListProps {
  comments: Comment[];
  userId: number | null;
  editingCommentId: number | null;
  dropdownOpen: number | null;
  editTextMap: { [key: number]: string };
  setEditTextMap: React.Dispatch<
    React.SetStateAction<{ [key: number]: string }>
  >;
  setEditingCommentId: (id: number | null) => void;
  setDropdownOpen: (id: number | null) => void;
  setDeleteConfirmId: (id: number | null) => void;
  handleEditComment: (commentId: number) => void;
  inputRef: React.RefObject<TextInput>;
}

const CommentList = ({
  comments,
  userId,
  editingCommentId,
  dropdownOpen,
  editTextMap,
  setEditTextMap,
  setEditingCommentId,
  setDropdownOpen,
  setDeleteConfirmId,
  handleEditComment,
  inputRef,
}: CommentListProps) => {
  const listRef = useRef<FlatList<Comment>>(null);
  const gray500 = useThemeColor({}, "gray-500");

  const handleTapOutside = () => {
    if (dropdownOpen !== null) {
      setDropdownOpen(null);
    }
  };

  const renderItem = ({ item }: { item: Comment }) => (
    <View style={{ marginBottom: 8 }}>
      <CommentItem
        key={item.id}
        comment={item}
        userId={userId}
        isEditing={editingCommentId === item.id}
        isDropdownOpen={dropdownOpen === item.id}
        editText={editTextMap[item.id] ?? item.content}
        setEditTextMap={setEditTextMap}
        onEdit={() => setEditingCommentId(item.id)}
        onDelete={() => setDeleteConfirmId(item.id)}
        onToggleDropdown={() =>
          setDropdownOpen(dropdownOpen === item.id ? null : item.id)
        }
        onSaveEdit={handleEditComment}
        onCancelEdit={() => setEditingCommentId(null)}
        inputRef={inputRef}
      />
    </View>
  );

  return (
    <TouchableOpacity onPress={handleTapOutside}>
      <View>
        {comments.length > 0 ? (
          <FlatList
            data={comments}
            ref={listRef}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 8 }}
            style={{
              maxHeight: 400,
            }}
          />
        ) : (
          <View style={{ paddingVertical: 16, alignItems: "center" }}>
            <Text style={[{ fontSize: 14 }, { color: gray500 }]}>
              No comments yet.
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CommentList;

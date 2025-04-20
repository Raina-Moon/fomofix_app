import { formatTimeAgo } from "@/utils/formatTimeAgo";
import VerticalDots from "@/assets/icons/VerticalDots";
import { Comment } from "@/types";
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CommentItemProps {
  comment: Comment;
  userId: number | null;
  isEditing: boolean;
  isDropdownOpen: boolean;
  editText: string;
  setEditTextMap: React.Dispatch<
    React.SetStateAction<{ [key: number]: string }>
  >;
  onEdit: () => void;
  onDelete: () => void;
  onToggleDropdown: () => void;
  onSaveEdit: (commentId: number) => void;
  onCancelEdit: () => void;
  inputRef: React.RefObject<TextInput>;
}

const CommentItem = ({
  comment,
  userId,
  isEditing,
  isDropdownOpen,
  editText,
  setEditTextMap,
  onEdit,
  onDelete,
  onToggleDropdown,
  onSaveEdit,
  onCancelEdit,
  inputRef,
}: CommentItemProps) => {
  const handleEditClick = useCallback(() => {
    setEditTextMap((prev) => ({ ...prev, [comment.id]: comment.content }));
    onEdit();
    onToggleDropdown();
  }, [comment.id, comment.content, onEdit, onToggleDropdown, setEditTextMap]);

  const handleDeleteClick = () => {
    onDelete();
    onToggleDropdown();
  };

  const handleCancelClick = () => {
    onCancelEdit();
  };

  const gray500 = useThemeColor({}, "gray-500");
  const primary500 = useThemeColor({}, "primary-500");
  const black = "#000000";
  const gray800 = useThemeColor({}, "gray-800");
  const gray200 = useThemeColor({}, "gray-200");
  const red500 = useThemeColor({}, "red-500");
  const white = "#FFFFFF";
  return (
    <View style={{ paddingVertical: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Image
            source={{
              uri: comment.profile_image || "/images/DefaultProfile.png",
            }}
            defaultSource={require("@/assets/images/DefaultProfile.png")}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
            }}
          />
          <Text
            style={{
              fontSize: 14,
            }}
          >
            {comment.username}
          </Text>
          {comment.created_at && (
            <Text
              style={{
                fontSize: 12,
                color: gray500,
              }}
            >
              {formatTimeAgo(comment.created_at)}
            </Text>
          )}
        </View>
        {userId === comment.user_id && (
          <TouchableOpacity
            onPress={onToggleDropdown}
            style={{ marginLeft: 8 }}
          >
            <VerticalDots />
          </TouchableOpacity>
        )}
      </View>

      {isEditing ? (
        <View
          style={{
            paddingLeft: 32,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <TextInput
            ref={inputRef}
            value={editText}
            onChangeText={(text) =>
              setEditTextMap((prev) => ({ ...prev, [comment.id]: text }))
            }
            multiline
            style={{
              width: "100%",
              paddingVertical: 4,
              paddingHorizontal: 8,
              fontSize: 12,
              borderWidth: 1,
              borderRadius: 4,
            }}
          />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity onPress={() => onSaveEdit(comment.id)}>
              <Text style={{ color: primary500 }}>save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelClick}>
              <Text style={{ color: gray500 }}>cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={{ marginLeft: 32 }}>{comment.content}</Text>
      )}

      <Modal
        visible={isDropdownOpen && userId === comment.user_id}
        transparent
        animationType="fade"
        onRequestClose={onToggleDropdown}
      >
        <TouchableOpacity
          onPress={onToggleDropdown}
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: black,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: white,
              borderRadius: 8,
              margin: 16,
              shadowColor: black,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <TouchableOpacity
              onPress={handleEditClick}
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: gray200,
              }}
            >
              <Text style={{ color: gray800 }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteClick}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 8,
              }}
            >
              <Text style={{ color: red500, textAlign: "left" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CommentItem;

import PaperPlaneIcon from "@/assets/icons/PaperPlaneIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInput, TouchableOpacity, View } from "react-native";

interface CommentFormProps {
  newComment: string;
  setNewComment: (text: string) => void;
  submitComment: () => void;
  userId: number | null;
}

const CommentForm = ({
  newComment,
  setNewComment,
  submitComment,
  userId,
}: CommentFormProps) => {
  const primary200 = useThemeColor({}, "primary-200");

  return (
    <View
      style={{
        borderTopColor: primary200,
        marginBottom: 16,
        borderTopWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
      }}
    >
      <TextInput
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Leave a comment..."
        style={{
          width: "100%",
          paddingVertical: 8,
          paddingHorizontal: 4,
          fontSize: 12,
          marginTop: 8,
        }}
        editable={!!userId}
      />
      <TouchableOpacity onPress={submitComment} disabled={!userId}>
        <PaperPlaneIcon />
      </TouchableOpacity>
    </View>
  );
};

export default CommentForm;

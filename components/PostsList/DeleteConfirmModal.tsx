import { useThemeColor } from "@/hooks/useThemeColor";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  const gray700 = useThemeColor({}, "gray-700");
  const black = "#000000";
  const white = "#FFFFFF";
  const red500 = useThemeColor({}, "red-500");
  return (
    <Modal visible={true} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: black,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: white,
            padding: 16,
            borderRadius: 8,
            width: "80%",
            shadowColor: black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            say bye-bye to this comment?
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <TouchableOpacity
              onPress={onCancel}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 4,
                borderRadius: 4,
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  color: gray700,
                  fontSize: 12,
                }}
              >
                Nah
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                backgroundColor: red500,
                paddingVertical: 12,
                paddingHorizontal: 4,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: white,
                  fontSize: 12,
                }}
              >
                Bet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmModal;

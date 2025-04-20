import { useState } from "react";
import GlobalButton from "@/components/ui/GlobalButton";
import { usePosts } from "@/contexts/PostContext";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

const PostModal = ({ isOpen, onClose, title, duration, onSubmit }: any) => {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [description, setDescription] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { uploadPostImage } = usePosts();

  const black = "#000000";
  const white = "#FFFFFF";
  const gray900 = useThemeColor({}, "gray-900");
  const gray700 = useThemeColor({}, "gray-700");
  const primary200 = useThemeColor({}, "primary-200");

  const handleImageClick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Toast.show({
        type: "error",
        text1: "Permission to access gallery is required!",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0]);
      setPreviewImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!image || !description) {
      Toast.show({
        type: "error",
        text1: "don’t ghost us—drop an image and some words",
      });
      return;
    }
    try {
      const file = new File(
        [await (await fetch(image.uri)).blob()],
        image.fileName || "image.jpg",
        {
          type: image.type || "image/jpeg",
        }
      );
      const imageUrl = await uploadPostImage(file);
      onSubmit({ imageUrl, description });
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
      Toast.show({
        type: "error",
        text1: "yikes! your pic didn’t make it",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: black,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
        >
          <ScrollView
            contentContainerStyle={{
              backgroundColor: white,
              padding: 24,
              borderRadius: 12,
              width: "90%",
              maxWidth: 400,
              shadowColor: black,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "medium",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {" "}
              you nailed it!
            </Text>
            <Text
              style={{
                fontSize: 12,
                marginBottom: 8,
                color: gray700,
              }}
            >
              {" "}
              <Text
                style={{
                  color: gray900,
                  fontWeight: "bold",
                }}
              >
                Title:
              </Text>{" "}
              {title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                marginBottom: 8,
                color: gray700,
              }}
            >
              <Text
                style={{
                  color: gray900,
                  fontWeight: "bold",
                }}
              >
                Duration:
              </Text>{" "}
              {duration} minutes
            </Text>
            <TouchableOpacity
              onPress={handleImageClick}
              style={{ alignItems: "center", marginBottom: 12 }}
            >
              <Image
                source={
                  previewImage
                    ? { uri: previewImage }
                    : require("@/assets/images/ImageUpload.png")
                }
                style={{
                  width: "100%",
                  maxWidth: 200,
                  height: 150,
                  borderRadius: 8,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="So, what’s the vibe after nailing it?"
              multiline
              style={{
                borderTopWidth: 1,
                paddingTop: 8,
                marginBottom: 16,
                fontSize: 14,
                minHeight: 80,
                borderColor: primary200,
                color: gray900,
              }}
            />

            <GlobalButton onPress={handleSubmit}>Post it</GlobalButton>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default PostModal;

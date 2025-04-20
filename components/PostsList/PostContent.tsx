import { useState } from "react";
import ExternalLink from "@/assets/icons/ExternalLink";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import * as Linking from "expo-linking";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PostContentProps {
  title: string;
  duration: number;
  imageUrl?: string;
  description: string;
  createdAt?: string | number | Date;
  postId: number;
}

const PostContent = ({
  title,
  duration,
  imageUrl,
  description,
  createdAt,
  postId,
}: PostContentProps) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const shareUrl = `https://app.com/post/${postId}`;

  const handleCopyLink = async () => {
    try {
      Clipboard.setString(shareUrl);
      Toast.show({
        type: "success",
        text1: "Link copied to clipboard!",
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
      Toast.show({
        type: "error",
        text1: "Failed to copy link.",
      });
    }
  };

  const handleShare = async (platform: string) => {
    let url = "";
    const encodedUrl = encodeURIComponent(shareUrl);
    const message = encodeURIComponent(`Check out this post: ${title}`);

    switch (platform) {
      case "whatsapp":
        url = `whatsapp://send?text=${message}%20${encodedUrl}`;
        break;
      case "instagram":
        url = `https://www.instagram.com/?url=${encodedUrl}`;
        break;
      case "kakaotalk":
        url = `kakaotalk://msg?text=${message}%20${encodedUrl}`;
        break;
      case "line":
        url = `line://msg/text/${message}%20${encodedUrl}`;
        break;
      case "facebook":
        url = `fb-messenger://share/?link=${encodedUrl}&app_id=YOUR_APP_ID`;
        break;
      default:
        return;
    }
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Toast.show({
          type: "error",
          text1: `Cannot open ${platform} on this device.`,
        });
      }
    } catch (err) {
      console.error(`Failed to share on ${platform}:`, err);
      Toast.show({
        type: "error",
        text1: `Failed to share on ${platform}.`,
      });
    }
  };

  const gray900 = useThemeColor({}, "gray-900");
  const gray600 = useThemeColor({}, "gray-600");
  const gray500 = useThemeColor({}, "gray-500");
  const gray200 = useThemeColor({}, "gray-200");
  const gray100 = useThemeColor({}, "gray-100");
  const red500 = useThemeColor({}, "red-500");
  const white = "#FFFFFF";
  const black = "#000000";

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text style={{ color: gray900, fontWeight: "semibold" }}>
          title : {title}
        </Text>
        <TouchableOpacity onPress={() => setIsShareModalOpen(true)}>
          <ExternalLink />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            color: gray600,
            fontSize: 12,
            marginBottom: 8,
          }}
        >
          duration: {duration} min
        </Text>
        {createdAt !== undefined && createdAt !== null ? (
          <Text
            style={{
              color: gray500,
              fontSize: 10,
            }}
          >
            {formatTimeAgo(String(createdAt))}
          </Text>
        ) : (
          <Text
            style={{
              color: red500,
              fontSize: 10,
            }}
          >
            Created_at missing
          </Text>
        )}
      </View>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={{
            width: "100%",
            maxWidth: 600,
            maxHeight: 750,
            borderRadius: 8,
            marginBottom: 8,
            alignSelf: "center",
          }}
        />
      )}
      <Text
        style={{
          color: gray900,
          fontSize: 12,
        }}
      >
        {description}
      </Text>

      {isShareModalOpen && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: black,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {" "}
            <View
              style={{
                backgroundColor: white,
                borderRadius: 8,
                padding: 24,
                width: "90%",
                maxWidth: 400,
              }}
            >
              {" "}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                {" "}
                <Text style={{ fontSize: 24, fontWeight: "semibold" }}>
                  Share this post
                </Text>
                <TouchableOpacity onPress={() => setIsShareModalOpen(false)}>
                  <Text style={{ color: gray500 }}>✕</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                  gap: 8,
                }}
              >
                <TextInput
                  value={shareUrl}
                  editable={false}
                  style={{
                    flex: 1,
                    padding: 8,
                    fontSize: 14,
                    borderRadius: 4,
                    backgroundColor: gray100,
                  }}
                />
                <TouchableOpacity
                  onPress={handleCopyLink}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 4,
                    backgroundColor: gray200,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: white }}>Share</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 4,
                }}
              >
                {" "}
                <TouchableOpacity
                  onPress={() => handleShare("whatsapp")}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 4,
                    borderColor: gray200,
                    borderWidth: 1,
                  }}
                >
                  <Text style={{ color: white }}>WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleShare("instagram")}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 4,
                    borderColor: gray200,
                    borderWidth: 1,
                  }}
                >
                  <Text style={{ color: white }}>Instagram DM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleShare("kakaotalk")}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 4,
                    borderColor: gray200,
                    borderWidth: 1,
                  }}
                >
                  <Text style={{ color: white }}>KakaoTalk</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleShare("line")}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 4,
                    borderColor: gray200,
                    borderWidth: 1,
                  }}
                >
                  <Text style={{ color: white }}>LINE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleShare("facebook")}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 4,
                    borderColor: gray200,
                    borderWidth: 1,
                  }}
                >
                  <Text style={{ color: white }}>Facebook Msg</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default PostContent;

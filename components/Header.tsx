import { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";

const Header = () => {
  const router = useRouter();
  const { user, getProfile, isLoggedIn } = useAuth();
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const primary500 = useThemeColor({}, "primary-500");
  const gray300 = useThemeColor({}, "gray-300");
  const gray900 = useThemeColor({}, "gray-900");

  const fetchProfile = useCallback(async () => {
    if (!isLoggedIn || !user?.id || user.profile_image) {
      return;
    }
    await getProfile(user.id);
  }, [isLoggedIn, user?.id, user?.profile_image, getProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

const handleNavigation = () => {
    const path:string = isLoggedIn && user ? `/dashboard/${user.id}` : "/login"
    router.push(path);
  };


  return (
    <View
      style={{
        width: "100%",
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        backgroundColor,
        borderBottomWidth: 1,
        borderBottomColor: gray300,
        position: "absolute",
        top: 0,
        zIndex: 50,
      }}
    >
      <TouchableOpacity onPress={() => router.push("/")} style={{ padding: 4 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: primary500,
          }}
        >
          Sign
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleNavigation}
        style={
          isLoggedIn && user
            ? {
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: gray300,
                overflow: "hidden",
              }
            : {
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: primary500,
                borderRadius: 6,
              }
        }
      >
        {isLoggedIn && user ? (
          <Image
            source={{
              uri: user.profile_image
                ? `${user.profile_image}?t=${Date.now()}`
                : "/images/DefaultProfile.png",
            }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
          />
        ) : (
          <Text
            style={{
              fontSize: 14,
              color: "white",
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Header;

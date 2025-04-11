import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import GoBackArrow from "@/assets/icons/GoBackArrow";
import GlobalInput from "@/components/ui/GlobalInput";
import GlobalButton from "@/components/ui/GlobalButton";
import Toast from "react-native-toast-message";
import { Text, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

const ForgotPasswordForm = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await requestPasswordReset(email);
      Toast.show({
        type: "success",
        text1: "Check your email for the reset code!",
      });
      router.push({
        pathname: "/reset-password",
        params: { email: encodeURIComponent(email) },
      });
    } catch (error) {
      Toast.show({ type: "error", text1: "Email sending failed!" });
    }
  };

  const gray900 = useThemeColor({}, "gray-900");
  const primary600 = useThemeColor({}, "primary-600");
  const white = "#fff";

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "90%",
          marginTop: 15,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <GoBackArrow />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: gray900,
          }}
        >
          Drop your email
          {"\n"}
          we'll send you the code!
        </Text>
      </View>

      <View
        style={{
          width: "90%",
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GlobalInput
          label="email"
          type="email"
          id="email"
          placeholder="email@example.com"
          value={email}
          onChange={setEmail}
        />

        <GlobalButton onPress={handleSubmit}>send</GlobalButton>
      </View>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text
          style={{
            fontSize: 14,
            color: primary600,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Need an account? Sign up here
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          marginTop: 20,
          textAlign: "center",
          fontSize: 6,
          color: white,
        }}
      >
        Made by @Raina
      </Text>
    </View>
  );
};

export default ForgotPasswordForm;

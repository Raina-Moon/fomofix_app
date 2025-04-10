import LoginForm from "@/components/LoginForm";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAvoidingView, Platform } from "react-native";

const page = () => {
  const backgroundColorStart = useThemeColor({}, "primary-300");
  const backgroundColorEnd = useThemeColor({}, "primary-600");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <LinearGradient
        colors={[backgroundColorStart, backgroundColorEnd]}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoginForm />
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default page;

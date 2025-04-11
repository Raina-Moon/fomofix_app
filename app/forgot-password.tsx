import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import ForgotPasswordForm from "@/components/forgot_password/ForgotPasswordForm";
import { Line } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";

const page = () => {
  const white = "#fff";
  const primary300 = useThemeColor({}, "primary-300");
  const primary600 = useThemeColor({}, "primary-600");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={[white, primary300, primary600]}
      >
        <View style={{ flex: 1 }}>
          <ForgotPasswordForm />
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default page;

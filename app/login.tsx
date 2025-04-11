import LoginForm from "@/components/login/LoginForm";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

const page = () => {
  const backgroundColorStart = useThemeColor({}, "primary-300");
  const backgroundColorEnd = useThemeColor({}, "primary-600");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
    </TouchableWithoutFeedback>
  );
};

export default page;

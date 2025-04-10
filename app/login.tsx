import LoginForm from "@/components/LoginForm";
import { useThemeColor } from "@/hooks/useThemeColor";
import { View } from "react-native";

const page = () => {
  const backgroundColorStart = useThemeColor({}, "primary-300");
  const backgroundColorEnd = useThemeColor({}, "primary-600");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColorStart,
        backgroundImage: `linear-gradient(180deg, ${backgroundColorStart} 0%, ${backgroundColorEnd} 100%)`,
      }}
    >
      <LoginForm />
    </View>
  );
};

export default page;

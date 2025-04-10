import LoginForm from "@/components/LoginForm";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";

const page = () => {
  const backgroundColorStart = useThemeColor({}, "primary-300");
  const backgroundColorEnd = useThemeColor({}, "primary-600");

  return (
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
  );
};

export default page;

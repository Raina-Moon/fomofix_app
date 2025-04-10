import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import GlobalInput from "@/components/ui/GlobalInput";
import GlobalButton from "@/components/ui/GlobalButton";
import GoBackArrow from "../../../public/icons/GoBackArrow";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useThemeColor } from "@/hooks/useThemeColor";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login, user } = useAuth();

  const textColor = useThemeColor({}, "text");
  const primary500 = useThemeColor({}, "primary-500");
  const primary600 = useThemeColor({}, "primary-600");
  const white = "#fff";

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Hmm… that doesn’t look like a real email!");
      return;
    }

    if (!password) {
      setPasswordError("Don’t forget to type in your password!");
      return;
    }

    try {
      await login(email, password);
    } catch (error: any) {
      if (error.message === "Invalid password") {
        setPasswordError("Oops! That password doesn’t seem right.");
      } else if (error.message === "Invalid email") {
        setEmailError("We couldn’t find an account with that email.");
      } else {
        setPasswordError("Login didn’t work... mind trying again?");
      }
    }
  };

  useEffect(() => {
    if (user) {
      Toast.show({
        type: "success",
        text1: `Welcome back, ${user.username}!`,
      });
      router.push("/");
    }
  }, [user, router]);

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 35,
        width: "80%",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: white,
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Stay On, Badge Up
        {"\n"}
        Share the Win!
      </Text>

      <View
        style={{
          width: "100%",
          backgroundColor: white,
          borderRadius: 16,
          padding: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/")}>
          <GoBackArrow />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text
            style={{
              color: textColor,
              fontSize: 16,
              marginVertical: 16,
            }}
          >
            Logo
          </Text>

          <GlobalInput
            label="email"
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />

          <GlobalInput
            label="password"
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
          />

          <GlobalButton type="submit" className="mt-4">
            log in
          </GlobalButton>
        </View>

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text
            style={{
              color: primary500,
              fontSize: 12,
              textAlign: "center",
              marginTop: 16,
            }}
          >
            Forgot your password? Fix it here!
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text
            style={{
              color: primary600,
              fontSize: 12,
              textAlign: "center",
              marginTop: 16,
            }}
          >
            Need an account? Sign up here
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          position: "absolute",
          bottom: 10,
          fontSize: 6,
          color: white,
          textAlign: "center",
          width: "100%",
        }}
      >
        Made by @Raina
      </Text>
    </View>
  );
};

export default LoginForm;

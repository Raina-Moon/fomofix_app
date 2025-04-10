import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useThemeColor } from "@/hooks/useThemeColor";
import GoBackArrow from "@/assets/icons/GoBackArrow";
import GlobalInput from "./ui/GlobalInput";
import GlobalButton from "./ui/GlobalButton";

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

  const handleSubmit = useCallback(async () => {
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
  }, [email, password, login]);

  useEffect(() => {
    if (user) {
      Toast.show({
        type: "success",
        text1: `Welcome back, ${user.username}!`,
      });
      router.push("/");
    }
  }, [user]);

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 35,
        width: "100%",
        flex: 1,
        marginTop: 40,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: white,
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 40,
        }}
      >
        Stay On, Badge Up
        {"\n"}
        Share the Win!
      </Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View
          style={{
            width: "90%",
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
              value={email}
              placeholder="email"
              onChange={setEmail}
              error={emailError}
            />

            <GlobalInput
              label="password"
              type="password"
              id="password"
              value={password}
              placeholder="password"
              onChange={setPassword}
              error={passwordError}
            />

            <GlobalButton onPress={handleSubmit} style={{ marginTop: 16 }}>
              log in
            </GlobalButton>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/forgot-password" as any)}
          >
            <Text
              style={{
                color: primary600,
                fontSize: 12,
                textAlign: "center",
                marginTop: 16,
              }}
            >
              Forgot your password? Fix it here!
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/signup" as any)}>
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
      </KeyboardAvoidingView>

      <Text
        style={{
          marginBottom: 20,
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

import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import GlobalInput from "@/components/ui/GlobalInput";
import GlobalButton from "@/components/ui/GlobalButton";
import Toast from "react-native-toast-message";
import { Text, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";

const SignupForm = () => {
  const { signup } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validatePassword = (password: string) => {
    const errors = [];
    if (!/[A-Z]/.test(password)) errors.push("uppercase");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("special char");
    if (!/\d/.test(password)) errors.push("number");
    if (password.length < 7) errors.push("7+ chars");

    if (errors.length === 0) return [];
    if (errors.length === 4)
      return ["Password needs uppercase, special char, number, and 7+ chars!"];
    if (errors.length === 1) return [`Add a ${errors[0]} and you’re good!`];
    return [`Missing ${errors.length}: ${errors.join(", ")}.`];
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const errors = validatePassword(text);
    setPasswordErrors(errors);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError(
      text && text !== password ? "Oops, these don’t match yet." : ""
    );
  };

  const handleSubmit = useCallback(async () => {
    setError(null);

    const passwordValidationErrors = validatePassword(password);
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match!" });
      return;
    }

    try {
      await signup(username, email, password);
      Toast.show({
        type: "success",
        text1: "Signup successful! Please log in.",
      });
      router.push("/login");
    } catch (error: any) {
      if (error.message === "Username is already taken") {
        setError("username is already taken!");
      } else {
        setError("Signup failed!");
      }
    }
  }, [username, email, password, confirmPassword, signup, router]);

  const primary300 = useThemeColor({}, "primary-300");
  const primary600 = useThemeColor({}, "primary-600");
  const white = "#fff";

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
        colors={[primary300, primary600]}
      >
        <Text
          style={{
            color: white,
            fontSize: 20,
            textAlign: "center",
            marginTop: 40,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Step Up, Badge Up
          {"\n"}Create Your Account!
        </Text>

        <View
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 16,
            backgroundColor: white,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              gap: 12,
              alignItems: "center",
              width: "100%",
            }}
          >
            <GlobalInput
              id="email"
              label="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={setEmail}
            />

            <GlobalInput
              id="password"
              label="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={handlePasswordChange}
              error={passwordErrors.length > 0 ? passwordErrors.join(" ") : ""}
            />

            <GlobalInput
              id="confirm-password"
              label="confirm password"
              type="password"
              placeholder="confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={confirmPasswordError}
            />

            <GlobalInput
              id="username"
              label="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={setUsername}
              error={error || ""}
            />

            <GlobalButton onPress={handleSubmit}>sign up</GlobalButton>
          </View>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text
              style={{
                color: primary600,
                fontSize: 12,
                textAlign: "center",
                marginTop: 16,
              }}
            >
              Have an account? Hit login!
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: white,
            fontSize: 6,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Made by @Raina
        </Text>
      </LinearGradient>
    </View>
  );
};

export default SignupForm;

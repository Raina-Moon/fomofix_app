import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import GlobalButton from "@/components/ui/GlobalButton";
import GlobalInput from "@/components/ui/GlobalInput";
import Toast from "react-native-toast-message";
import GoBackArrow from "@/assets/icons/GoBackArrow";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, TouchableOpacity, View } from "react-native";

const ResetPasswordForm = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyResetCode, resetPassword } = useAuth();

  const [code, setCode] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  if (!email) {
    router.push("/forgot-password"); // Redirect if email is missing
  }

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const enteredCode = parseInt(code.join(""));
    try {
      await verifyResetCode(email!, enteredCode);
      setIsCodeValid(true);
      Toast.show({ type: "success", text1: "Code verified successfully!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Invalid code." });
    }
  };

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
    setPasswordError(errors);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError(
      text && text !== password ? "Oops, these don’t match yet." : ""
    );
  };

  const handleResetPassword = async () => {
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordError(errors);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Hmm… looks like the passwords aren’t the same.");
      return;
    }

    const enteredCode = parseInt(code.join(""));
    try {
      if (email) {
        await resetPassword(email, enteredCode, password);
        Toast.show({ type: "success", text1: "Password reset successfully!" });
        router.push("/login");
      } else {
        Toast.show({
          type: "error",
          text1: "Email is missing. Please try again.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to reset password.",
      });
    }
  };

  const white = "#fff";
  const primary300 = useThemeColor({}, "primary-300");
  const primary600 = useThemeColor({}, "primary-600");
  const gray900 = useThemeColor({}, "gray-900");
  const gray300 = useThemeColor({}, "gray-300");

  return (
    <View className=" relative flex flex-col items-center justify-center mx-10">
      <Text style={{ color: gray900, fontSize: 20, fontWeight: "bold" }}>
        Enter your code
        {"\n"} Reset your password
      </Text>

      <TouchableOpacity onPress={() => router.back()}>
        <GoBackArrow />
      </TouchableOpacity>
      <View className="flex flex-col justify-center items-center gap-3">
        <div className="flex gap-2 my-4 justify-center items-center">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              className="w-[15%] h-16 bg-primary-100 rounded-lg border border-primary-400 text-center text-xl focus:outline-none focus:border-primary-600"
              required
            />
          ))}
        </div>

        <GlobalButton onPress={handleVerifyCode}>verify code</GlobalButton>

        <Text style={{ color: gray900, fontSize: 16, fontWeight: "bold" }}>
          {isCodeValid
            ? "now, set your new password!"
            : "enter the code and hit confirm to change your password!"}
        </Text>

        <GlobalInput
          label="New Password"
          type="password"
          value={password}
          disabled={!isCodeValid}
          onChange={handlePasswordChange}
          placeholder={
            isCodeValid
              ? "create a new password"
              : "Please verify the code first"
          }
          error={passwordError.join(", ")}
          style={{
            borderColor: isCodeValid ? primary600 : gray300,
          }}
        />

        <GlobalInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          disabled={!isCodeValid}
          onChange={handleConfirmPasswordChange}
          placeholder={
            isCodeValid
              ? "type that password again"
              : "Please verify the code first"
          }
          error={confirmPasswordError}
          style={{
            borderColor: isCodeValid ? primary600 : gray300,
          }}
        />

        <GlobalButton
          onPress={() => handlePasswordChange(password)}
          disabled={!isCodeValid}
        >
          reset password
        </GlobalButton>
      </View>
    </View>
  );
};

export default ResetPasswordForm;

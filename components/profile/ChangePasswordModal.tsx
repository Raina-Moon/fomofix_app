import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import GlobalInput from "@/components/ui/GlobalInput";
import GlobalButton from "@/components/ui/GlobalButton";
import { Text, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal = ({ onClose }: ChangePasswordModalProps) => {
  const { user, verifyCurrentPassword, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    const errors = validatePassword(value);
    setPasswordErrors(errors);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError(
      value && value !== newPassword ? "Oops, these don’t match yet." : ""
    );
  };

  const handleVerify = async () => {
    setError(null);
    try {
      await verifyCurrentPassword(user?.email as string, currentPassword);
      setVerified(true);
    } catch (err: any) {
      setError(err.message || "Current password is incorrect");
    }
  };

  const handleChangePassword = async () => {
    setError(null);

    const passwordValidationErrors = validatePassword(newPassword);
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Oops, these don’t match yet.");
      return;
    }

    try {
      await changePassword(user?.email as string, currentPassword, newPassword);
      setSuccessMessage("Password updated successfully");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    }
  };

  const red500 = useThemeColor({}, "red-500");
  const black = "#000000";
  const white = "#FFFFFF";
  const primary700 = useThemeColor({}, "primary-700");

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: black,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 30,
      }}
      onTouchStart={onClose}
    >
      <View
        style={{
          backgroundColor: white,
          padding: 24,
          borderRadius: 10,
          maxWidth: "85%",
          width: "100%",
        }}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <Text
          style={{ fontSize: 18, fontWeight: "semibold", marginBottom: 16 }}
        >
          Change Password
        </Text>
        {!verified ? (
          <>
            <GlobalInput
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <GlobalButton onPress={handleVerify}>Verify</GlobalButton>
          </>
        ) : (
          <>
            <GlobalInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              error={passwordErrors.length > 0 ? passwordErrors.join(" ") : ""}
            />
            <GlobalInput
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={confirmPasswordError}
            />
            <GlobalButton onPress={handleChangePassword}>
              Change Password
            </GlobalButton>
          </>
        )}
        {error && (
          <Text style={{ color: red500, fontSize: 8, marginTop: 8 }}>
            {error}
          </Text>
        )}
        {successMessage && (
          <Text style={{ color: primary700, fontSize: 8, marginTop: 8 }}>
            {successMessage}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ChangePasswordModal;

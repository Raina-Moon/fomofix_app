"use client";

import React from "react";
import ResetPasswordForm from "@/components/reset_password/ResetPasswordForm";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";

const page = () => {
  const white = "#fff";
  const primary300 = useThemeColor({}, "primary-300");
  const primary600 = useThemeColor({}, "primary-600");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={[white, primary300, primary600]}
        style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
      >
        <View style={{ flex: 1, width: "100%" }}>
          <ResetPasswordForm />
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default page;

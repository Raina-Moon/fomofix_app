import SignupForm from "@/components/signup/SignupForm";
import React from "react";
import { View } from "react-native";

const page = () => {
  return (
    <View className="min-h-screen">
      <SignupForm />
    </View>
  );
};

export default page;

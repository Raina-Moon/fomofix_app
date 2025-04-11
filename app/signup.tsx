import SignupForm from "@/components/signup/SignupForm";
import React from "react";
import { View } from "react-native";

const page = () => {
  return (
    <View style={{ flex: 1 }}>
      <SignupForm />
    </View>
  );
};

export default page;

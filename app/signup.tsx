import React from "react";
import SignupForm from "@/components/signup/SignupForm";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

const page = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{ flex: 1 }}>
      <SignupForm />
    </View>
    </TouchableWithoutFeedback>
  );
};

export default page;

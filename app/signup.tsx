import SignupForm from "@/components/signup/SignupForm";
import React from "react";
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

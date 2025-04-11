import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import ForgotPasswordForm from "@/components/forgot_password/ForgotPasswordForm";

const page = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <ForgotPasswordForm />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default page;

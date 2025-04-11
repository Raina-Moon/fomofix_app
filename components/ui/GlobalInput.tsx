import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, TextInput, View } from "react-native";

type InputProps = {
  id?: string;
  label?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  onChange?: (text: string) => void;
  error?: string;
  disabled?: boolean;
  style?: object;
};

const GlobalInput: React.FC<InputProps> = ({
  label,
  id,
  type = "text",
  value,
  placeholder,
  onChange,
  error,
  disabled = false,
  style,
}) => {
  const gray900 = useThemeColor({}, "gray-900");
  const gray300 = useThemeColor({}, "gray-300");
  const primary400 = useThemeColor({}, "primary-400");
  const red500 = "#EF4444";
  const white = "#FFFFFF";

  return (
    <View
      style={{
        width: "100%",
        padding: 4,
        flexDirection: "column",
        gap: 4,
      }}
    >
      {label && (
        <Text
          style={{
            color: gray900,
            fontSize: 14,
            textAlign: "left",
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        id={id}
        value={value}
        placeholder={placeholder}
        onChangeText={onChange}
        editable={!disabled}
        keyboardType={type === "email" ? "email-address" : "default"}
        secureTextEntry={type === "password"}
        placeholderTextColor={gray300}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: error ? red500 : disabled ? gray300 : primary400,
          backgroundColor: disabled ? gray300 : white,
          color: gray900,
          fontSize: 14,
          ...(style ||{}),
        }}
      />
      {error && (
        <Text
          style={{
            color: red500,
            fontSize: 12,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default GlobalInput;

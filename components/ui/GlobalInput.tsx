import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInput, View } from "react-native";

type InputProps = {
  id?: string;
  Text?: string;
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (text: string) => void;
  error?: string;
  disabled?: boolean;
};

const GlobalInput: React.FC<InputProps> = ({
  Text,
  id,
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  error,
  disabled = false,
}) => {
  const gray900 = useThemeColor({}, "gray-900");
  const gray300 = useThemeColor({}, "gray-300");
  const primary400 = useThemeColor({}, "primary-400");
  const red500 = "#EF4444";

  return (
    <View
      style={{
        width: "100%",
        padding: 4,
        flexDirection: "column",
      }}
    >
      {label && (
        <Text
          style={{
            color: gray900,
            fontSize: 14,
            marginBottom: 4,
            textAlign: "left",
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChangeText={onChange}
        editable={!disabled}
        keyboardType={type === "email" ? "email-address" : "default"}
        secureTextEntry={type === "password"}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          backgroundColor: error ? red500 : disabled ? gray300 : primary400,
          color: gray900,
          fontSize: 14,
          outline: "none",
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

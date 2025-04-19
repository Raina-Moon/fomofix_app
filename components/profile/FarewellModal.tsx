import React from "react";
import { Text, View } from "react-native";

const FarewellModal = () => {
  const white = "#fff";
  const black = "#000";
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
        zIndex: 50,
      }}
    >
      <View
        style={{
          backgroundColor: white,
          padding: 24,
          borderRadius: 8,
          width: "85%",
          maxWidth: 400,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          Goodbye!
        </Text>
        <Text
          style={{
            marginBottom: 16,
          }}
        >
          It was a pleasure having you. Hope to see you again!
        </Text>
      </View>
    </View>
  );
};

export default FarewellModal;

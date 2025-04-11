import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import GlobalInput from "@/components/ui/GlobalInput";
import GlobalButton from "@/components/ui/GlobalButton";
import Toast from "react-native-toast-message";
import { Text, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import GoBackArrow from "@/assets/icons/GoBackArrow";

const SignupForm = () => {
  const { signup } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(
    "Please enter an email address you own."
  );
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const steps = [
    "Sign Up (1/4)",
    "Sign Up (2/4)",
    "Sign Up (3/4)",
    "Sign Up (4/4)",
  ];

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

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

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError(
      text && !validateEmail(text)
        ? "Invalid email format."
        : text
        ? ""
        : "Please enter an email address you own."
    );
  };

  const handleSendCode = () => {
    if (!validateEmail(email)) return;
    // Mock 4-digit code for email verification (replace with backend call)
    const mockCode = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`Sending code ${mockCode} to ${email}`); // 백엔드 대체
    Toast.show({ type: "success", text1: "Verification code sent!" });
    setStep(2);
  };

  const handleVerifyCode = () => {
    // Mock verification (replace with backend call)
    const mockCode = "1234"; // Replace with the actual code sent to the email
    if (code === mockCode) {
      setStep(3);
    } else {
      setCodeError("Invalid verification code.");
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const errors = validatePassword(text);
    setPasswordErrors(errors);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError(
      text && text !== password ? "Oops, these don’t match yet." : ""
    );
  };

  const handlePasswordSubmit = () => {
    if (passwordErrors.length > 0 || confirmPasswordError) return;
    setStep(4);
  };

  const handleUsernameSubmit = useCallback(async () => {
    if (!username) {
      setUsernameError("Please enter a username.");
      return;
    }
    try {
      await signup(username, email, password);
      Toast.show({
        type: "success",
        text1: "Signup successful! Please log in.",
      });
      router.push("/login");
    } catch (error: any) {
      if (error.message === "Username is already taken") {
        setUsernameError("Username is already taken!");
      } else {
        setUsernameError("Signup failed!");
      }
    }
  }, [username, email, password, signup, router]);

  const handleBack = () => {
    if (step === 1) {
      router.push("/login");
    } else {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const primary300 = useThemeColor({}, "primary-300");
  const primary600 = useThemeColor({}, "primary-600");
  const gray900 = useThemeColor({}, "gray-900");
  const white = "#fff";

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        colors={[white, primary300]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "90%",
            marginTop: 15,
          }}
        >
          <TouchableOpacity onPress={handleBack}>
            <GoBackArrow />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                fontWeight: "bold",
                color: gray900,
              }}
            >
              {steps[step - 1]}
            </Text>
          </View>
        </View>

        <View
          style={{
            padding: 16,
            borderRadius: 16,
            width: "100%",
            marginTop: 20,
          }}
        >
          {step === 1 && (
            <>
              <View style={{ alignItems: "center" }}>
                <GlobalInput
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  error={emailError}
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    borderBottomWidth: 1,
                  }}
                />
              </View>
              <View style={{ alignItems: "center" }}>
                <GlobalButton
                  onPress={handleSendCode}
                  disabled={!email || !!emailError}
                  style={{ marginTop: 16, width: "100%" }}
                >
                  <Text style={{ color: white, fontWeight: "bold" }}>
                    Send Verification Code
                  </Text>
                </GlobalButton>
              </View>
              <Text
                style={{
                  color: gray900,
                  fontSize: 10,
                  marginTop: 12,
                }}
              >
                Sending the verification code may take some time, up to 3
                minutes. The code will be sent to the email address you
                provided. If you don’t receive it, please check your spam folder
                or email settings.
              </Text>
            </>
          )}

          {step === 2 && (
            <>
              <View style={{ alignItems: "flex-start" }}>
                <GlobalInput
                  id="code"
                  label="Verification Code"
                  type="numeric"
                  placeholder="Enter 4-digit code"
                  value={code}
                  onChange={setCode}
                  error={codeError}
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    width: "100%",
                  }}
                />
              </View>
              <GlobalButton
                onPress={handleVerifyCode}
                disabled={code.length !== 4}
                style={{ marginTop: 16, width: "100%" }}
              >
                <Text style={{ color: white, fontWeight: "bold" }}>
                  Verify Code
                </Text>
              </GlobalButton>
            </>
          )}

          {step === 3 && (
            <>
              <GlobalInput
                id="password"
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                error={
                  passwordErrors.length > 0 ? passwordErrors.join(" ") : ""
                }
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  borderBottomWidth: 1,
                }}
              />
              <GlobalInput
                id="confirm-password"
                label="Confirm Password"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={confirmPasswordError}
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  borderBottomWidth: 1,
                }}
              />
              <GlobalButton
                onPress={handlePasswordSubmit}
                disabled={
                  passwordErrors.length > 0 ||
                  !!confirmPasswordError ||
                  !password ||
                  !confirmPassword
                }
                style={{ marginTop: 16, width: "100%" }}
              >
                <Text style={{ color: white, fontWeight: "bold" }}>Next</Text>
              </GlobalButton>
            </>
          )}

          {step === 4 && (
            <>
              <View style={{ width: "100%" }}>
                <GlobalInput
                  id="username"
                  label="Username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={setUsername}
                  error={usernameError}
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    borderBottomWidth: 1,
                  }}
                />
              </View>
              <GlobalButton
                onPress={handleUsernameSubmit}
                disabled={!username}
                style={{ marginTop: 16, width: "100%" }}
              >
                <Text style={{ color: white, fontWeight: "bold" }}>
                  Sign Up
                </Text>
              </GlobalButton>
            </>
          )}
        </View>

        <Text
          style={{
            color: gray900,
            fontSize: 6,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Made by @Raina
        </Text>
      </LinearGradient>
    </View>
  );
};

export default SignupForm;

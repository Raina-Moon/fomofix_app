import { useEffect, useRef, useState } from "react";
import GlobalInput from "@/components/ui/GlobalInput";
import GlobalButton from "@/components/ui/GlobalButton";
import PostModal from "./PostModal";
import Confetti from "@/utils/confetti";
import { useGoals } from "@/contexts/GoalContext";
import { usePosts } from "@/contexts/PostContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import timerAnimation from "@/assets/animations/timerAnimation.json";
import Toast from "react-native-toast-message";
import { AppState, AppStateStatus, Image, Text, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import LottieView from "lottie-react-native";

const GoalForm = () => {
  const { createGoal, updateGoal } = useGoals();
  const { createPost } = usePosts();
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [goalId, setGoalId] = useState<number | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [completedGoal, setCompletedGoal] = useState<{
    id: number;
    title: string;
    duration: number;
  } | null>(null);

  const goalIdRef = useRef<number | null>(null);
  const secondsLeftRef = useRef<number | null>(null);

  const primary500 = useThemeColor({}, "primary-500");
  const primary600 = useThemeColor({}, "primary-600");
  const gray900 = useThemeColor({}, "gray-900");

  useEffect(() => {
    goalIdRef.current = goalId;
    secondsLeftRef.current = secondsLeft;
  }, [goalId, secondsLeft]);

  const startTimer = (duration: number, newGoalId: number) => {
    setSecondsLeft(duration * 60);
    setGoalId(newGoalId);
  };

  const handleFailOut = async () => {
    if (goalIdRef.current) {
      try {
        await updateGoal(goalIdRef.current, "failed out");
        Toast.show({
          type: "error",
          text1: "😢 Failed out",
        });
        setSecondsLeft(null);
        setGoalId(null);
      } catch (err) {
        console.error("Error updating goal:", err);
        Toast.show({
          type: "error",
          text1: "Error updating goal status.",
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      Toast.show({
        type: "info",
        text1: "Oops! looks like you're not logged in.",
        position: "bottom",
        onPress: () => router.push("/login"),
      });
      return;
    }

    try {
      const newGoal = await createGoal(user.id, title, duration);
      startTimer(duration, newGoal.id);
      Toast.show({
        type: "success",
        text1: "Goal started!",
      });
    } catch (err) {
      console.error("Error creating goal:", err);
      Toast.show({
        type: "error",
        text1: "Error creating goal",
      });
    }
  };

  const handlePostSubmit = async ({
    imageUrl,
    description,
  }: {
    imageUrl: string;
    description: string;
  }) => {
    if (!user?.id || !goalIdRef.current) {
      Toast.show({
        type: "error",
        text1: "Cannot post: User or goal not available.",
      });
      return;
    }

    try {
      await createPost(user.id, goalIdRef.current, imageUrl, description);
      setShowPostModal(false);
      Toast.show({
        type: "success",
        text1: "Post created!",
      });
      router.push(`/dashboard/${user.id}`);
    } catch (err) {
      console.error("Error creating post:", err);
      Toast.show({
        type: "error",
        text1: "Error creating post.",
      });
    }
  };

  useEffect(() => {
    if (secondsLeft === null) return;

    if (secondsLeft <= 0) {
      Confetti();
      Toast.show({
        type: "success",
        text1: "💪 Nailed it!",
      });
      setCompletedGoal({ id: goalId ?? 0, title, duration });
      setShowPostModal(true);
      setSecondsLeft(null);

      if (goalId) {
        updateGoal(goalId, "nailed it").catch((err) => {
          console.error("Error updating goal:", err);
          Toast.show({
            type: "error",
            text1: "Error updating goal status. Please try again.",
          });
        });
      }

      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft, goalId, updateGoal, title]);

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  // ✅ Fail on tab close or refresh
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        (nextAppState === "background" || nextAppState === "inactive") &&
        secondsLeftRef.current !== null &&
        goalIdRef.current !== null
      ) {
        try {
          await updateGoal(goalIdRef.current, "failed out");
          setSecondsLeft(null);
          setGoalId(null);
          AppState.currentState === "active" &&
            Toast.show({
              type: "error",
              text1: "😢 App backgrounded. Failed out.",
            });
        } catch (err) {
          console.error("Error updating goal:", err);
          AppState.currentState === "active" &&
            Toast.show({
              type: "error",
              text1: "Error updating goal status.",
            });
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          padding: 16,
          borderColor: primary500,
          borderWidth: 1,
          marginVertical: 40,
          marginTop: 40,
          marginBottom: 30,
          borderRadius: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: gray900,
              textAlign: "center",
            }}
          >
            lowkey timer drip!
          </Text>
          <Image
            style={{
              width: 28,
              height: 28,
            }}
            source={require("@/assets/images/TimerLogo.png")}
          />
        </View>
        {secondsLeft === null ? (
          <>
            <GlobalInput
              label="title"
              value={title}
              onChange={setTitle}
              placeholder="title"
              style={{
                marginBottom: 9,
              }}
            />
            <GlobalInput
              label="duration"
              type="number"
              value={String(duration)}
              onChange={(t) => setDuration(Number(t))}
            />
            <GlobalButton
              onPress={handleSubmit}
              style={{
                marginTop: 23,
                justifyContent: "center",
              }}
            >
              hit the drip
            </GlobalButton>
          </>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <LottieView
                source={timerAnimation}
                autoPlay
                loop
                style={{ width: 40, height: 40 }}
              />
              <Text
                style={{
                  color: primary600,
                  fontSize: 28,
                  fontWeight: "semibold",
                }}
              >
                {formatTime(secondsLeft)}
              </Text>
            </View>
            <GlobalButton onPress={handleFailOut}>Fail Out</GlobalButton>
          </View>
        )}
      </View>
      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        title={completedGoal?.title}
        duration={completedGoal?.duration}
        onSubmit={handlePostSubmit}
      />
    </>
  );
};

export default GoalForm;

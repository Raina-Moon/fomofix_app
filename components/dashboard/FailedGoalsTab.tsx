import { useThemeColor } from "@/hooks/useThemeColor";
import { Goal } from "@/types";
import { Text, View } from "react-native";

interface FailedGoalsTabProps {
  goals: Goal[];
}

const red100 = useThemeColor({}, "red-100");
const red400 = useThemeColor({}, "red-400");
const red700 = useThemeColor({}, "red-700");
const gray400 = useThemeColor({}, "gray-400");
const gray600 = useThemeColor({}, "gray-600");

const FailedGoalsTab = ({ goals }: FailedGoalsTabProps) => (
  <View style={{ gap: 12 }}>
    {goals
      .filter((goal) => goal.status === "failed out")
      .map((goal) => (
        <View
          key={goal.id}
          style={{
            borderWidth: 1,
            borderColor: red400,
            backgroundColor: red100,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: red700,
              fontWeight: "semibold",
            }}
          >
            {goal.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: gray600,
            }}
          >
            Duration: {goal.duration} min
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: gray400,
            }}
          >
            Created: {new Date(goal.created_at).toLocaleString()}
          </Text>
        </View>
      ))}
  </View>
);

export default FailedGoalsTab;

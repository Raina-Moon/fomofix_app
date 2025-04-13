import { useThemeColor } from "@/hooks/useThemeColor";
import { Goal } from "@/types";
import { ScrollView, Text, View } from "react-native";

interface GoalsTabProps {
  goals: Goal[];
}

const primary100 = useThemeColor({}, "primary-100");
const primary200 = useThemeColor({}, "primary-200");
const primary500 = useThemeColor({}, "primary-500");
const primary800 = useThemeColor({}, "primary-800");
const gray200 = useThemeColor({}, "gray-200");
const gray300 = useThemeColor({}, "gray-300");
const gray400 = useThemeColor({}, "gray-400");
const gray600 = useThemeColor({}, "gray-600");
const gray700 = useThemeColor({}, "gray-700");
const red200 = useThemeColor({}, "red-200");
const red400 = useThemeColor({}, "red-400");
const red800 = useThemeColor({}, "red-800");

const GoalsTab = ({ goals }: GoalsTabProps) => {
  return (
    <ScrollView contentContainerStyle={{ gap: 12 }}>
      {goals.map((goal) => {
        const isNailedIt = goal.status === "nailed it";
        const isFailedOut = goal.status === "failed out";

        const cardBorderColor = isNailedIt
          ? primary500
          : isFailedOut
          ? red400
          : gray300;

        const cardBackgroundColor = isNailedIt
          ? primary100
          : isFailedOut
          ? red200
          : gray200;

        const statusTextColor = isNailedIt
          ? primary800
          : isFailedOut
          ? red800
          : gray700;

        const statusBackgroundColor = isNailedIt
          ? primary200
          : isFailedOut
          ? red200
          : gray200;

        return (
          <View
            key={goal.id}
            style={{
              borderWidth: 1,
              borderColor: cardBorderColor,
              backgroundColor: cardBackgroundColor,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
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

              <View
                style={{
                  backgroundColor: statusBackgroundColor,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: statusTextColor,
                  }}
                >
                  {goal.status}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default GoalsTab;

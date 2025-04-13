import { useMemo } from "react";
import { BarChart } from "react-native-gifted-charts";
import { Dimensions, StyleSheet } from "react-native";
import { ChartData, Goal } from "@/types";
import { View } from "react-native";
import { Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable } from "react-native";

interface ChartComponentProps {
  nailedPosts: Goal[];
  failedPosts?: Goal[];
  chartPeriod: "day" | "week" | "month" | "year";
  setChartPeriod: (period: "day" | "week" | "month" | "year") => void;
  isOwnProfile: boolean;
}

const ChartComponent = ({
  nailedPosts = [],
  failedPosts = [],
  chartPeriod,
  setChartPeriod,
  isOwnProfile,
}: ChartComponentProps) => {
  const chartData: ChartData[] = useMemo(() => {
    if (!nailedPosts.length) return [];

    const processData = (
      posts: Goal[] = [],
      key: "nailedDuration" | "failedDuration"
    ): ChartData[] => {
      if (chartPeriod === "day") {
        const today = new Date();
        const durationByHour = Array(6).fill(0);
        posts.forEach((post) => {
          const postDate = new Date(post.created_at);
          if (postDate.toDateString() === today.toDateString()) {
            const hour = postDate.getHours();
            const slot = Math.floor(hour / 4);
            durationByHour[slot] += post.duration;
          }
        });
        return [
          {
            time: "0-4",
            nailedDuration: 0,
            failedDuration: 0,
            [key]: durationByHour[0],
          },
          {
            time: "4-8",
            nailedDuration: 0,
            failedDuration: 0,
            [key]: durationByHour[1],
          },
          {
            time: "8-12",
            nailedDuration: 0,
            failedDuration: 0,
            [key]: durationByHour[2],
          },
          {
            time: "12-16",
            nailedDuration: 0,
            failedDuration: 0,
            [key]: durationByHour[3],
          },
          {
            time: "16-20",
            nailedDuration: 0,
            failedDuration: 0,
            [key]: durationByHour[4],
          },
          {
            time: "20-24",
            nailedDuration: 0,
            failedDuration: 0,
            [key]: durationByHour[5],
          },
        ];
      } else if (chartPeriod === "week") {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const durationByDate = posts.reduce((acc, post) => {
          const date = new Date(post.created_at).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          });
          if (new Date(post.created_at) >= weekAgo) {
            acc[date] = (acc[date] || 0) + post.duration;
          }
          return acc;
        }, {} as { [key: string]: number });
        return Object.entries(durationByDate).map(([date, duration]) => ({
          date,
          nailedDuration: 0,
          failedDuration: 0,
          [key]: duration,
        }));
      } else if (chartPeriod === "month") {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const durationByDate = posts.reduce((acc, post) => {
          const date = new Date(post.created_at).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          });
          if (new Date(post.created_at) >= monthAgo) {
            acc[date] = (acc[date] || 0) + post.duration;
          }
          return acc;
        }, {} as { [key: string]: number });
        return Object.entries(durationByDate).map(([date, duration]) => ({
          date,
          nailedDuration: 0,
          failedDuration: 0,
          [key]: duration,
        }));
      } else if (chartPeriod === "year") {
        const yearStart = new Date(new Date().getFullYear(), 0, 1);
        const durationByMonth = posts.reduce((acc, post) => {
          const date = new Date(post.created_at).toLocaleDateString("en-US", {
            month: "short",
          });
          if (new Date(post.created_at) >= yearStart) {
            acc[date] = (acc[date] || 0) + post.duration;
          }
          return acc;
        }, {} as { [key: string]: number });
        return Object.entries(durationByMonth).map(([date, duration]) => ({
          date,
          nailedDuration: 0,
          failedDuration: 0,
          [key]: duration,
        }));
      }
      return [];
    };

    const nailedData = processData(nailedPosts, "nailedDuration");
    if (!isOwnProfile)
      return nailedData.map((d) => ({ ...d, failedDuration: 0 }));

    const failedData = processData(failedPosts, "failedDuration");

    const mergedDataMap = new Map<string, ChartData>();

    nailedData.forEach((nailed) => {
      const key = nailed.date || nailed.time || "";
      mergedDataMap.set(key, { ...nailed, failedDuration: 0 });
    });

    failedData.forEach((failed) => {
      const key = failed.date || failed.time || "";
      if (mergedDataMap.has(key)) {
        mergedDataMap.get(key)!.failedDuration = failed.failedDuration || 0;
      } else {
        mergedDataMap.set(key, {
          time: failed.time,
          date: failed.date,
          nailedDuration: 0,
          failedDuration: failed.failedDuration || 0,
        });
      }
    });

    return Array.from(mergedDataMap.values());
  }, [nailedPosts, failedPosts, chartPeriod, isOwnProfile]);

  const maxDuration = useMemo(() => {
    const nailedDurations = chartData.map((d) => d.nailedDuration || 0);
    const failedDurations = chartData.map((d) => d.failedDuration || 0);
    return Math.max(...nailedDurations, ...failedDurations, 5);
  }, [chartData]);

  const chartWidth = Dimensions.get("window").width - 88;

  const barData = chartData.map((item) => ({
    label: item.date || item.time || "",
    stacks: [
      { value: item.nailedDuration || 0, color: "#60A5FA" },
      ...(isOwnProfile
        ? [{ value: item.failedDuration || 0, color: "#EF4444" }]
        : []),
    ],
  }));

  const gray600 = useThemeColor({}, "gray-600");
  const primary600 = useThemeColor({}, "primary-600");
  const gray200 = useThemeColor({}, "gray-200");
  const gray300 = useThemeColor({}, "gray-300");
  const white = "#fff";
  const gray900 = useThemeColor({}, "gray-900");
  return (
    <View
      style={{
        backgroundColor: white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: gray300,
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
          Success Duration
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: gray600,
          }}
        >
          {chartPeriod === "day" && "Last 24 Hours"}
          {chartPeriod === "week" && "Last 7 Days"}
          {chartPeriod === "month" && "Last 30 Days"}
          {chartPeriod === "year" && "This Year"}
        </Text>
      </View>

      {/* Chart Legend */}

      {/* Period Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: 16,
          gap: 8,
        }}
      >
        {["day", "week", "month", "year"].map((period) => (
          <Pressable
            key={period}
            style={{
              backgroundColor: chartPeriod === period ? primary600 : gray200,
              borderWidth: 1,
              borderColor: chartPeriod === period ? primary600 : gray300,
              borderRadius: 6,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
            onPress={() =>
              setChartPeriod(period as ChartComponentProps["chartPeriod"])
            }
          >
            <Text
              style={{
                color: chartPeriod === period ? white : gray900,
                fontSize: 12,
              }}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Bar Chart */}
      <View style={{ height: 300, flexDirection: "row" }}>
        <View
          style={{ width: 10, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              transform: [{ rotate: "-90deg" }],
              color: gray600,
              fontSize: 8,
            }}
          >
            Duration (min)
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <BarChart
            width={chartWidth}
            height={300}
            data={barData}
            barWidth={isOwnProfile ? 20 : 10}
            spacing={isOwnProfile ? 10 : 5}
            noOfSections={Math.ceil((maxDuration + 10) / 10)}
            maxValue={maxDuration + 10}
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisText}
            formatYLabel={(label: string) =>
              chartPeriod === "day" ? label : label.slice(0, 6)
            }
            showFractionalValues={false}
            isAnimated
            rotateLabel={chartPeriod !== "day"}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  axisText: {
    color: "#6B7280",
    fontSize: 12,
  },
});

export default ChartComponent;

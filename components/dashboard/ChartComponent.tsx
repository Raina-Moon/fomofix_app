import { useMemo } from "react";
import { Box, Text, Pressable } from "@gluestack-ui/themed";
import { BarChart } from "react-native-gifted-charts";
import { Dimensions, StyleSheet } from "react-native";
import { ChartData, Goal } from "@/types";

interface ChartComponentProps {
  nailedPosts: Goal[];
  failedPosts?: Goal[];
  chartPeriod: "day" | "week" | "month" | "year";
  setChartPeriod: (period: "day" | "week" | "month" | "year") => void;
  isOwnProfile: boolean;
}

const ChartComponent = ({
  nailedPosts,
  failedPosts = [],
  chartPeriod,
  setChartPeriod,
  isOwnProfile,
}: ChartComponentProps) => {
  const chartData: ChartData[] = useMemo(() => {
    if (!nailedPosts || nailedPosts.length === 0) return [];

    const processData = (
      posts: Goal[],
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

  return (
    <Box
      bg="$white"
      borderRadius="$lg"
      p="$4"
      borderWidth={1}
      borderColor="$gray300"
      mb="$4"
    >
      {/* Header */}
      <Box mb="$4">
        <Text fontSize="$lg" fontWeight="$semibold">
          Success Duration
        </Text>
        <Text fontSize="$sm" color="$gray600">
          {chartPeriod === "day" && "Last 24 Hours"}
          {chartPeriod === "week" && "Last 7 Days"}
          {chartPeriod === "month" && "Last 30 Days"}
          {chartPeriod === "year" && "This Year"}
        </Text>
      </Box>

      {/* Period Buttons */}
      <Box flexDirection="row" justifyContent="flex-end" mb="$4" gap="$2">
        <Pressable
          bg={chartPeriod === "day" ? "$primary600" : "$gray200"}
          borderWidth={1}
          borderColor={chartPeriod === "day" ? "$primary600" : "$gray300"}
          borderRadius="$sm"
          px="$3"
          py="$2"
          onPress={() => setChartPeriod("day")}
        >
          <Text
            color={chartPeriod === "day" ? "$white" : "$gray900"}
            fontSize="$sm"
          >
            Day
          </Text>
        </Pressable>
        <Pressable
          bg={chartPeriod === "week" ? "$primary600" : "$gray200"}
          borderWidth={1}
          borderColor={chartPeriod === "week" ? "$primary600" : "$gray300"}
          borderRadius="$sm"
          px="$3"
          py="$2"
          onPress={() => setChartPeriod("week")}
        >
          <Text
            color={chartPeriod === "week" ? "$white" : "$gray900"}
            fontSize="$sm"
          >
            Week
          </Text>
        </Pressable>
        <Pressable
          bg={chartPeriod === "month" ? "$primary600" : "$gray200"}
          borderWidth={1}
          borderColor={chartPeriod === "month" ? "$primary600" : "$gray300"}
          borderRadius="$sm"
          px="$3"
          py="$2"
          onPress={() => setChartPeriod("month")}
        >
          <Text
            color={chartPeriod === "month" ? "$white" : "$gray900"}
            fontSize="$sm"
          >
            Month
          </Text>
        </Pressable>
        <Pressable
          bg={chartPeriod === "year" ? "$primary600" : "$gray200"}
          borderWidth={1}
          borderColor={chartPeriod === "year" ? "$primary600" : "$gray300"}
          borderRadius="$sm"
          px="$3"
          py="$2"
          onPress={() => setChartPeriod("year")}
        >
          <Text
            color={chartPeriod === "year" ? "$white" : "$gray900"}
            fontSize="$sm"
          >
            Year
          </Text>
        </Pressable>
      </Box>

      {/* Bar Chart */}
      <Box height={300}>
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
          formatYLabel={(label: any) =>
            chartPeriod === "day" ? label : label.slice(0, 6)
          }
          showFractionalValues={false}
          isAnimated
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  axisText: {
    color: "#6B7280",
    fontSize: 12,
  },
});

export default ChartComponent;

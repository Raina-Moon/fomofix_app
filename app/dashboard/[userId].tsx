import { useEffect, useMemo, useState } from "react";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import FollowButton from "@/components/dashboard/FollowButton";
import FollowersList from "@/components/dashboard/FollowersList";
import GoalsTab from "@/components/dashboard/GoalsTab";
import NailedPostsTab from "@/components/dashboard/NailedPostsTab";
import FailedGoalsTab from "@/components/dashboard/FailedGoalsTab";
import ChartComponent from "@/components/dashboard/ChartComponent";
import { useAuth } from "@/contexts/AuthContext";
import { useGoals } from "@/contexts/GoalContext";
import { useFollowers } from "@/contexts/FollowerContext";
import { usePosts } from "@/contexts/PostContext";
import { Box, Text, VStack } from "@gluestack-ui/themed";
import { Image, TouchableOpacity } from "react-native";
import { CustomTabs } from "@/components/ui/CustomTab";
import { useLocalSearchParams } from "expo-router";

const Dashboard = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user, token, fetchViewUser, viewUser } = useAuth();
  const { goals = [], fetchGoals } = useGoals();
  const { nailedPosts = [], fetchNailedPosts } = usePosts();
  const { followers = [], fetchFollowers } = useFollowers();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("nailed");
  const [chartPeriod, setChartPeriod] = useState<
    "day" | "week" | "month" | "year"
  >("week");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !user?.id || !token) return;

      const profileId = Number(userId);
      const viewerId = user.id;

      try {
        await Promise.all([
          fetchViewUser(profileId).catch((err) => {
            console.error("fetchViewUser failed:", err);
            return null;
          }),
          fetchGoals(profileId).catch((err) => {
            console.error("fetchGoals failed:", err);
            return [];
          }),
          fetchNailedPosts(profileId).catch((err) => {
            console.error("fetchNailedPosts failed:", err);
            return [];
          }),
          fetchFollowers(profileId).catch((err) => {
            console.error("fetchFollowers failed:", err);
            return [];
          }),
        ]);

        setIsFollowing(followers.some((f) => f.id === viewerId));
      } catch (err) {
        console.error("Unexpected error in fetchData:", err);
      }
    };
    fetchData();
  }, [
    userId,
    user,
    token,
    fetchViewUser,
    fetchGoals,
    fetchNailedPosts,
    fetchFollowers,
  ]);

  const nailedGoals = useMemo(() => {
    return goals.filter((goal) => goal.status === "nailed it");
  }, [goals]);

  const failedPosts = useMemo(() => {
    return goals.filter((goal) => goal.status === "failed out");
  }, [goals]);

  if (!user || !token || !viewUser) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" $base-px="$4">
        <Text color="$gray900">Please log in to view the dashboard.</Text>
      </Box>
    );
  }

  if (!viewUser) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" $base-px="$4">
        <Text color="$gray900" fontSize={18}>
          Loading user data...
        </Text>
      </Box>
    );
  }

  const displayedFollowers = followers.slice(0, 3);
  const extraFollowersCount = followers.length > 3 ? followers.length - 3 : 0;

  const isOwnProfile = user.id === viewUser.id;

  const tabs = [
    ...(isOwnProfile ? [{ value: "all", label: "All" }] : []),
    { value: "nailed", label: "Nailed It" },
    ...(isOwnProfile ? [{ value: "failed", label: "Failed It" }] : []),
    { value: "chart", label: "Chart" },
  ];

  return (
    <Box padding={3} flex={1}>
      <VStack style={{ gap: 10 }}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Box flexDirection="row" alignItems="center" style={{ gap: 5 }}>
            <ProfileHeader
              userId={viewUser.id}
              storedId={user.id}
              username={viewUser.username}
              profileImage={
                viewUser.profile_image || "/images/DefaultProfile.png"
              }
            />
            <TouchableOpacity onPress={() => setIsFollowersModalOpen(true)}>
              {displayedFollowers.length > 0 ? (
                <Box flexDirection="row" alignItems="center">
                  {displayedFollowers.map((follower, index) => (
                    <Image
                      key={follower.id}
                      source={{
                        uri:
                          follower.profile_image ||
                          "/images/DefaultProfile.png",
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        borderWidth: 2,
                        borderColor: "$white",
                        marginLeft: index > 0 ? -15 : 0,
                        zIndex: displayedFollowers.length - index,
                      }}
                    />
                  ))}
                  {extraFollowersCount > 0 && (
                    <Box
                      width={7}
                      height={7}
                      borderRadius="$lg"
                      backgroundColor="$gray300"
                      alignItems="center"
                      justifyContent="center"
                      borderWidth={2}
                      borderColor="$white"
                      zIndex={0}
                    >
                      <Text color="$white" fontSize={12} fontWeight="$medium">
                        +{extraFollowersCount}
                      </Text>
                    </Box>
                  )}
                </Box>
              ) : (
                <Text color="$gray500" fontSize={8}>
                  Be the first to vibe
                </Text>
              )}
            </TouchableOpacity>
          </Box>
          {user.id !== viewUser.id && (
            <FollowButton
              storedId={user.id}
              userId={viewUser.id}
              isFollowing={isFollowing}
              setIsFollowing={setIsFollowing}
            />
          )}
        </Box>

        <Text color="$gray900" fontSize={16} fontWeight="$medium" marginBottom={2}>
          {viewUser.username}'s grab goals
        </Text>

        <CustomTabs
          tabs={tabs}
          defaultValue="nailed"
          onValueChange={setActiveTab}
        >
          {(activeTab) => (
            <>
              {isOwnProfile && activeTab === "all" && (
                <GoalsTab goals={goals} />
              )}
              {activeTab === "nailed" && (
                <NailedPostsTab posts={nailedPosts} userId={user.id} />
              )}
              {isOwnProfile && activeTab === "failed" && (
                <FailedGoalsTab goals={goals} />
              )}
              {activeTab === "chart" && (
                <ChartComponent
                  nailedPosts={nailedGoals}
                  failedPosts={isOwnProfile ? failedPosts : undefined}
                  chartPeriod={chartPeriod}
                  setChartPeriod={setChartPeriod}
                  isOwnProfile={isOwnProfile}
                />
              )}
            </>
          )}
        </CustomTabs>
      </VStack>

      {isFollowersModalOpen && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="$black"
          opacity={0.5}
          justifyContent="center"
          alignItems="center"
          zIndex={50}
          onTouchStart={() => setIsFollowersModalOpen(false)}
        >
          <Box
            backgroundColor="$white"
            borderRadius="$lg"
            padding={6}
            width="85%"
            maxWidth={400}
            onTouchStart={(e: any) => e.stopPropagation()}
          >
            <Box flexDirection="row" justifyContent="space-between" marginBottom={4}>
              <Text color="$gray900" fontSize={16} fontWeight="$bold">
                Followers {followers.length}
              </Text>
            </Box>
            <FollowersList
              followers={followers.map((follower) => ({
                ...follower,
                profile_image: follower.profile_image ?? null,
              }))}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;

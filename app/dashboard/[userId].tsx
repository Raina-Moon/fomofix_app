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
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
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
      <View style={styles.centeredContainer}>
        <Text style={styles.gray900Text}>
          Please log in to view the dashboard.
        </Text>
      </View>
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

  const renderContent = () => {
    if (isOwnProfile && activeTab === "all") return <GoalsTab goals={goals} />;
    if (activeTab === "nailed") return <NailedPostsTab posts={nailedPosts} userId={user.id} />;
    if (isOwnProfile && activeTab === "failed") return <FailedGoalsTab goals={goals} />;
    if (activeTab === "chart") {
      return (
        <ChartComponent
          nailedPosts={nailedGoals}
          failedPosts={isOwnProfile ? failedPosts : undefined}
          chartPeriod={chartPeriod}
          setChartPeriod={setChartPeriod}
          isOwnProfile={isOwnProfile}
        />
      );
    }
    return null;
  };

  const data = [
    {
      id: "header",
      component: (
        <View style={styles.vStack}>
          <View style={styles.rowSpaceBetweenAlignFlexEnd}>
            <View style={styles.rowAlignCenter}>
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
                  <View style={styles.rowAlignCenter}>
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
                          borderColor: "white",
                          marginLeft: index > 0 ? -15 : 0,
                          zIndex: displayedFollowers.length - index,
                        }}
                      />
                    ))}
                    {extraFollowersCount > 0 && (
                      <View style={styles.extraFollowers}>
                        <Text style={styles.extraFollowersText}>
                          +{extraFollowersCount}
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text style={styles.smallGrayText}>Be the first to vibe</Text>
                )}
              </TouchableOpacity>
            </View>
            {user.id !== viewUser.id && (
              <FollowButton
                storedId={user.id}
                userId={viewUser.id}
                isFollowing={isFollowing}
                setIsFollowing={setIsFollowing}
              />
            )}
          </View>

          <Text style={styles.headerText}>{viewUser.username}'s grab goals</Text>

          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.value}
                style={[
                  styles.tabButton,
                  activeTab === tab.value && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab(tab.value)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.value && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      id: "content",
      component: renderContent(),
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => item.component}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContainer}
      />

      {isFollowersModalOpen && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsFollowersModalOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                Followers {followers.length}
              </Text>
            </View>
            <FollowersList
              followers={followers.map((follower) => ({
                ...follower,
                profile_image: follower.profile_image ?? null,
              }))}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    padding: 12,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  gray900Text: {
    color: "#212121",
  },
  loadingText: {
    fontSize: 18,
  },
  vStack: {
    flex: 1,
  },
  rowSpaceBetweenAlignFlexEnd: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  rowAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  extraFollowers: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
    marginLeft: -15,
  },
  extraFollowersText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  smallGrayText: {
    color: "#A0A0A0",
    fontSize: 8,
  },
  headerText: {
    color: "#212121",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#1EBD7B",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
  },
  activeTabText: {
    color: "#1EBD7B",
    fontWeight: "600",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    opacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalHeaderText: {
    color: "#212121",
    fontSize: 16,
    fontWeight: "bold",
  },
});

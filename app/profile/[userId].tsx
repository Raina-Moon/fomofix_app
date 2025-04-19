import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { Notification, Post } from "@/types";
import { useNotifications } from "@/contexts/NotificationsContext";
import ProfileCard from "@/components/profile/ProfileCard";
import NotificationModal from "@/components/profile/NotificationModal";
import BookmarksModal from "@/components/profile/BookmarksModal";
import LogoutModal from "@/components/profile/LogoutModal";
import PostDetailModal from "@/components/profile/PostDetailModal";
import DeleteConfirmModal from "@/components/profile/DeleteConfirmModal";
import FarewellModal from "@/components/profile/FarewellModal";
import { useThemeColor } from "@/hooks/useThemeColor";

const ProfilePage = () => {
  const {
    token,
    user,
    isLoggedIn,
    logout,
    getProfile,
    updateProfile,
    updateProfileImage,
    deleteUser,
  } = useAuth();
  const { fetchBookmarkedPostDetail } = useBookmarks();
  const { fetchNotifications, markAsRead, deleteNotification } =
    useNotifications();

  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();

  const [showBookmarkedPosts, setShowBookmarkedPosts] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionMessage, setDeletionMessage] = useState<string | null>(null);
  const [showFarewellModal, setShowFarewellModal] = useState(false);

  useEffect(() => {
    if (!token || !userId) return;
    if (!isLoggedIn) {
      router.replace("/login");
    } else if (!user) {
      getProfile(Number(userId));
    }
  }, [token, router, isLoggedIn, userId, getProfile]);

  useEffect(() => {
    if (isDeleting) {
      const messages = [
        "We're crying because you're leaving...",
        "Wiping away our tears...",
        "Deleting your data...",
        "Almost done...",
      ];
      let index = 0;
      setDeletionMessage(messages[index]);
      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setDeletionMessage(messages[index]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isDeleting]);

  const loadNotifications = async () => {
    if (user) {
      try {
        const notifs = await fetchNotifications(user.id);
        setNotifications(notifs);
        setShowNotifications(true);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      await deleteUser(user.id);
      setIsDeleting(false);
      setShowFarewellModal(true);
      setTimeout(() => {
        setShowFarewellModal(false);
        router.replace("/");
      }, 5000); // Show farewell for 3 seconds
    } catch (err) {
      console.error("Failed to delete account:", err);
      setIsDeleting(false);
    }
  };

  const handleShowBookmarks = async () => {
    if (user) {
      const posts = await fetchBookmarkedPostDetail(user.id);
      setBookmarkedPosts(posts);
      setShowBookmarkedPosts(true);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleBookmarkChange = (postId: number, isBookmarked: boolean) => {
    setBookmarkedPosts((prev) =>
      isBookmarked
        ? [...prev, { ...selectedPost!, post_id: postId }]
        : prev.filter((p) => p.post_id !== postId)
    );
  };

  if (!user) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const primary500 = useThemeColor({}, "primary-500");
  const white = "#fff";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: primary500,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 32,
      }}
    >
      <ProfileCard
        user={user}
        updateProfile={updateProfile}
        updateProfileImage={updateProfileImage}
        userId={userId}
        onLoadNotifications={loadNotifications}
        onShowBookmarks={handleShowBookmarks}
        onLogoutConfirm={() => setShowLogoutConfirm(true)}
        onDeleteConfirm={() => setShowDeleteConfirm(true)}
        notificationEnabled={notificationEnabled}
        toggleNotification={() => setNotificationEnabled(!notificationEnabled)}
      />
      <Text
        style={{
          color: white,
          fontSize: 6,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Made by @Raina
      </Text>

      {showNotifications && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
        />
      )}

      {showBookmarkedPosts && (
        <BookmarksModal
          bookmarkedPosts={bookmarkedPosts}
          onClose={() => setShowBookmarkedPosts(false)}
          onSelectPost={setSelectedPost}
        />
      )}

      {showLogoutConfirm && (
        <LogoutModal
          onConfirm={() => {
            handleLogout();
            setShowLogoutConfirm(false);
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={() => {
            handleDeleteAccount();
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {isDeleting && (
        <View
          style={{
            position: "absolute",
            top: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <Text style={{ color: white, fontSize: 18 }}>{deletionMessage}</Text>
        </View>
      )}

      {showFarewellModal && <FarewellModal />}

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          user={user}
          onBookmarkChange={handleBookmarkChange}
        />
      )}
    </View>
  );
};

export default ProfilePage;

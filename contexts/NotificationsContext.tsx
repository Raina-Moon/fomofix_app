
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Notification } from "@/types";
import { fetchApi } from "@/constants/api/fetch";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Vibration } from "react-native";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";

interface NotificationsState {
  notifications: Notification[];
  fetchNotifications: (userId: number) => Promise<Notification[]>;
  markAsRead: (notificationId: number) => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsState | undefined>(
  undefined
);

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const setupNotifications = async () => {
    if (!Device.isDevice) {
      console.log("Push notifications not supported on simulator/emulator");
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Notification permissions denied");
      return;
    }

    // Set the notification handler for Android
    await notifee.createChannel({
      id: "fomofix-notifications",
      name: "FomoFix Notifications",
      importance: AndroidImportance.HIGH,
      sound: "notification",
      vibration: true,
      vibrationPattern: [300, 200, 300],
    });

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    if (user?.id && token) {
      try {
        await fetchApi("/notifications/subscribe", {
          method: "POST",
          body: JSON.stringify({ expoPushToken: token, userId: user.id }),
          headers: { "Content-Type": "application/json" },
        });
        console.log("Expo push token sent to server:", token);
      } catch (err) {
        console.error("Failed to send push token:", err);
      }
    }
  };

  const handleForegroundNotification = async (notification) => {
    const { title, body, data } = notification.request.content;

    await notifee.displayNotification({
      title: title || "FomoFix",
      body: body || "New notification",
      data,
      android: {
        channelId: "fomofix-notifications",
        pressAction: { id: "default" },
        sound: "notification",
        vibrationPattern: [300, 200, 300],
      },
      ios: {
        sound: "notification.mp3",
      },
    });

    Vibration.vibrate([300, 200, 300]);

    setNotifications((prev) => [
      {
        id: Date.now(),
        user_id: user?.id || 0,
        message: body || "New notification",
        is_read: false,
        created_at: new Date().toISOString(),
        ...data,
      },
      ...prev,
    ]);
  };

  useEffect(() => {
    setupNotifications();

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener(handleForegroundNotification);

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("Notification clicked:", data);
      });

      // Notifee Event Listener
      const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log("Notifee notification clicked:", detail.notification?.data);
        // router.push(`/post/${detail.notification?.data?.postId}`);
      }
    });

    if ("serviceWorker" in navigator && "PushManager" in window && user) {
      const registerServiceWorker = async () => {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        await fetchApi("/notifications/subscribe", {
          method: "POST",
          body: JSON.stringify({ subscription, userId: user.id }),
          headers: { "Content-Type": "application/json" },
        });
      };

      registerServiceWorker().catch((err) =>
        console.error("Service Worker registration failed:", err)
      );

      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === "PLAY_SOUND") {
          const audio = new Audio(event.data.url);
          audio.volume = 0.3;
          audio.play().catch((err) => console.error("Audio play error:", err));
          Vibration.vibrate([300, 200, 300]);
        }
      };

      navigator.serviceWorker.addEventListener("message", handleMessage);

      return () => {
        navigator.serviceWorker.removeEventListener("message", handleMessage);
      };
    }

    // Cleanup
    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
      unsubscribeNotifee();
    };
  }, [user]);

  const fetchNotifications = async (userId: number) => {
    try {
      const data = await fetchApi<Notification[]>(`/notifications/${userId}`);
      setNotifications(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      return [];
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetchApi(`/notifications/${notificationId}/read`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      await fetchApi(`/notifications/${notificationId}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const value: NotificationsState = {
    notifications,
    fetchNotifications,
    markAsRead,
    deleteNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  return context;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

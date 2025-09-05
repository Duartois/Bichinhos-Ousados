import { createContext, useContext, useState, useCallback } from "react";
import Notification from "../components/Notification";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000); // some sozinho após 4s
  }, []);

  const closeNotification = () => setNotification(null);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);

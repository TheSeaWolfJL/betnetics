import { socketEvents } from "./events.js";
import createNotificationService from "./notification.js";

const socketController = (socket, io) => {
  const notifier = createNotificationService(io);

  // Client requests server to publish a notification after an API call
  // payload: { type: 'success'|'error', message: string, room?: string, meta?: any }
  socket.on(socketEvents.requestNotification, (payload) => {
    try {
      const { type, ...rest } = payload || {};

      if (type === "error") notifier.notifyError(rest);
      else notifier.notifySuccess(rest);
    } catch (err) {
      console.error("failed handling requestNotification", err);
      notifier.notifyError({ message: "Notification delivery failed" });
    }
  });
};

export default socketController;

import { socketEvents } from "./events.js";

export default function createNotificationService(io) {
  const notify = (targetEmit, payload) => {
    try {
      console.log("emitting notification", payload);
      targetEmit(socketEvents.setNotification, payload);
    } catch (err) {
      console.error("notification emit error", err);
    }
  };

  return {
    notifySuccess: (payload = {}) =>
      notify((event, data) => io.emit(event, data), {
        status: "success",
        ...payload,
      }),
    notifyError: (payload = {}) =>
      notify((event, data) => io.emit(event, data), {
        status: "error",
        ...payload,
      }),
  };
}

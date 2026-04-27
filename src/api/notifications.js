const NOTIF_KEY = "notifications";

export function getNotifications() {
  return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
}

export function createNotification({
  text,
  type = "info",
  goalId = null,
  route = null
}) {
  const all = getNotifications();

  const newNotif = {
    id: Date.now(),
    text,
    type,
    goalId,
    route,
    read: false,
    date: new Date().toISOString()
  };

  localStorage.setItem(
    NOTIF_KEY,
    JSON.stringify([newNotif, ...all].slice(0, 50))
  );

  window.dispatchEvent(new Event("notification_update"));
}

export function markNotificationsRead() {
  const all = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem(NOTIF_KEY, JSON.stringify(all));

  window.dispatchEvent(new Event("notification_update"));
}

export function removeNotification(id) {
  const all = getNotifications().filter(n => n.id !== id);

  localStorage.setItem(NOTIF_KEY, JSON.stringify(all));

  window.dispatchEvent(new Event("notification_update"));
}

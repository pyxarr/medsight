import type { NotificationResponse, NotificationUser } from "@/lib/api";

export function getNotificationUserName(user?: NotificationUser | null) {
  return user?.display_name ?? user?.name ?? user?.username ?? "Someone";
}

export function getNotificationUserAvatar(user?: NotificationUser | null) {
  return user?.avatar_url ?? user?.avatar ?? null;
}

function formatActorCount(name: string, count: number) {
  if (count <= 1) return name;
  return `${name} and ${count - 1} other${count - 1 === 1 ? "" : "s"}`;
}

function buildMessage(actionType: NotificationResponse["actionType"], firstName: string, count: number) {
  const actorLabel = formatActorCount(firstName, count);

  switch (actionType) {
    case "follow":
      return count > 1 ? `${actorLabel} followed you` : `${firstName} followed you`;
    case "like":
      return count > 1 ? `${actorLabel} liked your post` : `${firstName} liked your post`;
    case "repost":
      return count > 1 ? `${actorLabel} reposted your post` : `${firstName} reposted your post`;
    case "reply":
      return count > 1 ? `${actorLabel} replied to your post` : `${firstName} replied to your post`;
    case "message":
      return count > 1 ? `${actorLabel} messaged you` : `${firstName} sent you a message`;
    default:
      return "";
  }
}

function uniqueUsers(users: NotificationUser[]) {
  const seen = new Set<string>();
  return users.filter((user) => {
    if (seen.has(user.id)) return false;
    seen.add(user.id);
    return true;
  });
}

function getGroupKey(notification: NotificationResponse) {
  if (notification.actionType === "message") {
    return `message:${notification.conversation_id ?? notification.id}`;
  }

  if (notification.actionType === "follow") {
    return "follow";
  }

  return `${notification.actionType}:${notification.post_id ?? notification.id}`;
}

export function stackNotifications(notifications: NotificationResponse[]): NotificationResponse[] {
  const sorted = [...notifications].sort(
    (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );

  const grouped = new Map<string, NotificationResponse[]>();
  for (const notification of sorted) {
    const key = getGroupKey(notification);
    const current = grouped.get(key) ?? [];
    grouped.set(key, [...current, notification]);
  }

  const result: NotificationResponse[] = [];

  for (const group of grouped.values()) {
    const ordered = [...group].sort(
      (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    );
    const latest = ordered[0];
    const users = uniqueUsers(ordered.flatMap((notification) => notification.users));
    const firstName = getNotificationUserName(users[0]);
    const count = ordered.length;

    if (latest.actionType === "message") {
      result.push({
        ...latest,
        type: "single",
        users: users.slice(0, 1),
        message: latest.message || buildMessage(latest.actionType, firstName, 1),
        content: latest.content ?? null,
        time: latest.time ?? null,
      });
      continue;
    }

    const shouldGroup = count > 1;

    result.push({
      ...latest,
      type: shouldGroup ? "grouped" : "single",
      users: shouldGroup ? users : users.slice(0, 1),
      message: shouldGroup ? buildMessage(latest.actionType, firstName, count) : latest.message || buildMessage(latest.actionType, firstName, 1),
      content: latest.content ?? null,
      time: latest.time ?? null,
      is_read: group.every((notification) => notification.is_read),
    });
  }

  return result.sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
}

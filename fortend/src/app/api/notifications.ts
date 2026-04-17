
import { get, put } from './client';
import type { NotificationListResponse } from './types';

// 获取通知列表
export async function getNotifications() {
  return get<NotificationListResponse>('/notifications');
}

// 标记通知已读
export async function markNotificationRead(notificationId: number) {
  return put(`/notifications/${notificationId}/read`);
}


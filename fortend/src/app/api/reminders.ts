
import { get, post, put, del } from './client';
import type {
  ReminderInfo,
  ReminderCreate,
  ReminderUpdate,
  ReminderCompleteRequest,
} from './types';

// 获取提醒列表
export async function getReminders() {
  return get<ReminderInfo[]>('/reminders');
}

// 创建提醒
export async function createReminder(data: ReminderCreate) {
  return post<ReminderInfo>('/reminders', data);
}

// 更新提醒
export async function updateReminder(reminderId: number, data: ReminderUpdate) {
  return put<ReminderInfo>(`/reminders/${reminderId}`, data);
}

// 删除提醒
export async function deleteReminder(reminderId: number) {
  return del(`/reminders/${reminderId}`);
}

// 标记提醒已完成
export async function completeReminder(
  reminderId: number,
  data: ReminderCompleteRequest
) {
  return post(`/reminders/${reminderId}/complete`, data);
}


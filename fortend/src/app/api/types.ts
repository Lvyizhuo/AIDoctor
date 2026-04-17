
// 通用API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

// 用户信息
export interface UserInfo {
  id: number;
  openid: string;
  nickname: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

// 认证响应
export interface AuthResponse {
  token: string;
  user: UserInfo;
}

// 成员信息
export interface MemberBase {
  name: string;
  avatar_url: string | null;
  relationship: string;
  gender: string | null;
  birth_date: string | null;
  blood_type: string | null;
  height: number | null;
  weight: number | null;
  allergies: string | null;
  medical_history: string | null;
  is_self: boolean;
}

export interface MemberCreate extends MemberBase {}

export interface MemberUpdate extends Partial<MemberBase> {}

export interface MemberInfo extends MemberBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface MemberListItem {
  id: number;
  name: string;
  avatar_url: string | null;
  relationship: string;
  age: number | null;
  gender: string | null;
  is_self: boolean;
  created_at: string;
}

// 聊天相关
export interface Attachment {
  type: string;
  url: string;
}

export interface ChatCompletionRequest {
  session_id?: string;
  member_id: string;
  message: string;
  attachments?: Attachment[];
}

export interface ChatMessageInfo {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

export interface ChatCompletionResponse {
  session_id: string;
  message_id: string;
  content: string;
  created_at: string;
}

export interface ChatSessionCreate {
  member_id: string;
}

export interface ChatSessionInfo {
  id: string;
  member_id: number;
  member_name: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionDetail extends ChatSessionInfo {
  messages: ChatMessageInfo[];
}

// 提醒相关
export interface ReminderBase {
  title: string;
  type: string;
  time: string;
  repeat: string;
  enabled: boolean;
  member_id: number | null;
}

export interface ReminderCreate extends ReminderBase {}

export interface ReminderUpdate extends Partial<ReminderBase> {}

export interface ReminderInfo extends ReminderBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface ReminderCompleteRequest {
  time: string;
  date: string;
}

// 通知相关
export interface NotificationInfo {
  id: number;
  title: string;
  content: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  notifications: NotificationInfo[];
  unread_count: number;
  has_more: boolean;
}


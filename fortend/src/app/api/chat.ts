
import { get, post } from './client';
import type {
  ChatSessionInfo,
  ChatSessionDetail,
  ChatSessionCreate,
  ChatCompletionRequest,
  ChatCompletionResponse,
} from './types';

// 创建问诊会话
export async function createChatSession(data: ChatSessionCreate) {
  return post<ChatSessionInfo>('/chat/sessions', data);
}

// 获取问诊会话列表
export async function getChatSessions() {
  return get<ChatSessionInfo[]>('/chat/sessions');
}

// 获取会话详情
export async function getChatSessionDetail(sessionId: string) {
  return get<ChatSessionDetail>(`/chat/sessions/${sessionId}`);
}

// AI对话
export async function chatCompletion(data: ChatCompletionRequest) {
  return post<ChatCompletionResponse>('/chat/completions', data);
}

// 上传检查报告
export async function uploadReport(file: File, memberId?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (memberId) {
    formData.append('member_id', memberId);
  }

  return post('/chat/upload-report', formData, {
    headers: {}, // 不设置Content-Type，让浏览器自动设置
  });
}


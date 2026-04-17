
import { post, get, setToken, removeToken } from './client';
import type { WechatLoginRequest, AuthResponse, UserInfo } from './types';

// 登录状态管理
let currentUser: UserInfo | null = null;

export const getCurrentUser = (): UserInfo | null => currentUser;
export const setCurrentUser = (user: UserInfo | null) => {
  currentUser = user;
};

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return !!currentUser && !!localStorage.getItem('aidoc_token');
};

// 清除认证状态
export const clearAuth = () => {
  removeToken();
  setCurrentUser(null);
};

// 微信登录
export async function wechatLogin(code: string) {
  const response = await post<AuthResponse>('/auth/login', { code });

  if (response.code === 0 && response.data) {
    setToken(response.data.token);
    setCurrentUser(response.data.user);
  }

  return response;
}

// 退出登录
export async function logout() {
  try {
    await post('/auth/logout');
  } catch {
    // 忽略退出登录时的网络错误
  } finally {
    clearAuth();
  }
}

// 获取当前用户信息
export async function getProfile() {
  const response = await get<UserInfo>('/auth/profile');

  if (response.code === 0 && response.data) {
    setCurrentUser(response.data);
  }

  return response;
}


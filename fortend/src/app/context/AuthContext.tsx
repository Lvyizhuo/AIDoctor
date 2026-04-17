
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  getCurrentUser,
  setCurrentUser,
  isAuthenticated as checkAuth,
  getProfile,
  wechatLogin,
  logout as apiLogout,
  clearAuth,
  type UserInfo,
} from '../api';

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化检查认证状态
  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      if (checkAuth()) {
        // 如果本地有token，尝试获取用户信息
        const response = await getProfile();
        if (response.code === 0 && response.data) {
          setUser(response.data);
        } else {
          // Token无效，清除本地认证
          clearAuth();
        }
      }
    } catch (error) {
      console.error('初始化认证失败:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = async (code: string) => {
    setLoading(true);
    try {
      const response = await wechatLogin(code);
      if (response.code !== 0 || !response.data) {
        throw new Error(response.message || '登录失败');
      }
      setUser(response.data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
    } catch (error) {
      console.error('登出API调用失败:', error);
    } finally {
      setUser(null);
      clearAuth();
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getProfile();
      if (response.code === 0 && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 登录拦截Hook
export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // 重定向到登录页，并保存当前路径以便登录后跳转回来
      navigate('/login', { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  return { isAuthenticated, loading };
}

// 登录拦截HOC
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate('/login', { state: { from: location.pathname }, replace: true });
      }
    }, [isAuthenticated, loading, navigate, location]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">加载中...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}


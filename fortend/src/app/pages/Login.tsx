
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Activity } from 'lucide-react';

export default function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 获取登录前的页面路径
  const from = (location.state as any)?.from || '/';

  useEffect(() => {
    // 如果已经认证，跳转到首页或之前的页面
    if (!loading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  const handleMockLogin = async () => {
    setIsLoggingIn(true);
    try {
      // 使用Mock code进行登录（后端会使用Mock微信登录）
      await login('mock_code_' + Date.now());
    } catch (error) {
      console.error('登录失败:', error);
      alert('登录失败，请重试');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Activity className="w-16 h-16 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">AI家庭医生</CardTitle>
          <p className="text-gray-500 mt-2">您的专属健康管理助手</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600 mb-6">
            登录后即可使用AI问诊、健康档案管理等功能
          </div>

          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={handleMockLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                登录中...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>微信一键登录</span>
              </div>
            )}
          </Button>

          <div className="text-center text-xs text-gray-400 mt-4">
            开发环境：点击按钮即可模拟登录
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


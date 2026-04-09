import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Home, FolderHeart, Stethoscope, User, Bell, Plus } from 'lucide-react';
import { cn } from './utils';

export const DarkModeContext = React.createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export default function Root() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/records', icon: FolderHeart, label: '档案' },
    { path: '/consult', icon: Stethoscope, label: '问诊' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  const showFab = location.pathname === '/' || location.pathname === '/records';

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <div className={cn("min-h-screen bg-gray-100 flex items-center justify-center transition-colors duration-300", isDarkMode ? "dark" : "")}>
        {/* Phone Wrapper */}
        <div className="relative w-full max-w-[393px] h-[852px] bg-slate-50 dark:bg-slate-900 overflow-hidden shadow-2xl sm:rounded-[3rem] sm:border-[14px] border-gray-900 flex flex-col font-sans">
          
          {/* Header */}
          <header className="bg-blue-600 h-[80px] w-full flex items-center justify-between px-4 pt-4 z-10 shrink-0 transition-colors">
            <div 
              className="text-white text-2xl font-caveat font-bold tracking-wider cursor-pointer active:opacity-70"
              onClick={toggleDarkMode}
              title="点击切换深色模式"
            >
              FamilyDoctor
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-white relative active:scale-90 transition-transform">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-600"></span>
              </button>
              {location.pathname !== '/profile' && (
                <div 
                  className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white/20 active:scale-95 transition-transform cursor-pointer" 
                  onClick={() => navigate('/profile')}
                >
                  <img src="https://images.unsplash.com/photo-1769961982389-bb243681421a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwcGVyc29uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc1NTU4MDcwfDA&ixlib=rb-4.1.0&q=80&w=150" alt="User" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto pb-28 pt-4 px-4 no-scrollbar relative">
            <Outlet />
          </main>

          {/* FAB */}
          {showFab && (
            <button 
              className="absolute right-4 bottom-24 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-200 z-20"
              aria-label="添加"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}

          {/* Bottom Nav */}
          <nav className="absolute bottom-0 w-full h-[80px] bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex items-center justify-around px-2 z-30 transition-colors">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button 
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center space-y-1 w-16 active:scale-95 transition-transform group"
                >
                  <item.icon className={cn("w-6 h-6 transition-colors", isActive ? "text-blue-600 dark:text-blue-500" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400")} />
                  <span className={cn("text-[10px] font-medium transition-colors", isActive ? "text-blue-600 dark:text-blue-500" : "text-gray-400 dark:text-gray-500")}>{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>
      </div>
    </DarkModeContext.Provider>
  );
}

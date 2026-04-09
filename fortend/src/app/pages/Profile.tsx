import React from 'react';
import { ChevronRight, FileText, ShoppingBag, Heart, Bell, Pill, Activity, Moon, Target, Settings, Shield, HelpCircle, Info, LogOut } from 'lucide-react';
import { cn } from '../utils';

const menuGroups = [
  {
    title: '我的服务',
    items: [
      { icon: FileText, label: '我的问诊', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
      { icon: ShoppingBag, label: '我的订单', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30' },
      { icon: Heart, label: '我的收藏', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30' },
      { icon: Bell, label: '消息通知', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30' },
    ]
  },
  {
    title: '健康管理',
    items: [
      { icon: Pill, label: '用药提醒', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/30' },
      { icon: Activity, label: '运动记录', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30' },
      { icon: Moon, label: '睡眠管理', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
      { icon: Target, label: '健康目标', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/30' },
    ]
  },
  {
    title: '设置与帮助',
    items: [
      { icon: Settings, label: '账号设置', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-slate-700' },
      { icon: Shield, label: '隐私政策', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-slate-700' },
      { icon: HelpCircle, label: '帮助与反馈', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-slate-700' },
      { icon: Info, label: '关于我们', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-slate-700' },
    ]
  }
];

export default function Profile() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-4">
      
      {/* User Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex items-center space-x-4 transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 shadow-inner border-2 border-white dark:border-slate-700 shrink-0 relative z-10">
           <img src="https://images.unsplash.com/photo-1769961982389-bb243681421a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwcGVyc29uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc1NTU4MDcwfDA&ixlib=rb-4.1.0&q=80&w=150" alt="User" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 relative z-10">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white">王小明</h2>
           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: FD8839210</p>
        </div>
        <button className="relative z-10 text-blue-600 dark:text-blue-400 text-sm font-medium bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full active:scale-95 transition-transform">
           编辑资料
        </button>
      </div>

      {/* Menu Groups */}
      {menuGroups.map((group, gIdx) => (
        <section key={gIdx} className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm flex flex-col transition-colors">
          <div className="px-4 pt-3 pb-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{group.title}</h3>
          </div>
          <div className="grid grid-cols-4 gap-2 p-2">
            {group.items.map((item, iIdx) => (
              <button key={iIdx} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 active:scale-95 transition-all group/btn">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-inner transition-colors", item.bg)}>
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 group-hover/btn:text-gray-900 dark:group-hover/btn:text-white">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* Logout Button */}
      <button className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-center space-x-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.98] transition-all group mt-6">
        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-bold">退出登录</span>
      </button>

    </div>
  );
}

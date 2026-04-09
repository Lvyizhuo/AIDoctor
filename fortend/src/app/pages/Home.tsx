import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, ChevronRight, Activity, Stethoscope, Pill, PersonStanding } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

const DoctorIcon = () => (
  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-active:scale-95 transition-transform dark:bg-slate-700 shadow-inner">
    <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
  </div>
);

const RecordIcon = () => (
  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-3 group-active:scale-95 transition-transform dark:bg-blue-900/30 shadow-inner">
    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([
    { id: 1, title: '服用降压药', time: '上午9:00', icon: Pill, done: false },
    { id: 2, title: '晨间运动', time: '步行30分钟', icon: PersonStanding, done: false },
  ]);

  const handleCompleteReminder = (id: number) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, done: true } : r));
    setTimeout(() => {
       setReminders(prev => prev.filter(r => r.id !== id));
    }, 500);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-4">
      {/* Search Bar */}
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-2xl text-base placeholder-gray-400 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
          placeholder="搜索健康问题"
        />
      </div>

      {/* Health Status Card */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col space-y-4 transition-colors">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">健康状况</h2>
          <button className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center active:opacity-70">
            查看详情 <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 divide-x divide-gray-100 dark:divide-slate-700">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold text-blue-600 dark:text-blue-400 leading-tight">98</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">血氧饱和度</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold text-blue-600 dark:text-blue-400 leading-tight">72</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">心率</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold text-blue-600 dark:text-blue-400 leading-tight">36.5°</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">体温</span>
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <section className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate('/ai-consult')} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center group active:scale-95 transition-all">
          <DoctorIcon />
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">智能问诊</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">24小时在线咨询</p>
        </button>
        <button onClick={() => navigate('/records')} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center group active:scale-95 transition-all">
          <RecordIcon />
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">健康档案</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">专业检测报告</p>
        </button>
      </section>

      {/* Today's Reminders */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col space-y-4 overflow-hidden transition-colors">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">今日提醒</h2>
        <div className="flex flex-col space-y-3 relative overflow-hidden">
          <AnimatePresence>
            {reminders.map((reminder) => (
              <motion.div
                key={reminder.id}
                layout
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-xl"
              >
                <div className="absolute inset-0 bg-green-500 rounded-xl flex items-center justify-end pr-6">
                  <span className="text-white font-medium text-sm">已完成</span>
                </div>
                <motion.div
                  drag="x"
                  dragConstraints={{ left: -100, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -60) {
                      handleCompleteReminder(reminder.id);
                    }
                  }}
                  className={cn(
                    "relative bg-gray-50 dark:bg-slate-700 p-4 flex items-center shadow-sm w-full touch-pan-y z-10",
                    reminder.done && "opacity-50"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3 shrink-0">
                    <reminder.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex flex-col pointer-events-none">
                    <span className={cn("text-base font-bold text-gray-900 dark:text-white", reminder.done && "line-through")}>
                      {reminder.title}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{reminder.time}</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          {reminders.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">今日提醒已全部完成</p>
          )}
        </div>
      </section>

      {/* Family Members */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col space-y-4 transition-colors">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">家庭成员</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center active:bg-slate-50 dark:active:bg-slate-700 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3 shrink-0 bg-slate-200">
               <img src="https://images.unsplash.com/photo-1774821171205-4e4b5352666d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1pZGRsZSUyMGFnZWQlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzU2MjY4NDh8MA&ixlib=rb-4.1.0&q=80&w=150" alt="张伟" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-base font-medium text-gray-900 dark:text-white">张伟</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">父亲 | 58岁</span>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-200 dark:border-green-800/50">
              状态良好
            </div>
          </div>
          
          <div className="flex items-center active:bg-slate-50 dark:active:bg-slate-700 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3 shrink-0 bg-slate-200">
               <img src="https://images.unsplash.com/photo-1765248149073-69113caaa253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGVsZGVybHklMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTYyNjg0OHww&ixlib=rb-4.1.0&q=80&w=150" alt="李芳" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-base font-medium text-gray-900 dark:text-white">李芳</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">母亲 | 55岁</span>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-200 dark:border-green-800/50">
              状态良好
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

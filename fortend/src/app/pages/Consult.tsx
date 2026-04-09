import React from 'react';
import { useNavigate } from 'react-router';
import { Stethoscope, Sparkles, HeartPulse, Baby, Brain, Eye, Search, Clock, FileText, Activity, MessageSquare } from 'lucide-react';
import { cn } from '../utils';

const OnlineDoctorIcon = () => (
  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-active:scale-95 transition-transform dark:bg-slate-700 shadow-inner">
    <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
  </div>
);

const AILogo = () => (
  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3 group-active:scale-95 transition-transform dark:bg-indigo-900/30 shadow-inner">
    <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
  </div>
);

const categories = [
  { name: '内科咨询', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  { name: '外科咨询', icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { name: '妇科咨询', icon: HeartPulse, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  { name: '儿科咨询', icon: Baby, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { name: '慢病管理', icon: Clock, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { name: '���经内科', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { name: '眼科咨询', icon: Eye, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { name: '更多科室', icon: Search, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-700' },
];

export default function Consult() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-4">
      
      {/* Consult Services */}
      <section className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate('/ai-consult')} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center group active:scale-95 transition-all">
          <OnlineDoctorIcon />
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">在线问诊</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">24小时医生在线</p>
        </button>
        <button onClick={() => navigate('/ai-consult')} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center group active:scale-95 transition-all">
          <AILogo />
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">AI智能问诊</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">智能症状自查</p>
        </button>
      </section>

      {/* Quick Match */}
      

      {/* Categories */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">问诊分类</h2>
        <div className="grid grid-cols-4 gap-y-5 gap-x-2">
          {categories.map((cat, i) => (
            <button key={i} className="flex flex-col items-center justify-center space-y-2 group active:scale-90 transition-transform">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors", cat.bg)}>
                <cat.icon className={cn("w-6 h-6", cat.color)} />
              </div>
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* My Consults History */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">我的问诊</h2>
          <button className="text-blue-600 dark:text-blue-400 text-xs font-medium active:opacity-70">查看全部订单</button>
        </div>
        
        <div className="flex flex-col space-y-3">
          {/* Item 1 */}
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl flex items-start space-x-3 cursor-pointer active:scale-95 transition-transform border border-gray-100 dark:border-slate-600">
             <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center mb-1">
                 <h4 className="text-sm font-bold text-gray-900 dark:text-white">图文问诊 - 李医生 (内科)</h4>
                 <span className="text-green-600 bg-green-100 dark:bg-green-900/30 py-0.5 rounded-full font-medium text-[10px] px-3 whitespace-nowrap">待回复</span>
               </div>
               <p className="text-xs text-gray-500 dark:text-gray-400 truncate">您好，我最近经常感觉胸闷气短，有时还伴随...</p>
               <span className="text-[10px] text-gray-400 mt-2 block">今天 10:30</span>
             </div>
          </div>

          {/* Item 2 */}
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl flex items-start space-x-3 cursor-pointer active:scale-95 transition-transform border border-gray-100 dark:border-slate-600">
             <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center mb-1">
                 <h4 className="text-sm font-bold text-gray-900 dark:text-white">极速问诊 - 王医生 (外科)</h4>
                 <span className="text-[10px] text-gray-500 bg-gray-200 dark:bg-slate-600 px-3 py-0.5 rounded-full font-medium whitespace-nowrap">已完成</span>
               </div>
               <p className="text-xs text-gray-500 dark:text-gray-400 truncate">医生建议：按时涂抹药膏，注意保持伤口干燥...</p>
               <span className="text-[10px] text-gray-400 mt-2 block">2026-04-05 14:20</span>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}

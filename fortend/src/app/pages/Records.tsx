import React from 'react';
import { Search, Activity, FileText, ChevronRight } from 'lucide-react';
import { cn } from '../utils';

const RecordIcon = () => (
  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-3 group-active:scale-95 transition-transform dark:bg-blue-900/30 shadow-inner">
    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
  </div>
);

const ReportIcon = () => (
  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-3 group-active:scale-95 transition-transform dark:bg-blue-900/30 shadow-inner">
    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
  </div>
);

export default function Records() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-4">
      {/* Search Bar */}
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-2xl text-base placeholder-gray-400 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
          placeholder="搜索家人/健康档案"
        />
      </div>

      {/* My Family List */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col space-y-4 transition-colors">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">我的家人</h2>
        </div>
        <div className="flex flex-col space-y-4">
          
          {/* Member 1 */}
          <div className="flex items-center active:bg-slate-50 dark:active:bg-slate-700 p-2 -mx-2 rounded-xl transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3 shrink-0 bg-slate-200">
               <img src="https://images.unsplash.com/photo-1774821171205-4e4b5352666d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1pZGRsZSUyMGFnZWQlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzU2MjY4NDh8MA&ixlib=rb-4.1.0&q=80&w=150" alt="张伟" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-base font-bold text-gray-900 dark:text-white">张伟</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">父亲 | 58岁</span>
                <span className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded text-[10px] font-medium border border-red-100 dark:border-red-800/50">
                  血压偏高
                </span>
              </div>
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity active:opacity-70">
              查看详情 <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-slate-700 w-full"></div>
          
          {/* Member 2 */}
          <div className="flex items-center active:bg-slate-50 dark:active:bg-slate-700 p-2 -mx-2 rounded-xl transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3 shrink-0 bg-slate-200">
               <img src="https://images.unsplash.com/photo-1765248149073-69113caaa253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGVsZGVybHklMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTYyNjg0OHww&ixlib=rb-4.1.0&q=80&w=150" alt="李芳" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-base font-bold text-gray-900 dark:text-white">李芳</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">母亲 | 55岁</span>
                <span className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-medium border border-green-100 dark:border-green-800/50">
                  血糖正常
                </span>
              </div>
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity active:opacity-70">
              查看详情 <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-slate-700 w-full"></div>

          {/* Member 3 */}
          <div className="flex items-center active:bg-slate-50 dark:active:bg-slate-700 p-2 -mx-2 rounded-xl transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3 shrink-0 bg-slate-200">
               <img src="https://images.unsplash.com/photo-1769961982389-bb243681421a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwcGVyc29uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc1NTU4MDcwfDA&ixlib=rb-4.1.0&q=80&w=150" alt="本人" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-base font-bold text-gray-900 dark:text-white">王小明</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">本人 | 28岁</span>
                <span className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-medium border border-green-100 dark:border-green-800/50">
                  健康良好
                </span>
              </div>
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity active:opacity-70">
              查看详情 <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>

        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-2 gap-4">
        <button className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center group active:scale-95 transition-all">
          <RecordIcon />
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">健康档案总览</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">全方位健康数据</p>
        </button>
        <button className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center group active:scale-95 transition-all">
          <ReportIcon />
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">体检报告管理</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">历年报告对比</p>
        </button>
      </section>
    </div>
  );
}

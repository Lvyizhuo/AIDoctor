import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, MoreHorizontal, X, Mic, Plus, FileText, Image, Sparkles } from 'lucide-react';
import { cn } from '../utils';

const AssistantAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
    <Sparkles className="w-5 h-5 text-white" />
  </div>
);

export default function AIConsult() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-sans">
      <div className="relative w-full max-w-[393px] h-[852px] bg-[#F4F7FB] dark:bg-slate-900 overflow-hidden shadow-2xl sm:rounded-[3rem] sm:border-[14px] border-gray-900 flex flex-col">
        
        {/* Header */}
        <header className="bg-blue-600 h-[80px] w-full flex items-center justify-between px-4 pt-4 shrink-0 z-20">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white active:opacity-70 transition-opacity">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h1 className="text-white text-lg font-bold">AI智能问诊</h1>
          
          <div className="flex items-center space-x-3 bg-black/10 rounded-full px-3 py-1 border border-white/20">
            <button className="text-white active:opacity-70">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <div className="w-px h-4 bg-white/30"></div>
            <button onClick={() => navigate(-1)} className="text-white active:opacity-70">
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10">
          
          {/* Message 1: Welcome */}
          <div className="flex items-start space-x-3 max-w-[90%] animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AssistantAvatar />
            <div className="flex flex-col space-y-1">
              <div className="bg-blue-50 dark:bg-blue-900/40 rounded-2xl rounded-tl-sm p-4 shadow-sm border border-blue-100 dark:border-blue-800/50 relative">
                <p className="text-[15px] text-gray-800 dark:text-gray-200 leading-relaxed">
                  <span className="font-bold block mb-2 text-gray-900 dark:text-white">Hey，我是FamilyDoctor小助👋</span>
                  您好！我是基于医助大模型打造的智能导诊助手。为了帮您推荐最合适的科室，我需要了解一些基本信息，这样我可以更准确地为您提供帮助。
                </p>
                <div className="mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-700/50">
                   <span className="text-[10px] text-blue-400 dark:text-blue-500 font-medium">泛喜健康科技提供</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message 2: Question */}
          <div className="flex items-start space-x-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 fill-mode-backwards">
            <AssistantAvatar />
            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100 dark:border-slate-700">
              <p className="text-[15px] text-gray-800 dark:text-gray-200">
                请问，您主要有哪些不适？
              </p>
            </div>
          </div>

        </main>

        {/* Input Area */}
        <footer className="bg-[#F8FAFC] dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-4 shrink-0 pb-8 z-20">
          
          {/* Quick Actions */}
          <div className="flex mb-3">
            <button className="flex items-center space-x-1.5 bg-white dark:bg-slate-700 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-xs font-medium shadow-sm active:scale-95 transition-transform">
              <FileText className="w-3.5 h-3.5" />
              <span>上传检查检验报告</span>
            </button>
          </div>

          {/* Input Box */}
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 active:scale-95 transition-transform">
              <Mic className="w-5 h-5" />
            </button>
            
            <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-full px-4 py-2.5 flex items-center shadow-sm">
              <input 
                type="text" 
                placeholder="请输入您要回复的内容" 
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 active:scale-95 transition-transform">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}

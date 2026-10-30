import React from 'react';
import {
  BarChart3,
  Database,
  BrainCircuit,
  LineChart,
  Target,
  Settings as SettingsIcon,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useBI } from '../../context/BIContext';
import { NavigationTab } from '../../types/bi';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeDataset,
    allDatasets,
    setActiveDataset,
    isGeminiActive,
  } = useBI();

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'datasources', label: 'Data Sources', icon: Database },
    { id: 'analyst', label: 'AI Analyst', icon: BrainCircuit },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'forecasting', label: 'Forecasting', icon: Target },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/80 backdrop-blur-md h-screen sticky top-0 z-30 transition-colors">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-850">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              InsightFlow
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              AI Business Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Selector Drawer */}
      <div className="px-3 pt-4 pb-2">
        <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 block mb-1.5">
          Active Dataset
        </label>
        <div className="relative">
          <select
            value={activeDataset.id}
            onChange={(e) => {
              const selected = allDatasets.find((d) => d.id === e.target.value);
              if (selected) setActiveDataset(selected);
            }}
            aria-label="Select active business dataset"
            className="w-full text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-2 pr-7 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            {allDatasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
        </div>
        <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span>{activeDataset.rowCount.toLocaleString()} records</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>{activeDataset.badge}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 pb-1.5">
          Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.id === 'analyst' && (
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Model & Copilot Footer */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-850">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Copilot Engine
            </span>
            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">
              {isGeminiActive ? 'gemini-3.8-flash' : 'offline-bi'}
            </span>
          </div>
          <div className="text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{isGeminiActive ? 'Gemini API Connected' : 'Heuristic Engine Ready'}</span>
          </div>
          <button
            onClick={() => setActiveTab('analyst')}
            className="mt-2 w-full flex items-center justify-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 pt-1 transition-colors border-t border-slate-100 dark:border-slate-800/80"
          >
            <span>Ask Analyst a Question</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};

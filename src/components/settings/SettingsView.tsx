import React from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Coins,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Download,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useBI } from '../../context/BIContext';

export const SettingsView: React.FC = () => {
  const {
    theme,
    toggleTheme,
    currency,
    setCurrency,
    isGeminiActive,
    activeDataset,
  } = useBI();

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
          Workspace Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure visual appearance, localization metrics, and copilot engine parameters.
        </p>
      </div>

      {/* Visual Appearance & Theme */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Interface Color Theme
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose between deep slate dark theme or high-contrast clean light theme
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark Slate</span>
            </button>
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Clean Light</span>
            </button>
          </div>
        </div>

        {/* Currency Denomination */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Currency Denomination
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Standardize revenue and contract formatting across all charts and cards
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(
              [
                { id: 'USD', label: 'USD ($)' },
                { id: 'EUR', label: 'EUR (€)' },
                { id: 'GBP', label: 'GBP (£)' },
                { id: 'JPY', label: 'JPY (¥)' },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                onClick={() => setCurrency(c.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  currency === c.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Copilot & Backend Security Status */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-4">
        <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-500" />
          AI Architecture & Server Security
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-850 flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isGeminiActive ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}
                />
                <span>Active Model: {isGeminiActive ? 'Google Gemini 3.8 Flash' : 'Built-in Intelligence Copilot'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {isGeminiActive
                  ? 'Connected via secure server-side Express proxy using @google/genai SDK.'
                  : 'Operating in self-contained deterministic intelligence mode. Injects realistic executive analytics.'}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {isGeminiActive ? 'API Active' : 'Fallback Ready'}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-850 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-semibold text-slate-900 dark:text-white">
                Zero Client Key Exposure
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                All Gemini API calls are securely proxied via server.ts. Browser bundles never receive
                or store API secrets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Storage & Data Hygiene */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-500" />
          Active Ingestion Metadata
        </h3>
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <div>
            Dataset ID: <span className="font-mono text-slate-900 dark:text-white">{activeDataset.id}</span>
          </div>
          <div>
            Total Records Ingested: <span className="font-mono text-slate-900 dark:text-white">{activeDataset.rowCount.toLocaleString()}</span>
          </div>
          <div>
            Data Schema: <span className="font-mono text-slate-900 dark:text-white">{activeDataset.columns.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Sun, Moon, Download, PlusCircle, RefreshCw } from 'lucide-react';
import { useBI } from '../../context/BIContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    dateRange,
    setDateRange,
    activeDataset,
  } = useBI();

  const tabTitles: Record<string, string> = {
    overview: 'Executive Performance Overview',
    datasources: 'Data Sources & Ingestion',
    analyst: 'AI Intelligence Copilot',
    analytics: 'Segment & Cohort Analytics',
    forecasting: 'Predictive Revenue Scenarios',
    settings: 'Workspace Configuration',
  };

  const handleExportData = () => {
    // Generate simple CSV download of current active dataset records
    if (!activeDataset.records || activeDataset.records.length === 0) return;
    const headers = Object.keys(activeDataset.records[0]);
    const csvContent = [
      headers.join(','),
      ...activeDataset.records.map((row) =>
        headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeDataset.id}-export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="h-16 px-6 border-b border-slate-200 dark:border-slate-850 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-8 transition-colors">
      {/* Zone 1: Contextual Breadcrumbs */}
      <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          InsightFlow
        </span>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <h1 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
          {tabTitles[activeTab] || 'Dashboard'}
        </h1>
      </div>

      {/* Zone 2: Date Range Segmented Filter Controls */}
      <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
        {(
          [
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
            { id: 'ytd', label: 'YTD Trailing' },
            { id: '12m', label: '12 Months' },
          ] as const
        ).map((range) => {
          const isSelected = dateRange === range.id;
          return (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {range.label}
            </button>
          );
        })}
      </div>

      {/* Zone 3: Actions & Utility Buttons */}
      <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
        {/* Quick CSV upload action if not on data sources */}
        {activeTab !== 'datasources' && (
          <button
            onClick={() => setActiveTab('datasources')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload Data</span>
          </button>
        )}

        {/* Export Data Button */}
        <button
          onClick={handleExportData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors shadow-xs"
          title="Export CSV data"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};

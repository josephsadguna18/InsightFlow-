import React from 'react';
import { BIProvider, useBI } from './context/BIContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/dashboard/OverviewView';
import { DataSourcesView } from './components/datasources/DataSourcesView';
import { AIAnalystView } from './components/analyst/AIAnalystView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ForecastingView } from './components/forecasting/ForecastingView';
import { SettingsView } from './components/settings/SettingsView';

const AppContent: React.FC = () => {
  const { activeTab } = useBI();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'datasources':
        return <DataSourcesView />;
      case 'analyst':
        return <AIAnalystView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'forecasting':
        return <ForecastingView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {renderActiveView()}
        </main>

        {/* Quiet Clean Footer */}
        <footer className="px-6 py-4 border-t border-slate-200 dark:border-slate-850 bg-white/50 dark:bg-slate-950/50 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            InsightFlow AI Business Intelligence Copilot · High-Density Analytics Engine
          </div>
          <div className="flex items-center gap-4">
            <span>Server Proxy Verified</span>
            <span>·</span>
            <span>Zero Client Key Exposure</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BIProvider>
      <AppContent />
    </BIProvider>
  );
}

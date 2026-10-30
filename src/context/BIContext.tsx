import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavigationTab,
  Dataset,
  ForecastControls,
  AnalystMessage,
  ActivityEvent,
} from '../types/bi';
import { sampleDatasets, saasDataset, initialRecentActivity } from '../data/sampleDatasets';

interface BIContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeDataset: Dataset;
  setActiveDataset: (dataset: Dataset) => void;
  allDatasets: Dataset[];
  addCustomDataset: (dataset: Dataset) => void;
  deleteDataset: (id: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  dateRange: '30d' | '90d' | 'ytd' | '12m';
  setDateRange: (range: '30d' | '90d' | 'ytd' | '12m') => void;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  setCurrency: (c: 'USD' | 'EUR' | 'GBP' | 'JPY') => void;
  currencySymbol: string;
  formatCurrency: (val: number) => string;
  formatCompactNumber: (val: number) => string;
  forecastControls: ForecastControls;
  updateForecastControls: (updates: Partial<ForecastControls>) => void;
  resetForecastControls: () => void;
  analystMessages: AnalystMessage[];
  sendAnalystQuery: (query: string) => Promise<void>;
  isAnalystLoading: boolean;
  clearAnalystChat: () => void;
  recentActivity: ActivityEvent[];
  isGeminiActive: boolean;
}

const BIContext = createContext<BIContextType | undefined>(undefined);

export const BIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [allDatasets, setAllDatasets] = useState<Dataset[]>(sampleDatasets);
  const [activeDataset, setActiveDataset] = useState<Dataset>(saasDataset);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [dateRange, setDateRange] = useState<'30d' | '90d' | 'ytd' | '12m'>('12m');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'JPY'>('USD');
  const [isGeminiActive, setIsGeminiActive] = useState<boolean>(false);

  // Forecasting scenario configuration
  const defaultForecastControls: ForecastControls = {
    horizonMonths: 6,
    growthAdjustmentPercent: 12,
    retentionSensitivityPercent: 2,
    expansionFactor: 1.15,
    scenarioMode: 'balanced',
  };
  const [forecastControls, setForecastControls] = useState<ForecastControls>(defaultForecastControls);

  // AI Analyst state
  const [analystMessages, setAnalystMessages] = useState<AnalystMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      timestamp: 'Just now',
      text: "Welcome to InsightFlow. I'm your AI Business Intelligence Copilot. I've preloaded your SaaS Multi-Channel Growth dataset. Ask me anything about your revenue run-rate, churn dynamics, customer acquisition payback, or forward projections.",
      analysis: {
        summary: 'Your SaaS recurring revenue is pacing at $1.69M with an accelerating 18.4% YoY trajectory and 75% gross margins.',
        keyTakeaways: [
          'Enterprise tier accounts for 46.5% of annual contract volume with lowest churn (0.8%).',
          'Organic Search & Product-Led channel delivers the highest ROI ($232 ARPU vs $95 CAC).',
          'Forward P50 forecast projects reaching $2.14M annualized run-rate over the next 6 months.',
        ],
        recommendedActions: [
          'Double down on organic content and product-led onboarding to expand top-of-funnel.',
          'Introduce annual prepaid incentive (15% discount) to lock in enterprise expansion cash flow.',
        ],
        chartData: [
          { label: 'Organic', value: 642000, benchmark: 510000 },
          { label: 'Outbound', value: 456000, benchmark: 420000 },
          { label: 'Paid Search', value: 338000, benchmark: 310000 },
          { label: 'Partners', value: 168000, benchmark: 140000 },
        ],
        chartTitle: 'Current Channel Revenue vs Target Benchmark',
      },
    },
  ]);
  const [isAnalystLoading, setIsAnalystLoading] = useState<boolean>(false);
  const [recentActivity] = useState<ActivityEvent[]>(initialRecentActivity);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  // Check health endpoint for Gemini configuration status
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setIsGeminiActive(Boolean(data?.geminiConfigured));
      })
      .catch(() => {
        setIsGeminiActive(false);
      });
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };
  const currencySymbol = currencySymbols[currency] || '$';

  const formatCurrency = (val: number): string => {
    if (val === undefined || val === null || isNaN(val)) return `${currencySymbol}0`;
    return `${currencySymbol}${Math.round(val).toLocaleString()}`;
  };

  const formatCompactNumber = (val: number): string => {
    if (val === undefined || val === null || isNaN(val)) return '0';
    if (Math.abs(val) >= 1_000_000) {
      return `${currencySymbol}${(val / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(val) >= 1_000) {
      return `${currencySymbol}${(val / 1_000).toFixed(1)}K`;
    }
    return `${currencySymbol}${val.toFixed(0)}`;
  };

  const addCustomDataset = (dataset: Dataset) => {
    setAllDatasets((prev) => [dataset, ...prev]);
    setActiveDataset(dataset);
    setActiveTab('overview');
  };

  const deleteDataset = (id: string) => {
    setAllDatasets((prev) => {
      const remaining = prev.filter((d) => d.id !== id);
      if (activeDataset.id === id && remaining.length > 0) {
        setActiveDataset(remaining[0]);
      }
      return remaining;
    });
  };

  const updateForecastControls = (updates: Partial<ForecastControls>) => {
    setForecastControls((prev) => ({ ...prev, ...updates }));
  };

  const resetForecastControls = () => {
    setForecastControls(defaultForecastControls);
  };

  const clearAnalystChat = () => {
    setAnalystMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: `Session reset for ${activeDataset.name}. Ask any question regarding your current dataset metrics, cohort performance, or future simulations.`,
      },
    ]);
  };

  const sendAnalystQuery = async (query: string) => {
    if (!query.trim()) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: AnalystMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setAnalystMessages((prev) => [...prev, userMsg]);
    setIsAnalystLoading(true);

    try {
      const response = await fetch('/api/analyst/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          datasetSummary: activeDataset.summary,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: AnalystMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data?.analysis?.summary || 'Analysis completed.',
        source: data?.source,
        model: data?.model,
        analysis: data?.analysis,
      };

      setAnalystMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Failed to query analyst API:', err);
      // Fallback message
      const fallbackMsg: AnalystMessage = {
        id: `asst-fallback-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Analysis for "${query}": Trailing performance on ${activeDataset.name} shows strong traction with $${activeDataset.summary.totalRevenue.toLocaleString()} in total revenue and ${activeDataset.summary.grossMargin}% gross margin.`,
        source: 'heuristic',
        analysis: {
          summary: `Current dataset metrics indicate ${activeDataset.summary.growthRate}% annual velocity across ${activeDataset.summary.topChannels.length} distribution channels.`,
          keyTakeaways: [
            `Top revenue channel represents ${(activeDataset.summary.topChannels[0]?.share || 40)}% of total volume.`,
            `Unit economics yield an average transaction size of $${activeDataset.summary.aov.toFixed(2)}.`,
            `Regional diversification shows strongest traction in ${activeDataset.summary.regionalData[0]?.region || 'North America'}.`,
          ],
          recommendedActions: [
            'Concentrate expansion capital on channels generating highest LTV:CAC.',
            'Monitor month-over-month cohort retention curves for early churn signs.',
          ],
          chartData: activeDataset.summary.topChannels.map((c) => ({
            label: c.name.split(' ')[0],
            value: c.value,
            benchmark: Math.round(c.value * 0.85),
          })),
          chartTitle: 'Channel Revenue Contribution vs Benchmark',
        },
      };
      setAnalystMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAnalystLoading(false);
    }
  };

  return (
    <BIContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeDataset,
        setActiveDataset,
        allDatasets,
        addCustomDataset,
        deleteDataset,
        theme,
        toggleTheme,
        dateRange,
        setDateRange,
        currency,
        setCurrency,
        currencySymbol,
        formatCurrency,
        formatCompactNumber,
        forecastControls,
        updateForecastControls,
        resetForecastControls,
        analystMessages,
        sendAnalystQuery,
        isAnalystLoading,
        clearAnalystChat,
        recentActivity,
        isGeminiActive,
      }}
    >
      {children}
    </BIContext.Provider>
  );
};

export const useBI = () => {
  const context = useContext(BIContext);
  if (!context) {
    throw new Error('useBI must be used within a BIProvider');
  }
  return context;
};

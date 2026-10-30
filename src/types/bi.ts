export type NavigationTab =
  | 'overview'
  | 'datasources'
  | 'analyst'
  | 'analytics'
  | 'forecasting'
  | 'settings';

export interface KPICardData {
  key: string;
  title: string;
  value: number;
  formattedValue: string;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  periodLabel: string;
  sparkline: number[];
  description: string;
  prefix?: string;
  suffix?: string;
}

export interface ChannelPerformance {
  name: string;
  value: number;
  orders: number;
  share: number;
  growth: number;
}

export interface CategoryPerformance {
  name: string;
  revenue: number;
  units: number;
  marginPercent: number;
  status: 'High Growth' | 'Stable' | 'At Risk' | 'Optimal';
}

export interface RegionalPerformance {
  region: string;
  revenue: number;
  share: number;
  growth: number;
  topCity: string;
}

export interface MonthlyTrendPoint {
  month: string;
  revenue: number;
  profit: number;
  orders: number;
  cost: number;
  churnRate?: number;
}

export interface DatasetSummary {
  name: string;
  totalRevenue: number;
  grossProfit: number;
  grossMargin: number;
  totalOrders: number;
  aov: number;
  growthRate: number;
  topChannels: ChannelPerformance[];
  topCategories: CategoryPerformance[];
  regionalData: RegionalPerformance[];
  monthlyTrend: MonthlyTrendPoint[];
  recentTrends: string[];
}

export interface Dataset {
  id: string;
  name: string;
  badge: string;
  description: string;
  category: 'saas' | 'ecommerce' | 'sales' | 'custom';
  rowCount: number;
  columns: string[];
  records: Record<string, any>[];
  summary: DatasetSummary;
  isCustom?: boolean;
  uploadedAt?: string;
  fileSize?: string;
}

export interface ForecastPoint {
  period: string;
  historical?: number | null;
  baseline: number;
  optimistic: number;
  conservative: number;
  isForecast: boolean;
  confidenceBandLower?: number;
  confidenceBandUpper?: number;
}

export interface ForecastControls {
  horizonMonths: number;
  growthAdjustmentPercent: number; // e.g. -10% to +30%
  retentionSensitivityPercent: number;
  expansionFactor: number;
  scenarioMode: 'balanced' | 'aggressive' | 'conservative';
}

export interface AnalystMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  source?: 'gemini' | 'heuristic';
  model?: string;
  analysis?: {
    summary: string;
    keyTakeaways: string[];
    recommendedActions: string[];
    chartData?: Array<{ label: string; value: number; benchmark?: number }>;
    chartTitle?: string;
  };
  isThinking?: boolean;
}

export interface ActivityEvent {
  id: string;
  title: string;
  category: 'growth' | 'alert' | 'milestone' | 'retention';
  timestamp: string;
  metricChange: string;
  impact: 'positive' | 'neutral' | 'negative';
}

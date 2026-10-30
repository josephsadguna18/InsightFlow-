import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  ShoppingCart,
  Users,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Globe,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useBI } from '../../context/BIContext';

export const OverviewView: React.FC = () => {
  const {
    activeDataset,
    formatCurrency,
    formatCompactNumber,
    setActiveTab,
    theme,
    recentActivity,
  } = useBI();

  const [chartMetric, setChartMetric] = useState<'revenue' | 'profit' | 'orders'>('revenue');

  const summary = activeDataset.summary;
  const isDark = theme === 'dark';

  // KPI cards data definition
  const kpiCards = [
    {
      title: 'Total Revenue',
      value: summary.totalRevenue,
      formatted: formatCurrency(summary.totalRevenue),
      change: `+${summary.growthRate}%`,
      trend: 'up',
      period: 'vs. trailing period',
      subtext: `Target: ${formatCurrency(summary.totalRevenue * 1.05)}`,
      icon: DollarSign,
      color: 'indigo',
    },
    {
      title: 'Gross Profit',
      value: summary.grossProfit,
      formatted: formatCurrency(summary.grossProfit),
      change: `${summary.grossMargin}% Margin`,
      trend: 'up',
      period: '75% margin efficiency',
      subtext: `Cost: ${formatCurrency(summary.totalRevenue - summary.grossProfit)}`,
      icon: PieChartIcon,
      color: 'emerald',
    },
    {
      title: activeDataset.category === 'saas' ? 'Active Accounts' : 'Total Orders',
      value: summary.totalOrders,
      formatted: summary.totalOrders.toLocaleString(),
      change: '+14.2%',
      trend: 'up',
      period: 'volume velocity',
      subtext: '482 new this quarter',
      icon: ShoppingCart,
      color: 'cyan',
    },
    {
      title: activeDataset.category === 'saas' ? 'Average Revenue / ARPU' : 'Average Order Value',
      value: summary.aov,
      formatted: formatCurrency(summary.aov),
      change: '+6.8%',
      trend: 'up',
      period: 'basket expansion',
      subtext: 'Up from $219.00',
      icon: Users,
      color: 'violet',
    },
  ];

  const channelColors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Dataset Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Active Ingestion:
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {activeDataset.name}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {summary.monthlyTrend.length} Months Trailing
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {activeDataset.description}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('analyst')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Executive Brief</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white tracking-tight">
                  {card.formatted}
                </div>
                <div className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  <span>{card.change}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <span>{card.period}</span>
                <span className="font-mono text-slate-400">{card.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trailing Revenue & Profit Performance (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Revenue & Profit Trajectory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                12-month performance curve with cost margin separation
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start sm:self-auto">
              {(['revenue', 'profit', 'orders'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setChartMetric(m)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                    chartMetric === m
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={summary.monthlyTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDark ? '#1e293b' : '#f1f5f9'}
                />
                <XAxis
                  dataKey="month"
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
                />
                <YAxis
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) =>
                    chartMetric === 'orders' ? val : formatCompactNumber(val)
                  }
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-lg border border-slate-700 shadow-xl text-xs space-y-1">
                          <div className="font-semibold text-slate-300 mb-1">{label} Overview</div>
                          <div className="flex justify-between gap-4">
                            <span className="text-indigo-400">Revenue:</span>
                            <span className="font-mono">{formatCurrency(data.revenue)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-emerald-400">Gross Profit:</span>
                            <span className="font-mono">{formatCurrency(data.profit)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Operating Cost:</span>
                            <span className="font-mono">{formatCurrency(data.cost)}</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
                            <span className="text-slate-300">Volume:</span>
                            <span className="font-mono">{data.orders.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {chartMetric === 'revenue' && (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                )}
                {chartMetric === 'profit' && (
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#profitGrad)"
                  />
                )}
                {chartMetric === 'orders' && (
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                Gross Margin
              </span>
            </div>
            <span>Annual Run-Rate: {formatCurrency(summary.totalRevenue * 1.08)}</span>
          </div>
        </div>

        {/* Channel & Acquisition Breakdown (1 Col) */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Acquisition Channels
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Revenue contribution by source
                </p>
              </div>
            </div>

            <div className="space-y-3.5 my-2">
              {summary.topChannels.map((channel, idx) => (
                <div key={channel.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[170px]">
                      {channel.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-900 dark:text-white font-medium">
                        {formatCompactNumber(channel.value)}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        ({channel.share}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${channel.share}%`,
                        backgroundColor: channelColors[idx % channelColors.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Leading: {summary.topChannels[0]?.name.split(' ')[0]}</span>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              Deep Cohorts
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Regional Performance + Top Categories + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Performance */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-400" />
                Regional Markets
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Territory volume & growth
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {summary.regionalData.map((reg) => (
              <div
                key={reg.region}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {reg.region}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Hub: {reg.topCity}</span>
                    <span>·</span>
                    <span>{reg.share}% share</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-slate-900 dark:text-white">
                    {formatCompactNumber(reg.revenue)}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    +{reg.growth}% YoY
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products / Plan Tiers */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Top Products & Plans
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Segment profitability & status
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {summary.topCategories.map((cat) => (
              <div
                key={cat.name}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                    {cat.name}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                      cat.status === 'High Growth'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                  <span>{cat.units.toLocaleString()} units</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{cat.marginPercent}% margin</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatCompactNumber(cat.revenue)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Business Activity Feed */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Recent Intelligence Activity
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automated metric signals & audits
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {recentActivity.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-850 last:border-b-0 last:pb-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      evt.impact === 'positive'
                        ? 'bg-emerald-500'
                        : evt.impact === 'negative'
                        ? 'bg-rose-500'
                        : 'bg-indigo-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {evt.title}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                      <span>{evt.timestamp}</span>
                      <span className="font-mono text-slate-600 dark:text-slate-300 font-medium">
                        {evt.metricChange}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('forecasting')}
            className="mt-4 w-full py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Simulate Forward Trajectory</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

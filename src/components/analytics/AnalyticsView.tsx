import React, { useState } from 'react';
import {
  TrendingUp,
  Filter,
  Layers,
  ArrowUpDown,
  PieChart,
  BarChart3,
  Percent,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import { useBI } from '../../context/BIContext';

export const AnalyticsView: React.FC = () => {
  const { activeDataset, formatCurrency, formatCompactNumber, theme } = useBI();
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [sortField, setSortField] = useState<'value' | 'growth' | 'orders'>('value');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const summary = activeDataset.summary;
  const isDark = theme === 'dark';

  const channels = summary.topChannels;
  const filteredChannels =
    selectedChannel === 'all'
      ? channels
      : channels.filter((c) => c.name.toLowerCase().includes(selectedChannel.toLowerCase()));

  const sortedChannels = [...filteredChannels].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortAsc ? valA - valB : valB - valA;
  });

  const toggleSort = (field: 'value' | 'growth' | 'orders') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Overview Card */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Multi-Dimensional Performance Attribution
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evaluating channel ROI, product margins, and customer cohort longevity across {activeDataset.name}
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
            {['all', 'Organic', 'Paid', 'Outbound', 'Partner'].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedChannel === ch
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {ch === 'all' ? 'All Channels' : ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Channel Volume vs Transaction Orders
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gross sales volume compared with volume counts
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedChannels.map((c) => ({
                  name: c.name.split(' ')[0],
                  revenue: c.value,
                  orders: c.orders,
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDark ? '#1e293b' : '#f1f5f9'}
                />
                <XAxis dataKey="name" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <YAxis
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => formatCompactNumber(v)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-lg border border-slate-700 shadow-xl text-xs space-y-1">
                          <div className="font-semibold text-slate-300">{label}</div>
                          <div className="text-indigo-400 font-mono">
                            Revenue: {formatCurrency(payload[0]?.value as number)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profitability Efficiency Card */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              Unit Economics Health
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Key enterprise efficiency benchmarks
            </p>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">LTV to CAC Ratio</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">3.8x</span>
                </div>
                <div className="text-[11px] text-slate-400">Target $\ge 3.0$x for healthy SaaS scale</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">CAC Payback Time</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">6.2 Months</span>
                </div>
                <div className="text-[11px] text-slate-400">Optimal recovery window (&lt; 12 months)</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Gross Margin Ratio</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {summary.grossMargin}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Industry peer median: 68.0%</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            Validated against SaaS Capital benchmark indices
          </div>
        </div>
      </div>

      {/* Attribution Detail Table */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Channel Attribution Ledger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click column headers to sort by volume, share, or growth rate
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-medium">
              <tr>
                <th className="px-4 py-3">Channel Name</th>
                <th
                  onClick={() => toggleSort('value')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Revenue Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('orders')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Transactions / Accounts</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Revenue Share</th>
                <th
                  onClick={() => toggleSort('growth')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>YoY Velocity</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedChannels.map((channel) => (
                <tr
                  key={channel.name}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                    {channel.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300 font-medium">
                    {formatCurrency(channel.value)}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                    {channel.orders.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                    {channel.share}%
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    +{channel.growth}%
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Efficient
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

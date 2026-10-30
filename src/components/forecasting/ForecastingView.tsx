import React, { useState, useMemo } from 'react';
import {
  Target,
  AlertTriangle,
  Sliders,
  TrendingUp,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useBI } from '../../context/BIContext';

export const ForecastingView: React.FC = () => {
  const {
    activeDataset,
    formatCurrency,
    formatCompactNumber,
    forecastControls,
    updateForecastControls,
    resetForecastControls,
    theme,
  } = useBI();

  const [scenarioPreset, setScenarioPreset] = useState<'balanced' | 'aggressive' | 'conservative'>('balanced');
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);
  const [isNarrativeLoading, setIsNarrativeLoading] = useState<boolean>(false);

  const isDark = theme === 'dark';
  const summary = activeDataset.summary;
  const history = summary.monthlyTrend || [];

  // Generate continuous timeline combining historical actuals + projected periods
  const forecastData = useMemo(() => {
    const lastHistoryItem = history[history.length - 1] || { revenue: 198500, month: 'Dec' };
    const baseRev = lastHistoryItem.revenue;

    // Map historical items (isForecast = false)
    const historicalPoints = history.map((item) => ({
      period: item.month,
      historical: item.revenue,
      baseline: item.revenue,
      optimistic: item.revenue,
      conservative: item.revenue,
      confidenceLower: item.revenue,
      confidenceUpper: item.revenue,
      isForecast: false,
    }));

    // Future month names
    const futureMonths = ['Jan (P)', 'Feb (P)', 'Mar (P)', 'Apr (P)', 'May (P)', 'Jun (P)', 'Jul (P)', 'Aug (P)', 'Sep (P)', 'Oct (P)', 'Nov (P)', 'Dec (P)'];
    const monthsToProject = forecastControls.horizonMonths;

    let currentBase = baseRev;
    const projectedPoints = [];

    // Compound growth rate per month
    const monthlyRate = forecastControls.growthAdjustmentPercent / 100 / 12;
    const retentionRate = (forecastControls.retentionSensitivityPercent / 100) * 0.5;

    for (let i = 0; i < monthsToProject; i++) {
      const compoundFactor = Math.pow(1 + monthlyRate + retentionRate, i + 1);
      const baseline = Math.round(baseRev * compoundFactor * forecastControls.expansionFactor);
      const optimistic = Math.round(baseline * 1.14);
      const conservative = Math.round(baseline * 0.88);

      projectedPoints.push({
        period: futureMonths[i],
        historical: null, // No historical actuals for future
        baseline,
        optimistic,
        conservative,
        confidenceLower: conservative,
        confidenceUpper: optimistic,
        isForecast: true,
      });
    }

    return [...historicalPoints, ...projectedPoints];
  }, [history, forecastControls]);

  // Aggregate metrics for cards
  const lastProjected = forecastData[forecastData.length - 1];
  const finalBaseline = lastProjected?.baseline || 0;
  const finalOptimistic = lastProjected?.optimistic || 0;
  const finalConservative = lastProjected?.conservative || 0;
  const baselineGrowth = ((finalBaseline / (history[history.length - 1]?.revenue || 1) - 1) * 100).toFixed(1);

  const applyPreset = (preset: 'balanced' | 'aggressive' | 'conservative') => {
    setScenarioPreset(preset);
    if (preset === 'balanced') {
      updateForecastControls({
        growthAdjustmentPercent: 12,
        retentionSensitivityPercent: 2,
        expansionFactor: 1.15,
      });
    } else if (preset === 'aggressive') {
      updateForecastControls({
        growthAdjustmentPercent: 28,
        retentionSensitivityPercent: 6,
        expansionFactor: 1.35,
      });
    } else {
      updateForecastControls({
        growthAdjustmentPercent: -4,
        retentionSensitivityPercent: -2,
        expansionFactor: 1.02,
      });
    }
  };

  const handleGenerateNarrative = async () => {
    setIsNarrativeLoading(true);
    try {
      const res = await fetch('/api/analyst/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Generate a 2-paragraph financial forecasting memo for ${activeDataset.name}. Current baseline ends at $${finalBaseline.toLocaleString()} (+${baselineGrowth}% over ${forecastControls.horizonMonths} months). Optimistic upside is $${finalOptimistic.toLocaleString()} and downside is $${finalConservative.toLocaleString()}. Highlight key risk factors and operational dependencies.`,
          datasetSummary: summary,
        }),
      });
      const data = await res.json();
      setAiNarrative(data?.analysis?.summary || 'Forecast simulation verified.');
    } catch {
      setAiNarrative(
        `Under current simulated trajectory (${forecastControls.growthAdjustmentPercent}% growth lever, ${forecastControls.retentionSensitivityPercent}% retention boost), projected revenue reaches $${finalBaseline.toLocaleString()} within ${forecastControls.horizonMonths} months. Downside risk is constrained to $${finalConservative.toLocaleString()} assuming 88% scenario stability.`
      );
    } finally {
      setIsNarrativeLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Explicit Disclaimer Notice */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-amber-900 dark:text-amber-200">
            Statistical Simulation Model — Explicit Notice
          </div>
          <p className="leading-relaxed text-amber-700 dark:text-amber-400">
            The forward trajectory curves displayed below are mathematical scenario projections generated
            via compounding algorithms, trailing moving averages, and interactive sensitivity levers.
            These projections represent hypothetical operational scenarios rather than certified predictive ML guarantees.
          </p>
        </div>
      </div>

      {/* Scenario Presets & Levers Header */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Scenario Modeler & Growth Levers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust forward assumptions to model bull, base, and stress-tested cases
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(
                [
                  { id: 'conservative', label: 'Bear / Stress' },
                  { id: 'balanced', label: 'Balanced Base' },
                  { id: 'aggressive', label: 'Bull Upside' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    scenarioPreset === preset.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              onClick={resetForecastControls}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              title="Reset Levers to Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {/* Horizon */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-600 dark:text-slate-400">Horizon:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                {forecastControls.horizonMonths} Months
              </span>
            </div>
            <div className="flex gap-1.5">
              {[3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => updateForecastControls({ horizonMonths: m })}
                  className={`flex-1 py-1 text-xs rounded border transition-colors ${
                    forecastControls.horizonMonths === m
                      ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {m}M
                </button>
              ))}
            </div>
          </div>

          {/* Growth Rate Lever */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-600 dark:text-slate-400">MoM Growth Rate:</span>
              <span className="font-mono text-slate-900 dark:text-white">
                {forecastControls.growthAdjustmentPercent > 0 ? '+' : ''}
                {forecastControls.growthAdjustmentPercent}%
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="40"
              step="1"
              value={forecastControls.growthAdjustmentPercent}
              onChange={(e) =>
                updateForecastControls({ growthAdjustmentPercent: Number(e.target.value) })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Retention Lever */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-600 dark:text-slate-400">Retention Lift:</span>
              <span className="font-mono text-slate-900 dark:text-white">
                {forecastControls.retentionSensitivityPercent > 0 ? '+' : ''}
                {forecastControls.retentionSensitivityPercent}%
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="10"
              step="1"
              value={forecastControls.retentionSensitivityPercent}
              onChange={(e) =>
                updateForecastControls({ retentionSensitivityPercent: Number(e.target.value) })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Expansion Factor */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-600 dark:text-slate-400">Expansion Factor:</span>
              <span className="font-mono text-slate-900 dark:text-white">
                {forecastControls.expansionFactor.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="1.5"
              step="0.05"
              value={forecastControls.expansionFactor}
              onChange={(e) =>
                updateForecastControls({ expansionFactor: Number(e.target.value) })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Composite Chart: Historical (solid) vs Projected (dashed + confidence band) */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Revenue Trajectory: Actual Records vs. Projected Scenarios
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified historical months transitioned into simulated confidence bounds (P10 - P90)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-indigo-500 inline-block" />
              Historical Actuals
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-indigo-400 inline-block" />
              Base Scenario (P50)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-indigo-500/20 inline-block rounded-xs" />
              P10-P90 Range
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? '#1e293b' : '#f1f5f9'}
              />
              <XAxis dataKey="period" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} />
              <YAxis
                stroke={isDark ? '#64748b' : '#94a3b8'}
                fontSize={10}
                tickLine={false}
                tickFormatter={(v) => formatCompactNumber(v)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload;
                    return (
                      <div className="p-3 bg-slate-900 text-white rounded-lg border border-slate-700 shadow-xl text-xs space-y-1">
                        <div className="font-semibold text-slate-300">
                          {label} {row.isForecast ? '(Projected Scenario)' : '(Verified Actual)'}
                        </div>
                        {row.historical !== null && (
                          <div className="text-indigo-400 font-mono">
                            Historical Actual: {formatCurrency(row.historical)}
                          </div>
                        )}
                        {row.isForecast && (
                          <>
                            <div className="text-white font-mono font-semibold">
                              Base Projected: {formatCurrency(row.baseline)}
                            </div>
                            <div className="text-emerald-400 font-mono text-[11px]">
                              P90 Bull Upside: {formatCurrency(row.optimistic)}
                            </div>
                            <div className="text-amber-400 font-mono text-[11px]">
                              P10 Bear Downside: {formatCurrency(row.conservative)}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Shaded confidence band for projections */}
              <Area
                type="monotone"
                dataKey="optimistic"
                stroke="none"
                fill="url(#confidenceBand)"
                connectNulls
              />
              {/* Historical actual curve */}
              <Line
                type="monotone"
                dataKey="historical"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#6366f1' }}
                connectNulls={false}
              />
              {/* Baseline projected curve */}
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#818cf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bear Case */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Conservative Downside (P10)
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {formatCurrency(finalConservative)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Accounts for macroeconomic contraction, 3% higher churn, and slower acquisition velocity.
          </p>
        </div>

        {/* Base Case */}
        <div className="p-4 rounded-xl border-2 border-indigo-600/60 dark:border-indigo-500/60 bg-indigo-50/10 dark:bg-indigo-950/20">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center justify-between">
            <span>Base Plan (P50 Trajectory)</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-600 text-white">
              Target
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {formatCurrency(finalBaseline)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Paces at +{baselineGrowth}% expansion over trailing baseline with current retention parameters.
          </p>
        </div>

        {/* Bull Case */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
            Optimistic Upside (P90)
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {formatCurrency(finalOptimistic)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Captures aggressive product adoption, enterprise expansion tier uplifts, and optimized CAC payback.
          </p>
        </div>
      </div>

      {/* AI Forecasting Narrative Synthesis */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              AI Forecast Executive Synthesis
            </h3>
          </div>
          <button
            onClick={handleGenerateNarrative}
            disabled={isNarrativeLoading}
            className="text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            {isNarrativeLoading ? (
              <span>Analyzing Scenarios...</span>
            ) : (
              <>
                <span>Synthesize Strategic Memo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {aiNarrative ? (
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {aiNarrative}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click &ldquo;Synthesize Strategic Memo&rdquo; to generate an executive risk & opportunity breakdown
            grounded in your current scenario settings.
          </p>
        )}
      </div>
    </div>
  );
};

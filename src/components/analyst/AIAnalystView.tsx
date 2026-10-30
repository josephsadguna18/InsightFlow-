import React, { useState, useRef, useEffect } from 'react';
import {
  BrainCircuit,
  Send,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BarChart2,
  CheckCircle,
  Lightbulb,
  Cpu,
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
} from 'recharts';
import { useBI } from '../../context/BIContext';

export const AIAnalystView: React.FC = () => {
  const {
    analystMessages,
    sendAnalystQuery,
    isAnalystLoading,
    clearAnalystChat,
    activeDataset,
    formatCurrency,
    formatCompactNumber,
    isGeminiActive,
    theme,
  } = useBI();

  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  const quickPrompts = [
    'Analyze our revenue run-rate and top growth drivers',
    'What is our churn rate and how can we reduce it?',
    'Compare channel performance and acquisition efficiency',
    'Simulate a 6-month expansion scenario with 15% uplift',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isAnalystLoading) return;
    setInputQuery('');
    await sendAnalystQuery(textToSend);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [analystMessages, isAnalystLoading]);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>InsightFlow AI Executive Analyst</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
                {isGeminiActive ? 'Gemini 3.8 Flash' : 'Built-in Intelligence'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Grounded on <span className="font-semibold text-slate-600 dark:text-slate-300">{activeDataset.name}</span>
            </div>
          </div>
        </div>

        <button
          onClick={clearAnalystChat}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {analystMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`rounded-xl p-4 text-xs space-y-3 ${
                  isUser
                    ? 'bg-indigo-600 text-white font-medium shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-200'
                }`}
              >
                {/* Main text message */}
                <div className="leading-relaxed">{msg.text}</div>

                {/* Structured Analysis Response Cards */}
                {msg.analysis && (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
                    {/* Key Takeaways */}
                    {msg.analysis.keyTakeaways && msg.analysis.keyTakeaways.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          Key Performance Takeaways
                        </div>
                        <ul className="space-y-1 pl-1">
                          {msg.analysis.keyTakeaways.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                              <span className="text-indigo-500 font-bold">·</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Interactive Drill-Down Chart Card */}
                    {msg.analysis.chartData && msg.analysis.chartData.length > 0 && (
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
                            {msg.analysis.chartTitle || 'Metric Drill-Down Comparison'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Interactive Recharts Card
                          </span>
                        </div>

                        <div className="h-44 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={msg.analysis.chartData}
                              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke={isDark ? '#1e293b' : '#f1f5f9'}
                              />
                              <XAxis
                                dataKey="label"
                                stroke={isDark ? '#64748b' : '#94a3b8'}
                                fontSize={10}
                                tickLine={false}
                              />
                              <YAxis
                                stroke={isDark ? '#64748b' : '#94a3b8'}
                                fontSize={10}
                                tickLine={false}
                                tickFormatter={(v) => formatCompactNumber(v)}
                              />
                              <Tooltip
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="p-2 bg-slate-900 text-white rounded border border-slate-700 text-[11px] space-y-1">
                                        <div className="font-semibold text-slate-300">{label}</div>
                                        <div className="text-indigo-400 font-mono">
                                          Current: {formatCurrency(payload[0]?.value as number)}
                                        </div>
                                        {payload[1] && (
                                          <div className="text-slate-400 font-mono">
                                            Benchmark: {formatCurrency(payload[1]?.value as number)}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} name="Value" />
                              {msg.analysis.chartData[0]?.benchmark !== undefined && (
                                <Bar
                                  dataKey="benchmark"
                                  fill={isDark ? '#334155' : '#cbd5e1'}
                                  radius={[4, 4, 0, 0]}
                                  name="Benchmark"
                                />
                              )}
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Recommended Actions */}
                    {msg.analysis.recommendedActions && msg.analysis.recommendedActions.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-semibold text-amber-500 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          Recommended Next Steps
                        </div>
                        <ul className="space-y-1 pl-1">
                          {msg.analysis.recommendedActions.map((act, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                              <span className="text-amber-500 font-bold">→</span>
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>{msg.timestamp}</span>
                  {msg.source && (
                    <span className="font-mono text-slate-500">
                      via {msg.source === 'gemini' ? 'Gemini API' : 'Built-in Copilot'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isAnalystLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="rounded-xl p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-850 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>Analyzing dataset correlations and synthesizing executive response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-5 py-2 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2 overflow-x-auto bg-slate-50/50 dark:bg-slate-950/30">
        <span className="text-[11px] font-medium text-slate-400 shrink-0">Try:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 whitespace-nowrap shrink-0 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about revenue drivers, customer churn, CAC, or future forecasts..."
            disabled={isAnalystLoading}
            className="flex-1 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isAnalystLoading}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

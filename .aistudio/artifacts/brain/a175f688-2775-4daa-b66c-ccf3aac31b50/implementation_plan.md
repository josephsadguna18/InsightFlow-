# InsightFlow — AI Business Intelligence Copilot

InsightFlow is an AI business intelligence platform engineered for founders, operators, growth leads, and financial analysts to ingest business datasets (CSV/Excel), interrogate KPIs in natural language, detect actionable trends, and simulate future financial trajectories with statistical scenario modeling.

### User Review & Critical Decisions

> [!IMPORTANT]
> The clarifying decisions have been confirmed as follows:
> - **Preloaded Business Dataset**: Multi-channel SaaS metrics (MRR, net retention, customer acquisition cost, churn rates, average contract value) preloaded by default, alongside instant-switch options for E-commerce retail and B2B sales pipelines.
> - **Forecasting Experience**: Interactive statistical scenario modeler with historical timeline continuity, adjustable growth & retention drivers, upper/lower confidence bounds (P10/P50/P90), and clear visual labeling separating historical facts from statistical projections.
> - **AI Analyst Output Mode**: Executive intelligence format providing concise strategic takeaways, highlighted anomalies, interactive drill-down cards, and actionable recommendations.

- **Dual-Theme Support**: Dark theme by default (Linear/Stripe inspired deep slate `#0B0F19`, crisp borders `#1E293B`, subtle violet/indigo accents) with complete zero-glitch light theme toggle (`#F8FAFC` canvas, `#FFFFFF` cards, `#E2E8F0` borders).
- **Backend & Gemini Architecture**: Full-stack Node/Express server proxy (`server.ts`) maintaining the secure `GEMINI_API_KEY` boundary, streaming AI analyst responses via `@google/genai` with `gemini-3.8-flash`, and returning structured metric insights without exposing secrets to client bundles.

---

### 1. Overview & Core Concept

- **What It Does**: InsightFlow turns raw business spreadsheets into executive dashboards and conversational insights. Users can upload CSV or Excel files or explore curated benchmark datasets, inspect interactive charts and regional distribution grids, run conversational queries with an AI Analyst, and stress-test revenue projections through predictive scenario modeling.
- **Target Audience / Persona**: SaaS founders, e-commerce operators, CFOs/controllers, business intelligence analysts, and marketing agency leads who need instant clarity on performance drivers without writing SQL or building complex BI pipelines.
- **Key Value**: Replaces cumbersome multi-tab spreadsheets with instant executive synthesis: automated KPI attribution, anomaly explanation, and forward-looking forecast simulations with zero setup friction.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Executive Overview*: High-level KPI strip (Total Revenue, Gross Profit, Total Orders / Active Accounts, Average Order Value / ARPU) with period-over-period delta badges, dual revenue & margin velocity charts, regional breakdowns, and top-performing revenue drivers.
  2. *Data Sources & Ingestion*: Drag-and-drop CSV/Excel file parser with schema introspection (column types, row counts, missing value indicators), dataset switcher (SaaS, E-commerce, B2B Pipeline), and schema data preview tables.
  3. *AI Analyst Workspace*: Chat interface pre-populated with high-impact strategic prompt suggestions ("Explain our Q3 churn spike", "Which region yields the highest LTV:CAC?", "Summarize top 3 revenue growth drivers"). Displays conversational commentary alongside embedded interactive chart cards and metric drill-downs.
  4. *Predictive Forecasting*: Historical-to-projected revenue curves with adjustable scenario levers (Organic MoM growth %, Churn contraction %, Expansion factor) and explicit confidence intervals.
  5. *Deep Analytics & Slice-and-Dice*: Segmented dimensional analysis (by channel, region, customer cohort, and product tier) with sorting, filtering, and CSV export.
  6. *Settings & Workspace Configuration*: Theme switcher (Dark / Light), data refresh preferences, currency formats, export presets, and API status verification.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Precision SaaS editorial inspired by Linear, Stripe, and modern financial terminals. Hairline borders, single-elevation depth, zero-pill metadata discipline, and deliberate spatial rhythm.
  - *Color Palette & Tokens*:
    - Canvas Dark: `#090D16` / `#0E1424` (dominant 60%)
    - Surface Cards Dark: `#131B2E` with hairline borders `#1E293B` (structural 30%)
    - Accent / Focus: High-intent Indigo/Violet (`#6366F1` / `#4F46E5`) and Emerald (`#10B981`) for positive margins (10% accent budget)
    - Canvas Light: `#F8FAFC` with `#FFFFFF` cards and `#E2E8F0` borders
  - *Typography & Hierarchy*:
    - Display / Headers: `Plus Jakarta Sans` / clean sans typography with tight tracking (`tracking-tight`)
    - Body Text: `Plus Jakarta Sans` (14px–15px) with `leading-relaxed`
    - Metrics & Numbers: Strictly tabular figures (`font-mono tabular-nums`) to eliminate layout shift
  - *Anti-Slop Discipline*: No code-comment titles (`// 01_OVERVIEW`), no fake pulsing dots, no nested cards-in-cards, and no static metadata wrapped in colored pill chips.

- **Interactive Feedback & Motion**:
  - Sub-200ms transitions for tab switches and filter modifications.
  - Dynamic responsive charts with customized tooltips and animated path reveals.
  - Transparent status notices for simulated vs. live dataset computations.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Parsing with Server-Side AI Intelligence**:
  - *Chosen Approach*: Client-side fast CSV/data processing for immediate zero-latency visualization, combined with secure Express server routes (`/api/ai/analyze`, `/api/ai/forecast-narrative`) communicating with Gemini `gemini-3.8-flash`.
  - *Why*: Instantaneous client feedback without uploading multi-megabyte customer data files to third-party endpoints unless explicitly queried by the user.
  - *Alternatives Considered*: Pure server-only processing was rejected because it introduces latency on local file uploads and filter tweaks.
- **Decision 2: Transparent Projection Boundary in Forecasting**:
  - *Chosen Approach*: Clear graphical separation on timelines: solid line for verified historical records, dashed curve with shaded confidence band for forward projections, accompanied by an explicit "Statistical Simulation Model" banner.
  - *Why*: Adheres to data ethics and prevents misleading stakeholders into confusing empirical facts with predictive simulations.
- **Decision 3: Multi-Domain Datasets Out-of-the-Box**:
  - *Chosen Approach*: Pre-configure 3 realistic business datasets (SaaS Subscription, E-commerce D2C, B2B Enterprise Sales) alongside the custom CSV/Excel upload dropzone.
  - *Why*: Ensures the application is immediately rich, interactive, and explorable even before users have their own CSV files handy.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INSIGHTFLOW CLIENT (React + Vite)               │
├──────────────────────────┬─────────────────────────────────────────────┤
│   Navigation & State     │   Views & Workspaces                        │
│   ├── Active Tab Store   │   ├── Overview (KPI Strip, Charts, Matrix)  │
│   ├── Dataset Manager    │   ├── Data Sources (CSV/Excel Upload/Drop)  │
│   ├── Scenario Levers    │   ├── AI Analyst (Chat, Drill-Down Cards)   │
│   └── Theme State        │   ├── Deep Analytics (Cohorts & Segments)   │
│                          │   ├── Forecasting (Scenarios, P10/P50/P90)  │
│                          │   └── Workspace Settings                    │
└────────────┬─────────────┴──────────────────────┬──────────────────────┘
             │                                    │
             ▼ JSON / Form Data                   ▼ HTTP POST / SSE
┌───────────────────────────┐         ┌──────────────────────────────────┐
│ Client-side Data Engine   │         │ Express Server Proxy (Node.js)   │
│ ├── CSV / JSON Parser     │         │ ├── /api/health                  │
│ ├── Aggregation Matrix    │         │ ├── /api/analyst/chat            │
│ └── Statistical Modeler   │         │ └── /api/forecast/narrative      │
└───────────────────────────┘         └─────────────────┬────────────────┘
                                                        │
                                                        ▼ User-Agent: aistudio-build
                                              ┌──────────────────────────┐
                                              │ Google Gemini API        │
                                              │ Model: gemini-3.8-flash  │
                                              │ SDK: @google/genai       │
                                              └──────────────────────────┘
```

- **Data Model & State**:
  - `Dataset`: id, name, category, columns, rowCount, records, uploadedAt, summaryMetrics (revenue, profit, orders, aov, growthRate).
  - `MetricRecord`: date/timestamp, period, revenue, cost, profit, orders, region, category, channel, segment.
  - `ForecastModel`: baselineGrowth, churnFactor, seasonalityWeights, targetMonths, projections (period, baseline, optimistic, conservative).
  - `AnalystMessage`: id, sender (`user` | `assistant`), timestamp, content, chartCard (optional Recharts visualization object), suggestedFollowUps.

- **Interactive State Transitions**:
  - *Dataset Selection*: Switching datasets triggers immediate recalculation of KPI strips, chart re-renders, cohort distributions, and contextual prompt suggestions in the AI Analyst.
  - *CSV Upload*: Drag-and-drop or file selector parses headers and rows, validates numeric types, derives key business dimensions, and populates the dashboard within milliseconds.
  - *Forecasting Sliders*: Dragging growth rate (-20% to +50%) or retention sliders immediately recalculates the projected revenue curve and updates confidence bounds without page reload.
  - *AI Analyst Queries*: Dispatches prompt and active dataset summary to `/api/analyst/chat`, rendering streamed or structured answers with rich chart drill-downs.

---

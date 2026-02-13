"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Target,
  TrendingUp,
  Shield,
  Zap,
  DollarSign,
  Calendar,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Clock,
  Flame,
} from "lucide-react";
import BackgroundCircles from "@/components/ui/background-circles";
import { cn } from "@/lib/utils";

// --- Types ---
type GoalDuration = "12-month" | "5-year" | null;
type InvestmentStyle = "conservative" | "moderate" | "aggressive" | null;

interface ProjectionPoint {
  month: number;
  savingOnly: number;
  withCompounding: number;
}

// --- Constants ---
const ANNUAL_RETURNS: Record<string, number> = {
  conservative: 0.06,
  moderate: 0.1,
  aggressive: 0.15,
};

const STYLE_CONFIG = {
  conservative: {
    label: "Conservative",
    description: "Focused on stability and lower volatility",
    icon: Shield,
    color: "primary-green",
    gradient: "from-primary-green/20 to-primary-green/5",
    border: "border-primary-green/40",
    activeBg: "bg-primary-green/10",
  },
  moderate: {
    label: "Moderate",
    description: "Balanced growth with controlled risk",
    icon: BarChart3,
    color: "primary-orange",
    gradient: "from-primary-orange/20 to-primary-orange/5",
    border: "border-primary-orange/40",
    activeBg: "bg-primary-orange/10",
  },
  aggressive: {
    label: "Aggressive",
    description: "Higher growth focus with higher risk",
    icon: Flame,
    color: "primary-peach",
    gradient: "from-primary-peach/20 to-primary-peach/5",
    border: "border-primary-peach/40",
    activeBg: "bg-primary-peach/10",
  },
};

// --- Helpers ---
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateProjections(
  startingAmount: number,
  monthlyContribution: number,
  months: number,
  annualReturn: number
): ProjectionPoint[] {
  const monthlyRate = annualReturn / 12;
  const points: ProjectionPoint[] = [];
  let compoundedBalance = startingAmount;

  for (let m = 0; m <= months; m++) {
    const savingOnly = startingAmount + monthlyContribution * m;
    points.push({
      month: m,
      savingOnly,
      withCompounding: Math.round(compoundedBalance),
    });
    compoundedBalance =
      (compoundedBalance + monthlyContribution) * (1 + monthlyRate);
  }
  return points;
}

// --- SVG Chart Component ---
function CompoundingChart({
  data,
  style,
}: {
  data: ProjectionPoint[];
  style: InvestmentStyle;
}) {
  const W = 700;
  const H = 320;
  const PAD = { top: 30, right: 30, bottom: 50, left: 70 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map((d) => d.withCompounding), 1);
  const maxMonth = data[data.length - 1]?.month || 1;

  const x = (month: number) => PAD.left + (month / maxMonth) * chartW;
  const y = (val: number) => PAD.top + chartH - (val / maxVal) * chartH;

  const savePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(d.month)},${y(d.savingOnly)}`).join(" ");
  const compoundPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(d.month)},${y(d.withCompounding)}`).join(" ");

  const compoundAreaPath = `${compoundPath} L${x(data[data.length - 1].month)},${y(0)} L${x(0)},${y(0)} Z`;
  const saveAreaPath = `${savePath} L${x(data[data.length - 1].month)},${y(0)} L${x(0)},${y(0)} Z`;

  const accentColor =
    style === "aggressive"
      ? "#e26844"
      : style === "moderate"
      ? "#faba26"
      : "#236f62";

  // Y-axis ticks
  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((maxVal / tickCount) * i)
  );

  // X-axis ticks
  const xTickInterval = maxMonth <= 12 ? 3 : 12;
  const xTicks: number[] = [];
  for (let t = 0; t <= maxMonth; t += xTickInterval) {
    xTicks.push(t);
  }
  if (xTicks[xTicks.length - 1] !== maxMonth) xTicks.push(maxMonth);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px] mx-auto h-auto" aria-label="Compounding growth chart">
        <defs>
          <linearGradient id="compoundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="saveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line
              x1={PAD.left}
              y1={y(tick)}
              x2={W - PAD.right}
              y2={y(tick)}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
            <text x={PAD.left - 10} y={y(tick) + 4} textAnchor="end" fill="#94a3b8" fontSize="11">
              {tick >= 1000 ? `$${(tick / 1000).toFixed(0)}k` : `$${tick}`}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xTicks.map((tick) => (
          <text key={`x-${tick}`} x={x(tick)} y={H - 10} textAnchor="middle" fill="#94a3b8" fontSize="11">
            {tick === 0 ? "Start" : maxMonth <= 12 ? `M${tick}` : `Y${Math.round(tick / 12)}`}
          </text>
        ))}

        {/* Area fills */}
        <path d={compoundAreaPath} fill="url(#compoundGrad)" />
        <path d={saveAreaPath} fill="url(#saveGrad)" />

        {/* Lines */}
        <path d={savePath} fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="6 4" />
        <path d={compoundPath} fill="none" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />

        {/* End dots */}
        <circle cx={x(maxMonth)} cy={y(data[data.length - 1].savingOnly)} r="5" fill="#94a3b8" />
        <circle cx={x(maxMonth)} cy={y(data[data.length - 1].withCompounding)} r="6" fill={accentColor} stroke="white" strokeWidth="2" />

        {/* Legend */}
        <g transform={`translate(${PAD.left + 10}, ${PAD.top + 10})`}>
          <rect x="0" y="0" width="14" height="3" rx="1.5" fill={accentColor} />
          <text x="20" y="5" fill="#374151" fontSize="11" fontWeight="600">Investing with Compounding</text>
          <rect x="0" y="18" width="14" height="3" rx="1.5" fill="#94a3b8" strokeDasharray="4 2" />
          <text x="20" y="23" fill="#94a3b8" fontSize="11">Saving Only</text>
        </g>
      </svg>
    </div>
  );
}

// --- Main Page ---
export default function PortfolioJourneyPage() {
  const [goalDuration, setGoalDuration] = useState<GoalDuration>(null);
  const [investmentStyle, setInvestmentStyle] = useState<InvestmentStyle>(null);
  const [startingAmount, setStartingAmount] = useState<string>("");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const months = goalDuration === "12-month" ? 12 : goalDuration === "5-year" ? 60 : 0;
  const annualReturn = investmentStyle ? ANNUAL_RETURNS[investmentStyle] : 0;

  const isFormValid =
    goalDuration &&
    investmentStyle &&
    parseFloat(startingAmount) > 0 &&
    parseFloat(monthlyContribution) >= 0;

  const projections = useMemo(() => {
    if (!isFormValid) return [];
    return calculateProjections(
      parseFloat(startingAmount),
      parseFloat(monthlyContribution),
      months,
      annualReturn
    );
  }, [startingAmount, monthlyContribution, months, annualReturn, isFormValid]);

  const finalSavingOnly = projections.length > 0 ? projections[projections.length - 1].savingOnly : 0;
  const finalCompounded = projections.length > 0 ? projections[projections.length - 1].withCompounding : 0;
  const totalInvested = finalSavingOnly;
  const growthDifference = finalCompounded - finalSavingOnly;

  const handleCalculate = () => {
    if (isFormValid) setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setGoalDuration(null);
    setInvestmentStyle(null);
    setStartingAmount("");
    setMonthlyContribution("");
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10 relative flex flex-col">
      <BackgroundCircles />

      {/* Decorative blobs */}
      <motion.div
        className="absolute top-20 right-16 w-72 h-72 rounded-full bg-primary-green/8 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 left-8 w-56 h-56 rounded-full bg-primary-orange/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <section className="relative py-16 px-4 overflow-hidden flex-1">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-green/10 text-primary-green text-sm font-semibold mb-4">
              <Target className="w-4 h-4" />
              My Portfolio Journey
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Plan Your Growth — <br className="hidden sm:block" />
              <span className="text-primary-green">12 Months & 5 Years Ahead</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-3">
              Investing isn&apos;t just about picking stocks — it&apos;s about time,
              consistency, and compounding. This section helps you visualize what
              disciplined investing can grow into.
            </p>
            <p className="text-sm font-medium text-primary-orange italic">
              &ldquo;Compounding doesn&apos;t need perfection — it needs consistency.&rdquo;
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="form"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                {/* Step 1: Goal Duration */}
                <motion.div variants={stepVariants}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-primary-green text-white flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Choose Your Goal Duration</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-5 ml-12">
                    Short-term discipline builds long-term results.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-12">
                    {([
                      { id: "12-month" as GoalDuration, label: "12-Month Investment Goal", icon: Clock, sub: "Build a strong foundation in one year" },
                      { id: "5-year" as GoalDuration, label: "5-Year Investment Goal", icon: Calendar, sub: "Let compounding do the heavy lifting" },
                    ]).map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setGoalDuration(option.id)}
                        className={cn(
                          "relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group hover:shadow-lg",
                          goalDuration === option.id
                            ? "border-primary-green bg-primary-green/5 shadow-md shadow-primary-green/10"
                            : "border-gray-200 bg-white hover:border-primary-green/30"
                        )}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            goalDuration === option.id ? "bg-primary-green text-white" : "bg-gray-100 text-gray-400 group-hover:bg-primary-green/10 group-hover:text-primary-green"
                          )}>
                            <option.icon className="w-5 h-5" />
                          </div>
                          <h3 className="font-semibold text-foreground">{option.label}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground ml-13">{option.sub}</p>
                        {goalDuration === option.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3"
                          >
                            <CheckCircle2 className="w-5 h-5 text-primary-green" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Step 2: Investment Style */}
                <motion.div variants={stepVariants}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold",
                      goalDuration ? "bg-primary-green text-white" : "bg-gray-200 text-gray-400"
                    )}>
                      2
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Select Your Investment Style</h2>
                  </div>
                  <div className="bg-primary-orange/5 border border-primary-orange/20 rounded-xl p-3 mb-5 ml-12 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-primary-orange mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-primary-orange/90 font-medium">
                      Risk levels affect potential outcomes. Higher returns come with higher risk.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ml-12">
                    {(Object.entries(STYLE_CONFIG) as [string, typeof STYLE_CONFIG.conservative][]).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setInvestmentStyle(key as InvestmentStyle)}
                        disabled={!goalDuration}
                        className={cn(
                          "relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed",
                          investmentStyle === key
                            ? `${config.border} ${config.activeBg} shadow-md`
                            : "border-gray-200 bg-white hover:border-gray-300"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all bg-gradient-to-br",
                          config.gradient
                        )}>
                          <config.icon className={cn("w-6 h-6", `text-${config.color}`)} />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{config.label}</h3>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                        {investmentStyle === key && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3"
                          >
                            <CheckCircle2 className={cn("w-5 h-5", `text-${config.color}`)} />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Step 3: Investment Form */}
                <motion.div variants={stepVariants}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold",
                      investmentStyle ? "bg-primary-green text-white" : "bg-gray-200 text-gray-400"
                    )}>
                      3
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Enter Your Investment Details</h2>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ml-12 space-y-5">
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary-green" />
                        Starting Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                        <input
                          type="number"
                          placeholder="e.g. 5000"
                          value={startingAmount}
                          onChange={(e) => setStartingAmount(e.target.value)}
                          disabled={!investmentStyle}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary-green" />
                        Monthly Contribution
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                        <input
                          type="number"
                          placeholder="e.g. 500"
                          value={monthlyContribution}
                          onChange={(e) => setMonthlyContribution(e.target.value)}
                          disabled={!investmentStyle}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-green" />
                        Goal Duration
                      </label>
                      <div className="py-3 px-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-foreground font-medium">
                        {goalDuration === "12-month"
                          ? "12 Months"
                          : goalDuration === "5-year"
                          ? "5 Years (60 Months)"
                          : "Select a duration above"}
                      </div>
                    </div>

                    {/* Calculate Button */}
                    <motion.button
                      onClick={handleCalculate}
                      disabled={!isFormValid}
                      whileHover={isFormValid ? { scale: 1.02 } : {}}
                      whileTap={isFormValid ? { scale: 0.98 } : {}}
                      className={cn(
                        "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300",
                        isFormValid
                          ? "bg-gradient-to-r from-primary-green to-primary-green/80 text-white shadow-lg shadow-primary-green/20 hover:shadow-xl"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <Sparkles className="w-5 h-5" />
                      Visualize What You&apos;re Working Toward
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Back button */}
                <button
                  onClick={() => setShowResults(false)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Adjust your inputs
                </button>

                {/* Step 4: Compounding Growth Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary-green/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary-green" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Compounding Growth Preview</h2>
                      <p className="text-sm text-muted-foreground">See how your investments could grow over time</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Invested</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(totalInvested)}</p>
                    </div>
                    <div className="bg-primary-green/5 rounded-xl p-4 text-center">
                      <p className="text-xs text-primary-green font-medium uppercase tracking-wider mb-1">Estimated Growth</p>
                      <p className="text-2xl font-bold text-primary-green">{formatCurrency(finalCompounded)}</p>
                    </div>
                    <div className={cn(
                      "rounded-xl p-4 text-center",
                      investmentStyle === "aggressive" ? "bg-primary-peach/5" : investmentStyle === "moderate" ? "bg-primary-orange/5" : "bg-primary-green/5"
                    )}>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Compounding Advantage</p>
                      <p className={cn(
                        "text-2xl font-bold",
                        investmentStyle === "aggressive" ? "text-primary-peach" : investmentStyle === "moderate" ? "text-primary-orange" : "text-primary-green"
                      )}>
                        +{formatCurrency(growthDifference)}
                      </p>
                    </div>
                  </div>

                  {/* Chart */}
                  <CompoundingChart data={projections} style={investmentStyle} />

                  {/* Disclaimer */}
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Important Disclaimer</p>
                      <p className="text-xs text-amber-700 mt-1">
                        This is a projection based on assumptions, not a guarantee. Actual results vary with market conditions.
                        Past performance does not predict future results.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Step 5: Goal Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-white via-primary-green/5 to-primary-orange/5 rounded-2xl p-6 md:p-8 border border-primary-green/20 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary-green text-white flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Your Goal Summary</h2>
                      <p className="text-sm text-muted-foreground">What you&apos;re working toward</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Strategy</p>
                      <div className="flex items-center gap-2">
                        {investmentStyle && (() => {
                          const Icon = STYLE_CONFIG[investmentStyle].icon;
                          return <Icon className={cn("w-5 h-5", `text-${STYLE_CONFIG[investmentStyle].color}`)} />;
                        })()}
                        <span className="font-bold text-foreground capitalize">{investmentStyle}</span>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Time Horizon</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-green" />
                        <span className="font-bold text-foreground">
                          {goalDuration === "12-month" ? "12 Months" : "5 Years"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Your Investment Goal</p>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary-orange" />
                        <span className="font-bold text-primary-green">{formatCurrency(finalCompounded)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-lg font-semibold text-foreground italic">
                      &ldquo;Compounding rewards patience, not speed.&rdquo;
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 text-foreground font-semibold hover:border-primary-green/30 hover:bg-primary-green/5 transition-all"
                    >
                      Start Over
                    </button>
                    <button
                      onClick={() => setShowResults(false)}
                      className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-primary-green to-primary-green/80 text-white font-semibold shadow-lg shadow-primary-green/20 hover:shadow-xl transition-all"
                    >
                      Adjust & Recalculate
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

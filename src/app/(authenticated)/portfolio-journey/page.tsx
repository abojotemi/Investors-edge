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
  ChevronRight,
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
    hexColor: "#236f62",
    gradient: "from-primary-green to-primary-green/70",
    softGradient: "from-primary-green/20 to-primary-green/5",
    border: "border-primary-green",
    activeBg: "bg-primary-green/10",
    ring: "ring-primary-green/30",
    badge: "bg-primary-green text-white",
    badgeSoft: "bg-primary-green/10 text-primary-green",
    returnLabel: "~6% p.a.",
    bgFull: "bg-primary-green",
    textColor: "text-primary-green",
  },
  moderate: {
    label: "Moderate",
    description: "Balanced growth with controlled risk",
    icon: BarChart3,
    color: "primary-orange",
    hexColor: "#faba26",
    gradient: "from-primary-orange to-primary-orange/70",
    softGradient: "from-primary-orange/20 to-primary-orange/5",
    border: "border-primary-orange",
    activeBg: "bg-primary-orange/10",
    ring: "ring-primary-orange/30",
    badge: "bg-primary-orange text-white",
    badgeSoft: "bg-primary-orange/10 text-primary-orange",
    returnLabel: "~10% p.a.",
    bgFull: "bg-primary-orange",
    textColor: "text-primary-orange",
  },
  aggressive: {
    label: "Aggressive",
    description: "Higher growth focus with higher risk",
    icon: Flame,
    color: "primary-peach",
    hexColor: "#e26844",
    gradient: "from-primary-peach to-primary-peach/70",
    softGradient: "from-primary-peach/20 to-primary-peach/5",
    border: "border-primary-peach",
    activeBg: "bg-primary-peach/10",
    ring: "ring-primary-peach/30",
    badge: "bg-primary-peach text-white",
    badgeSoft: "bg-primary-peach/10 text-primary-peach",
    returnLabel: "~15% p.a.",
    bgFull: "bg-primary-peach",
    textColor: "text-primary-peach",
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

  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((maxVal / tickCount) * i)
  );

  const xTickInterval = maxMonth <= 12 ? 3 : 12;
  const xTicks: number[] = [];
  for (let t = 0; t <= maxMonth; t += xTickInterval) xTicks.push(t);
  if (xTicks[xTicks.length - 1] !== maxMonth) xTicks.push(maxMonth);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px] mx-auto h-auto" aria-label="Compounding growth chart">
        <defs>
          <linearGradient id="compoundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="saveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.02" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
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
        <path d={savePath} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />
        <path d={compoundPath} fill="none" stroke={accentColor} strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />

        {/* End dots */}
        <circle cx={x(maxMonth)} cy={y(data[data.length - 1].savingOnly)} r="5" fill="#94a3b8" />
        <circle cx={x(maxMonth)} cy={y(data[data.length - 1].withCompounding)} r="7" fill={accentColor} stroke="white" strokeWidth="2.5" filter="url(#glow)" />

        {/* Legend */}
        <g transform={`translate(${PAD.left + 10}, ${PAD.top + 10})`}>
          <rect x="0" y="0" width="14" height="3" rx="1.5" fill={accentColor} />
          <text x="20" y="5" fill="#374151" fontSize="11" fontWeight="600">Investing with Compounding</text>
          <rect x="0" y="18" width="14" height="3" rx="1.5" fill="#94a3b8" />
          <text x="20" y="23" fill="#94a3b8" fontSize="11">Saving Only</text>
        </g>
      </svg>
    </div>
  );
}

// --- Step Progress Bar ---
function StepProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: "Duration", num: 1 },
    { label: "Style", num: 2 },
    { label: "Details", num: 3 },
    { label: "Results", num: 4 },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.num;
        const isActive = currentStep === step.num;
        return (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{ scale: isActive ? 1.15 : 1 }}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2",
                  isCompleted
                    ? "bg-primary-green border-primary-green text-white shadow-md shadow-primary-green/30"
                    : isActive
                    ? "bg-white border-primary-green text-primary-green shadow-lg shadow-primary-green/20"
                    : "bg-gray-100 border-gray-200 text-gray-400"
                )}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.num}
              </motion.div>
              <span className={cn(
                "text-xs font-semibold hidden sm:block",
                isActive ? "text-primary-green" : isCompleted ? "text-primary-green/70" : "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cn(
                "w-16 sm:w-24 h-0.5 mx-1 mb-5 transition-all duration-500",
                isCompleted ? "bg-gradient-to-r from-primary-green to-primary-green/60" : "bg-gray-200"
              )} />
            )}
          </div>
        );
      })}
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

  const currentStep = showResults
    ? 4
    : investmentStyle && startingAmount && monthlyContribution
    ? 3
    : investmentStyle
    ? 2
    : goalDuration
    ? 2
    : 1;

  const activeStyleConfig = investmentStyle ? STYLE_CONFIG[investmentStyle] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-green/8 via-white to-primary-orange/8 relative flex flex-col pt-24 pb-16">
      <BackgroundCircles variant="sparse" />

      {/* Rich decorative blobs */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary-green/15 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 left-6 w-80 h-80 rounded-full bg-primary-orange/15 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-primary-peach/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <section className="relative px-4 flex-1">
        <div className="max-w-4xl mx-auto relative z-10">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary-green/20 to-primary-orange/10 text-primary-green text-sm font-bold mb-5 border border-primary-green/30 shadow-sm"
            >
              <Target className="w-4 h-4" />
              My Portfolio Journey
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Plan Your Growth —{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary-green via-primary-green to-primary-orange bg-clip-text text-transparent">
                12 Months &amp; 5 Years Ahead
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-4">
              Investing isn&apos;t just about picking stocks — it&apos;s about time,
              consistency, and compounding. Visualize what disciplined investing
              can grow into.
            </p>
            <p className="text-sm font-bold text-primary-orange italic">
              &ldquo;Compounding doesn&apos;t need perfection — it needs consistency.&rdquo;
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StepProgress currentStep={currentStep} />
          </motion.div>

          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Step 1: Goal Duration */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Colored step header */}
                  <div className="bg-gradient-to-r from-primary-green to-primary-green/80 px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white border-2 border-white/40">
                      {goalDuration ? <CheckCircle2 className="w-4 h-4" /> : "1"}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Choose Your Goal Duration</h2>
                      <p className="text-xs text-white/70">Short-term discipline builds long-term results</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {([
                        {
                          id: "12-month" as GoalDuration,
                          label: "12-Month Goal",
                          sub: "Build a strong foundation in one year",
                          icon: Clock,
                          detail: "Short-term focus",
                          accentClass: "from-primary-green/10 to-primary-green/5 border-primary-green",
                          iconClass: "bg-primary-green text-white",
                          badgeClass: "bg-primary-green/15 text-primary-green",
                        },
                        {
                          id: "5-year" as GoalDuration,
                          label: "5-Year Goal",
                          sub: "Let compounding do the heavy lifting",
                          icon: Calendar,
                          detail: "Long-term growth",
                          accentClass: "from-primary-orange/10 to-primary-orange/5 border-primary-orange",
                          iconClass: "bg-primary-orange text-white",
                          badgeClass: "bg-primary-orange/15 text-primary-orange",
                        },
                      ]).map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setGoalDuration(option.id)}
                          className={cn(
                            "relative p-5 rounded-xl border-2 text-left transition-all duration-300 group hover:shadow-lg",
                            goalDuration === option.id
                              ? `bg-gradient-to-br ${option.accentClass} shadow-md`
                              : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                              goalDuration === option.id
                                ? option.iconClass
                                : "bg-white border border-gray-200 text-gray-400 group-hover:border-gray-300"
                            )}>
                              <option.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900">{option.label}</h3>
                              <p className="text-sm text-gray-500 mt-0.5">{option.sub}</p>
                              <span className={cn(
                                "mt-2 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full",
                                goalDuration === option.id ? option.badgeClass : "bg-gray-100 text-gray-500"
                              )}>
                                {option.detail}
                              </span>
                            </div>
                          </div>
                          {goalDuration === option.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                              <CheckCircle2 className="w-5 h-5 text-primary-green" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Step 2: Investment Style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className={cn(
                    "px-6 py-4 flex items-center gap-3 transition-all duration-300",
                    goalDuration
                      ? "bg-gradient-to-r from-primary-orange to-primary-orange/80"
                      : "bg-gray-100"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2",
                      goalDuration ? "bg-white/20 border-white/40 text-white" : "bg-gray-200 border-gray-300 text-gray-400"
                    )}>
                      {investmentStyle ? <CheckCircle2 className="w-4 h-4" /> : "2"}
                    </div>
                    <div>
                      <h2 className={cn("text-base font-bold", goalDuration ? "text-white" : "text-gray-400")}>
                        Select Your Investment Style
                      </h2>
                      <p className={cn("text-xs", goalDuration ? "text-white/70" : "text-gray-400")}>
                        Higher returns come with higher risk
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    {!goalDuration && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 px-2">
                        <ChevronRight className="w-4 h-4" />
                        Choose a goal duration first
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(Object.entries(STYLE_CONFIG) as [string, typeof STYLE_CONFIG.conservative][]).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => setInvestmentStyle(key as InvestmentStyle)}
                          disabled={!goalDuration}
                          className={cn(
                            "relative p-5 rounded-xl border-2 text-left transition-all duration-300 group hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed",
                            investmentStyle === key
                              ? `${config.border} bg-gradient-to-br ${config.softGradient} shadow-md`
                              : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white"
                          )}
                        >
                          {/* Colored icon area */}
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all",
                            investmentStyle === key
                              ? `bg-gradient-to-br ${config.gradient}`
                              : "bg-gray-100"
                          )}>
                            <config.icon className={cn(
                              "w-6 h-6 transition-colors",
                              investmentStyle === key ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                            )} />
                          </div>
                          <h3 className="font-bold text-gray-900 mb-1">{config.label}</h3>
                          <p className="text-xs text-gray-500 mb-3">{config.description}</p>
                          <span className={cn(
                            "text-xs font-bold px-2.5 py-1 rounded-full",
                            investmentStyle === key ? config.badge : "bg-gray-100 text-gray-500"
                          )}>
                            {config.returnLabel}
                          </span>
                          {investmentStyle === key && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                              <CheckCircle2 className={cn("w-5 h-5", config.textColor)} />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Step 3: Investment Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className={cn(
                    "px-6 py-4 flex items-center gap-3 transition-all duration-300",
                    investmentStyle
                      ? `bg-gradient-to-r ${activeStyleConfig?.gradient}`
                      : "bg-gray-100"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2",
                      investmentStyle ? "bg-white/20 border-white/40 text-white" : "bg-gray-200 border-gray-300 text-gray-400"
                    )}>
                      3
                    </div>
                    <div>
                      <h2 className={cn("text-base font-bold", investmentStyle ? "text-white" : "text-gray-400")}>
                        Enter Your Investment Details
                      </h2>
                      <p className={cn("text-xs", investmentStyle ? "text-white/70" : "text-gray-400")}>
                        How much are you starting with and adding monthly?
                      </p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    {!investmentStyle && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 px-2">
                        <ChevronRight className="w-4 h-4" />
                        Select an investment style first
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary-green flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-white" />
                          </div>
                          Starting Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                          <input
                            type="number"
                            placeholder="e.g. 5000"
                            value={startingAmount}
                            onChange={(e) => setStartingAmount(e.target.value)}
                            disabled={!investmentStyle}
                            className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-green focus:ring-2 focus:ring-primary-green/15 outline-none transition-all text-gray-900 font-semibold disabled:opacity-40 disabled:cursor-not-allowed bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary-orange flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                          Monthly Contribution
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                          <input
                            type="number"
                            placeholder="e.g. 500"
                            value={monthlyContribution}
                            onChange={(e) => setMonthlyContribution(e.target.value)}
                            disabled={!investmentStyle}
                            className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-green focus:ring-2 focus:ring-primary-green/15 outline-none transition-all text-gray-900 font-semibold disabled:opacity-40 disabled:cursor-not-allowed bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Strategy summary pill */}
                    {goalDuration && (
                      <div className={cn(
                        "flex flex-wrap items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold",
                        activeStyleConfig
                          ? `${activeStyleConfig.badgeSoft} ${activeStyleConfig.border}`
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      )}>
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        Goal:{" "}
                        <span>{goalDuration === "12-month" ? "12 Months" : "5 Years (60 Months)"}</span>
                        {investmentStyle && (
                          <>
                            <span className="opacity-40 mx-0.5">•</span>
                            <span className="capitalize">{investmentStyle} strategy</span>
                            <span className="opacity-40 mx-0.5">•</span>
                            <span>{activeStyleConfig?.returnLabel}</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Calculate Button */}
                    <motion.button
                      onClick={handleCalculate}
                      disabled={!isFormValid}
                      whileHover={isFormValid ? { scale: 1.02 } : {}}
                      whileTap={isFormValid ? { scale: 0.98 } : {}}
                      className={cn(
                        "w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300",
                        isFormValid
                          ? "bg-gradient-to-r from-primary-green via-primary-green to-primary-orange/80 text-white shadow-lg shadow-primary-green/25 hover:shadow-xl hover:shadow-primary-green/35"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
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
                className="space-y-6"
              >
                {/* Back button */}
                <button
                  onClick={() => setShowResults(false)}
                  className="flex items-center gap-2 text-gray-500 hover:text-primary-green transition-colors text-sm font-semibold group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  Adjust your inputs
                </button>

                {/* Hero stat banner */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "rounded-2xl p-6 md:p-10 relative overflow-hidden text-white",
                    `bg-gradient-to-br ${activeStyleConfig?.gradient}`
                  )}
                >
                  {/* Decorative shapes */}
                  <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" />
                  <div className="absolute -left-8 -bottom-12 w-48 h-48 rounded-full bg-black/10" />
                  <div className="absolute right-24 bottom-4 w-32 h-32 rounded-full bg-white/5" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-white/80" />
                      <span className="text-sm font-semibold text-white/80">Projected Portfolio Value</span>
                    </div>
                    <p className="text-6xl md:text-7xl font-bold mb-3 tracking-tight">
                      {formatCurrency(finalCompounded)}
                    </p>
                    <p className="text-white/70 text-sm font-medium">
                      After {goalDuration === "12-month" ? "12 months" : "5 years"} with&nbsp;
                      <span className="text-white font-bold capitalize">{investmentStyle}</span> strategy &nbsp;({activeStyleConfig?.returnLabel})
                    </p>
                  </div>
                </motion.div>

                {/* Stat Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {/* Total invested */}
                  <div className="bg-white rounded-xl p-5 border-2 border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Invested</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvested)}</p>
                    <p className="text-xs text-gray-400 mt-1">Your actual contributions</p>
                  </div>

                  {/* Compounding gain */}
                  <div className={cn(
                    "rounded-xl p-5 border-2 shadow-sm",
                    activeStyleConfig?.badgeSoft,
                    activeStyleConfig?.border
                  )}>
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                      `bg-gradient-to-br ${activeStyleConfig?.gradient}`
                    )}>
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", activeStyleConfig?.textColor)}>
                      Compounding Gain
                    </p>
                    <p className={cn("text-2xl font-bold", activeStyleConfig?.textColor)}>
                      +{formatCurrency(growthDifference)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Money working for you</p>
                  </div>

                  {/* Growth multiple */}
                  <div className="bg-white rounded-xl p-5 border-2 border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary-peach/10 flex items-center justify-center mb-3">
                      <Zap className="w-5 h-5 text-primary-peach" />
                    </div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Growth Multiple</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalInvested > 0 ? `${(finalCompounded / totalInvested).toFixed(2)}x` : "—"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Return on total invested</p>
                  </div>
                </motion.div>

                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      `bg-gradient-to-br ${activeStyleConfig?.gradient}`
                    )}>
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Compounding Growth Chart</h2>
                      <p className="text-sm text-gray-500">How your investment could grow vs. saving alone</p>
                    </div>
                  </div>
                  <CompoundingChart data={projections} style={investmentStyle} />

                  {/* Disclaimer */}
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-700">Important Disclaimer</p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        These projections are based on assumptions and are not guaranteed. Actual results vary
                        with market conditions. Past performance does not predict future results.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Goal Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    "rounded-2xl p-6 md:p-8 border-2 shadow-sm",
                    activeStyleConfig?.badgeSoft,
                    activeStyleConfig?.border
                  )}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      `bg-gradient-to-br ${activeStyleConfig?.gradient}`
                    )}>
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Your Goal Summary</h2>
                      <p className="text-sm text-gray-500">What you&apos;re working toward</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white shadow-sm">
                      <p className="text-xs text-gray-400 font-medium mb-2">Strategy</p>
                      <div className="flex items-center gap-2">
                        {investmentStyle && (() => {
                          const Icon = STYLE_CONFIG[investmentStyle].icon;
                          return <Icon className={cn("w-5 h-5", STYLE_CONFIG[investmentStyle].textColor)} />;
                        })()}
                        <span className="font-bold text-gray-900 capitalize">{investmentStyle}</span>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white shadow-sm">
                      <p className="text-xs text-gray-400 font-medium mb-2">Time Horizon</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-green" />
                        <span className="font-bold text-gray-900">
                          {goalDuration === "12-month" ? "12 Months" : "5 Years"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white shadow-sm">
                      <p className="text-xs text-gray-400 font-medium mb-2">Target Portfolio</p>
                      <div className="flex items-center gap-2">
                        <Zap className={cn("w-5 h-5", activeStyleConfig?.textColor)} />
                        <span className={cn("font-bold", activeStyleConfig?.textColor)}>{formatCurrency(finalCompounded)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="bg-white/60 backdrop-blur rounded-xl p-5 border border-white text-center mb-6">
                    <p className="text-base font-bold text-gray-700 italic">
                      &ldquo;Compounding rewards patience, not speed.&rdquo;
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-bold hover:border-primary-green/40 hover:bg-primary-green/5 transition-all"
                    >
                      Start Over
                    </button>
                    <motion.button
                      onClick={() => setShowResults(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex-1 py-3 px-6 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2",
                        `bg-gradient-to-r ${activeStyleConfig?.gradient}`,
                        "hover:shadow-xl"
                      )}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Adjust &amp; Recalculate
                    </motion.button>
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

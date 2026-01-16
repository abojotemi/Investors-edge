"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageFooter from "@/components/ui/page-footer";
import BackgroundCircles from "@/components/ui/background-circles";
import { useState } from "react";

// Stock data - in production this would come from an API/database
const stockData: Record<
  string,
  {
    name: string;
    ticker: string;
    dateAdded: string;
    sector: string;
    analysis: string[];
    highlights: {
      title: string;
      description: string;
      icon: "check" | "down" | "up";
    }[];
    tradeSetup: { buyRange: string; targetProfit: string; riskPrice: string };
  }
> = {
  veritas: {
    name: "Veritas Kapital Assurance",
    ticker: "VERITAS",
    dateAdded: "January 25, 2025",
    sector: "Insurance",
    analysis: [
      "Veritas Kapital is positioned as a strong player in the Nigerian insurance sector. Following the government's recapitalization drive signed by the president, Veritas stands out as one of the companies expected to gain significant investor attention.",
      "Earlier this year, Veritas experienced a strong surge (up to ₦3.06) driven by FOMO around the new insurance reform. Currently, the stock has corrected by over 30% and is consolidating, offering a potential entry point for long-term investors.",
      "Unlike some other insurance firms, Veritas has relatively solid financials, making it better positioned to benefit once the reforms begin to take effect. Patience is key here: we enter when the market is cold, and exit when the broader investor community rushes in.",
    ],
    highlights: [
      {
        title: "Why Veritas?",
        description:
          "Beneficiary of insurance sector recapitalization reforms with long-term upside potential.",
        icon: "check",
      },
      {
        title: "Current Status",
        description:
          "Down 30% from its highs, consolidating and building a strong base.",
        icon: "down",
      },
      {
        title: "Outlook",
        description:
          "When reforms kick in and investor sentiment returns, Veritas could see significant growth.",
        icon: "up",
      },
    ],
    tradeSetup: {
      buyRange: "₦2.20 – ₦2.40",
      targetProfit: "+40%",
      riskPrice: "₦1.80",
    },
  },
  jberger: {
    name: "Julius Berger Nigeria Plc",
    ticker: "JBERGER",
    dateAdded: "January 27, 2025",
    sector: "Construction",
    analysis: [
      "Julius Berger is Nigeria's premier construction and civil engineering company with a strong track record spanning decades. The company has been involved in major infrastructure projects across the country.",
      "With the government's renewed focus on infrastructure development and the completion of several major contracts, Julius Berger is well-positioned to benefit from increased construction activity.",
      "The stock has shown resilience during market downturns and offers exposure to Nigeria's infrastructure growth story. Current valuation presents an attractive entry point for patient investors.",
    ],
    highlights: [
      {
        title: "Why JBERGER?",
        description:
          "Market leader in construction with strong government contracts and proven execution.",
        icon: "check",
      },
      {
        title: "Current Status",
        description:
          "Trading at attractive valuations with steady revenue growth.",
        icon: "up",
      },
      {
        title: "Outlook",
        description:
          "Infrastructure spending expected to boost earnings in coming quarters.",
        icon: "up",
      },
    ],
    tradeSetup: {
      buyRange: "₦85.00 – ₦92.00",
      targetProfit: "+35%",
      riskPrice: "₦75.00",
    },
  },
  dangcem: {
    name: "Dangote Cement Plc",
    ticker: "DANGCEM",
    dateAdded: "December 15, 2024",
    sector: "Industrial Goods",
    analysis: [
      "Dangote Cement is Africa's largest cement producer and a cornerstone of the Nigerian Stock Exchange. The company has consistently delivered strong results and maintains dominant market share.",
      "Recent expansion into other African markets has diversified revenue streams and reduced dependence on the Nigerian market alone.",
      "While the stock trades at premium valuations, its defensive characteristics and dividend yield make it attractive for long-term portfolios seeking stability.",
    ],
    highlights: [
      {
        title: "Why DANGCEM?",
        description:
          "Market leader with strong brand, pricing power, and consistent dividends.",
        icon: "check",
      },
      {
        title: "Current Status",
        description:
          "On watchlist - waiting for better entry point during market corrections.",
        icon: "down",
      },
      {
        title: "Outlook",
        description:
          "Long-term growth story intact with African expansion driving future growth.",
        icon: "up",
      },
    ],
    tradeSetup: {
      buyRange: "₦450.00 – ₦480.00",
      targetProfit: "+25%",
      riskPrice: "₦420.00",
    },
  },
  gtco: {
    name: "Guaranty Trust Holding Co",
    ticker: "GTCO",
    dateAdded: "November 20, 2024",
    sector: "Banking",
    analysis: [
      "GTCO is one of Nigeria's tier-1 banks with strong retail and corporate banking operations. The holding company structure allows for diversification into fintech and other financial services.",
      "The bank has consistently maintained industry-leading efficiency ratios and return on equity, making it a favorite among institutional investors.",
      "Recent monetary policy changes and higher interest rates have positively impacted net interest margins, boosting profitability.",
    ],
    highlights: [
      {
        title: "Why GTCO?",
        description:
          "Premier tier-1 bank with excellent management and consistent returns.",
        icon: "check",
      },
      {
        title: "Current Status",
        description:
          "Benefiting from higher interest rate environment with improved margins.",
        icon: "up",
      },
      {
        title: "Outlook",
        description:
          "Digital banking initiatives and holding company structure unlock future value.",
        icon: "up",
      },
    ],
    tradeSetup: {
      buyRange: "₦42.00 – ₦46.00",
      targetProfit: "+30%",
      riskPrice: "₦38.00",
    },
  },
};

export default function StockDetailPage() {
  const params = useParams();
  const stockId = params.ticker as string;
  const stock = stockData[stockId];

  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");

  if (!stock) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Stock not found</h1>
          <Link href="/stocks">
            <Button>Back to Stocks</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "check":
        return <CheckCircle className="w-6 h-6 text-primary-green" />;
      case "down":
        return <TrendingDown className="w-6 h-6 text-primary-orange" />;
      case "up":
        return <TrendingUp className="w-6 h-6 text-primary-green" />;
      default:
        return <BarChart3 className="w-6 h-6 text-primary-green" />;
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && comment) {
      // In production, this would send to an API
      window.location.href = `mailto:contact@investorsedge.com?subject=Comment on ${
        stock.ticker
      }&body=${encodeURIComponent(`From: ${email}\n\n${comment}`)}`;
      setEmail("");
      setComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-green/5 py-8 px-4 relative">
      <BackgroundCircles variant="sparse" />
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/stocks"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary-green transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stock Updates
          </Link>
        </motion.div>

        {/* Stock Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-primary-green/20 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {stock.name}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <span className="px-4 py-1.5 rounded-full bg-primary-green text-white font-semibold">
                  Ticker: {stock.ticker}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Added: {stock.dateAdded}
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Sector:{" "}
              <span className="font-semibold text-foreground">
                {stock.sector}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-primary-green mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-green" />
            Analysis
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {stock.analysis.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        {/* Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {stock.highlights.map((highlight, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 shadow-lg border border-primary-green/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                {getIcon(highlight.icon)}
                <h3 className="font-bold text-foreground">{highlight.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {highlight.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Trade Setup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-primary-green/5 to-white rounded-2xl p-6 shadow-lg border border-primary-green/20 mb-8"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-green" />
            Trade Setup
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 text-center shadow border border-primary-green/10">
              <div className="text-sm text-muted-foreground mb-2">
                Buy Range
              </div>
              <div className="text-xl font-bold text-primary-green">
                {stock.tradeSetup.buyRange}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 text-center shadow border border-primary-green/10">
              <div className="text-sm text-muted-foreground mb-2">
                Target Profit
              </div>
              <div className="text-xl font-bold text-primary-green">
                {stock.tradeSetup.targetProfit}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 text-center shadow border border-primary-orange/10">
              <div className="text-sm text-muted-foreground mb-2">
                Risk Price
              </div>
              <div className="text-xl font-bold text-primary-orange">
                {stock.tradeSetup.riskPrice}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-border/50 mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-green" />
            Share Your Thoughts
          </h2>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all"
            />
            <textarea
              placeholder="Leave a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all resize-none"
            />
            <Button
              type="submit"
              className="bg-primary-green hover:bg-primary-green/90 text-white"
            >
              Send Comment
            </Button>
          </form>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-primary-orange/5 border border-primary-orange/20 rounded-xl"
        >
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-primary-orange flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-primary-orange">Disclaimer:</strong> This
              is educational content only, not financial advice. Past
              performance does not guarantee future results. Always conduct your
              own research and consult a licensed financial advisor before
              making investment decisions.
            </span>
          </p>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Link href="/stocks">
            <Button
              variant="outline"
              className="border-primary-green text-primary-green hover:bg-primary-green hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stock Updates
            </Button>
          </Link>
        </motion.div>
      </div>

      <PageFooter />
    </div>
  );
}

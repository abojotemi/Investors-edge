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
  Loader2,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageFooter from "@/components/ui/page-footer";
import BackgroundCircles from "@/components/ui/background-circles";
import { StockPriceCard } from "@/components/ui/stock-price-card";
import { useContent } from "@/context/content-context";
import { useState } from "react";

// Sector labels and colors for display
const sectorLabels: Record<string, string> = {
  technology: "Technology",
  healthcare: "Healthcare",
  finance: "Finance",
  energy: "Energy",
  consumer: "Consumer",
  industrial: "Industrial",
  materials: "Materials",
  utilities: "Utilities",
  "real-estate": "Real Estate",
  communication: "Communication",
};

const sectorColors: Record<string, string> = {
  technology: "bg-blue-500",
  healthcare: "bg-green-500",
  finance: "bg-purple-500",
  energy: "bg-yellow-500",
  consumer: "bg-pink-500",
  industrial: "bg-gray-500",
  materials: "bg-orange-500",
  utilities: "bg-teal-500",
  "real-estate": "bg-indigo-500",
  communication: "bg-red-500",
};

export default function StockDetailPage() {
  const params = useParams();
  const stockId = params.ticker as string;
  const { stocks, loading } = useContent();

  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");

  // Find the stock by ID (which matches the URL ticker param)
  const stock = stocks.find((s) => s.id === stockId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading stock details...</p>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-primary-orange" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Stock not found</h1>
          <p className="text-muted-foreground mb-6">
            The stock you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/stocks">
            <Button className="bg-primary-green hover:bg-primary-green/90 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stocks
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && comment) {
      window.location.href = `mailto:contact@investorsedge.com?subject=Comment on ${
        stock.ticker
      }&body=${encodeURIComponent(`From: ${email}\n\n${comment}`)}`;
      setEmail("");
      setComment("");
    }
  };

  // Generate highlights from stock data
  const highlights = [
    {
      title: "Why " + stock.ticker + "?",
      description:
        stock.description ||
        "A strong investment opportunity based on our analysis.",
      icon: "check" as const,
    },
    {
      title: "Current Status",
      description:
        stock.status === "active"
          ? "Actively monitored with ongoing analysis."
          : "This position has been closed.",
      icon: stock.status === "active" ? ("up" as const) : ("down" as const),
    },
    {
      title: "Outlook",
      description: `Target price of ₦${stock.targetPrice.toFixed(
        2
      )} represents a ${(
        ((stock.targetPrice - stock.entryPrice) / stock.entryPrice) *
        100
      ).toFixed(0)}% potential gain.`,
      icon: "up" as const,
    },
  ];

  const getIcon = (type: "check" | "down" | "up") => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10 py-8 px-4 relative">
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
          className="bg-gradient-to-br from-white to-primary-green/5 rounded-2xl p-6 shadow-lg border-2 border-primary-green/20 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {stock.name}
              </h1>
              <div className="flex items-center flex-wrap gap-3 mt-3">
                <span className="px-4 py-1.5 rounded-full bg-primary-green text-white font-semibold">
                  Ticker: {stock.ticker}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                    sectorColors[stock.sector] || "bg-gray-500"
                  }`}
                >
                  {sectorLabels[stock.sector] || stock.sector}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Added:{" "}
                  {new Date(stock.dateAdded).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            {stock.status === "closed" && (
              <div className="px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground">
                <span className="font-semibold">Closed Position</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Real-time Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <StockPriceCard
            ticker={stock.ticker}
            isNigerian={true}
            showDetails={true}
          />
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
          <div
            className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: stock.analysis || "" }}
          />
        </motion.div>

        {/* Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-primary-green/5 rounded-2xl p-5 shadow-lg border-2 border-primary-green/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
          className="bg-gradient-to-br from-primary-green/5 to-white rounded-2xl p-6 shadow-lg border-2 border-primary-green/20 mb-8"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-green" />
            Trade Setup
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 text-center shadow border-2 border-primary-green/10 hover:border-primary-green/30 transition-colors">
              <div className="text-sm text-muted-foreground mb-2">
                Entry Price
              </div>
              <div className="text-2xl font-bold text-primary-green">
                ₦{stock.entryPrice.toFixed(2)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 text-center shadow border-2 border-primary-green/10 hover:border-primary-green/30 transition-colors">
              <div className="text-sm text-muted-foreground mb-2">
                Target Price
              </div>
              <div className="text-2xl font-bold text-primary-green">
                ₦{stock.targetPrice.toFixed(2)}
              </div>
              <div className="text-xs text-primary-green mt-1">
                +
                {(
                  ((stock.targetPrice - stock.entryPrice) / stock.entryPrice) *
                  100
                ).toFixed(0)}
                % Potential
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 text-center shadow border-2 border-primary-orange/10 hover:border-primary-orange/30 transition-colors">
              <div className="text-sm text-muted-foreground mb-2">
                Stop Loss
              </div>
              <div className="text-2xl font-bold text-primary-orange">
                ₦{stock.stopLoss.toFixed(2)}
              </div>
              <div className="text-xs text-primary-orange mt-1">
                {(
                  ((stock.stopLoss - stock.entryPrice) / stock.entryPrice) *
                  100
                ).toFixed(0)}
                % Risk
              </div>
            </div>
          </div>
        </motion.div>

        {/* Closed Position Notes */}
        {stock.status === "closed" && stock.closingNotes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-muted/50 rounded-2xl p-6 shadow-lg border border-border/50 mb-8"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              Closing Notes
            </h2>
            {stock.closingPrice && (
              <p className="text-muted-foreground mb-3">
                <span className="font-semibold">Closing Price:</span> ₦
                {stock.closingPrice.toFixed(2)}
                <span className="ml-2">
                  (
                  {(
                    ((stock.closingPrice - stock.entryPrice) /
                      stock.entryPrice) *
                    100
                  ).toFixed(1)}
                  % {stock.closingPrice >= stock.entryPrice ? "gain" : "loss"})
                </span>
              </p>
            )}
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: stock.closingNotes }}
            />
          </motion.div>
        )}

        {/* Comment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border-2 border-border/50 mb-8"
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
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all"
            />
            <textarea
              placeholder="Leave a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all resize-none"
            />
            <Button
              type="submit"
              className="bg-primary-green hover:bg-primary-green/90 text-white font-semibold px-6"
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
          className="p-4 bg-primary-orange/5 border-2 border-primary-orange/20 rounded-xl"
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
              className="border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stock Updates
            </Button>
          </Link>
        </motion.div>
      </div>

    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Loader2,
  Activity,
  Globe,
  RefreshCw,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageFooter from "@/components/ui/page-footer";
import BackgroundCircles from "@/components/ui/background-circles";
import {
  getStockQuote,
  getStockHistory,
  formatPrice,
  formatPercentChange,
  formatLargeNumber,
  type StockQuote,
  type StockHistoricalData,
} from "@/lib/api/stocks";

export default function StockDetailPage() {
  const params = useParams();
  const ticker = (params.ticker as string).toUpperCase();
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [history, setHistory] = useState<StockHistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRange, setSelectedRange] = useState<
    "1d" | "5d" | "1mo" | "3mo" | "1y"
  >("1mo");

  useEffect(() => {
    const fetchData = async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const [quoteData, historyData] = await Promise.all([
          getStockQuote(ticker, false),
          getStockHistory(ticker, selectedRange, false),
        ]);
        setQuote(quoteData);
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => fetchData(true), 60000);
    return () => clearInterval(interval);
  }, [ticker, selectedRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [quoteData, historyData] = await Promise.all([
        getStockQuote(ticker, false),
        getStockHistory(ticker, selectedRange, false),
      ]);
      setQuote(quoteData);
      setHistory(historyData);
    } catch (error) {
      console.error("Error refreshing stock data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const isPositive = quote && quote.changePercent >= 0;

  // Calculate price range percentage
  const getPriceRangePercent = () => {
    if (!quote || quote.dayLow === quote.dayHigh) return 50;
    return (
      ((quote.price - quote.dayLow) / (quote.dayHigh - quote.dayLow)) * 100
    );
  };

  // Calculate 52-week range percentage
  const get52WeekPercent = () => {
    if (!quote || !quote.fiftyTwoWeekLow || !quote.fiftyTwoWeekHigh)
      return null;
    if (quote.fiftyTwoWeekLow === quote.fiftyTwoWeekHigh) return 50;
    return (
      ((quote.price - quote.fiftyTwoWeekLow) /
        (quote.fiftyTwoWeekHigh - quote.fiftyTwoWeekLow)) *
      100
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-green mx-auto mb-4" />
          <p className="text-muted-foreground">Loading {ticker} data...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Stock not found</h1>
          <p className="text-muted-foreground mb-6">
            Unable to find data for ticker &quot;{ticker}&quot;. Please check
            the symbol and try again.
          </p>
          <Link href="/stocks">
            <Button className="bg-primary-green hover:bg-primary-green/90">
              Back to Stocks
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-green/5 relative">
      <BackgroundCircles variant="sparse" />

      <div className="max-w-4xl mx-auto py-8 px-4">
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
            Back to Stocks
          </Link>
        </motion.div>

        {/* Stock Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-8 border-2 border-primary-green/20 overflow-hidden">
            <div
              className={`h-1.5 ${
                isPositive
                  ? "bg-gradient-to-r from-primary-green to-emerald-400"
                  : "bg-gradient-to-r from-red-500 to-red-400"
              }`}
            />
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {quote.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <Badge className="bg-primary-green text-white px-4 py-1.5 text-sm font-mono">
                      {quote.symbol}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {quote.exchange}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="ml-auto"
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-1 ${
                          refreshing ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl md:text-4xl font-bold text-foreground">
                    {formatPrice(quote.price, quote.currency)}
                  </p>
                  <div
                    className={`flex items-center justify-end gap-2 mt-2 ${
                      isPositive ? "text-primary-green" : "text-red-500"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                    <span className="text-lg font-semibold">
                      {formatPercentChange(quote.changePercent)}
                    </span>
                    <span className="text-muted-foreground">
                      ({isPositive ? "+" : ""}
                      {quote.change.toFixed(2)})
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-green" />
                Key Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Open</p>
                  <p className="text-lg font-semibold">
                    {formatPrice(quote.open, quote.currency)}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Previous Close
                  </p>
                  <p className="text-lg font-semibold">
                    {formatPrice(quote.previousClose, quote.currency)}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Volume</p>
                  <p className="text-lg font-semibold">
                    {formatLargeNumber(quote.volume)}
                  </p>
                </div>
                {quote.marketCap && quote.marketCap > 0 && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Market Cap
                    </p>
                    <p className="text-lg font-semibold">
                      {formatLargeNumber(quote.marketCap)}
                    </p>
                  </div>
                )}
              </div>

              {/* Day Range */}
              {quote.dayLow > 0 && quote.dayHigh > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Day Range</span>
                    <span className="font-medium">
                      {formatPrice(quote.dayLow, quote.currency)} -{" "}
                      {formatPrice(quote.dayHigh, quote.currency)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-green to-emerald-400 rounded-full relative"
                      style={{ width: `${getPriceRangePercent()}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-primary-green rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* 52-Week Range */}
              {quote.fiftyTwoWeekLow && quote.fiftyTwoWeekHigh && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">52-Week Range</span>
                    <span className="font-medium">
                      {formatPrice(quote.fiftyTwoWeekLow, quote.currency)} -{" "}
                      {formatPrice(quote.fiftyTwoWeekHigh, quote.currency)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-orange to-amber-400 rounded-full relative"
                      style={{ width: `${get52WeekPercent()}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-primary-orange rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Price History Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-orange" />
                  Price History
                </CardTitle>
                <div className="flex gap-1">
                  {(["1d", "5d", "1mo", "3mo", "1y"] as const).map((range) => (
                    <Button
                      key={range}
                      variant={selectedRange === range ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedRange(range)}
                      className={
                        selectedRange === range
                          ? "bg-primary-green hover:bg-primary-green/90"
                          : ""
                      }
                    >
                      {range.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-4">
                  {/* Simple price summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">
                        Start
                      </p>
                      <p className="font-semibold">
                        {formatPrice(history[0].close, quote.currency)}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">End</p>
                      <p className="font-semibold">
                        {formatPrice(
                          history[history.length - 1].close,
                          quote.currency
                        )}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">High</p>
                      <p className="font-semibold text-primary-green">
                        {formatPrice(
                          Math.max(...history.map((h) => h.high)),
                          quote.currency
                        )}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">Low</p>
                      <p className="font-semibold text-red-500">
                        {formatPrice(
                          Math.min(...history.map((h) => h.low)),
                          quote.currency
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Simple visual price indicator */}
                  <div className="h-24 flex items-end gap-0.5">
                    {history.slice(-30).map((day, i) => {
                      const minPrice = Math.min(
                        ...history.slice(-30).map((h) => h.low)
                      );
                      const maxPrice = Math.max(
                        ...history.slice(-30).map((h) => h.high)
                      );
                      const height =
                        ((day.close - minPrice) / (maxPrice - minPrice)) * 100;
                      const isUp = day.close >= day.open;

                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-t transition-all hover:opacity-80 ${
                            isUp ? "bg-primary-green" : "bg-red-400"
                          }`}
                          style={{ height: `${Math.max(height, 5)}%` }}
                          title={`${day.date.toLocaleDateString()}: ${formatPrice(
                            day.close,
                            quote.currency
                          )}`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Last {Math.min(30, history.length)} trading days
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Historical data unavailable</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-8 bg-gradient-to-br from-primary-green/5 to-white border-2 border-primary-green/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary-green" />
                Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    Current Price
                  </div>
                  <div className="text-2xl font-bold text-primary-green">
                    {formatPrice(quote.price, quote.currency)}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    Today&apos;s Change
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isPositive ? "text-primary-green" : "text-red-500"
                    }`}
                  >
                    {formatPercentChange(quote.changePercent)}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    Trading Volume
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatLargeNumber(quote.volume)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-primary-orange/5 border border-primary-orange/20 rounded-xl mb-8"
        >
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-primary-orange flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-primary-orange">Disclaimer:</strong> Stock
              data is provided for informational purposes only. Prices may be
              delayed up to 15 minutes. This is not financial advice. Always
              conduct your own research and consult a licensed financial advisor
              before making investment decisions.
            </span>
          </p>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/stocks">
            <Button
              variant="outline"
              className="border-primary-green text-primary-green hover:bg-primary-green hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stocks
            </Button>
          </Link>
        </motion.div>
      </div>

      <PageFooter />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Loader2,
  Star,
  Clock,
  Globe,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageFooter from "@/components/ui/page-footer";
import BackgroundCircles from "@/components/ui/background-circles";
import {
  searchStocks,
  getStockQuote,
  formatPrice,
  formatPercentChange,
  formatLargeNumber,
  type StockQuote,
} from "@/lib/api/stocks";

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
}

// Popular stocks to show by default
const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ" },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ" },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE" },
];

// Stock card with live price data
function StockCard({
  symbol,
  name,
  exchange,
  index,
}: SearchResult & { index: number }) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      const data = await getStockQuote(symbol, false);
      setQuote(data);
      setLoading(false);
    };

    fetchQuote();
  }, [symbol]);

  const isPositive = quote && quote.changePercent >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/stocks/${symbol}`}>
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          {/* Top gradient bar */}
          <div
            className={`absolute top-0 left-0 w-full h-1.5 ${
              loading
                ? "bg-gray-200"
                : isPositive
                ? "bg-gradient-to-r from-primary-green to-emerald-400"
                : "bg-gradient-to-r from-red-500 to-red-400"
            }`}
          />

          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary-green transition-colors truncate">
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="font-mono font-semibold text-primary-green border-primary-green/30"
                >
                  {symbol}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {exchange}
                </span>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-4">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 bg-gray-100 animate-pulse rounded" />
                <div className="h-5 w-16 bg-gray-100 animate-pulse rounded" />
              </div>
            ) : quote ? (
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {formatPrice(quote.price, quote.currency)}
                  </p>
                  <div
                    className={`flex items-center gap-1 mt-1 ${
                      isPositive ? "text-primary-green" : "text-red-500"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-semibold text-sm">
                      {formatPercentChange(quote.changePercent)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({isPositive ? "+" : ""}
                      {quote.change.toFixed(2)})
                    </span>
                  </div>
                </div>
                {quote.volume > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="text-sm font-medium">
                      {formatLargeNumber(quote.volume)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Price unavailable</p>
            )}
          </div>

          {/* Price Range */}
          {quote && quote.dayLow > 0 && quote.dayHigh > 0 && (
            <div className="mt-4 pt-3 border-t border-border/50">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Day Range</span>
                <span>
                  {formatPrice(quote.dayLow, quote.currency)} -{" "}
                  {formatPrice(quote.dayHigh, quote.currency)}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function StocksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    // Initialize from localStorage on mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentStockSearches");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Save search to recent searches
  const saveRecentSearch = useCallback((query: string) => {
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((s) => s !== query)].slice(0, 5);
      localStorage.setItem("recentStockSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentStockSearches");
  };

  // Handle search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setHasSearched(true);
      const results = await searchStocks(searchQuery);
      setSearchResults(results);
      setSearching(false);

      if (results.length > 0) {
        saveRecentSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, saveRecentSearch]);

  const displayedStocks = hasSearched ? searchResults : POPULAR_STOCKS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-green/5 relative flex flex-col">
      <BackgroundCircles />

      <section className="relative py-12 md:py-20 px-4 overflow-hidden flex-1">
        {/* Background decorative circles */}
        <motion.div
          className="absolute top-10 right-20 w-64 h-64 rounded-full bg-primary-green/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-green/10 text-primary-green text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4" />
              Live Stock Data
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Stocks
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search any stock and get real-time prices, charts, and market
              data. Track US and global markets instantly.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search stocks by name or symbol (e.g., AAPL, Tesla, Microsoft)..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 pr-12 py-6 text-lg rounded-xl border-2 focus:border-primary-green shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              {searching && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-green" />
                </div>
              )}
            </div>

            {/* Recent Searches */}
            <AnimatePresence>
              {!searchQuery && recentSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Recent searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSearchChange(search)}
                        className="px-3 py-1 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2 mb-6"
          >
            {hasSearched ? (
              <>
                <Search className="w-5 h-5 text-primary-green" />
                <h2 className="text-xl font-semibold">
                  {searchResults.length > 0
                    ? `Found ${searchResults.length} result${
                        searchResults.length !== 1 ? "s" : ""
                      }`
                    : "No results found"}
                </h2>
              </>
            ) : (
              <>
                <Star className="w-5 h-5 text-primary-orange" />
                <h2 className="text-xl font-semibold">Popular Stocks</h2>
              </>
            )}
          </motion.div>

          {/* Stock Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedStocks.map((stock, index) => (
              <StockCard key={stock.symbol} {...stock} index={index} />
            ))}
          </div>

          {/* Empty Search State */}
          {hasSearched && searchResults.length === 0 && !searching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No stocks found for &quot;{searchQuery}&quot;
              </h3>
              <p className="text-muted-foreground mb-4">
                Try searching with a different term or stock symbol
              </p>
              <Button variant="outline" onClick={() => handleSearchChange("")}>
                View Popular Stocks
              </Button>
            </motion.div>
          )}

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-4 bg-primary-orange/5 border border-primary-orange/20 rounded-xl text-center"
          >
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary-orange">Disclaimer:</strong> Stock
              data is provided for informational purposes only. Prices may be
              delayed. Always do your own research and consult with a financial
              advisor before making investment decisions.
            </p>
          </motion.div>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}

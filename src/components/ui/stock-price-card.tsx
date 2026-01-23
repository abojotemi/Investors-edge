"use client";

import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStockQuote } from "@/hooks/use-stock-quote";
import {
  formatPrice,
  formatPercentChange,
  formatLargeNumber,
} from "@/lib/api/stocks";

interface StockPriceCardProps {
  ticker: string;
  isNigerian?: boolean;
  showDetails?: boolean;
  className?: string;
}

export function StockPriceCard({
  ticker,
  isNigerian = true,
  showDetails = false,
  className = "",
}: StockPriceCardProps) {
  const { quote, loading, error, refetch } = useStockQuote(ticker, isNigerian);

  if (loading) {
    return (
      <Card className={`border-2 border-primary-green/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !quote) {
    return (
      <Card
        className={`border-2 border-yellow-200 bg-yellow-50/50 ${className}`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Price data unavailable</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-yellow-600 hover:text-yellow-700"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = quote.change >= 0;

  return (
    <Card
      className={`border-2 ${
        isPositive
          ? "border-green-200 bg-green-50/30"
          : "border-red-200 bg-red-50/30"
      } ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground">
                {quote.symbol}
              </span>
              <span className="text-xs text-muted-foreground">
                {quote.exchange}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {formatPrice(quote.price, quote.currency)}
            </div>
            <div
              className={`flex items-center gap-1 mt-1 ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">
                {isPositive ? "+" : ""}
                {formatPrice(quote.change, quote.currency)}
              </span>
              <span className="text-sm">
                ({formatPercentChange(quote.changePercent)})
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {showDetails && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border/50">
            <div>
              <div className="text-xs text-muted-foreground">Open</div>
              <div className="font-medium">
                {formatPrice(quote.open, quote.currency)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Prev Close</div>
              <div className="font-medium">
                {formatPrice(quote.previousClose, quote.currency)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Day High</div>
              <div className="font-medium text-green-600">
                {formatPrice(quote.dayHigh, quote.currency)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Day Low</div>
              <div className="font-medium text-red-600">
                {formatPrice(quote.dayLow, quote.currency)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="font-medium">
                {formatLargeNumber(quote.volume)}
              </div>
            </div>
            {quote.fiftyTwoWeekHigh && (
              <div>
                <div className="text-xs text-muted-foreground">52W High</div>
                <div className="font-medium">
                  {formatPrice(quote.fiftyTwoWeekHigh, quote.currency)}
                </div>
              </div>
            )}
            {quote.fiftyTwoWeekLow && (
              <div>
                <div className="text-xs text-muted-foreground">52W Low</div>
                <div className="font-medium">
                  {formatPrice(quote.fiftyTwoWeekLow, quote.currency)}
                </div>
              </div>
            )}
            <div>
              <div className="text-xs text-muted-foreground">Updated</div>
              <div className="font-medium text-xs">
                {quote.lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Inline stock price display for use in stock cards
 */
interface StockPriceInlineProps {
  ticker: string;
  isNigerian?: boolean;
}

export function StockPriceInline({
  ticker,
  isNigerian = true,
}: StockPriceInlineProps) {
  const { quote, loading, error } = useStockQuote(ticker, isNigerian, 120000); // 2 min refresh

  if (loading) {
    return <Skeleton className="h-5 w-24 inline-block" />;
  }

  if (error || !quote) {
    return (
      <span className="text-sm text-muted-foreground italic">
        Price unavailable
      </span>
    );
  }

  const isPositive = quote.change >= 0;

  return (
    <div className="inline-flex items-center gap-2">
      <span className="font-bold">
        {formatPrice(quote.price, quote.currency)}
      </span>
      <span
        className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {formatPercentChange(quote.changePercent)}
      </span>
    </div>
  );
}

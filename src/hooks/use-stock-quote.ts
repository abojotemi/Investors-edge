"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getStockQuote,
  getMultipleStockQuotes,
  type StockQuote,
} from "@/lib/api/stocks";

interface UseStockQuoteResult {
  quote: StockQuote | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseMultipleStockQuotesResult {
  quotes: Map<string, StockQuote>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch a single stock quote with auto-refresh
 */
export function useStockQuote(
  ticker: string | undefined,
  isNigerian: boolean = true,
  refreshInterval: number = 60000 // 1 minute default
): UseStockQuoteResult {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!ticker) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await getStockQuote(ticker, isNigerian);
      setQuote(data);
    } catch (err) {
      setError("Failed to fetch stock data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ticker, isNigerian]);

  useEffect(() => {
    fetchQuote();

    // Set up auto-refresh
    if (refreshInterval > 0) {
      const interval = setInterval(fetchQuote, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchQuote, refreshInterval]);

  return { quote, loading, error, refetch: fetchQuote };
}

/**
 * Hook to fetch multiple stock quotes with auto-refresh
 */
export function useMultipleStockQuotes(
  tickers: string[],
  isNigerian: boolean = true,
  refreshInterval: number = 60000 // 1 minute default
): UseMultipleStockQuotesResult {
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    if (tickers.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await getMultipleStockQuotes(tickers, isNigerian);
      setQuotes(data);
    } catch (err) {
      setError("Failed to fetch stock data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tickers, isNigerian]);

  useEffect(() => {
    fetchQuotes();

    // Set up auto-refresh
    if (refreshInterval > 0) {
      const interval = setInterval(fetchQuotes, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchQuotes, refreshInterval]);

  return { quotes, loading, error, refetch: fetchQuotes };
}

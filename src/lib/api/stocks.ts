// Free Stock API Service using Yahoo Finance (via RapidAPI free tier or direct endpoint)
// This provides real-time stock data for Nigerian and US stocks

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  currency: string;
  exchange: string;
  lastUpdated: Date;
}

export interface StockHistoricalData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Get real-time stock quote via our API proxy (to avoid CORS issues)
 * For Nigerian stocks, the API will append .LG to the ticker
 */
export async function getStockQuote(
  ticker: string,
  isNigerian: boolean = true
): Promise<StockQuote | null> {
  try {
    const url = `/api/stocks/${encodeURIComponent(
      ticker
    )}?nigerian=${isNigerian}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch stock data for ${ticker}`);
      return null;
    }

    const data = await response.json();

    if (data.error) {
      return null;
    }

    return {
      ...data,
      lastUpdated: new Date(data.lastUpdated),
    };
  } catch (error) {
    console.error(`Error fetching stock quote for ${ticker}:`, error);
    return null;
  }
}

/**
 * Get multiple stock quotes at once
 */
export async function getMultipleStockQuotes(
  tickers: string[],
  isNigerian: boolean = true
): Promise<Map<string, StockQuote>> {
  const quotes = new Map<string, StockQuote>();

  // Fetch all quotes in parallel
  const promises = tickers.map((ticker) => getStockQuote(ticker, isNigerian));
  const results = await Promise.all(promises);

  results.forEach((quote, index) => {
    if (quote) {
      quotes.set(tickers[index], quote);
    }
  });

  return quotes;
}

/**
 * Get historical stock data for charting (via API proxy)
 */
export async function getStockHistory(
  ticker: string,
  range: "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "5y" = "1mo",
  isNigerian: boolean = true
): Promise<StockHistoricalData[]> {
  try {
    const url = `/api/stocks/${encodeURIComponent(
      ticker
    )}/history?range=${range}&nigerian=${isNigerian}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch historical data for ${ticker}`);
      return [];
    }

    const data = await response.json();

    if (data.error) {
      return [];
    }

    return data.map(
      (item: {
        date: string;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
      }) => ({
        ...item,
        date: new Date(item.date),
      })
    );
  } catch (error) {
    console.error(`Error fetching stock history for ${ticker}:`, error);
    return [];
  }
}

/**
 * Search for stocks by name or ticker (via API proxy)
 */
export async function searchStocks(
  query: string
): Promise<{ symbol: string; name: string; exchange: string }[]> {
  try {
    const url = `/api/stocks/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (data.error) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error searching stocks:", error);
    return [];
  }
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format large numbers (for volume, market cap)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }
  return num.toString();
}

/**
 * Format percentage change
 */
export function formatPercentChange(percent: number): string {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(2)}%`;
}

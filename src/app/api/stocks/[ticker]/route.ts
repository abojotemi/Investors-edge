import { NextRequest, NextResponse } from "next/server";

// Finnhub API (free tier: 60 calls/minute)
// Get your free API key at: https://finnhub.io/
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || "";

// Nigerian Stock Exchange suffix for Yahoo
const NSE_SUFFIX = ".LG";

interface FinnhubQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

async function fetchFromFinnhub(symbol: string): Promise<{
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  name: string;
  currency: string;
  exchange: string;
} | null> {
  if (!FINNHUB_API_KEY) {
    console.log("Finnhub API key not configured");
    return null;
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
      symbol
    )}&token=${FINNHUB_API_KEY}`;
    console.log(`Fetching from Finnhub: ${symbol}`);

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.log(`Finnhub response not ok: ${response.statusText}`);
      return null;
    }

    const data: FinnhubQuote = await response.json();
    console.log(`Finnhub data:`, JSON.stringify(data));

    // Finnhub returns {c: 0, d: null, ...} for invalid symbols
    if (!data.c || data.c === 0) {
      console.log("No valid price from Finnhub");
      return null;
    }

    return {
      price: data.c,
      change: data.d || 0,
      changePercent: data.dp || 0,
      open: data.o || 0,
      high: data.h || 0,
      low: data.l || 0,
      previousClose: data.pc || 0,
      volume: 0,
      name: symbol,
      currency: "USD",
      exchange: "US",
    };
  } catch (error) {
    console.error(`Error fetching from Finnhub for ${symbol}:`, error);
    return null;
  }
}

async function fetchFromYahoo(symbol: string): Promise<{
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  name: string;
  currency: string;
  exchange: string;
} | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?interval=1d&range=1d`;
    console.log(`Fetching from Yahoo: ${url}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(`Yahoo response status: ${response.status}`);

    if (!response.ok) {
      console.log(`Yahoo response not ok: ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    const result = data.chart?.result?.[0];
    if (!result) {
      console.log("No result in Yahoo response");
      return null;
    }

    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];
    const timestamps = result.timestamp;
    const lastIndex = timestamps ? timestamps.length - 1 : 0;

    const currentPrice = meta.regularMarketPrice || quote?.close?.[lastIndex];
    const previousClose = meta.previousClose || meta.chartPreviousClose;

    if (!currentPrice) {
      console.log("No price in Yahoo response");
      return null;
    }

    const change = currentPrice - previousClose;
    const changePercent = previousClose ? (change / previousClose) * 100 : 0;

    return {
      price: currentPrice || 0,
      change: change || 0,
      changePercent: changePercent || 0,
      open: quote?.open?.[lastIndex] || meta.regularMarketOpen || 0,
      high: quote?.high?.[lastIndex] || meta.regularMarketDayHigh || 0,
      low: quote?.low?.[lastIndex] || meta.regularMarketDayLow || 0,
      previousClose: previousClose || 0,
      volume: quote?.volume?.[lastIndex] || meta.regularMarketVolume || 0,
      name: meta.shortName || meta.longName || symbol,
      currency: meta.currency || "USD",
      exchange: meta.exchangeName || "Unknown",
    };
  } catch (error) {
    console.error(`Error fetching from Yahoo for ${symbol}:`, error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const searchParams = request.nextUrl.searchParams;
    const isNigerian = searchParams.get("nigerian") !== "false";

    console.log(
      `Stock API called for ticker: ${ticker}, isNigerian: ${isNigerian}`
    );

    // Try Finnhub first (works for US stocks, 60 calls/min)
    console.log(`Trying Finnhub for: ${ticker}`);
    const finnhubData = await fetchFromFinnhub(ticker);

    if (finnhubData) {
      console.log(`Got data from Finnhub for: ${ticker}`);
      return NextResponse.json({
        symbol: ticker,
        name: finnhubData.name,
        price: finnhubData.price,
        change: finnhubData.change,
        changePercent: finnhubData.changePercent,
        previousClose: finnhubData.previousClose,
        open: finnhubData.open,
        dayHigh: finnhubData.high,
        dayLow: finnhubData.low,
        volume: finnhubData.volume,
        currency: finnhubData.currency,
        exchange: finnhubData.exchange,
        lastUpdated: new Date().toISOString(),
      });
    }

    // For Nigerian stocks, try Yahoo with .LG suffix
    if (isNigerian) {
      const yahooSymbol = `${ticker}${NSE_SUFFIX}`;
      console.log(`Trying Nigerian symbol: ${yahooSymbol}`);
      const yahooData = await fetchFromYahoo(yahooSymbol);

      if (yahooData) {
        console.log(`Got data for Nigerian stock: ${yahooSymbol}`);
        return NextResponse.json({
          symbol: yahooSymbol,
          name: yahooData.name,
          price: yahooData.price,
          change: yahooData.change,
          changePercent: yahooData.changePercent,
          previousClose: yahooData.previousClose,
          open: yahooData.open,
          dayHigh: yahooData.high,
          dayLow: yahooData.low,
          volume: yahooData.volume,
          currency: yahooData.currency,
          exchange: yahooData.exchange,
          lastUpdated: new Date().toISOString(),
        });
      }
    }

    // Try Yahoo without suffix as final fallback
    console.log(`Trying Yahoo for symbol: ${ticker}`);
    const yahooData = await fetchFromYahoo(ticker);

    if (yahooData) {
      console.log(`Got data for stock: ${ticker}`);
      return NextResponse.json({
        symbol: ticker,
        name: yahooData.name,
        price: yahooData.price,
        change: yahooData.change,
        changePercent: yahooData.changePercent,
        previousClose: yahooData.previousClose,
        open: yahooData.open,
        dayHigh: yahooData.high,
        dayLow: yahooData.low,
        volume: yahooData.volume,
        currency: yahooData.currency,
        exchange: yahooData.exchange,
        lastUpdated: new Date().toISOString(),
      });
    }

    console.log(`No data found for ticker: ${ticker}`);
    return NextResponse.json({ error: "Stock not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

// Yahoo Finance API URL
const YAHOO_FINANCE_BASE_URL = "https://query1.finance.yahoo.com/v8/finance";

// Nigerian Stock Exchange suffix
const NSE_SUFFIX = ".LG";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const searchParams = request.nextUrl.searchParams;
    const isNigerian = searchParams.get("nigerian") !== "false";
    const range = searchParams.get("range") || "1mo";

    const symbol = isNigerian ? `${ticker}${NSE_SUFFIX}` : ticker;
    const interval = range === "1d" ? "5m" : range === "5d" ? "15m" : "1d";

    const url = `${YAHOO_FINANCE_BASE_URL}/chart/${symbol}?interval=${interval}&range=${range}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch historical data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];

    if (!result) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0] || {};

    const history = timestamps.map((timestamp: number, index: number) => ({
      date: new Date(timestamp * 1000).toISOString(),
      open: quote.open?.[index] || 0,
      high: quote.high?.[index] || 0,
      low: quote.low?.[index] || 0,
      close: quote.close?.[index] || 0,
      volume: quote.volume?.[index] || 0,
    }));

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
      query
    )}&quotesCount=10&newsCount=0`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to search stocks" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const quotes = data.quotes || [];

    const results = quotes.map(
      (quote: {
        symbol: string;
        shortname?: string;
        longname?: string;
        exchange: string;
      }) => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname || quote.symbol,
        exchange: quote.exchange,
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error searching stocks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

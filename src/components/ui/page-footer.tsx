"use client";

import Link from "next/link";
import Image from "next/image";

export default function PageFooter() {
  return (
    <footer className="bg-foreground text-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <Link href="/home">
            <Image
              src="/logo.png"
              alt="Logo"
              width={160}
              height={40}
              className="h-10 w-auto object-contain invert"
            />
            </Link>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-background/70">
            <Link
              href="/"
              className="hover:text-primary-green transition-colors"
            >
              Home
            </Link>
            <Link
              href="/stocks"
              className="hover:text-primary-green transition-colors"
            >
              Stocks
            </Link>
            <Link
              href="/learn"
              className="hover:text-primary-green transition-colors"
            >
              Learn
            </Link>
            <Link
              href="/insights"
              className="hover:text-primary-green transition-colors"
            >
              Insights
            </Link>
          </nav>
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} Investor&apos;s Edge | Knowledge First,
            Profit Next
          </p>
        </div>
      </div>
    </footer>
  );
}

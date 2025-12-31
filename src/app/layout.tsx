import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navbar";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Investor's Edge - Student Investing Made Simple",
  description:
    "Empowering students to build wealth early through smart investing. Learn, invest, and grow your financial future while still in school.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${oswald.variable} font-oswald tracking-wide antialiased flex flex-col min-w-screen max-w-screen overflow-hidden`}
      >
        <Navigation />
        <div className="flex w-full flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}

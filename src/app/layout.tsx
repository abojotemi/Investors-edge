import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navbar";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Investor's Edge - Smart Investing Made Simple",
  description:
    "Empowering everyone to build wealth through smart investing. Learn, invest, and grow your financial future with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${inter.variable} font-inter tracking-wide antialiased flex flex-col min-w-screen max-w-screen overflow-x-hidden`}
      >
        <AuthProvider>
          <Navigation />
          <div className="flex w-full flex-1 flex-col">{children}</div>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

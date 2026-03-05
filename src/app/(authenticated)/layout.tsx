"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ContentProvider } from "@/context/content-context";
import PageFooter from "@/components/ui/page-footer";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isOnForum = pathname.startsWith("/community/forum");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children until we confirm user is authenticated
  if (!user) {
    return null;
  }

  return (
    <ContentProvider>
      {children}
      <PageFooter />

      {/* Floating Discussion Forum Bubble */}
      {!isOnForum && (
        <Link
          href="/community/forum"
          title="Discussion Forum"
          className="fixed bottom-6 right-6 z-50 group"
        >
          <span className="absolute inset-0 rounded-full bg-primary-green/30 animate-ping" />
          <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary-green text-white shadow-lg hover:bg-primary-green/90 hover:scale-110 transition-all duration-200">
            <MessageCircle className="w-6 h-6" />
          </span>
        </Link>
      )}
    </ContentProvider>
  );
}

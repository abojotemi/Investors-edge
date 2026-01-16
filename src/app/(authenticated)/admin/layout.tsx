"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Video,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Home,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useAdmin, AdminProvider } from "@/context/admin-context";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Videos",
    href: "/admin/videos",
    icon: Video,
  },
  {
    label: "Articles",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut, loading: authLoading } = useAuth();
  const { isAdmin, adminLoading, adminUser } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Skip auth check for admin login page
  const isLoginPage = pathname === "/admin/login";

  // TODO: Re-enable admin check after development
  // useEffect(() => {
  //   if (!authLoading && !adminLoading && mounted && !isLoginPage) {
  //     if (!user) {
  //       router.push("/admin/login");
  //     } else if (!isAdmin) {
  //       router.push("/unauthorized");
  //     }
  //   }
  // }, [user, isAdmin, authLoading, adminLoading, router, mounted, isLoginPage]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Allow login page to render without auth checks
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (authLoading || adminLoading || !mounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // TODO: Re-enable admin check after development
  // if (!user || !isAdmin) {
  //   return (
  //     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  //       <div className="text-center">
  //         <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
  //         <h1 className="text-2xl font-bold text-gray-900 mb-2">
  //           Access Denied
  //         </h1>
  //         <p className="text-gray-600 mb-6">
  //           You don&apos;t have permission to access this area.
  //         </p>
  //         <Link href="/">
  //           <Button className="bg-primary-green hover:bg-primary-green/90">
  //             <Home className="w-4 h-4 mr-2" />
  //             Go Home
  //           </Button>
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary-green" />
                <span className="text-xl font-bold">Admin Panel</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-green text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              {adminUser?.photoURL ? (
                <img
                  src={adminUser.photoURL}
                  alt={adminUser.displayName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {adminUser?.displayName?.charAt(0) || "A"}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {adminUser?.displayName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {adminUser?.email}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <Home className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-primary-green">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Admin</span>
              {pathname !== "/admin" && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-gray-900 font-medium capitalize">
                    {pathname.split("/").pop()?.replace(/-/g, " ")}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Welcome, {adminUser?.displayName?.split(" ")[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}

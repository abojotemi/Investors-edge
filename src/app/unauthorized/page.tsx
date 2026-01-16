"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldOff, Home, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4 relative">
      <BackgroundCircles variant="sparse" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center relative z-10"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>

        <p className="text-gray-600 mb-8">
          You don&apos;t have permission to access the admin panel. This area is
          restricted to authorized administrators only.
        </p>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full bg-primary-green hover:bg-primary-green/90">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>

          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">
              <LogIn className="w-4 h-4 mr-2" />
              Sign in with Different Account
            </Button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-gray-700 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          If you believe this is an error, please contact the site
          administrator.
        </p>
      </motion.div>
    </div>
  );
}

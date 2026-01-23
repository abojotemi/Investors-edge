"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInAsAdmin, user, userProfile, loading, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && user && userProfile) {
      if (isAdmin) {
        toast.success("Welcome back!", {
          description: "Redirecting to admin dashboard...",
        });
        router.push("/admin");
      }
    }
  }, [user, userProfile, loading, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signInAsAdmin(email, password);
      toast.success("Welcome!", {
        description: "Redirecting to admin dashboard...",
      });
      router.push("/admin");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("Login error:", error);

      let errorMessage =
        error.message || "Failed to sign in. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please try again.";
      }

      setError(errorMessage);
      toast.error("Login failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(251, 146, 60, 0.2) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl">
            <CardContent className="p-8">
              {/* Back link */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to site
              </Link>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary-green" />
                </div>
                <h1 className="text-2xl font-bold">Admin Login</h1>
                <p className="text-muted-foreground mt-2">
                  Sign in to access the admin panel
                </p>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="mb-2">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                This area is restricted to authorized administrators only.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-gray-400 mt-6"
        >
          Protected by role-based authentication
        </motion.p>
      </div>
    </div>
  );
}

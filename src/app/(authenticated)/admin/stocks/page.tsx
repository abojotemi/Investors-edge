"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  DollarSign,
  Target,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { getStocks, deleteStock } from "@/lib/firebase/firestore";
import type { Stock, StockStatus } from "@/types/admin";
import { cn } from "@/lib/utils";

const sectorLabels: Record<string, string> = {
  technology: "Technology",
  healthcare: "Healthcare",
  finance: "Finance",
  energy: "Energy",
  consumer: "Consumer",
  industrial: "Industrial",
  materials: "Materials",
  utilities: "Utilities",
  "real-estate": "Real Estate",
  communication: "Communication",
};

export default function AdminStocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus | "all">("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const data = await getStocks();
      setStocks(data);
    } catch (error) {
      console.error("Error loading stocks:", error);
      toast.error("Failed to load stocks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setDeleting(id);
      await deleteStock(id);
      setStocks(stocks.filter((s) => s.id !== id));
      toast.success("Stock deleted successfully");
    } catch (error) {
      console.error("Error deleting stock:", error);
      toast.error("Failed to delete stock");
    } finally {
      setDeleting(null);
    }
  };

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || stock.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Stock Recommendations
          </h1>
          <p className="text-muted-foreground">
            Manage your stock picks and recommendations
          </p>
        </div>
        <Link href="/admin/stocks/new">
          <Button className="bg-primary-green hover:bg-primary-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or ticker..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
                className={cn(
                  statusFilter === "all" &&
                    "bg-primary-green hover:bg-primary-green/90"
                )}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
                className={cn(
                  statusFilter === "active" &&
                    "bg-primary-green hover:bg-primary-green/90"
                )}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "closed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("closed")}
                className={cn(
                  statusFilter === "closed" &&
                    "bg-primary-green hover:bg-primary-green/90"
                )}
              >
                Closed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-green/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-green" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stocks.filter((s) => s.status === "active").length}
              </p>
              <p className="text-sm text-muted-foreground">Active Picks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-orange/10 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-primary-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stocks.filter((s) => s.status === "closed").length}
              </p>
              <p className="text-sm text-muted-foreground">Closed Positions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stocks.length}</p>
              <p className="text-sm text-muted-foreground">Total Stocks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock List */}
      {filteredStocks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No stocks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search"
                : "Get started by adding your first stock recommendation"}
            </p>
            {!searchQuery && (
              <Link href="/admin/stocks/new">
                <Button className="bg-primary-green hover:bg-primary-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Stock
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredStocks.map((stock, index) => (
            <motion.div
              key={stock.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{stock.name}</h3>
                        <span className="px-2 py-0.5 bg-primary-green/10 text-primary-green text-sm font-medium rounded">
                          {stock.ticker}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full",
                            stock.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          )}
                        >
                          {stock.status === "active" ? "Active" : "Closed"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {stock.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Entry:</span>
                          <span className="font-medium">
                            ₦{stock.entryPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-primary-green" />
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-medium text-primary-green">
                            ₦{stock.targetPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-muted-foreground">
                            Stop Loss:
                          </span>
                          <span className="font-medium text-red-500">
                            ₦{stock.stopLoss.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-muted-foreground">
                          Sector: {sectorLabels[stock.sector] || stock.sector}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/admin/stocks/${stock.id}`}>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(stock.id, stock.name)}
                          disabled={deleting === stock.id}
                        >
                          {deleting === stock.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                          )}
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  TrendingUp,
  Eye,
  Globe,
} from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { StockPriceInline } from "@/components/ui/stock-price-card";
import { toast } from "sonner";
import type { StockStatus } from "@/types/admin";

const getStatusColor = (status: StockStatus) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "watchlist":
      return "bg-yellow-100 text-yellow-800";
    case "closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatSector = (sector: string) => {
  return sector
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function AdminStocksPage() {
  const { stocks, deleteStock, loading } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus | "all">("all");
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchesSearch =
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || stock.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [stocks, searchQuery, statusFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStocks(filteredStocks.map((s) => s.id));
    } else {
      setSelectedStocks([]);
    }
  };

  const handleSelectStock = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedStocks((prev) => [...prev, id]);
    } else {
      setSelectedStocks((prev) => prev.filter((stockId) => stockId !== id));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStock(id);
      toast.success("Stock deleted successfully");
    } catch {
      toast.error("Failed to delete stock");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedStocks.map((id) => deleteStock(id)));
      setSelectedStocks([]);
      toast.success(`${selectedStocks.length} stocks deleted`);
    } catch {
      toast.error("Failed to delete stocks");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Stock Recommendations</h1>
          <p className="text-muted-foreground mt-1">
            Manage your stock picks and analysis
          </p>
        </div>
        <Link href="/admin/stocks/new">
          <Button className="bg-primary-green hover:bg-primary-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-green/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-green" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stocks.length}</p>
                <p className="text-sm text-muted-foreground">Total Stocks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stocks.filter((s) => s.status === "active").length}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stocks.filter((s) => s.status === "watchlist").length}
                </p>
                <p className="text-sm text-muted-foreground">Watchlist</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stocks.filter((s) => s.status === "closed").length}
                </p>
                <p className="text-sm text-muted-foreground">Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "watchlist", "closed"] as const).map(
                (status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={
                      statusFilter === status
                        ? "bg-primary-green hover:bg-primary-green/90"
                        : ""
                    }
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedStocks.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedStocks.length} stock(s) selected
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete selected stocks?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {selectedStocks.length}{" "}
                      stock(s). This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stocks Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Stocks ({filteredStocks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStocks.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No stocks found</p>
              <Link href="/admin/stocks/new">
                <Button className="mt-4 bg-primary-green hover:bg-primary-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Stock
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedStocks.length === filteredStocks.length &&
                        filteredStocks.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead>Live Price</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStocks.includes(stock.id)}
                        onCheckedChange={(checked) =>
                          handleSelectStock(stock.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">{stock.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{stock.ticker}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          stock.market === "US"
                            ? "border-blue-500 text-blue-600"
                            : "border-green-500 text-green-600"
                        }
                      >
                        <Globe className="w-3 h-3 mr-1" />
                        {stock.market || "US"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StockPriceInline
                        ticker={stock.ticker}
                        isNigerian={stock.market === "NGX"}
                      />
                    </TableCell>
                    <TableCell>{formatSector(stock.sector)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(stock.status)}>
                        {stock.status.charAt(0).toUpperCase() +
                          stock.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {stock.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/admin/stocks/${stock.id}`}>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/stocks/${stock.id}`} target="_blank">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete stock?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete &quot;
                                  {stock.name}
                                  &quot;. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(stock.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

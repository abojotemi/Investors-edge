"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  TrendingUp,
  DollarSign,
  Target,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { toast } from "sonner";
import { getStock, updateStock, deleteStock } from "@/lib/firebase/firestore";
import type { Stock, StockStatus, StockSector } from "@/types/admin";

const sectors: { label: string; value: StockSector }[] = [
  { label: "Technology", value: "technology" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Finance", value: "finance" },
  { label: "Energy", value: "energy" },
  { label: "Consumer", value: "consumer" },
  { label: "Industrial", value: "industrial" },
  { label: "Materials", value: "materials" },
  { label: "Utilities", value: "utilities" },
  { label: "Real Estate", value: "real-estate" },
  { label: "Communication", value: "communication" },
];

export default function EditStockPage() {
  const router = useRouter();
  const params = useParams();
  const stockId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [sector, setSector] = useState<StockSector>("technology");
  const [description, setDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [status, setStatus] = useState<StockStatus>("active");
  const [closingPrice, setClosingPrice] = useState("");
  const [closingNotes, setClosingNotes] = useState("");

  useEffect(() => {
    const loadStock = async () => {
      try {
        const stock = await getStock(stockId);
        if (!stock) {
          toast.error("Stock not found");
          router.push("/admin/stocks");
          return;
        }

        setName(stock.name);
        setTicker(stock.ticker);
        setSector(stock.sector);
        setDescription(stock.description);
        setAnalysis(stock.analysis);
        setEntryPrice(stock.entryPrice.toString());
        setTargetPrice(stock.targetPrice.toString());
        setStopLoss(stock.stopLoss.toString());
        setStatus(stock.status);
        if (stock.closingPrice) setClosingPrice(stock.closingPrice.toString());
        if (stock.closingNotes) setClosingNotes(stock.closingNotes);
      } catch (error) {
        console.error("Error loading stock:", error);
        toast.error("Failed to load stock");
        router.push("/admin/stocks");
      } finally {
        setLoading(false);
      }
    };

    loadStock();
  }, [stockId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !ticker || !entryPrice || !targetPrice || !stopLoss) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);
      await updateStock(stockId, {
        name,
        ticker: ticker.toUpperCase(),
        sector,
        description,
        analysis,
        entryPrice: parseFloat(entryPrice),
        targetPrice: parseFloat(targetPrice),
        stopLoss: parseFloat(stopLoss),
        status,
        closingPrice: closingPrice ? parseFloat(closingPrice) : undefined,
        closingNotes: closingNotes || undefined,
        dateClosed: status === "closed" ? new Date() : undefined,
      });

      toast.success("Stock updated successfully");
      router.push("/admin/stocks");
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setDeleting(true);
      await deleteStock(stockId);
      toast.success("Stock deleted successfully");
      router.push("/admin/stocks");
    } catch (error) {
      console.error("Error deleting stock:", error);
      toast.error("Failed to delete stock");
    } finally {
      setDeleting(false);
    }
  };

  const potentialGain =
    entryPrice && targetPrice
      ? (
          ((parseFloat(targetPrice) - parseFloat(entryPrice)) /
            parseFloat(entryPrice)) *
          100
        ).toFixed(2)
      : null;

  const potentialLoss =
    entryPrice && stopLoss
      ? (
          ((parseFloat(entryPrice) - parseFloat(stopLoss)) /
            parseFloat(entryPrice)) *
          100
        ).toFixed(2)
      : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-green" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <Link href="/admin/stocks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Edit Stock</h1>
          <p className="text-muted-foreground">
            Update {name} ({ticker})
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-green" />
                  Stock Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Apple Inc."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticker">Ticker Symbol *</Label>
                    <Input
                      id="ticker"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      placeholder="AAPL"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sector">Sector</Label>
                  <Select
                    value={sector}
                    onValueChange={(v) => setSector(v as StockSector)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief overview of why this stock is recommended..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary-green" />
                  Price Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="entryPrice">Entry Price *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="entryPrice"
                        type="number"
                        step="0.01"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        placeholder="0.00"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="targetPrice">Target Price *</Label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-green" />
                      <Input
                        id="targetPrice"
                        type="number"
                        step="0.01"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        placeholder="0.00"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="stopLoss">Stop Loss *</Label>
                    <div className="relative">
                      <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                      <Input
                        id="stopLoss"
                        type="number"
                        step="0.01"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(e.target.value)}
                        placeholder="0.00"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>

                {(potentialGain || potentialLoss) && (
                  <div className="flex gap-4 pt-2">
                    {potentialGain && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Potential Gain:{" "}
                        </span>
                        <span className="font-medium text-primary-green">
                          +{potentialGain}%
                        </span>
                      </div>
                    )}
                    {potentialLoss && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Risk: </span>
                        <span className="font-medium text-red-500">
                          -{potentialLoss}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Closing Details (for closed positions) */}
            {status === "closed" && (
              <Card>
                <CardHeader>
                  <CardTitle>Closing Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="closingPrice">Closing Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="closingPrice"
                        type="number"
                        step="0.01"
                        value={closingPrice}
                        onChange={(e) => setClosingPrice(e.target.value)}
                        placeholder="0.00"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="closingNotes">Closing Notes</Label>
                    <Textarea
                      id="closingNotes"
                      value={closingNotes}
                      onChange={(e) => setClosingNotes(e.target.value)}
                      placeholder="Why was this position closed?"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  value={analysis}
                  onChange={setAnalysis}
                  placeholder="Write your detailed stock analysis here..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as StockStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-primary-green hover:bg-primary-green/90"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Stock
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Stock
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

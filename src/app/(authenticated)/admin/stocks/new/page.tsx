"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { addStock } from "@/lib/firebase/firestore";
import type { StockStatus, StockSector } from "@/types/admin";

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

export default function NewStockPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !ticker || !entryPrice || !targetPrice || !stopLoss) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);
      await addStock({
        name,
        ticker: ticker.toUpperCase(),
        sector,
        description,
        analysis,
        entryPrice: parseFloat(entryPrice),
        targetPrice: parseFloat(targetPrice),
        stopLoss: parseFloat(stopLoss),
        status,
        dateAdded: new Date(),
      });

      toast.success("Stock added successfully");
      router.push("/admin/stocks");
    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error("Failed to add stock");
    } finally {
      setSaving(false);
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
          <h1 className="text-2xl font-bold text-foreground">
            Add Stock Recommendation
          </h1>
          <p className="text-muted-foreground">
            Create a new stock pick for your readers
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
                      {/* <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /> */}
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground text-primary-green">₦</div>
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
              <CardContent className="pt-6">
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
                      Save Stock
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

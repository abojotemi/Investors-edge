"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Trash2,
  TrendingUp,
  Plus,
  CheckCircle,
  TrendingDown,
  Loader2,
  Globe,
} from "lucide-react";
import { StockPriceCard } from "@/components/ui/stock-price-card";
import { useAdmin } from "@/context/admin-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import type {
  StockSector,
  StockStatus,
  StockHighlight,
  StockMarket,
} from "@/types/admin";

const sectors: { label: string; value: StockSector }[] = [
  { label: "Banking", value: "banking" },
  { label: "Insurance", value: "insurance" },
  { label: "Construction", value: "construction" },
  { label: "Industrial Goods", value: "industrial-goods" },
  { label: "Consumer Goods", value: "consumer-goods" },
  { label: "Oil & Gas", value: "oil-gas" },
  { label: "Technology", value: "technology" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Real Estate", value: "real-estate" },
  { label: "Other", value: "other" },
];

const statuses: { label: string; value: StockStatus }[] = [
  { label: "Active", value: "active" },
  { label: "Watchlist", value: "watchlist" },
  { label: "Closed", value: "closed" },
];

const markets: { label: string; value: StockMarket }[] = [
  { label: "🇺🇸 US (NYSE, NASDAQ)", value: "US" },
  { label: "🇳🇬 Nigeria (NGX)", value: "NGX" },
];

const highlightIcons: { label: string; value: "check" | "up" | "down" }[] = [
  { label: "✓ Check", value: "check" },
  { label: "↑ Up", value: "up" },
  { label: "↓ Down", value: "down" },
];

export default function EditStockPage() {
  const router = useRouter();
  const params = useParams();
  const stockId = params.id as string;
  const { getStock, updateStock, deleteStock, loading } = useAdmin();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    market: "US" as StockMarket,
    sector: "banking" as StockSector,
    status: "active" as StockStatus,
    analysis: [""],
    highlights: [
      { title: "", description: "", icon: "check" as const },
    ] as StockHighlight[],
    tradeSetup: {
      buyRange: "",
      targetProfit: "",
      riskPrice: "",
    },
    author: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const stock = getStock(stockId);
    if (stock) {
      setFormData({
        name: stock.name,
        ticker: stock.ticker,
        market: stock.market || "US",
        sector: stock.sector,
        status: stock.status,
        analysis: stock.analysis.length > 0 ? stock.analysis : [""],
        highlights:
          stock.highlights.length > 0
            ? stock.highlights
            : [{ title: "", description: "", icon: "check" }],
        tradeSetup: stock.tradeSetup,
        author: stock.author,
      });
    }
  }, [stockId, getStock]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Stock name is required";
    }
    if (!formData.ticker.trim()) {
      newErrors.ticker = "Ticker symbol is required";
    }
    if (!formData.analysis[0]?.trim()) {
      newErrors.analysis = "At least one analysis paragraph is required";
    }
    if (!formData.tradeSetup.buyRange.trim()) {
      newErrors.buyRange = "Buy range is required";
    }
    if (!formData.tradeSetup.targetProfit.trim()) {
      newErrors.targetProfit = "Target profit is required";
    }
    if (!formData.tradeSetup.riskPrice.trim()) {
      newErrors.riskPrice = "Risk price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Validation error", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    setSaving(true);

    try {
      await updateStock(stockId, {
        ...formData,
        market: formData.market,
        analysis: formData.analysis.filter((p) => p.trim()),
        highlights: formData.highlights.filter((h) => h.title.trim()),
      });

      toast.success("Stock updated", {
        description: "Your changes have been saved.",
      });

      router.push("/admin/stocks");
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Error updating stock", {
        description:
          "There was a problem saving your changes. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteStock(stockId);
      toast.success("Stock deleted");
      router.push("/admin/stocks");
    } catch (error) {
      console.error("Error deleting stock:", error);
      toast.error("Failed to delete stock");
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAnalysisChange = (index: number, value: string) => {
    const newAnalysis = [...formData.analysis];
    newAnalysis[index] = value;
    setFormData((prev) => ({ ...prev, analysis: newAnalysis }));
  };

  const addAnalysisParagraph = () => {
    setFormData((prev) => ({ ...prev, analysis: [...prev.analysis, ""] }));
  };

  const removeAnalysisParagraph = (index: number) => {
    const newAnalysis = formData.analysis.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, analysis: newAnalysis }));
  };

  const handleHighlightChange = (
    index: number,
    field: keyof StockHighlight,
    value: string
  ) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setFormData((prev) => ({ ...prev, highlights: newHighlights }));
  };

  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        { title: "", description: "", icon: "check" },
      ],
    }));
  };

  const removeHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, highlights: newHighlights }));
  };

  const handleTradeSetupChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tradeSetup: { ...prev.tradeSetup, [field]: value },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-green" />
      </div>
    );
  }

  const stock = getStock(stockId);
  if (!stock) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Stock not found</h1>
        <Link href="/admin/stocks">
          <Button>Back to Stocks</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/stocks"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Stock</h1>
            <p className="text-muted-foreground mt-1">{stock.name}</p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleting}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this stock?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &quot;{stock.name}&quot;. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="mb-2">
                    Stock Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Veritas Kapital Assurance"
                    className={errors.name ? "border-red-300" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="ticker" className="mb-2">
                    Ticker Symbol *
                  </Label>
                  <Input
                    id="ticker"
                    name="ticker"
                    value={formData.ticker}
                    onChange={handleChange}
                    placeholder="e.g., VERITAS"
                    className={`uppercase ${
                      errors.ticker ? "border-red-300" : ""
                    }`}
                  />
                  {errors.ticker && (
                    <p className="text-red-500 text-sm mt-1">{errors.ticker}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-2">Market *</Label>
                  <Select
                    value={formData.market}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        market: value as StockMarket,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {markets.map((market) => (
                        <SelectItem key={market.value} value={market.value}>
                          {market.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-xs mt-1">
                    Select the stock exchange for live price data
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Analysis */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Analysis</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAnalysisParagraph}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Paragraph
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.analysis.map((paragraph, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={paragraph}
                      onChange={(e) =>
                        handleAnalysisChange(index, e.target.value)
                      }
                      placeholder={`Analysis paragraph ${index + 1}...`}
                      rows={4}
                      className={
                        index === 0 && errors.analysis ? "border-red-300" : ""
                      }
                    />
                    {formData.analysis.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAnalysisParagraph(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.analysis && (
                  <p className="text-red-500 text-sm">{errors.analysis}</p>
                )}
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Highlights</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addHighlight}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg space-y-3 relative"
                  >
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label className="mb-2">Title</Label>
                        <Input
                          value={highlight.title}
                          onChange={(e) =>
                            handleHighlightChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Why This Stock?"
                        />
                      </div>
                      <div className="w-32">
                        <Label className="mb-2">Icon</Label>
                        <Select
                          value={highlight.icon}
                          onValueChange={(value) =>
                            handleHighlightChange(index, "icon", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {highlightIcons.map((icon) => (
                              <SelectItem key={icon.value} value={icon.value}>
                                {icon.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2">Description</Label>
                      <Textarea
                        value={highlight.description}
                        onChange={(e) =>
                          handleHighlightChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Brief description..."
                        rows={2}
                      />
                    </div>
                    {formData.highlights.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHighlight(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trade Setup */}
            <Card>
              <CardHeader>
                <CardTitle>Trade Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-2">Buy Range *</Label>
                    <Input
                      value={formData.tradeSetup.buyRange}
                      onChange={(e) =>
                        handleTradeSetupChange("buyRange", e.target.value)
                      }
                      placeholder="e.g., ₦2.20 – ₦2.40"
                      className={errors.buyRange ? "border-red-300" : ""}
                    />
                    {errors.buyRange && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.buyRange}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2">Target Profit *</Label>
                    <Input
                      value={formData.tradeSetup.targetProfit}
                      onChange={(e) =>
                        handleTradeSetupChange("targetProfit", e.target.value)
                      }
                      placeholder="e.g., +40%"
                      className={errors.targetProfit ? "border-red-300" : ""}
                    />
                    {errors.targetProfit && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.targetProfit}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2">Risk Price *</Label>
                    <Input
                      value={formData.tradeSetup.riskPrice}
                      onChange={(e) =>
                        handleTradeSetupChange("riskPrice", e.target.value)
                      }
                      placeholder="e.g., ₦1.80"
                      className={errors.riskPrice ? "border-red-300" : ""}
                    />
                    {errors.riskPrice && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.riskPrice}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Box */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value as StockStatus,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="submit"
                  className="w-full bg-primary-green hover:bg-primary-green/90"
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Sector */}
            <Card>
              <CardHeader>
                <CardTitle>Sector</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.sector}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      sector: value as StockSector,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.value} value={sector.value}>
                        {sector.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Live Price Preview */}
            {formData.ticker && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Live Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StockPriceCard
                    ticker={formData.ticker.toUpperCase()}
                    isNigerian={formData.market === "NGX"}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.market === "US"
                      ? "Data from US markets (NYSE/NASDAQ)"
                      : "Data from Nigerian Stock Exchange"}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-primary-green" />
                    <span className="font-semibold">
                      {formData.name || "Stock Name"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>Ticker: {formData.ticker || "TICKER"}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted">
                      {formData.market === "US" ? "🇺🇸 US" : "🇳🇬 NGX"}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {formData.highlights.slice(0, 3).map((h, i) => (
                      <div
                        key={i}
                        className="text-xs bg-primary-green/10 text-primary-green px-2 py-1 rounded"
                      >
                        {h.icon === "check" && (
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                        )}
                        {h.icon === "up" && (
                          <TrendingUp className="w-3 h-3 inline mr-1" />
                        )}
                        {h.icon === "down" && (
                          <TrendingDown className="w-3 h-3 inline mr-1" />
                        )}
                        {h.title || `Highlight ${i + 1}`}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meta Info */}
            <Card>
              <CardHeader>
                <CardTitle>Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Created:</strong>{" "}
                  {stock.createdAt.toLocaleDateString()}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {stock.updatedAt.toLocaleDateString()}
                </p>
                <p>
                  <strong>Author:</strong> {stock.author}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

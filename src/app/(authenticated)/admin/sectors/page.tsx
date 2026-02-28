"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  BarChart3,
  Loader2,
  Save,
  X,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  addSectorWatch,
  updateSectorWatch,
  deleteSectorWatch,
  sectorWatchCollection,
} from "@/lib/firebase/firestore";
import type { SectorWatch, SectorTrend, ContentStatus } from "@/types/admin";
import { query, orderBy, onSnapshot } from "firebase/firestore";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/ui/rich-text-editor"),
  { ssr: false, loading: () => <div className="h-64 bg-gray-50 rounded-xl animate-pulse" /> }
);

const TREND_OPTIONS: { value: SectorTrend; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "up", label: "Up", icon: <TrendingUp className="w-4 h-4" />, color: "text-green-600 bg-green-50 border-green-200" },
  { value: "neutral", label: "Neutral", icon: <BarChart3 className="w-4 h-4" />, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  { value: "down", label: "Down", icon: <TrendingUp className="w-4 h-4 rotate-180" />, color: "text-red-600 bg-red-50 border-red-200" },
];

const EMPTY_FORM = {
  name: "",
  trend: "neutral" as SectorTrend,
  performance: "",
  outlook: "",
  content: "",
  topPicksRaw: "",
  status: "draft" as ContentStatus,
};

type FormState = typeof EMPTY_FORM;

export default function AdminSectorsPage() {
  const [sectors, setSectors] = useState<SectorWatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectorToDelete, setSectorToDelete] = useState<string | null>(null);

  // Real-time listener
  useEffect(() => {
    const q = query(sectorWatchCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: SectorWatch[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.name || "",
            trend: d.trend || "neutral",
            performance: d.performance || "",
            outlook: d.outlook || "",
            content: d.content || "",
            topPicks: d.topPicks || [],
            status: d.status || "draft",
            createdAt: d.createdAt?.toDate?.() || new Date(),
            updatedAt: d.updatedAt?.toDate?.() || new Date(),
          };
        });
        setSectors(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching sectors:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (sector: SectorWatch) => {
    setEditingId(sector.id);
    setForm({
      name: sector.name,
      trend: sector.trend,
      performance: sector.performance,
      outlook: sector.outlook,
      content: sector.content || "",
      topPicksRaw: sector.topPicks.join(", "),
      status: sector.status,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.performance.trim() || !form.outlook.trim()) {
      toast.error("Please fill in Sector Name, Performance, and Outlook");
      return;
    }
    setSaving(true);
    const topPicks = form.topPicksRaw
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    const payload = {
      name: form.name.trim(),
      trend: form.trend,
      performance: form.performance.trim(),
      outlook: form.outlook.trim(),
      content: form.content,
      topPicks,
      status: form.status,
    };

    try {
      if (editingId) {
        await updateSectorWatch(editingId, payload);
        toast.success("Sector updated");
      } else {
        await addSectorWatch(payload);
        toast.success("Sector added");
      }
      closeForm();
    } catch {
      toast.error("Failed to save sector");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (sector: SectorWatch) => {
    const newStatus: ContentStatus = sector.status === "published" ? "draft" : "published";
    try {
      await updateSectorWatch(sector.id, { status: newStatus });
      toast.success(newStatus === "published" ? "Sector published" : "Sector moved to draft");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!sectorToDelete) return;
    try {
      await deleteSectorWatch(sectorToDelete);
      toast.success("Sector deleted");
      setDeleteDialogOpen(false);
      setSectorToDelete(null);
    } catch {
      toast.error("Failed to delete sector");
    }
  };

  const getTrendConfig = (trend: SectorTrend) =>
    TREND_OPTIONS.find((t) => t.value === trend) ?? TREND_OPTIONS[1];

  const publishedCount = sectors.filter((s) => s.status === "published").length;
  const draftCount = sectors.filter((s) => s.status === "draft").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sector Watch</h1>
            <p className="text-gray-500 mt-1">Manage sector articles shown on the Insights page</p>
          </div>
          <Button onClick={openNew} className="bg-primary-green hover:bg-primary-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Sector
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sectors</p>
                <p className="text-2xl font-bold">{sectors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-2xl font-bold">{publishedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Drafts</p>
                <p className="text-2xl font-bold">{draftCount}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-md mb-8 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingId ? "Edit Sector" : "Add New Sector"}
                </h2>
                <button onClick={closeForm} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Row 1: Name + Performance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Sector Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Banking"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Performance <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. +3.2% or -1.8%"
                      value={form.performance}
                      onChange={(e) => setForm({ ...form, performance: e.target.value })}
                    />
                  </div>
                </div>

                {/* Trend */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trend</label>
                  <div className="flex gap-3">
                    {TREND_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setForm({ ...form, trend: opt.value })}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all",
                          form.trend === opt.value
                            ? opt.color + " border-current"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                        )}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outlook (short summary) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Outlook Summary <span className="text-red-500">*</span>
                    <span className="ml-2 font-normal text-gray-400">(shown on the sector card)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief one-liner shown on the insight card..."
                    value={form.outlook}
                    onChange={(e) => setForm({ ...form, outlook: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-2 focus:ring-primary-green/15 outline-none transition-all resize-none text-sm"
                  />
                </div>

                {/* Rich Text Article */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Article
                    <span className="ml-2 font-normal text-gray-400">(opened when user clicks the sector card)</span>
                  </label>
                  <RichTextEditor
                    value={form.content}
                    onChange={(val) => setForm({ ...form, content: val })}
                    placeholder="Write the full sector analysis article here..."
                  />
                </div>

                {/* Top Picks */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Top Picks
                    <span className="ml-2 font-normal text-gray-400">(comma-separated tickers)</span>
                  </label>
                  <Input
                    placeholder="e.g. GTCO, ZENITHBANK, ACCESSCORP"
                    value={form.topPicksRaw}
                    onChange={(e) => setForm({ ...form, topPicksRaw: e.target.value })}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <div className="flex gap-3">
                    {(["draft", "published"] as ContentStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setForm({ ...form, status: s })}
                        className={cn(
                          "px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all capitalize",
                          form.status === s
                            ? s === "published"
                              ? "bg-green-50 border-green-400 text-green-700"
                              : "bg-yellow-50 border-yellow-400 text-yellow-700"
                            : "bg-gray-50 border-gray-200 text-gray-500"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                  <Button variant="outline" onClick={closeForm}>Cancel</Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary-green hover:bg-primary-green/90"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" />Save Sector</>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sectors List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {sectors.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No sectors yet</h3>
              <p className="text-gray-500 mb-6">Add your first sector article to display on the Insights page.</p>
              <Button onClick={openNew} className="bg-primary-green hover:bg-primary-green/90">
                <Plus className="w-4 h-4 mr-2" />
                Add First Sector
              </Button>
            </div>
          ) : (
            sectors.map((sector, index) => {
              const trendConfig = getTrendConfig(sector.trend);
              return (
                <motion.div
                  key={sector.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-primary-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-primary-green" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{sector.name}</h3>
                        <span className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          sector.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        )}>
                          {sector.status}
                        </span>
                        <span className={cn(
                          "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border",
                          trendConfig.color
                        )}>
                          {trendConfig.icon}
                          {trendConfig.label}
                        </span>
                        {sector.content && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                            Article
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={cn(
                          "text-xl font-bold",
                          sector.trend === "up" ? "text-green-600" : sector.trend === "down" ? "text-red-500" : "text-yellow-600"
                        )}>
                          {sector.performance}
                        </span>
                        <span className="text-sm text-gray-400">this week</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1 mb-2">{sector.outlook}</p>
                      {sector.topPicks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {sector.topPicks.map((pick) => (
                            <span key={pick} className="px-2 py-0.5 bg-primary-green/10 text-primary-green text-xs font-medium rounded-full">
                              {pick}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        title={sector.status === "published" ? "Move to draft" : "Publish"}
                        onClick={() => handleToggleStatus(sector)}
                      >
                        {sector.status === "published"
                          ? <EyeOff className="w-4 h-4" />
                          : <Eye className="w-4 h-4 text-green-600" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEdit(sector)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => { setSectorToDelete(sector.id); setDeleteDialogOpen(true); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sector?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this sector and its article from the Insights page.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

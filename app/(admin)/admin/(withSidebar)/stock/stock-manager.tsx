"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchStockAction, saveStockAction } from "./actions";
import type { StockRow } from "@/lib/dal";
import type { Branch, Category } from "@/types/db";
import { formatPrice } from "@/lib/utils";
import { Loader2, Search, Save } from "lucide-react";

export function StockManager({ branches, categories }: { branches: Branch[]; categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchParam = searchParams.get("branchId");

  const [branchId, setBranchId] = useState<string>(() => {
    if (branchParam && branches.some((b) => b.id === branchParam)) return branchParam;
    return branches[0]?.id ?? "";
  });
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  // Sync URL with branch
  const updateBranch = useCallback(
    (id: string) => {
      setBranchId(id);
      setDirty({});
      const url = new URL(window.location.href);
      if (id) url.searchParams.set("branchId", id);
      else url.searchParams.delete("branchId");
      router.replace(url.pathname + url.search, { scroll: false });
    },
    [router]
  );

  // Fetch stock when branch changes
  useEffect(() => {
    if (!branchId) {
      setRows([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetchStockAction(branchId).then((res) => {
      setLoading(false);
      if (res.ok) setRows(res.rows);
      else setError(res.error);
    });
  }, [branchId]);

  const getQty = useCallback(
    (variantId: string, baseQty: number) =>
      dirty[variantId] !== undefined ? dirty[variantId] : baseQty,
    [dirty]
  );

  const setQty = useCallback((variantId: string, qty: number) => {
    setDirty((prev) => {
      const next = { ...prev };
      if (qty < 0) return prev;
      next[variantId] = qty;
      return next;
    });
  }, []);

  const toggleInStock = useCallback(
    (variantId: string, currentQty: number) => {
      const qty = getQty(variantId, currentQty);
      setQty(variantId, qty > 0 ? 0 : 1);
    },
    [getQty, setQty]
  );

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = rows;
    if (q) {
      list = list.filter(
        (r) =>
          r.productName.toLowerCase().includes(q) ||
          r.variantName.toLowerCase().includes(q) ||
          r.sku.toLowerCase().includes(q)
      );
    }
    if (categoryId) {
      list = list.filter((r) => r.categoryId === categoryId);
    }
    return list;
  }, [rows, searchQuery, categoryId]);

  const dirtyCount = Object.keys(dirty).length;
  const hasDirty = dirtyCount > 0;

  const handleSave = useCallback(async () => {
    if (!branchId || !hasDirty) return;
    setSaving(true);
    setError(null);
    const updates = Object.entries(dirty).map(([variantId, quantity]) => ({
      variantId,
      quantity,
    }));
    const previousRows = rows;
    const previousDirty = { ...dirty };
    setRows((prev) =>
      prev.map((r) =>
        dirty[r.variantId] !== undefined
          ? { ...r, quantity: dirty[r.variantId]! }
          : r
      )
    );
    setDirty({});

    const result = await saveStockAction(branchId, updates);
    setSaving(false);
    if (!result.ok) {
      setRows(previousRows);
      setDirty(previousDirty);
      setError(result.error);
    }
  }, [branchId, dirty, hasDirty, rows]);

  if (branches.length === 0) {
    return (
      <p className="text-muted-foreground">
        No branches available. Add a branch first.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Branch</Label>
            <Select
              value={branchId}
              onValueChange={updateBranch}
              disabled={loading}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Product or variant..."
                className="w-[200px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Category</Label>
            <Select
              value={categoryId || "all"}
              onValueChange={(v) => setCategoryId(v === "all" ? "" : v)}
              disabled={loading}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasDirty && (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save changes {dirtyCount > 0 ? `(${dirtyCount})` : ""}
          </Button>
        )}
      </div>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !branchId ? (
        <p className="text-muted-foreground py-8">Select a branch to view stock.</p>
      ) : (
        <div className="admin-table-wrapper">
          <Table className="admin-table">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="w-[100px]">In stock</TableHead>
                <TableHead className="w-[120px]">Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {searchQuery.trim()
                      ? "No variants match your search."
                      : "No variants. Add products and variants first."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => {
                  const qty = getQty(row.variantId, row.quantity);
                  const inStock = qty > 0;
                  return (
                    <TableRow key={row.variantId}>
                      <TableCell className="font-medium">
                        {row.productName || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {row.categoryName || "—"}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground text-xs">
                          {row.sku}
                        </span>{" "}
                        {row.variantName}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatPrice(row.price)}
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={inStock}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 ${
                            inStock ? "bg-primary" : "bg-muted"
                          }`}
                          onClick={() => toggleInStock(row.variantId, row.quantity)}
                        >
                          <span
                            className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow ring-0 transition-transform ${
                              inStock ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          className="h-9 w-20 tabular-nums"
                          value={qty}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (!Number.isNaN(v) && v >= 0) setQty(row.variantId, v);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && branchId && filteredRows.length > 0 && (
        <p className="text-muted-foreground text-sm">
          {filteredRows.length} variant{filteredRows.length !== 1 ? "s" : ""}
          {searchQuery.trim() && ` matching "${searchQuery}"`}
          {hasDirty && " · Unsaved changes"}
        </p>
      )}
    </div>
  );
}

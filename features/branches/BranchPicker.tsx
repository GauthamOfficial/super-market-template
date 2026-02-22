"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import { BRANCH_LOCALSTORAGE_KEY } from "@/lib/branch-cookie";
import { selectBranch } from "@/app/(shop)/select-branch/actions";
import type { Branch } from "@/types/db";

/** Branch with optional opening hours (e.g. "09:00-21:00" or JSON). */
export type BranchWithHours = Branch & { opening_hours?: string | null };

/** Returns label for "Open now" badge; fallback when no opening_hours. */
export function getOpenNowLabel(
  branch: BranchWithHours,
  now: Date = new Date()
): string {
  const hours = branch.opening_hours;
  if (!hours || typeof hours !== "string" || !hours.trim()) {
    return "—";
  }
  const trimmed = hours.trim();
  const match = trimmed.match(/^(\d{1,2}):?(\d{2})?\s*-\s*(\d{1,2}):?(\d{2})?$/i);
  if (!match) return "—";
  const [, startH, startM, endH, endM] = match;
  const toMins = (h: string, m: string) => parseInt(h, 10) * 60 + parseInt(m || "0", 10);
  const start = toMins(startH!, startM || "0");
  let end = toMins(endH!, endM || "0");
  if (end <= start) end += 24 * 60;
  const current = now.getHours() * 60 + now.getMinutes();
  const currentNorm = current < start ? current + 24 * 60 : current;
  const open = currentNorm >= start && currentNorm < end;
  return open ? "Open now" : "Closed";
}

interface BranchPickerProps {
  branches: BranchWithHours[];
}

export function BranchPicker({ branches }: BranchPickerProps) {
  const router = useRouter();

  async function handleSelect(branchId: string) {
    const result = await selectBranch(branchId);
    if (!result.ok) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(BRANCH_LOCALSTORAGE_KEY, branchId);
    }
    router.push("/home");
  }

  if (branches.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No branches available.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {branches.map((branch) => {
        const badgeLabel = getOpenNowLabel(branch);
        const isOpenNow = badgeLabel === "Open now";
        return (
          <li key={branch.id}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">{branch.name}</CardTitle>
                <Badge
                  variant={isOpenNow ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {badgeLabel}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {branch.address && (
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{branch.address}</span>
                  </p>
                )}
                {branch.phone && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <a
                      href={`tel:${branch.phone}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {branch.phone}
                    </a>
                  </p>
                )}
                <Button
                  className="w-full"
                  onClick={() => handleSelect(branch.id)}
                >
                  Select this branch
                </Button>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}


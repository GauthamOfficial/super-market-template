"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackOrder, type TrackOrderResult } from "./actions";
import type { OrderStatus } from "@/types/db";

const STEPS: OrderStatus[] = ["pending", "packed", "dispatched", "completed"];

function StatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-center">
        <p className="font-medium text-destructive">Order cancelled</p>
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);
  return (
    <div className="space-y-0">
      {STEPS.map((step, idx) => {
        const isDone = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <div key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  isDone
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-muted text-muted-foreground"
                }`}
              >
                {isDone || (isCurrent && status === "completed") ? "✓" : idx + 1}
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`w-0.5 flex-1 min-h-[24px] ${
                    isDone ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
            <div className="pb-6">
              <p className={`font-medium capitalize ${isCurrent ? "text-foreground" : isDone ? "text-muted-foreground" : "text-muted-foreground"}`}>
                {step}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<TrackOrderResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await trackOrder(orderNumber, phone);
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-lg border p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orderNumber">Order number</Label>
          <Input
            id="orderNumber"
            placeholder="e.g. ORD-1234567890-ABC123"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Phone used at checkout"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Checking…" : "Track order"}
        </Button>
      </form>

      {result && (
        <div className="rounded-lg border bg-card p-6 space-y-4">
          {result.ok ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order</span>
                <span className="font-mono font-medium">{result.order.order_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <span className="capitalize font-medium">{result.order.status}</span>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-3">Timeline</p>
                <StatusTimeline status={result.order.status} />
              </div>
            </>
          ) : (
            <p className="text-destructive">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

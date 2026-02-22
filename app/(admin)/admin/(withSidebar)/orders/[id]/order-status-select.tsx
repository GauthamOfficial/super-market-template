"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatusAction } from "./actions";
import type { OrderStatus } from "@/types/db";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "packed", label: "Packed" },
  { value: "dispatched", label: "Dispatched" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onValueChange(value: OrderStatus) {
    if (value === currentStatus) return;
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, value);
      if (result.ok) {
        router.refresh();
      } else {
        console.error(result.error);
      }
    });
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={onValueChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import { useRouter } from "next/navigation";
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { Order } from "@/types/db";

export function OrderTableRow({
  order,
  branchName,
}: {
  order: Order;
  branchName: string;
}) {
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => router.push(`/admin/orders/${order.id}`)}
    >
      <TableCell className="font-medium">{order.order_number}</TableCell>
      <TableCell>{order.customer_name ?? order.customer_email}</TableCell>
      <TableCell>{branchName}</TableCell>
      <TableCell>
        <span className="capitalize">{order.status}</span>
      </TableCell>
      <TableCell className="text-right text-muted-foreground">
        {new Date(order.created_at).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
}

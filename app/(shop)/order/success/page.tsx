import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/dal";
import { formatPrice } from "@/lib/utils";
import { buildOrderSummaryMessage, getShopWhatsAppNumber } from "@/lib/orderWhatsApp";
import { OrderWhatsAppButtons } from "./OrderWhatsAppButtons";
import type { Order } from "@/types/db";
import type { OrderItem } from "@/types/db";
import type { ProductVariant } from "@/types/db";

export const metadata = {
  title: "Order placed",
  description: "Your order has been received",
};

function OrderSummary({
  order,
  items,
}: {
  order: { order_number: string; status: string; customer_name?: string | null; customer_phone?: string | null };
  items: { quantity: number; unit_price: number; variant?: { name?: string } }[];
}) {
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  return (
    <div className="rounded-lg border bg-card p-4 text-left space-y-4 sm:p-6">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Order number</span>
        <span className="font-mono font-medium">{order.order_number}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Status</span>
        <span className="capitalize font-medium">{order.status}</span>
      </div>
      <div className="border-t pt-4 space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Summary</p>
        <ul className="space-y-1 text-sm">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>
                {item.variant?.name ?? "Item"} × {item.quantity}
              </span>
              <span>{formatPrice(item.quantity * item.unit_price)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-medium pt-2 border-t">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}

async function SuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.orderId ?? "";

  if (!orderId) {
    return (
      <div className="rounded-lg border p-6 sm:p-8 text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold sm:text-2xl">Order placed</h1>
        <p className="text-muted-foreground">No order ID provided.</p>
        <Button asChild>
          <Link href="/home">Back to home</Link>
        </Button>
      </div>
    );
  }

  const result = await getOrderById(orderId);
  if (!result.ok) {
    return (
      <div className="rounded-lg border p-6 sm:p-8 text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold sm:text-2xl">Order not found</h1>
        <p className="text-muted-foreground">{result.error}</p>
        <Button asChild>
          <Link href="/home">Back to home</Link>
        </Button>
      </div>
    );
  }

  const { order, items, branch } = result.data;
  const total = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const message = buildOrderSummaryMessage(order as Order, items as (OrderItem & { variant?: ProductVariant })[], total);
  const whatsappNumber = getShopWhatsAppNumber(branch);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-2 sm:px-0">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold sm:text-2xl">Order placed</h1>
        <p className="text-muted-foreground">
          Thank you. Your order has been received.
        </p>
      </div>
      <OrderSummary
        order={order}
        items={items}
      />
      <OrderWhatsAppButtons message={message} whatsappNumber={whatsappNumber} />
      <div className="flex justify-center">
        <Button asChild>
          <Link href="/home">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="h-32 animate-pulse rounded-lg bg-muted" />}>
        <SuccessContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

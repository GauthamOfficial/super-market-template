import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/dal";
import { formatPrice } from "@/lib/utils";
import { buildOrderSummaryMessage, getShopWhatsAppNumber } from "@/lib/orderWhatsApp";
import { ClearCartOnSuccess } from "./ClearCartOnSuccess";
import { OrderWhatsAppButtons } from "./OrderWhatsAppButtons";
import type { Order } from "@/types/db";
import type { OrderItem } from "@/types/db";
import type { ProductVariant } from "@/types/db";

export const metadata = {
  title: "Order confirmed",
  description: "Your order has been received and is being processed",
};

function OrderSummary({
  order,
  items,
  deliveryFee = 0,
}: {
  order: { order_number: string; status: string; customer_name?: string | null; customer_phone?: string | null };
  items: { quantity: number; unit_price: number; variant?: { name?: string } }[];
  deliveryFee?: number;
}) {
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const total = subtotal + deliveryFee;
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="bg-primary/5 px-4 py-3 border-b">
        <h2 className="text-sm font-semibold text-foreground">Order details</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Keep this number for tracking</p>
      </div>
      <div className="p-4 sm:p-6 space-y-4 text-left">
        <div className="flex justify-between items-center gap-4">
          <span className="text-muted-foreground text-sm">Order number</span>
          <span className="font-mono font-semibold text-foreground">{order.order_number}</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-muted-foreground text-sm">Status</span>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium capitalize text-primary">
            {order.status}
          </span>
        </div>
        <div className="border-t pt-4 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Items</p>
          <ul className="space-y-2 text-sm">
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between gap-4">
                <span className="text-foreground">
                  {item.variant?.name ?? "Item"} × {item.quantity}
                </span>
                <span className="font-medium tabular-nums">{formatPrice(item.quantity * item.unit_price)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1.5 pt-3 border-t text-base">
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between font-medium">
                <span>Delivery</span>
                <span className="tabular-nums">{formatPrice(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-1">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>
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
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const deliveryFee = order.delivery_fee ?? 0;
  const total = subtotal + deliveryFee;
  const message = buildOrderSummaryMessage(order as Order, items as (OrderItem & { variant?: ProductVariant })[], total);
  const whatsappNumber = getShopWhatsAppNumber(branch);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-2 sm:px-0">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
          Order confirmed
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Thank you for your order.
        </p>
      </div>
      <OrderSummary
        order={order}
        items={items}
        deliveryFee={deliveryFee}
      />
      <div className="space-y-2">
        <p className="text-center text-sm text-muted-foreground">
          Share this order with the shop
        </p>
        <OrderWhatsAppButtons message={message} whatsappNumber={whatsappNumber} />
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
        <Button asChild variant="outline" size="lg" className="min-w-[200px]">
          <Link href="/order/track">Track your order</Link>
        </Button>
        <Button asChild size="lg" className="min-w-[200px]">
          <Link href="/home">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

function OrderSuccessLoading() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-2 sm:px-0">
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">Loading your order…</p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-green-100 dark:bg-green-950/50">
          <div
            className="h-full w-1/3 min-w-[120px] rounded-full bg-green-500 dark:bg-green-500 animate-order-loading-bar"
            aria-hidden
          />
        </div>
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
      <Suspense fallback={null}>
        <ClearCartOnSuccess />
      </Suspense>
      <Suspense fallback={<OrderSuccessLoading />}>
        <SuccessContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

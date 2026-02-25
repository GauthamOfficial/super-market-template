import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById, getBranches } from "@/lib/dal";
import { isOk } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusSelect } from "./order-status-select";
import { CopyWhatsAppButton } from "./copy-whatsapp-button";
import { formatPrice, formatPaymentMethod } from "@/lib/utils";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [orderResult, branchesResult] = await Promise.all([
    getOrderById(id),
    getBranches(),
  ]);

  if (!isOk(orderResult)) {
    if (orderResult.error === "Order not found") notFound();
    return (
      <div className="space-y-6">
        <p className="text-destructive">{orderResult.error}</p>
        <Button asChild variant="outline">
          <Link href="/admin/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const { order, items } = orderResult.data;
  const branches = isOk(branchesResult) ? branchesResult.data : [];
  const branch = branches.find((b) => b.id === order.branch_id);
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const deliveryFee = order.delivery_fee ?? 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link href="/admin/orders">← Back to orders</Link>
          </Button>
          <h1 className="text-2xl font-semibold">{order.order_number}</h1>
          <p className="text-muted-foreground text-sm">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
          <CopyWhatsAppButton order={order} items={items} total={total} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3 rounded-lg border p-4">
          <h2 className="font-medium">Customer</h2>
          <dl className="space-y-1 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd>{order.customer_name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd>{order.customer_email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{order.customer_phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Payment</dt>
              <dd>{formatPaymentMethod(order.payment_method)}</dd>
            </div>
          </dl>
        </section>

        <section className="space-y-3 rounded-lg border p-4">
          <h2 className="font-medium">Delivery</h2>
          <dl className="space-y-1 text-sm">
            <div>
              <dt className="text-muted-foreground">Address</dt>
              <dd className="whitespace-pre-wrap">
                {order.delivery_address ?? "—"}
              </dd>
            </div>
            {deliveryFee > 0 && (
              <div>
                <dt className="text-muted-foreground">Delivery fee</dt>
                <dd>{formatPrice(deliveryFee)}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">Branch</dt>
              <dd>{branch?.name ?? order.branch_id}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="font-medium">Items</h2>
        <div className="admin-table-wrapper overflow-x-auto">
          <Table className="admin-table min-w-[500px]">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.variant?.name ?? `Variant ${item.product_variant_id}`}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatPrice(item.unit_price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(item.quantity * item.unit_price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col items-end gap-1 border-t pt-4 text-sm">
          <div className="flex justify-between w-full max-w-xs">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between w-full max-w-xs">
              <span className="text-muted-foreground">Delivery</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
          )}
          <p className="text-lg font-semibold pt-1">
            Total: {formatPrice(total)}
          </p>
        </div>
      </section>
    </div>
  );
}

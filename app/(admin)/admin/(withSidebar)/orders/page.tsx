import { getOrders, getBranches } from "@/lib/dal";
import { isOk } from "@/lib/dal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderFiltersForm } from "./order-filters-form";
import { OrderTableRow } from "./order-table-row";
import type { OrderStatus } from "@/types/db";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "packed", label: "Packed" },
  { value: "dispatched", label: "Dispatched" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; branchId?: string }>;
}) {
  const params = await searchParams;
  const status = (params.status ?? "") as OrderStatus | "";
  const branchId = params.branchId ?? "";

  const filters: Parameters<typeof getOrders>[0] = { limit: 50 };
  if (status && STATUS_OPTIONS.some((o) => o.value === status)) {
    filters.status = status as OrderStatus;
  }
  if (branchId) filters.branchId = branchId;

  const [ordersResult, branchesResult] = await Promise.all([
    getOrders(filters),
    getBranches(),
  ]);

  const orders = isOk(ordersResult) ? ordersResult.data.orders : [];
  const total = isOk(ordersResult) ? ordersResult.data.total : 0;
  const branches = isOk(branchesResult) ? branchesResult.data : [];

  const branchMap = new Map(branches.map((b) => [b.id, b.name]));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl">Orders</h1>
        <OrderFiltersForm
          statusOptions={STATUS_OPTIONS}
          branches={branches}
          currentStatus={status}
          currentBranchId={branchId}
        />
      </div>

      {!isOk(ordersResult) ? (
        <p className="text-destructive">{ordersResult.error}</p>
      ) : (
        <div className="admin-table-wrapper overflow-x-auto">
          <Table className="admin-table min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No orders match the filters.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    branchName={branchMap.get(order.branch_id) ?? order.branch_id}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {isOk(ordersResult) && total !== undefined && total > orders.length && (
        <p className="text-muted-foreground text-sm">
          Showing {orders.length} of {total} orders.
        </p>
      )}
    </div>
  );
}

import Link from "next/link";
import { getDeliveryAreas } from "@/lib/dal";
import { getAllBranches } from "@/lib/dal";
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
import { DeliveryAreaForm } from "./delivery-area-form";
import { formatPrice } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

export default async function AdminDeliveryPage() {
  const [areasResult, branchesResult] = await Promise.all([
    getDeliveryAreas(),
    getAllBranches(),
  ]);

  const areas = isOk(areasResult) ? areasResult.data : [];
  const branches = isOk(branchesResult) ? branchesResult.data : [];
  const branchMap = new Map(branches.map((b) => [b.id, b.name]));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Delivery areas</h1>
          <p className="text-muted-foreground text-sm">
            Manage delivery areas and fees. Only enabled areas appear at checkout.
          </p>
        </div>
        <DeliveryAreaForm
          branches={branches}
          trigger={<Button className="gap-2"><PlusCircle className="h-4 w-4" /> Add area</Button>}
        />
      </div>

      {!isOk(areasResult) ? (
        <p className="text-destructive">{areasResult.error}</p>
      ) : (
        <div className="admin-table-wrapper">
          <Table className="admin-table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Fee</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No delivery areas yet. Add one to offer delivery at checkout.
                  </TableCell>
                </TableRow>
              ) : (
                areas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell className="font-medium">{area.name}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPrice(area.fee)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {area.branch_id ? branchMap.get(area.branch_id) ?? area.branch_id : "—"}
                    </TableCell>
                    <TableCell>
                      {area.is_enabled ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DeliveryAreaForm
                        branches={branches}
                        area={area}
                        trigger={
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

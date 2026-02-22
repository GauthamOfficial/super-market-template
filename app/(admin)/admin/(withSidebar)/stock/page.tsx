import { getBranches } from "@/lib/dal";
import { isOk } from "@/lib/dal";
import { StockManager } from "./stock-manager";

export default async function AdminStockPage() {
  const branchesResult = await getBranches();
  const branches = isOk(branchesResult) ? branchesResult.data : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Stock</h1>
      <p className="text-muted-foreground text-sm">
        Select a branch and update inventory quantities. Changes are saved when you click Save.
      </p>
      <StockManager branches={branches} />
    </div>
  );
}

import { getBranches, getCategories } from "@/lib/dal";
import { isOk } from "@/lib/dal";
import { StockManager } from "./stock-manager";

export default async function AdminStockPage() {
  const [branchesResult, categoriesResult] = await Promise.all([
    getBranches(),
    getCategories(),
  ]);
  const branches = isOk(branchesResult) ? branchesResult.data : [];
  const categories = isOk(categoriesResult) ? categoriesResult.data : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Stock</h1>
      <p className="text-muted-foreground text-sm">
        Select a branch and update inventory quantities. Changes are saved when you click Save.
      </p>
      <StockManager branches={branches} categories={categories} />
    </div>
  );
}

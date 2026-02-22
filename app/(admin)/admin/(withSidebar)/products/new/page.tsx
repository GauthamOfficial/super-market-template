import Link from "next/link";
import { getCategories } from "@/lib/dal";
import { isOk } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import { ProductForm } from "../product-form";

export default async function AdminNewProductPage() {
  const categoriesResult = await getCategories();
  const categories = isOk(categoriesResult) ? categoriesResult.data : [];

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/admin/products">← Back to products</Link>
        </Button>
        <h1 className="text-2xl font-semibold">New product</h1>
      </div>
      <ProductForm
        categories={categories}
        initialProduct={null}
        initialVariants={[]}
      />
    </div>
  );
}

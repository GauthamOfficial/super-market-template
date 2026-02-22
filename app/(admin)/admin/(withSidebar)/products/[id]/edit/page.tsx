import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getCategories } from "@/lib/dal";
import { isOk } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import { ProductForm } from "../../product-form";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [productResult, categoriesResult] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!isOk(productResult)) {
    if (productResult.error === "Product not found") notFound();
    return (
      <div className="space-y-6">
        <p className="text-destructive">{productResult.error}</p>
        <Button asChild variant="outline">
          <Link href="/admin/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  const { product, variants } = productResult.data;
  const categories = isOk(categoriesResult) ? categoriesResult.data : [];

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/admin/products">← Back to products</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit: {product.name}</h1>
      </div>
      <ProductForm
        categories={categories}
        initialProduct={product}
        initialVariants={variants}
      />
    </div>
  );
}

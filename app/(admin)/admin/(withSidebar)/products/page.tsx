import Link from "next/link";
import { getProducts, getCategories } from "@/lib/dal";
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
import { PlusCircle } from "lucide-react";
import { ProductCategoryFilter } from "./product-category-filter";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const { categoryId } = await searchParams;
  const result = await getProducts();
  const categoriesResult = await getCategories();
  const allCategories = isOk(categoriesResult) ? categoriesResult.data : [];

  if (!isOk(result)) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold sm:text-2xl">Products</h1>
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const { products, categories } = result.data;
  const filteredProducts = categoryId
    ? products.filter((p) => p.category_id === categoryId)
    : products;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl">Products</h1>
        <div className="flex flex-wrap items-end gap-3">
          <ProductCategoryFilter categories={allCategories} />
          <Button asChild>
            <Link href="/admin/products/new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New product
            </Link>
          </Button>
        </div>
      </div>

      <div className="admin-table-wrapper overflow-x-auto">
        <Table className="admin-table min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  {categoryId
                    ? "No products in this category."
                    : "No products yet. Create one to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.slug}</TableCell>
                  <TableCell>
                    {product.category_id
                      ? categories.get(product.category_id) ?? product.category_id
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {product.is_active ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

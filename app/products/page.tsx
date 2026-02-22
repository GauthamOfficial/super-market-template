import { getProducts } from "@/features/products/actions";
import { ProductCard } from "@/features/products/product-card";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Products</h1>
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <p>No products in the database. Create tables in Supabase and add data.</p>
        </div>
      )}
    </div>
  );
}

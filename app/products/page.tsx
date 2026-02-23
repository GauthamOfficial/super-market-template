import Link from "next/link";
import { getProducts } from "@/features/products/actions";
import { getCategories } from "@/lib/dal";
import { ProductCard } from "@/features/products/product-card";

export default async function ProductsPage() {
  const [products, categoriesResult] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const categories = categoriesResult.ok ? categoriesResult.data : [];

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Categories sidebar — left */}
      <aside className="shrink-0 lg:w-56">
        <nav className="sticky top-20 rounded-lg border bg-card p-4" aria-label="Product categories">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Categories
          </h2>
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/products"
                className="block rounded-md px-3 py-2 text-sm font-medium bg-primary/10 text-primary"
              >
                All products
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Product grid — main content */}
      <div className="min-w-0 flex-1 space-y-6">
        <h1 className="text-3xl font-bold">Products</h1>
        {products.length > 0 ? (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            <p>No products in the database. Create tables in Supabase and add data.</p>
          </div>
        )}
      </div>
    </div>
  );
}

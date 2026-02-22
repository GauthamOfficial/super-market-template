import Link from "next/link";
import { getProducts } from "@/features/products/actions";
import { ProductCard } from "@/features/products/product-card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{siteConfig.name}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {siteConfig.tagline}
        </p>
        <Button asChild>
          <Link href="/products">Browse all products</Link>
        </Button>
      </section>

      {featured.length > 0 ? (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <p>No products yet. Add products in Supabase or run the seed script.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/products">View products</Link>
          </Button>
        </section>
      )}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getSelectedBranchId } from "@/lib/branch-cookie";
import { getProductBySlug, getCategories } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import { ProductPurchaseBlock } from "@/features/product/ProductPurchaseBlock";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const cookieStore = await cookies();
  const branchId = getSelectedBranchId(cookieStore);

  if (!branchId) {
    redirect("/select-branch");
  }

  const { slug } = await params;
  const [result, categoriesResult] = await Promise.all([
    getProductBySlug(branchId, slug),
    getCategories(),
  ]);

  if (!result.ok) notFound();

  const { product, variants, inventory } = result.data;
  const categorySlug =
    product.category_id && categoriesResult.ok
      ? categoriesResult.data.find((c) => c.id === product.category_id)?.slug
      : null;
  const inventoryList = inventory.map((i) => ({
    variantId: i.variantId,
    quantity: i.quantity,
  }));

  return (
    <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
      <ProductGallery
        imageUrl={product.image_url}
        name={product.name}
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{product.name}</h1>
          {product.description && (
            <p className="mt-2 text-muted-foreground">{product.description}</p>
          )}
        </div>

        <ProductPurchaseBlock
          branchId={branchId}
          product={{
            id: product.id,
            name: product.name,
            image_url: product.image_url,
            slug: product.slug,
          }}
          variants={variants}
          inventory={inventoryList}
        />

        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button asChild variant="outline">
            <Link href="/home">Back to home</Link>
          </Button>
          {categorySlug && (
            <Button asChild variant="ghost">
              <Link href={`/category/${categorySlug}`}>View category</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductGallery({
  imageUrl,
  name,
}: {
  imageUrl: string | null;
  name: string;
}) {
  return (
    <div className="space-y-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>
    </div>
  );
}

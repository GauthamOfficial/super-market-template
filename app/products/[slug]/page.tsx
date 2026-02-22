import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/features/products/actions";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square rounded-lg border bg-muted overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
        {product.description && (
          <p className="text-muted-foreground">{product.description}</p>
        )}
        <div className="flex gap-4 pt-4">
          <Button asChild>
            <Link href="/products">Back to products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

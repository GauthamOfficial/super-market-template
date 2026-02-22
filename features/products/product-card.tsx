import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="text-lg font-semibold">
          {formatPrice(product.base_price)}
        </span>
        <Button asChild size="sm">
          <Link href={`/products/${product.slug}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

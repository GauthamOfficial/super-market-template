import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  /** Smaller layout for grids with many columns (e.g. Featured products) */
  compact?: boolean;
}

export function ProductCard({ product, compact }: ProductCardProps) {
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
              sizes={compact ? "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
        </div>
      </Link>
      <CardContent className={compact ? "p-2" : "p-4"}>
        <h3 className={`font-semibold line-clamp-2 ${compact ? "text-sm" : ""}`}>{product.name}</h3>
        {product.description && !compact && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}
      </CardContent>
      <CardFooter className={compact ? "flex items-center justify-between p-2 pt-0" : "flex items-center justify-between p-4 pt-0"}>
        <span className={compact ? "text-sm font-semibold" : "text-lg font-semibold"}>
          {formatPrice(product.base_price)}
        </span>
        <Button asChild size={compact ? "sm" : "sm"} className={compact ? "h-7 text-xs px-2" : ""}>
          <Link href={`/product/${product.slug}`}>Add to cart</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

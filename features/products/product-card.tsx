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
    <Card className="min-w-0 overflow-hidden text-left transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover object-[55%_50%] sm:object-center"
              sizes={compact ? "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
        </div>
      </Link>
      <CardContent className={`text-left ${compact ? "p-2 sm:p-2" : "p-3 sm:p-4"}`}>
        <h3 className={`font-semibold line-clamp-2 break-words ${compact ? "text-xs sm:text-sm" : "text-base sm:text-lg"}`}>{product.name}</h3>
        {product.description && !compact && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}
      </CardContent>
      <CardFooter className={compact ? "flex flex-col gap-1.5 items-start text-left sm:flex-row sm:items-center sm:justify-between p-2 pt-0" : "flex flex-col gap-2 items-start text-left sm:flex-row sm:items-center sm:justify-between p-3 pt-0 sm:p-4 sm:pt-0"}>
        <span className={`font-semibold ${compact ? "text-xs sm:text-sm" : "text-base sm:text-lg"}`}>
          {formatPrice(product.base_price)}
        </span>
        <Button asChild size="sm" className={compact ? "h-7 w-full min-w-0 text-xs px-2 sm:w-auto" : "w-full sm:w-auto"}>
          <Link href={`/product/${product.slug}`} className="truncate">Add to cart</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

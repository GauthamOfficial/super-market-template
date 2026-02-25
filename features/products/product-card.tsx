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
  /** Button label (e.g. "View" on home page, "Add to cart" elsewhere). Default: "Add to cart" */
  actionLabel?: string;
}

export function ProductCard({ product, compact, actionLabel = "Add to cart" }: ProductCardProps) {
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
      <CardFooter className={compact ? "flex flex-col gap-1.5 items-start text-left sm:flex-row sm:items-center sm:justify-between sm:gap-2 p-2 pt-0" : "flex flex-col gap-2 items-start text-left sm:flex-row sm:items-center sm:justify-between sm:gap-2 p-3 pt-0 sm:p-4 sm:pt-0"}>
        <span className={`font-semibold shrink-0 ${compact ? "text-xs sm:text-sm" : "text-base sm:text-lg"}`}>
          {formatPrice(product.base_price)}
        </span>
        <Button asChild variant="default" size="sm" className={compact ? "h-7 w-full min-w-0 shrink-0 rounded-md text-xs px-2 sm:h-6 sm:w-auto sm:min-w-0 sm:px-2 sm:text-xs" : "w-full shrink-0 rounded-md sm:h-7 sm:w-auto sm:min-w-0 sm:px-2 sm:text-xs"}>
          <Link href={`/product/${product.slug}`} className="truncate">{actionLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

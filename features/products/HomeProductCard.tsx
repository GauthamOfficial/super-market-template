import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/features/cart/AddToCartButton";
import type { ProductWithPriceStockAndVariant } from "@/lib/dal";

interface HomeProductCardProps {
  item: ProductWithPriceStockAndVariant;
  branchId: string;
  compact?: boolean;
}

export function HomeProductCard({ item, branchId, compact }: HomeProductCardProps) {
  const { product, minPrice, inStock, primaryVariant } = item;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes={compact ? "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw" : "(max-width: 768px) 50vw, 25vw"}
            />
          ) : (
            <div className={`flex h-full items-center justify-center text-muted-foreground ${compact ? "text-xs" : "text-sm"}`}>
              No image
            </div>
          )}
          {inStock && (
            <Badge className={`absolute bg-green-600 hover:bg-green-600 ${compact ? "right-1.5 top-1.5 text-xs" : "right-2 top-2"}`}>
              In stock
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className={compact ? "p-2" : "p-4"}>
        <h3 className={`font-semibold line-clamp-2 ${compact ? "text-sm" : ""}`}>
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
      </CardContent>
      <CardFooter className={`flex flex-col items-stretch gap-1.5 pt-0 ${compact ? "p-2" : "p-4"}`}>
        <span className={compact ? "text-sm font-semibold" : "text-lg font-semibold"}>{formatPrice(minPrice)}</span>
        {primaryVariant && inStock ? (
          <AddToCartButton
            branchId={branchId}
            variantId={primaryVariant.id}
            productName={product.name}
            variantLabel={primaryVariant.name}
            unitPrice={primaryVariant.price}
            imageUrl={product.image_url}
          />
        ) : (
          <Button variant="outline" disabled size="sm" className={compact ? "h-7 text-xs" : ""}>
            Out of stock
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

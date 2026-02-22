import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { ProductWithPriceAndStock } from "@/lib/dal";

interface HomeProductCardProps {
  item: ProductWithPriceAndStock;
}

export function HomeProductCard({ item }: HomeProductCardProps) {
  const { product, minPrice, inStock } = item;

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
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          {inStock && (
            <Badge className="absolute right-2 top-2 bg-green-600 hover:bg-green-600">
              In stock
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2">
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="text-lg font-semibold">{formatPrice(minPrice)}</span>
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View
        </Link>
      </CardFooter>
    </Card>
  );
}

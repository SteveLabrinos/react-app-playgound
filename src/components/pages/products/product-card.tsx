import { Package } from "lucide-react";
import type { Product } from "@/store/apis/products-api.ts";
import { CardContent } from "@/components/ui/card.tsx";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { prdId, product: prd, description } = product!;

  return (
    <div key={prdId}>
      <CardContent>
        <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent transition-colors">
          <div className="bg-primary/10 p-2 rounded-md">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">{prd}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            <p className="text-xs text-muted-foreground mt-2">ID: {prdId}</p>
          </div>
        </div>
      </CardContent>
    </div>
  );
}

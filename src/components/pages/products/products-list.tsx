import {
  ListProductsApiArg,
  useListProductsQuery,
} from "@/store/apis/products-api.ts";
import Loading from "@/components/layouts/loading.tsx";
import ErrorCard from "@/components/layouts/error-card.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import EmptyState from "@/components/layouts/empty-state.tsx";
import ProductCard from "@/components/pages/products/product-card.tsx";

export default function ProductsList() {
  const {
    data: products,
    error,
    isLoading,
  } = useListProductsQuery({
    context: "MAIN",
  } as ListProductsApiArg);

  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorCard
        title="Error Loading Products"
        description={"Products failed to load due to connection issues."}
      />
    );

  if (!products) return <EmptyState description="No Products Found" />;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Products</CardTitle>
          <CardDescription>Available products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <ProductCard key={product!.prdId!} product={product} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

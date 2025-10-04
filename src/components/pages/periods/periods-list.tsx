import {
  ListPeriodsApiArg,
  useListPeriodsQuery,
} from "@/store/apis/periods-api.ts";
import Loading from "@/components/layouts/loading.tsx";
import ErrorCard from "@/components/layouts/error-card.tsx";
import EmptyState from "@/components/layouts/empty-state.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import PeriodCard from "@/components/pages/periods/period-card.tsx";

export default function PeriodsList() {
  const {
    data: periods,
    error,
    isLoading,
  } = useListPeriodsQuery({
    context: "MAIN",
  } as ListPeriodsApiArg);

  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorCard
        title="Error Loading Products"
        description={"Products failed to load due to connection issues."}
      />
    );

  if (!periods || periods.length === 0)
    return <EmptyState description="No Products Found" />;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Periods</CardTitle>
          <CardDescription>Available periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {periods.map((per) => (
              <PeriodCard key={per!.perId!} period={per} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

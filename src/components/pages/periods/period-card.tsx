import { Period } from "@/store/apis/periods-api.ts";
import { CardContent } from "@/components/ui/card.tsx";
import { Clock } from "lucide-react";

interface PeriodCardProps {
  period: Period;
}

export default function PeriodCard({ period }: PeriodCardProps) {
  const { perId, period: per, startDate, endDate } = period!;
  return (
    <div key={perId}>
      <CardContent>
        <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent transition-colors">
          <div className="bg-primary/10 p-2 rounded-md">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">{per}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start: {startDate}
            </p>
            <p className="text-sm text-muted-foreground mt-2">End: {endDate}</p>
          </div>
        </div>
      </CardContent>
    </div>
  );
}

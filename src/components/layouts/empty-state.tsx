import { CardContent } from "@/components/ui/card.tsx";

interface EmptyStateProps {
  description: string;
}

export default function EmptyState({ description }: EmptyStateProps) {
  return (
    <CardContent>
      <p className="text-muted-foreground text-center py-8">{description}</p>
    </CardContent>
  );
}

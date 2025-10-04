import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

interface ErrorCardProps {
  title: string;
  description?: string;
}

export default function ErrorCard({ title, description }: ErrorCardProps) {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

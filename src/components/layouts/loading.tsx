import { LoaderIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <LoaderIcon className="animate-spin h-14 w-14" />
    </div>
  );
}

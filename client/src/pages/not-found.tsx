import { Card, CardContent } from "@/components/ui/card";
import { BrandLogo } from "@/components/BrandLogo";
import { AlertCircle } from "lucide-react";
import { useDocumentHead } from "@/hooks/use-document-head";

export default function NotFound() {
  useDocumentHead({
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist on BharatSolve AI.",
    noIndex: true,
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 gap-6">
      <BrandLogo size="lg" />
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            The page you're looking for doesn't exist. Head back to <a href="/" className="text-primary hover:underline">BharatSolve AI</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

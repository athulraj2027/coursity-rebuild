import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Error = () => {
  return (
    <div className="flex items-center justify-center min-h-75 p-6">
      <div className="w-full max-w-md bg-background rounded-3xl shadow-2xl p-8 text-center space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-destructive/10 text-destructive p-4 rounded-full">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold">Something went wrong</h2>

        {/* Message */}
        <p className="text-muted-foreground text-sm">
          Failed to load. Please try again.
        </p>

        {/* Retry Button */}
        <Button
          variant="destructive"
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default Error;

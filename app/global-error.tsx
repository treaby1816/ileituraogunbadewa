"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-forest-black flex flex-col items-center justify-center p-4 text-center">
          <h1 className="font-playfair text-4xl text-cream mb-4">Something went wrong</h1>
          <p className="text-cream-muted mb-8 max-w-md">
            We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold-primary text-forest-black px-8 py-3 rounded-xl font-cinzel text-sm tracking-widest hover:bg-gold-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

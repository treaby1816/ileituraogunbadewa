"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import * as Sentry from "@sentry/nextjs";
import { usePostHog } from "posthog-js/react";

export default function AnalyticsDebugPage() {
  const [loading, setLoading] = useState(false);
  const posthog = usePostHog();

  const handleTestSentry = () => {
    try {
      throw new Error("Test Error from Ilé Ìtura Debug Page");
    } catch (e) {
      Sentry.captureException(e);
      alert("Test error sent to Sentry (check console & dashboard)");
    }
  };

  const handleTestPostHog = () => {
    if (posthog) {
      posthog.capture("test_button_clicked", {
        source: "debug_page",
        timestamp: new Date().toISOString(),
      });
      alert("Test event sent to PostHog");
    } else {
      alert("PostHog not initialized yet");
    }
  };

  const handleTestRateLimit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] }),
      });
      
      if (res.status === 429) {
        alert("Rate limit working! Received 429 Too Many Requests");
      } else {
        alert(`Request successful. Status: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-24 px-4 max-w-3xl mx-auto">
      <h1 className="font-playfair text-3xl text-cream mb-8">Infrastructure Diagnostics</h1>
      
      <div className="space-y-8">
        <div className="p-6 bg-forest rounded-xl border border-gold-primary/20">
          <h2 className="text-xl text-gold-primary mb-4">Sentry Error Tracking</h2>
          <p className="text-sm text-cream-muted mb-4">Test if client-side errors are successfully caught and sent to Sentry.</p>
          <Button onClick={handleTestSentry} variant="primary" size="sm">Trigger Test Error</Button>
        </div>

        <div className="p-6 bg-forest rounded-xl border border-gold-primary/20">
          <h2 className="text-xl text-gold-primary mb-4">PostHog Analytics</h2>
          <p className="text-sm text-cream-muted mb-4">Send a custom event to PostHog to verify event tracking.</p>
          <Button onClick={handleTestPostHog} variant="primary" size="sm">Send Test Event</Button>
        </div>

        <div className="p-6 bg-forest rounded-xl border border-gold-primary/20">
          <h2 className="text-xl text-gold-primary mb-4">Upstash Rate Limiting</h2>
          <p className="text-sm text-cream-muted mb-4">Test the AI chat API rate limit (10 reqs / 60s). Click multiple times quickly.</p>
          <Button onClick={handleTestRateLimit} variant="primary" size="sm" disabled={loading}>
            {loading ? "Testing..." : "Test Chat API Request"}
          </Button>
        </div>
      </div>
    </main>
  );
}

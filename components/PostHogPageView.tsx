"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { createBrowserClient } from "@/lib/supabase-browser";

export default function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const supabase = createBrowserClient();

  // Identify user using Supabase auth
  useEffect(() => {
    const identifyUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && posthog) {
        posthog.identify(user.id, {
          email: user.email,
        });
      }
    };
    identifyUser();
  }, [posthog, supabase]);

  // Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

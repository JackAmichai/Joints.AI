"use client";

import { supabase } from "@/lib/supabase/client";

/**
 * Client-side wrapper that attaches the current Supabase access token to a
 * fetch request. All API routes that need auth pull Bearer tokens via
 * lib/api/auth.ts — use this helper to call them from the browser.
 */
export async function authedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(input, { ...init, headers });
}

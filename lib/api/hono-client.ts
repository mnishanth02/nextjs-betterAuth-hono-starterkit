import { env } from "@/env/client-env";
import type { AppType } from "@/server";
import { hc } from "hono/client";

const BASE_URL = env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const client = hc<AppType>(BASE_URL);

// Type-safe fetch wrapper using Hono client
export const fetchFromAPI = async <T>(fetcher: () => Promise<Response>): Promise<T> => {
  try {
    const response = await fetcher();
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

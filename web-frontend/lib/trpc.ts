import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../api/src/server/serverController";

const getBaseUrl = () => {
  // Browser should use relative path
  if (typeof window !== "undefined") return "";

  // SSR should use vercel url or localhost with Docker port
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Use env variable if set, otherwise default to Docker exposed port 1092
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:1092";
};

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
});

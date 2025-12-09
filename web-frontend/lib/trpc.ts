import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../api/src/server/serverController";

// In Next.js client code environment variables must start with NEXT_PUBLIC_
// Prefer the public var, but allow a fallback to server-only `API_URL` for SSR/tests.
const apiURL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;
if (!apiURL)
  throw new Error(
    `NEXT_PUBLIC_API_URL is not defined in environment variables. It must be set to the backend API URL. Loaded: ${apiURL}`
  );

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${apiURL}/trpc`,
    }),
  ],
});

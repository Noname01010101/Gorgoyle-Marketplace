import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../api/src/server/serverController";

const getBaseUrl = () => {
  if (!process.env.NEXT_PUBLIC_API_URL)
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  // Use env variable if set, otherwise default to Docker exposed port 1092
  return process.env.NEXT_PUBLIC_API_URL;
};

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
});

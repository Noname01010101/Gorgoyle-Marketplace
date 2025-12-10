// Server wrapper page for the model detail route.
// It decodes params (which are provided as a Promise when used in client components)
// and then renders a client-side component that performs the interactive data fetching.

import ModelDetailClient from "./ModelDetailClient";

export default async function ModelDetailPage({
  params,
}: {
  params:
    | { name: string; version: string }
    | Promise<{ name: string; version: string }>;
}) {
  // `params` can be a plain object (server component) or a Promise (client
  // component context). Awaiting is safe in either case and ensures we always
  // have the resolved values before decoding and passing to the client.
  const resolvedParams = await params;

  const decodedName = decodeURIComponent(resolvedParams.name ?? "");
  const decodedVersion = decodeURIComponent(resolvedParams.version ?? "");

  return <ModelDetailClient name={decodedName} version={decodedVersion} />;
}

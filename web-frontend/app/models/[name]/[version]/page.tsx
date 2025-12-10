// Server wrapper page for the model detail route.
// It decodes params (which are provided as a Promise when used in client components)
// and then renders a client-side component that performs the interactive data fetching.

import ModelDetailClient from "./ModelDetailClient";

export default function ModelDetailPage({
  params,
}: {
  params: { name: string; version: string };
}) {
  const decodedName = decodeURIComponent(params.name);
  const decodedVersion = decodeURIComponent(params.version);

  return <ModelDetailClient name={decodedName} version={decodedVersion} />;
}

import { jsonLdGraph, type SeoInput } from "../site";

export function JsonLd(input: SeoInput) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph(input)) }} />
  );
}

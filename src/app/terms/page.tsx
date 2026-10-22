import { JsonLd } from "../../components/JsonLd";
import { TermsOfService } from "../../views/Legal";
import { pageMetadata } from "../../seo-meta";
import { PAGES } from "../../site";

export const metadata = pageMetadata(PAGES.terms);

export default function TermsPage() {
  return (
    <>
      <JsonLd {...PAGES.terms} />
      <TermsOfService />
    </>
  );
}

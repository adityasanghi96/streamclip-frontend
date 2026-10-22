import { JsonLd } from "../../components/JsonLd";
import { PrivacyPolicy } from "../../views/Legal";
import { pageMetadata } from "../../seo-meta";
import { PAGES } from "../../site";

export const metadata = pageMetadata(PAGES.privacy);

export default function PrivacyPage() {
  return (
    <>
      <JsonLd {...PAGES.privacy} />
      <PrivacyPolicy />
    </>
  );
}

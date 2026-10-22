import { JsonLd } from "../../components/JsonLd";
import { Login } from "../../views/Login";
import { pageMetadata } from "../../seo-meta";
import { PAGES } from "../../site";

export const metadata = pageMetadata(PAGES.login);

export default function LoginPage() {
  return (
    <>
      <JsonLd {...PAGES.login} />
      <Login />
    </>
  );
}

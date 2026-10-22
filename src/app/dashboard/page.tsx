import { Dashboard } from "../../views/Dashboard";
import { pageMetadata } from "../../seo-meta";
import { PAGES } from "../../site";

export const metadata = pageMetadata(PAGES.dashboard);

export default function DashboardPage() {
  return <Dashboard />;
}

import Link from "next/link";
import { BrandLockup } from "./Brand";
import { JoinDiscordButton } from "./Discord";
import { NavLink } from "./NavLink";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link href="/" className="brand" aria-label="Stream Clip">
          <BrandLockup />
        </Link>
        <nav className="site-footer-nav" aria-label="Legal">
          <JoinDiscordButton />
          <NavLink href="/privacy">Privacy Policy</NavLink>
          <NavLink href="/terms">Terms of Service</NavLink>
        </nav>
        <p className="site-footer-copy">© {new Date().getFullYear()} Stream Clip</p>
      </div>
    </footer>
  );
}

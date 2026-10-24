"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function NavLink({
  href,
  className,
  end,
  children,
}: {
  href: string;
  className?: string;
  end?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  const active = end ? pathname === target : pathname === target || pathname.startsWith(`${target}/`);
  return (
    <Link href={href} className={active ? [className, "active"].filter(Boolean).join(" ") : className} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}

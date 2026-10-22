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
  const pathname = usePathname();
  const active = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={active ? [className, "active"].filter(Boolean).join(" ") : className} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}

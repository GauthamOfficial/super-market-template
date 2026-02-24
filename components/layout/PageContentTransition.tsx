"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps page content and re-runs the page-enter animation whenever the route changes,
 * so every page (including on client-side navigation) gets the smooth entrance.
 */
export function PageContentTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div key={pathname ?? "initial"} className="animate-page-enter min-w-0">
      {children}
    </div>
  );
}

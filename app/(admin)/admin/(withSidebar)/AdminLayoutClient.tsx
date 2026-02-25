"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  Warehouse,
  Building2,
  Truck,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const ICON_MAP = {
  LayoutDashboard,
  ListOrdered,
  Package,
  Warehouse,
  Building2,
  Truck,
} as const;

type NavItem = { href: string; label: string; icon: keyof typeof ICON_MAP };

export function AdminLayoutClient({
  navItems,
  userEmail,
  sidebarFooter,
  children,
}: {
  navItems: readonly NavItem[];
  userEmail?: string;
  sidebarFooter?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const navContent = (
    <>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map(({ href, label, icon: iconKey }) => {
          const Icon = ICON_MAP[iconKey];
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSheetOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-2">
        {userEmail && (
          <p className="truncate px-3 py-1 text-xs text-muted-foreground">
            {userEmail}
          </p>
        )}
        {sidebarFooter}
      </div>
    </>
  );

  return (
    <div className="flex min-h-[60vh] w-full min-w-0 flex-col overflow-x-hidden lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r bg-muted/30 lg:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="font-semibold">
            Admin
          </Link>
        </div>
        {navContent}
      </aside>

      {/* Mobile: menu button + sheet */}
      <div className="flex items-center gap-2 border-b bg-background px-4 py-3 lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100vw-2rem,280px)] p-0 flex flex-col">
            <SheetHeader className="border-b p-4 text-left">
              <SheetTitle className="text-lg">Admin</SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 flex-col overflow-auto">
              {navContent}
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/admin" className="font-semibold">
          Admin
        </Link>
      </div>

      <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}

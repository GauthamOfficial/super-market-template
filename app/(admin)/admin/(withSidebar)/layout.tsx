import { AdminSidebar } from "./admin-sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSignOut } from "./admin-sign-out";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/orders", label: "Orders", icon: "ListOrdered" },
  { href: "/admin/products", label: "Products", icon: "Package" },
  { href: "/admin/stock", label: "Stock", icon: "Warehouse" },
  { href: "/admin/branches", label: "Branches", icon: "Building2" },
  { href: "/admin/delivery", label: "Delivery", icon: "Truck" },
] as const;

export default async function AdminWithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-[60vh] w-full">
      <AdminSidebar navItems={navItems} userEmail={user.email ?? undefined}>
        <AdminSignOut />
      </AdminSidebar>
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  const productCount = count ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">Products</p>
          <p className="text-2xl font-semibold">{productCount}</p>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        Use the sidebar to manage products and other admin tasks.
      </p>
    </div>
  );
}

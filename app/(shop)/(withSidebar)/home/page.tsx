import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSelectedBranchId } from "@/lib/branch-cookie";
import { getBranches, getPopularProductsWithDetails } from "@/lib/dal";
import { HomeProductCard } from "@/features/products/HomeProductCard";
import { HomeSearchBar } from "@/features/home/HomeSearchBar";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Home",
  description: "Browse categories and popular products",
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const branchId = getSelectedBranchId(cookieStore);

  if (!branchId) {
    redirect("/select-branch");
  }

  const [branchesResult, popularResult] = await Promise.all([
    getBranches(),
    getPopularProductsWithDetails(branchId, 8),
  ]);

  const branchName = branchesResult.ok
    ? branchesResult.data.find((b) => b.id === branchId)?.name ?? null
    : null;
  const popularItems = popularResult.ok ? popularResult.data : [];

  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {branchName ? `Welcome, ${branchName}` : "Home"}
        </h1>
        <p className="text-muted-foreground">
          {branchName
            ? "Browse categories and popular products below."
            : "Select a branch to see products."}
        </p>
        <div className="flex items-center gap-3">
          <Suspense fallback={<div className="h-10 w-full max-w-md rounded-md border bg-muted animate-pulse" />}>
            <HomeSearchBar />
          </Suspense>
          {siteConfig.branchesMode === "multi" && (
            <Link
              href="/select-branch"
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Change branch
            </Link>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Popular</h2>
        <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {popularItems.map((item) => (
            <li key={item.product.id}>
              <HomeProductCard item={item} branchId={branchId} compact />
            </li>
          ))}
        </ul>
        {popularItems.length === 0 && (
          <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
            No products yet. Check back later.
          </p>
        )}
      </section>
    </div>
  );
}

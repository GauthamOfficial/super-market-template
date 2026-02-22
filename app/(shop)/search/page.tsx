import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { getSelectedBranchId } from "@/lib/branch-cookie";
import { getSearchProductsWithDetails } from "@/lib/dal";
import { CategoryProductGrid } from "@/features/category/CategoryProductGrid";
import { SearchInput } from "@/features/search/SearchInput";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: "Search",
  description: "Search products",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const cookieStore = await cookies();
  const branchId = getSelectedBranchId(cookieStore);

  if (!branchId) {
    redirect("/select-branch");
  }

  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const result = await getSearchProductsWithDetails(branchId, query);
  const items = result.ok ? result.data : [];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <Suspense
          fallback={
            <div className="h-10 w-full max-w-md rounded-md border bg-muted animate-pulse" />
          }
        >
          <SearchInput />
        </Suspense>
      </section>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center space-y-4">
          <p className="text-muted-foreground">
            {query
              ? `No results for “${query}”. Try different keywords or browse categories.`
              : "Enter a search term above, or browse from home."}
          </p>
          <Link
            href="/home"
            className="inline-block text-sm font-medium text-primary hover:underline"
          >
            Browse categories on home
          </Link>
        </div>
      ) : (
        <CategoryProductGrid branchId={branchId} items={items} />
      )}
    </div>
  );
}

import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getSelectedBranchId } from "@/lib/branch-cookie";
import { getCategories, getProductsByCategoryWithDetails } from "@/lib/dal";
import { CategoryProductGrid } from "@/features/category/CategoryProductGrid";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const cookieStore = await cookies();
  const branchId = getSelectedBranchId(cookieStore);

  if (!branchId) {
    redirect("/select-branch");
  }

  const { slug } = await params;

  const [categoriesResult, productsResult] = await Promise.all([
    getCategories(),
    getProductsByCategoryWithDetails(branchId, slug),
  ]);

  const category = categoriesResult.ok
    ? categoriesResult.data.find((c) => c.slug === slug)
    : null;
  const items = productsResult.ok ? productsResult.data : [];

  if (!category) notFound();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="mt-1 text-muted-foreground">{category.description}</p>
        )}
      </section>

      <CategoryProductGrid branchId={branchId} items={items} />
    </div>
  );
}

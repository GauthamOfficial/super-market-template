import { getCategories } from "@/lib/dal";
import { CategoriesSidebar } from "@/components/layout/CategoriesSidebar";

export default async function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getCategories();
  const categories = result.ok ? result.data : [];

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <CategoriesSidebar categories={categories} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { setSelectedBranchId } from "@/lib/branch-cookie";
import { getBranches } from "@/lib/dal";
import { BranchPicker } from "@/features/branches/BranchPicker";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Find a store",
  description: "Choose your branch for delivery or pickup",
};

export default async function FindStorePage() {
  const cookieStore = await cookies();

  const result = await getBranches();
  if (!result.ok) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const branches = result.data;

  // Single-branch mode: auto-select the only branch and go to home
  if (siteConfig.branchesMode === "single" && branches.length === 1) {
    setSelectedBranchId(cookieStore, branches[0].id);
    redirect("/home");
  }

  // Always show the branch picker on Find a store (no redirect when branch already selected)
  return (
    <div className="space-y-8">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Find a store
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Choose a branch for delivery or pickup. Your selection is saved for
          your next visit.
        </p>
      </section>
      <BranchPicker branches={branches} />
    </div>
  );
}

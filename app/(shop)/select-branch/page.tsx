import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSelectedBranchId, setSelectedBranchId } from "@/lib/branch-cookie";
import { getBranches } from "@/lib/dal";
import { BranchPicker } from "@/features/branches/BranchPicker";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Select branch",
  description: "Choose your branch for delivery or pickup",
};

export default async function SelectBranchPage() {
  const cookieStore = await cookies();
  const selectedId = getSelectedBranchId(cookieStore);

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

  if (selectedId) {
    redirect("/home");
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="text-center space-y-2 px-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Select your branch
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
          Choose a branch for delivery or pickup. Your selection is saved for
          your next visit.
        </p>
      </section>
      <BranchPicker branches={branches} />
    </div>
  );
}
